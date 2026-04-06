import { OWNER_DISCORD_ID } from "./auth";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  [key: string]: unknown;
};

export function isOwner(user: SessionUser | null | undefined): boolean {
  if (!user) {
    console.log("[isOwner] No user provided");
    return false;
  }
  
  // Debug: Log alle verfügbaren Felder
  console.log("[isOwner] User object keys:", Object.keys(user));
  console.log("[isOwner] User id:", user.id);
  console.log("[isOwner] Looking for Discord ID, OWNER_DISCORD_ID =", OWNER_DISCORD_ID);
  
  const accountId =
    (user.providerAccountId as string | undefined) ??
    (user.discordId as string | undefined) ??
    (user.externalId as string | undefined) ??
    user.id;
    
  console.log("[isOwner] Resolved accountId:", accountId);
  console.log("[isOwner] Match:", accountId === OWNER_DISCORD_ID);
    
  return accountId === OWNER_DISCORD_ID;
}
