import { createPublicKey, verify } from "node:crypto";
import { deleteDiscordAuthorizedUser } from "@/lib/delete-user-data";
import { readLimitedBody, RequestBodyTooLargeError } from "@/lib/limited-json";

export const runtime = "nodejs";

const publicKeyPrefix = Buffer.from("302a300506032b6570032100", "hex");

function verifyDiscordSignature(body: Uint8Array, signature: string, timestamp: string, publicKeyHex: string) {
  if (!/^[\da-f]{128}$/i.test(signature) || !/^[\da-f]{64}$/i.test(publicKeyHex)) return false;

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 900) return false;

  try {
    const publicKey = createPublicKey({
      key: Buffer.concat([publicKeyPrefix, Buffer.from(publicKeyHex, "hex")]),
      format: "der",
      type: "spki",
    });
    const signedBody = Buffer.concat([Buffer.from(timestamp), Buffer.from(body)]);
    return verify(null, signedBody, publicKey, Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!publicKey || !clientId) {
    return Response.json({ error: "Discord webhook is not configured" }, { status: 503 });
  }

  let body: Uint8Array;
  try {
    body = await readLimitedBody(request, 64 * 1024);
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    return Response.json({ error: "Invalid webhook body" }, { status });
  }

  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  if (!signature || !timestamp || !verifyDiscordSignature(body, signature, timestamp, publicKey)) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return Response.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const eventPayload = payload as Record<string, unknown>;
  if (eventPayload.application_id !== clientId) {
    return new Response("Invalid application", { status: 401 });
  }

  if (eventPayload.type === 0) {
    return new Response(null, { status: 204, headers: { "Content-Type": "application/json" } });
  }
  if (eventPayload.type !== 1) return new Response(null, { status: 204 });

  const event = eventPayload.event;
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return Response.json({ error: "Invalid event" }, { status: 400 });
  }

  const eventBody = event as Record<string, unknown>;
  if (eventBody.type !== "APPLICATION_DEAUTHORIZED") return new Response(null, { status: 204 });

  const data = eventBody.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return Response.json({ error: "Invalid deauthorization event" }, { status: 400 });
  }

  const user = (data as Record<string, unknown>).user;
  if (!user || typeof user !== "object" || Array.isArray(user)) {
    return Response.json({ error: "Missing user" }, { status: 400 });
  }

  const discordId = (user as Record<string, unknown>).id;
  if (typeof discordId !== "string" || !/^\d{17,20}$/.test(discordId)) {
    return Response.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    await deleteDiscordAuthorizedUser(discordId);
  } catch {
    console.error("Discord deauthorization cleanup failed");
    return Response.json({ error: "Failed to remove Discord account data" }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
