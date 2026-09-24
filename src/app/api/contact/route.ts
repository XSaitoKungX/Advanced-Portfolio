import { NextRequest } from "next/server";
import { getSmtpTransporter, getSmtpUser } from "@/lib/mailer";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { parseLimitedJson, RequestBodyTooLargeError } from "@/lib/limited-json";
import { contactSchema } from "@/lib/validations/contact";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(`contact:${getClientIp(req.headers)}`, 5, 60_000)) {
    return Response.json(
      { error: "Too many requests. Please wait before sending another message." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: unknown;
  try {
    body = await parseLimitedJson(req, 16 * 1024);
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    return Response.json({ error: "Invalid request body" }, { status });
  }

  try {
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return Response.json(
        { error: "Validation failed", details: fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = result.data;

    if (honeypot && honeypot.length > 0) {
      return Response.json({ success: true });
    }

    const contactEmail = process.env.CONTACT_EMAIL ?? process.env.SMTP_USER ?? "your@email.com";
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    await getSmtpTransporter().sendMail({
      from: `"Portfolio Contact" <${getSmtpUser()}>`,
      to: contactEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nNachricht:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0d1117;color:#f9fafb;border-radius:12px;">
          <h2 style="color:#a78bfa;margin:0 0 16px;">Neue Kontaktanfrage</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Name</td><td style="padding:8px 0;font-weight:600;">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">E-Mail</td><td style="padding:8px 0;font-weight:600;">${safeEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px;">Betreff</td><td style="padding:8px 0;font-weight:600;">${safeSubject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #1f2937;margin:16px 0;"/>
          <p style="color:#9ca3af;font-size:14px;margin-bottom:8px;">Nachricht:</p>
          <p style="line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
