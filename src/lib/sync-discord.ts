import { prisma } from "@/lib/prisma";
import { fetchDiscordUser, avatarUrl, bannerUrl } from "@/lib/discord";

export async function syncDiscordProfile(userId: string, accessToken: string): Promise<void> {
  const discord = await fetchDiscordUser(accessToken);
  if (!discord) return;

  const pg = discord.primary_guild;
  const newAvatar = avatarUrl(discord.id, discord.avatar);
  const newBanner = bannerUrl(discord.id, discord.banner);

  await prisma.userProfile.upsert({
    where: { userId },
    create: {
      id: crypto.randomUUID(),
      userId,
      discordId: discord.id,
      username: discord.username,
      displayName: discord.global_name ?? discord.username,
      globalName: discord.global_name,
      avatar: newAvatar,
      banner: newBanner,
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
      avatar: newAvatar,
      banner: newBanner,
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

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: discord.global_name ?? discord.username,
      image: newAvatar,
    },
  });

  if (newAvatar) {
    await prisma.guestbookEntry.updateMany({
      where: { userId, isVerified: true },
      data: { image: newAvatar, name: discord.global_name ?? discord.username },
    });
  }
}

export async function syncDiscordProfileForUser(userId: string): Promise<void> {
  const accounts = await prisma.$queryRaw<Array<{ access_token: string | null }>>`
    SELECT "accessToken" as access_token
    FROM "account"
    WHERE "userId" = ${userId}
    AND "providerId" = 'discord'
    LIMIT 1
  `;
  const token = accounts[0]?.access_token;
  if (!token) return;
  await syncDiscordProfile(userId, token);
}
