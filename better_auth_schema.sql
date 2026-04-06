-- Better Auth schema for PostgreSQL
-- Run this in Neon SQL Editor or via prisma db execute

-- User table
CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" BOOLEAN DEFAULT FALSE,
    image TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Account table (OAuth connections)
CREATE TABLE IF NOT EXISTS "account" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "providerId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    "scope" TEXT,
    "idToken" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("providerId", "accountId")
);

-- Session table
CREATE TABLE IF NOT EXISTS "session" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification table (email verification, password reset, etc.)
CREATE TABLE IF NOT EXISTS "verification" (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_account_userId ON "account"("userId");
CREATE INDEX IF NOT EXISTS idx_session_userId ON "session"("userId");
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON "verification"(identifier);
