import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { isOwnerClient } from "@/lib/is-owner";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !isOwnerClient(session.user)) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [pending, approved, rejected] = await Promise.all([
      prisma.guestbookEntry.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      }),
      prisma.guestbookEntry.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.guestbookEntry.findMany({
        where: { status: "REJECTED" },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({ pending, approved, rejected });
  } catch {
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, action } = await request.json();

    if (!id || !["approve", "reject", "delete"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (action === "delete") {
      await prisma.guestbookEntry.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    const updated = await prisma.guestbookEntry.update({
      where: { id },
      data: { status: action === "approve" ? "APPROVED" : "REJECTED" },
    });

    return NextResponse.json({ success: true, entry: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}
