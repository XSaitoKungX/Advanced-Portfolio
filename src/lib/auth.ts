import { betterAuth } from "better-auth";
import type { Pool } from "pg";
import { getSmtpTransporter, getSmtpUser } from "@/lib/mailer";
import { cleanupBeforeUserDeletion } from "@/lib/delete-user-data";
import { syncDiscordProfileForUser } from "./sync-discord";

// Server-only database pool - lazy loaded to prevent client bundling
let pool: Pool | undefined;
function getPool(): Pool | undefined {
  if (!pool && typeof window === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool: PgPool } = require("pg");
    pool = new PgPool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: true },
    });
  }
  return pool;
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: getPool(),
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await getSmtpTransporter().sendMail({
          from: `"Portfolio" <${getSmtpUser()}>`,
          to: user.email,
          subject: "Confirm your xsaitox.dev account deletion",
          text: `To confirm deletion of your account and associated profile data, open this link:\n\n${url}\n\nApproved guestbook messages will remain visible anonymously. Pending entries will be removed.`,
        });
      },
      beforeDelete: async (user) => {
        await cleanupBeforeUserDeletion(user.id, user.email);
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          syncDiscordProfileForUser(session.userId).catch(() => {});
        },
      },
    },
  },
});
