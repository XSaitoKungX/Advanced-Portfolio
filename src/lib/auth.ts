import { betterAuth } from "better-auth";
import type { Pool } from "pg";

export const OWNER_DISCORD_ID = "848917797501141052";

// Server-only database pool - lazy loaded to prevent client bundling
let pool: Pool | undefined;
function getPool(): Pool | undefined {
  if (!pool && typeof window === "undefined") {
    const { Pool: PgPool } = require("pg");
    pool = new PgPool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: typeof window === "undefined" ? getPool() : undefined,
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
});
