import nodemailer, { type Transporter } from "nodemailer";

// Lazy initialization - created on first use
let transporter: Transporter | null = null;

export function getSmtpUser(): string {
  const user = process.env.SMTP_USER;
  if (!user) throw new Error("SMTP credentials not configured");
  return user;
}

export function getSmtpTransporter(): Transporter {
  if (transporter) return transporter;

  const user = getSmtpUser();
  const pass = process.env.SMTP_PASS;
  if (!pass) throw new Error("SMTP credentials not configured");

  const port = Number.parseInt(process.env.SMTP_PORT ?? "465", 10);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.spacemail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}
