import { beforeEach, expect, mock, test } from "bun:test";

let storedProfile;
let discordUser;
const prisma = {
  userProfile: {
    upsert: async ({ create, update }) => {
      if (!storedProfile) storedProfile = { ...create };
      else
        Object.assign(
          storedProfile,
          Object.fromEntries(
            Object.entries(update).filter(([, value]) => value !== undefined),
          ),
        );
      return storedProfile;
    },
  },
  user: { update: async () => ({}) },
  guestbookEntry: { updateMany: async () => ({ count: 0 }) },
};

mock.module("../src/lib/prisma.ts", () => ({ prisma }));
mock.module("../src/lib/discord.ts", () => ({
  fetchDiscordUser: async () => discordUser,
  avatarUrl: () => null,
  bannerUrl: () => null,
}));
const { syncDiscordProfile } = await import("../src/lib/sync-discord.ts");

beforeEach(() => {
  storedProfile = null;
  discordUser = {
    id: "123456789012345678",
    username: "fixture",
    global_name: "Fixture",
    bio: "Initial Discord bio",
    avatar: null,
    banner: null,
  };
});

test("seeds a new profile from Discord", async () => {
  await syncDiscordProfile("fixture-user", "fixture-token");
  expect(storedProfile.bio).toBe("Initial Discord bio");
  expect(storedProfile.displayName).toBe("Fixture");
});

test.each(["My website bio", ""])(
  "keeps an edited website bio across syncs: %j",
  async (bio) => {
    await syncDiscordProfile("fixture-user", "fixture-token");
    storedProfile.bio = bio;
    discordUser.bio = "Changed Discord bio";
    discordUser.global_name = "Updated name";
    await syncDiscordProfile("fixture-user", "fixture-token");
    await syncDiscordProfile("fixture-user", "fixture-token");
    expect(storedProfile.bio).toBe(bio);
    expect(storedProfile.displayName).toBe("Updated name");
  },
);

test("leaves existing data intact when Discord is unavailable", async () => {
  storedProfile = { bio: "Saved website bio", displayName: "Saved name" };
  discordUser = null;
  await syncDiscordProfile("fixture-user", "fixture-token");
  expect(storedProfile).toEqual({
    bio: "Saved website bio",
    displayName: "Saved name",
  });
});
