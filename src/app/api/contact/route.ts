import { NextRequest } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many requests. Please wait before sending another message." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const body = await req.json();

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = result.data;

    if (honeypot && honeypot.length > 0) {
      return Response.json({ success: true });
    }

    const contactEmail = process.env.CONTACT_EMAIL ?? "your@email.com";

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nNachricht:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0d1117;color:#f9fafb;border-radius:12px;">
          <h2 style="color:#a78bfa;margin:0 0 16px;">Neue Kontaktanfrage</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">E-Mail</td><td style="padding:8px 0;font-weight:600;">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Betreff</td><td style="padding:8px 0;font-weight:600;">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #1f2937;margin:16px 0;"/>
          <p style="color:#9ca3af;font-size:14px;margin-bottom:8px;">Nachricht:</p>
          <p style="line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
