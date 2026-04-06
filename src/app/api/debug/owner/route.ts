import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { OWNER_DISCORD_ID } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return NextResponse.json({ isOwner: false, error: "No session" });
    }
    
    // The user.id from Better Auth is NOT the Discord ID
    // We need to check if the user was created via Discord OAuth
    // and compare the actual Discord account ID
    
    console.log("[/api/debug/owner] Session user:", session.user);
    console.log("[/api/debug/owner] Expected Discord ID:", OWNER_DISCORD_ID);
    
    // Better Auth stores the provider account ID in the session
    // Try different possible locations
    const user = session.user as Record<string, unknown>;
    
    // Check if there's any field containing the Discord ID
    let discordId: string | undefined;
    
    // Option 1: Direct fields on user
    discordId = (user.discordId || user.providerAccountId || user.providerId || user.externalId) as string | undefined;
    
    // Option 2: Check nested accounts array if present
    if (!discordId && Array.isArray(user.accounts)) {
      const discordAccount = user.accounts.find(
        (acc: { provider?: string; providerId?: string; accountId?: string }) => 
          acc.provider === "discord" || acc.providerId === "discord"
      );
      discordId = discordAccount?.accountId || discordAccount?.providerAccountId;
    }
    
    console.log("[/api/debug/owner] Found Discord ID:", discordId);
    console.log("[/api/debug/owner] Match:", discordId === OWNER_DISCORD_ID);
    
    const isOwner = discordId === OWNER_DISCORD_ID;
    
    return NextResponse.json({ 
      isOwner, 
      discordId,
      expectedId: OWNER_DISCORD_ID,
      userId: user.id,
      userKeys: Object.keys(user)
    });
  } catch (error) {
    console.error("[/api/debug/owner] Error:", error);
    return NextResponse.json({ isOwner: false, error: String(error) });
  }
}
