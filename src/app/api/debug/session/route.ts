import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }
    
    // Return full session data for debugging
    return NextResponse.json({
      user: session.user,
      session: {
        id: session.session?.id,
        createdAt: session.session?.createdAt,
        updatedAt: session.session?.updatedAt,
        userId: session.session?.userId,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
