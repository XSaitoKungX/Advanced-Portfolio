export function rand32(n: number): Uint32Array {
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

export function randInt(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > 0x100000000) {
    throw new RangeError("maxExclusive must be an integer between 1 and 2^32");
  }

  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  while (true) {
    const [value] = rand32(1);
    if (value < limit) return value % maxExclusive;
  }
}

export function randomChance(numerator: number, denominator: number): boolean {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new RangeError("Chance values must be safe integers");
  }
  if (numerator <= 0) return false;
  if (numerator >= denominator) return true;
  return randInt(denominator) < numerator;
}

export function pick<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new RangeError("Cannot pick from an empty array");
  return arr[randInt(arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function randBytes(n: number): Uint8Array {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

export function toHex(buf: Uint8Array): string {
  return Array.from(buf, b => b.toString(16).padStart(2, "0")).join("");
}

export function toBase64url(buf: Uint8Array): string {
  const b64 = btoa(String.fromCharCode(...buf));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function encodeFromBytes(buf: Uint8Array, alphabet: string): string {
  const limit = Math.floor(256 / alphabet.length) * alphabet.length;
  let result = "";
  for (const b of buf) {
    let value = b;
    while (value >= limit) {
      value = randBytes(1)[0];
    }
    result += alphabet[value % alphabet.length];
  }
  return result;
}

export function randomString(alphabet: string, length: number): string {
  if (alphabet.length === 0) throw new RangeError("Alphabet must not be empty");
  return Array.from({ length }, () => alphabet[randInt(alphabet.length)]).join("");
}

export function toBase62(buf: Uint8Array): string {
  return encodeFromBytes(buf, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
}

export function toBase58(buf: Uint8Array): string {
  return encodeFromBytes(buf, "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
}

export function uuidV4(): string {
  return crypto.randomUUID();
}

export function uuidV7(): string {
  const buf = randBytes(16);
  const now = Date.now();
  // Encode 48-bit ms timestamp into bytes 0-5 without BigInt
  buf[0] = Math.floor(now / 0x10000000000) & 0xff;
  buf[1] = Math.floor(now / 0x100000000)   & 0xff;
  buf[2] = Math.floor(now / 0x1000000)     & 0xff;
  buf[3] = Math.floor(now / 0x10000)       & 0xff;
  buf[4] = Math.floor(now / 0x100)         & 0xff;
  buf[5] = now & 0xff;
  buf[6] = (buf[6] & 0x0f) | 0x70; // version 7
  buf[8] = (buf[8] & 0x3f) | 0x80; // variant 10xx
  const h = toHex(buf);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeCrockfordNumber(value: number, numChars: number): string {
  const result = new Array<string>(numChars);
  let v = value;
  for (let i = numChars - 1; i >= 0; i--) {
    result[i] = CROCKFORD[Math.floor(v) % 32];
    v = Math.floor(v / 32);
  }
  return result.join("");
}

export function ulid(): string {
  const ts = encodeCrockfordNumber(Date.now(), 10);
  const randBuf = randBytes(10);
  // Process in two 5-byte chunks (each fits in a safe JS integer: 2^40 < 2^53)
  let hi = 0;
  let lo = 0;
  for (let i = 0; i < 5; i++) hi = hi * 256 + randBuf[i];
  for (let i = 5; i < 10; i++) lo = lo * 256 + randBuf[i];
  return ts + encodeCrockfordNumber(hi, 8) + encodeCrockfordNumber(lo, 8);
}

export function nanoidStyle(size = 21): string {
  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  return randomString(ALPHA, size);
}
