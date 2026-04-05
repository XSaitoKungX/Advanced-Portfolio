import { z } from "zod";

const messages = {
  de: {
    name_min: "Name muss mindestens 2 Zeichen haben.",
    name_max: "Name darf maximal 100 Zeichen haben.",
    email_invalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
    subject_min: "Betreff muss mindestens 3 Zeichen haben.",
    message_min: "Nachricht muss mindestens 10 Zeichen haben.",
    message_max: "Nachricht darf maximal 5000 Zeichen haben.",
  },
  en: {
    name_min: "Name must be at least 2 characters.",
    name_max: "Name must be at most 100 characters.",
    email_invalid: "Please enter a valid email address.",
    subject_min: "Subject must be at least 3 characters.",
    message_min: "Message must be at least 10 characters.",
    message_max: "Message must be at most 5000 characters.",
  },
} as const;

export function createContactSchema(locale: "de" | "en" = "de") {
  const m = messages[locale];
  return z.object({
    name: z.string().min(2, { message: m.name_min }).max(100, { message: m.name_max }).trim(),
    email: z.string().email({ message: m.email_invalid }).max(255),
    subject: z.string().min(3, { message: m.subject_min }).max(200).trim(),
    message: z.string().min(10, { message: m.message_min }).max(5000, { message: m.message_max }).trim(),
    honeypot: z.string().max(0).optional(),
  });
}

export const contactSchema = createContactSchema("de");

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;
