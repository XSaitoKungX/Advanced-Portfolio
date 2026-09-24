import { OWNER_DISCORD_ID } from "./constants";

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

// Legacy export for compatibility
export function isOwner(user: SessionUser | null | undefined): boolean {
  return isOwnerClient(user);
}
