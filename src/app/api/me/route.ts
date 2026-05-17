import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { syncDiscordProfileForUser } from "@/lib/sync-discord";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await syncDiscordProfileForUser(session.user.id);

    let profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      const avatarMatch = (session.user.image as string | null)?.match(/\/avatars\/(\d+)\//);
      const discordId = avatarMatch?.[1] ?? null;

      profile = await prisma.userProfile.create({
        data: {
          id: crypto.randomUUID(),
          userId: session.user.id,
          discordId,
          displayName: session.user.name ?? "Unknown",
          avatar: session.user.image ?? null,
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (e) {
    console.error("Me GET error:", e);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
