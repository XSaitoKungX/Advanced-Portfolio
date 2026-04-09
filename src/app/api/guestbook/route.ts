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
        createdAt: true,
      },
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Guestbook GET error:", error);
    return NextResponse.json({ entries: [] });
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

