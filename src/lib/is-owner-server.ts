import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OWNER_DISCORD_ID } from "@/lib/constants";

type DiscordAccount = {
  account_id: string;
};

export async function isOwnerServer(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return false;

  const accounts = await prisma.$queryRaw<DiscordAccount[]>`
    SELECT "accountId" as account_id
    FROM "account"
    WHERE "userId" = ${session.user.id}
    AND "providerId" = 'discord'
    LIMIT 1
  `;

  return accounts[0]?.account_id === OWNER_DISCORD_ID;
}
