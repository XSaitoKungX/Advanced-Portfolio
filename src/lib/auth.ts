import { betterAuth } from "better-auth";
import type { Pool } from "pg";
import { OWNER_DISCORD_ID } from "./constants";

export { OWNER_DISCORD_ID };

// Server-only database pool - lazy loaded to prevent client bundling
let pool: Pool | undefined;
function getPool(): Pool | undefined {
  if (!pool && typeof window === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
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
});
