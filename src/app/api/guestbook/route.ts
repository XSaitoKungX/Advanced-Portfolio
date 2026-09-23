import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    // Get current session to also show user's own pending entries
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    const entries = await prisma.guestbookEntry.findMany({
      where: {
        OR: [
          { status: "APPROVED" },
          // Show user's own pending entries
          ...(session?.user?.id ? [{ status: "PENDING" as const, userId: session.user.id }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        name: true,
        image: true,
        isVerified: true,
        status: true,
        userId: true,
        createdAt: true,
      },
    });

    // Overlay live profile data for verified entries so avatar/name never stale
    const verifiedUserIds = [...new Set(
      entries
        .filter((e) => e.isVerified && e.userId)
        .map((e) => e.userId as string)
    )];

    if (verifiedUserIds.length > 0) {
      const profiles = await prisma.userProfile.findMany({
        where: { userId: { in: verifiedUserIds } },
        select: { userId: true, avatar: true, displayName: true },
      });
      const profileMap = new Map(profiles.map((p) => [p.userId, p]));

      const enriched = entries.map((e) => {
        if (!e.isVerified || !e.userId) return e;
        const p = profileMap.get(e.userId);
        if (!p) return e;
        return {
          ...e,
          image: p.avatar ?? e.image,
          name: p.displayName ?? e.name,
        };
      });

      return NextResponse.json({ entries: enriched });
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Guestbook GET error:", error);
    return NextResponse.json({ entries: [] });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Entry ID required" }, { status: 400 });
    }

    const entry = await prisma.guestbookEntry.findUnique({ where: { id } });
    if (!entry || entry.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or not your entry" }, { status: 403 });
    }

    await prisma.guestbookEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guestbook DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await request.json();
    const { message, name } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Message too long (max 500 chars)" }, { status: 400 });
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        message: message.trim(),
        name: (session?.user?.name || name?.trim() || "Anonymous").slice(0, 50),
        email: session?.user?.email || undefined,
        image: session?.user?.image || undefined,
        isVerified: !!session?.user,
        userId: session?.user?.id || undefined,
        // Auto-approve verified Discord users, anonymous goes to pending for moderation
        status: session?.user ? "APPROVED" : "PENDING",
      },
    });

    return NextResponse.json({ success: true, entry, pending: !session?.user });
  } catch (error) {
    console.error("Guestbook POST error:", error);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}

