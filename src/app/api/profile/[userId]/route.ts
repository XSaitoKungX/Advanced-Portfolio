import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  try {
    const isOwn = session?.user?.id === userId;

    let profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // If own profile and logged in, upsert from session data
    if (isOwn && session?.user) {
      const user = session.user;

      // Extract discordId from avatar URL (e.g. cdn.discordapp.com/avatars/848917.../hash.png)
      const avatarMatch = (user.image as string | null)?.match(/\/avatars\/(\d+)\//);
      const discordId = avatarMatch?.[1] ?? null;

      profile = await prisma.userProfile.upsert({
        where: { userId },
        create: {
          id: crypto.randomUUID(),
          userId,
          discordId,
          displayName: user.name ?? "Unknown",
          avatar: user.image ?? null,
        },
        update: {
          discordId: discordId ?? undefined,
          displayName: user.name ?? undefined,
          avatar: user.image ?? undefined,
        },
      });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile, isOwn });
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bio, bannerColor } = body;

    const profile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        id: crypto.randomUUID(),
        userId,
        displayName: session.user.name ?? "Unknown",
        avatar: session.user.image ?? null,
        bio: bio?.slice(0, 500) ?? null,
        bannerColor: bannerColor ?? null,
      },
      update: {
        bio: bio?.slice(0, 500) ?? undefined,
        bannerColor: bannerColor ?? undefined,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

