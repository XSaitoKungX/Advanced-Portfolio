import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

async function anonymizeGuestbookAndRemoveProfile(
  tx: Prisma.TransactionClient,
  userId: string,
  email: string
) {
  await tx.guestbookEntry.updateMany({
    where: { userId, status: "APPROVED" },
    data: {
      name: "Anonymous",
      email: null,
      image: null,
      isVerified: false,
      userId: null,
    },
  });
  await tx.guestbookEntry.deleteMany({ where: { userId } });
  await tx.userProfile.deleteMany({ where: { userId } });
  await tx.verification.deleteMany({ where: { identifier: { in: [userId, email] } } });
}

export async function cleanupBeforeUserDeletion(userId: string, email: string) {
  const revoked = await revokeDiscordAuthorization(userId);
  if (!revoked) console.error("Discord OAuth revocation failed during account deletion");

  await prisma.$transaction((tx) => anonymizeGuestbookAndRemoveProfile(tx, userId, email));
}

export async function revokeDiscordAuthorization(userId: string): Promise<boolean> {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: "discord" },
    select: { accessToken: true, refreshToken: true },
  });
  const token = account?.refreshToken ?? account?.accessToken;
  if (!token) return true;

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) return false;

  try {
    const response = await fetch("https://discord.com/api/v10/oauth2/token/revoke", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token,
        token_type_hint: account?.refreshToken ? "refresh_token" : "access_token",
      }),
      signal: AbortSignal.timeout(5_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function deleteDiscordAuthorizedUser(discordId: string) {
  await prisma.$transaction(async (tx) => {
    const accounts = await tx.account.findMany({
      where: { providerId: "discord", accountId: discordId },
      select: { userId: true },
    });

    for (const { userId } of accounts) {
      const user = await tx.user.findUnique({ where: { id: userId }, select: { email: true } });
      if (!user) continue;

      await anonymizeGuestbookAndRemoveProfile(tx, userId, user.email);
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      await tx.user.deleteMany({ where: { id: userId } });
    }
  });
}
