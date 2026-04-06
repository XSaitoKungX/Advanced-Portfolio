import { OWNER_DISCORD_ID } from "./auth";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  [key: string]: unknown;
};

// Extract Discord ID from the avatar URL
// Format: https://cdn.discordapp.com/avatars/{DISCORD_ID}/{hash}.png
function extractDiscordIdFromImageUrl(imageUrl: string | null | undefined): string | undefined {
  if (!imageUrl) return undefined;
  const match = imageUrl.match(/\/avatars\/(\d+)\//);
  return match?.[1];
}

// Client-side check (extracts Discord ID from avatar URL)
export function isOwnerClient(user: SessionUser | null | undefined): boolean {
  if (!user) {
    console.log("[isOwnerClient] No user provided");
    return false;
  }
  
  console.log("[isOwnerClient] User keys:", Object.keys(user));
  console.log("[isOwnerClient] User image:", user.image);
  console.log("[isOwnerClient] Looking for Discord ID:", OWNER_DISCORD_ID);
  
  // Better Auth stores Discord ID in the avatar URL!
  const discordId = extractDiscordIdFromImageUrl(user.image as string);
  
  console.log("[isOwnerClient] Extracted Discord ID:", discordId);
  console.log("[isOwnerClient] Match:", discordId === OWNER_DISCORD_ID);
  
  if (discordId) {
    return discordId === OWNER_DISCORD_ID;
  }
  
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
