import { OWNER_DISCORD_ID } from "./auth";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  [key: string]: unknown;
};

export function isOwner(user: SessionUser | null | undefined): boolean {
  if (!user) return false;
  const accountId =
    (user.providerAccountId as string | undefined) ??
    (user.discordId as string | undefined) ??
    (user.externalId as string | undefined);
  return accountId === OWNER_DISCORD_ID;
}
