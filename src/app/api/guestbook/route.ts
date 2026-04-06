import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        name: true,
        image: true,
        isVerified: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ entries });
  } catch {
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
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch {
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}

