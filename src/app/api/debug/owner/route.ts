import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { OWNER_DISCORD_ID } from "@/lib/auth";
import { headers } from "next/headers";

// Extract Discord ID from the avatar URL
// Format: https://cdn.discordapp.com/avatars/{DISCORD_ID}/{hash}.png
function extractDiscordIdFromImageUrl(imageUrl: string | null | undefined): string | undefined {
  if (!imageUrl) return undefined;
  
  const match = imageUrl.match(/\/avatars\/(\d+)\//);
  return match?.[1];
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return NextResponse.json({ isOwner: false, error: "No session" });
    }
    
    const user = session.user as Record<string, unknown>;
    
    console.log("[/api/debug/owner] Session user:", session.user);
    console.log("[/api/debug/owner] Expected Discord ID:", OWNER_DISCORD_ID);
    
    // Better Auth stores Discord ID in the avatar URL!
    // https://cdn.discordapp.com/avatars/{DISCORD_ID}/{hash}.png
    const discordId = extractDiscordIdFromImageUrl(user.image as string);
    
    console.log("[/api/debug/owner] Extracted Discord ID from image URL:", discordId);
    console.log("[/api/debug/owner] Image URL:", user.image);
    console.log("[/api/debug/owner] Match:", discordId === OWNER_DISCORD_ID);
    
    const isOwner = discordId === OWNER_DISCORD_ID;
    
    return NextResponse.json({ 
      isOwner, 
      discordId,
      expectedId: OWNER_DISCORD_ID,
      userId: user.id,
      imageUrl: user.image,
    });
  } catch (error) {
    console.error("[/api/debug/owner] Error:", error);
    return NextResponse.json({ isOwner: false, error: String(error) });
  }
}
