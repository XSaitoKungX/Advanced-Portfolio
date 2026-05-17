import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { syncDiscordProfile } from "@/lib/sync-discord";

type DiscordAccount = {
  account_id: string;
  access_token: string | null;
  provider_id: string;
};

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

    const accounts = session?.user?.id
      ? await prisma.$queryRaw<DiscordAccount[]>`
          SELECT "accountId" as account_id, "accessToken" as access_token, "providerId" as provider_id
          FROM "account"
          WHERE "userId" = ${session.user.id}
          AND "providerId" = 'discord'
          LIMIT 1
        `
      : [];
    const discordAccount = accounts[0];
    const sessionDiscordId = discordAccount?.account_id;

    const isOwn = !!(session?.user && (
      session.user.id === profile?.userId ||
      session.user.id === userId ||
      sessionDiscordId === userId ||
      sessionDiscordId === profile?.discordId
    ));

    // If logged in and viewing own profile, refresh from Discord API
    if (isOwn && session?.user) {
      if (discordAccount?.access_token) {
        await syncDiscordProfile(session.user.id, discordAccount.access_token);
        profile = await prisma.userProfile.findFirst({
          where: {
            OR: [{ discordId: userId }, { userId: session.user.id }],
          },
        });
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
    where: {
      userId: session.user.id,
      OR: [{ discordId: userId }, { userId }],
    },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bio, bannerColor } = body;
    const safeBio = typeof bio === "string" ? bio.slice(0, 500) : undefined;
    const safeBannerColor =
      typeof bannerColor === "string" && /^#[0-9a-fA-F]{6}$/.test(bannerColor)
        ? bannerColor
        : undefined;

    const profile = await prisma.userProfile.update({
      where: { userId: existing.userId },
      data: {
        bio: safeBio,
        bannerColor: safeBannerColor,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
