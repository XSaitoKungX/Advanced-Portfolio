import { OWNER_DISCORD_ID } from "./auth";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  [key: string]: unknown;
};

// Client-side check (limited data)
export function isOwnerClient(user: SessionUser | null | undefined): boolean {
  if (!user) {
    console.log("[isOwnerClient] No user provided");
    return false;
  }
  
  console.log("[isOwnerClient] User keys:", Object.keys(user));
  console.log("[isOwnerClient] User id:", user.id);
  console.log("[isOwnerClient] Looking for:", OWNER_DISCORD_ID);
  
  // Check all possible fields where Discord ID might be
  const possibleId =
    (user.discordId as string | undefined) ??
    (user.providerId as string | undefined) ??
    (user.providerAccountId as string | undefined) ??
    (user.externalId as string | undefined);
    
  console.log("[isOwnerClient] Found ID:", possibleId);
  
  if (possibleId) {
    return possibleId === OWNER_DISCORD_ID;
  }
  
  // If no Discord ID found, we can't verify on client side
  console.log("[isOwnerClient] No Discord ID in user object, deferring to server");
  return false;
}

// Server-side check - queries the database directly
export async function isOwnerServer(userId: string | undefined): Promise<boolean> {
  if (!userId) {
    console.log("[isOwnerServer] No userId provided");
    return false;
  }
  
  try {
    // For now, we use the API endpoint approach instead
    // The API will check properly server-side
    console.log("[isOwnerServer] UserId:", userId);
    return false; // Let API handle it
  } catch (error) {
    console.error("[isOwnerServer] Error:", error);
    return false;
  }
}

// Legacy export for compatibility
export function isOwner(user: SessionUser | null | undefined): boolean {
  return isOwnerClient(user);
}
