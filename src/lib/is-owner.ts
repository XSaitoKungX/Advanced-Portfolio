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
  if (!user) return false;
  const discordId = extractDiscordIdFromImageUrl(user.image as string);
  return discordId === OWNER_DISCORD_ID;
}

// Server-side check
export async function isOwnerServer(): Promise<boolean> {
  // Server-side check requires API call - handled in admin page
  return false;
}

// Legacy export for compatibility
export function isOwner(user: SessionUser | null | undefined): boolean {
  return isOwnerClient(user);
}
