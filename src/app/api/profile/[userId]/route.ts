import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

interface DiscordAPIUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  banner: string | null;
  banner_color: string | null;
  bio: string | null;
  accent_color: number | null;
  premium_type: number | null;
  public_flags: number | null;
  locale: string | null;
  primary_guild?: {
    identity_guild_id: string | null;
    identity_enabled: boolean | null;
    tag: string | null;
    badge: string | null;
  } | null;
}

async function fetchDiscordUser(accessToken: string): Promise<DiscordAPIUser | null> {
  try {
    const res = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function avatarUrl(id: string, hash: string | null) {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=256`;
}

function bannerUrl(id: string, hash: string | null) {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/banners/${id}/${hash}.${ext}?size=600`;
}

// The [userId] param accepts either the Better Auth internal ID OR a Discord ID
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  try {
    // Try to find profile by discordId first, then by userId
    let profile = await prisma.userProfile.findFirst({
      where: {
        OR: [
          { discordId: userId },
          { userId },
        ],
      },
    });

    // Check if this is the user's own profile - compare by userId OR by discordId from avatar URL
    const avatarMatch = (session?.user?.image as string | null)?.match(/\/avatars\/(\d+)\//);
    const sessionDiscordId = avatarMatch?.[1];
    const isOwn = !!(session?.user && (
      session.user.id === profile?.userId ||
      session.user.id === userId ||
      sessionDiscordId === userId ||
      sessionDiscordId === profile?.discordId
    ));

    // If logged in and viewing own profile, refresh from Discord API
    if (isOwn && session?.user) {
      // Query Better Auth's account table via raw SQL
      const accounts = await prisma.$queryRaw<Array<{
        account_id: string;
        access_token: string | null;
        provider_id: string;
      }>>`
        SELECT "accountId" as account_id, "accessToken" as access_token, "providerId" as provider_id
        FROM "account"
        WHERE "userId" = ${session.user.id}
        AND "providerId" = 'discord'
        LIMIT 1
      `;

      const discordAccount = accounts[0];

      if (discordAccount?.access_token) {
        const discord = await fetchDiscordUser(discordAccount.access_token);

        if (discord) {
          const internalUserId = profile?.userId ?? session.user.id;
          const pg = discord.primary_guild;

          profile = await prisma.userProfile.upsert({
            where: { userId: internalUserId },
            create: {
              id: crypto.randomUUID(),
              userId: internalUserId,
              discordId: discord.id,
              username: discord.username,
              displayName: discord.global_name ?? discord.username,
              globalName: discord.global_name,
              avatar: avatarUrl(discord.id, discord.avatar),
              banner: bannerUrl(discord.id, discord.banner),
              bannerColor: discord.banner_color,
              bio: discord.bio,
              accentColor: discord.accent_color,
              premiumType: discord.premium_type,
              publicFlags: discord.public_flags,
              locale: discord.locale,
              identityGuildId: pg?.identity_guild_id ?? null,
              identityEnabled: pg?.identity_enabled ?? null,
              tag: pg?.tag ?? null,
              badge: pg?.badge ?? null,
            },
            update: {
              discordId: discord.id,
              username: discord.username,
              displayName: discord.global_name ?? discord.username,
              globalName: discord.global_name,
              avatar: avatarUrl(discord.id, discord.avatar),
              banner: bannerUrl(discord.id, discord.banner),
              bannerColor: discord.banner_color,
              bio: discord.bio,
              accentColor: discord.accent_color,
              premiumType: discord.premium_type,
              publicFlags: discord.public_flags,
              locale: discord.locale,
              identityGuildId: pg?.identity_guild_id ?? null,
              identityEnabled: pg?.identity_enabled ?? null,
              tag: pg?.tag ?? null,
              badge: pg?.badge ?? null,
            },
          });
        }
      } else if (!profile) {
        // Fallback: create minimal profile from session + extract discordId from avatar URL
        const avatarMatch = (session.user.image as string | null)?.match(/\/avatars\/(\d+)\//);
        const discordId = discordAccount?.account_id ?? avatarMatch?.[1] ?? null;

        profile = await prisma.userProfile.upsert({
          where: { userId: session.user.id },
          create: {
            id: crypto.randomUUID(),
            userId: session.user.id,
            discordId,
            displayName: session.user.name ?? "Unknown",
            avatar: session.user.image ?? null,
          },
          update: {
            discordId: discordId ?? undefined,
            displayName: session.user.name ?? undefined,
            avatar: session.user.image ?? undefined,
          },
        });
      }
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile, isOwn });
  } catch (e) {
    console.error("Profile GET error:", e);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find profile by discordId or userId
  const existing = await prisma.userProfile.findFirst({
    where: { OR: [{ discordId: userId }, { userId }] },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bio, bannerColor } = body;

    const profile = await prisma.userProfile.update({
      where: { userId: existing.userId },
      data: {
        bio: bio?.slice(0, 500) ?? undefined,
        bannerColor: bannerColor ?? undefined,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}


