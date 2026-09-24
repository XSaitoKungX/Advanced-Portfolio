type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const normalizedKey = key.slice(0, 128);
  const bucket = buckets.get(normalizedKey);

  if (bucket && now < bucket.resetAt) {
    if (bucket.count >= limit) return false;
    bucket.count++;
    return true;
  }

  buckets.delete(normalizedKey);
  if (buckets.size >= MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey) buckets.delete(oldestKey);
  }

  buckets.set(normalizedKey, { count: 1, resetAt: now + windowMs });
  return true;
}

export function getClientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);

  return headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 64) || "unknown";
}
