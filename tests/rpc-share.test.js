import { describe, expect, test } from "bun:test";
import { decodeProfile } from "../src/app/[locale]/discord-customrpc/share/_lib/profile.ts";

const profile = { name: "Gaming Setup", applicationId: "1234567890123456789" };
const encode = (value) =>
  Buffer.from(JSON.stringify(value), "utf8").toString("base64");

describe("shared RPC profiles", () => {
  test("reads UTF-8 names, details and emojis without changing their text", () => {
    const shared = { ...profile, name: "Grüße 🚀", details: "日本語 • café" };
    expect(decodeProfile(encode(shared))).toEqual(shared);
  });

  test("keeps existing Latin-1 share links readable", () => {
    const legacy = { ...profile, name: "Grüße" };
    const data = Buffer.from(JSON.stringify(legacy), "latin1").toString(
      "base64",
    );
    expect(decodeProfile(data)).toEqual(legacy);
  });

  test("accepts missing and null optional fields", () => {
    expect(decodeProfile(encode(profile))).toEqual(profile);
    expect(decodeProfile(encode({ ...profile, details: null }))).toEqual(
      profile,
    );
  });

  test.each(
    [
      null,
      [],
      12,
      "profile",
      {},
      { ...profile, name: {} },
      { ...profile, name: " " },
      { ...profile, applicationId: 123 },
      { ...profile, details: {} },
      { ...profile, button1Label: ["Unexpected"] },
    ].map((value) => [value]),
  )("rejects invalid shapes before they reach React: %j", (value) => {
    expect(decodeProfile(encode(value))).toBeNull();
  });

  test("rejects corrupt Base64 and JSON", () => {
    expect(decodeProfile("%%%broken%%%")).toBeNull();
    expect(
      decodeProfile(Buffer.from("{broken json").toString("base64")),
    ).toBeNull();
  });
});
