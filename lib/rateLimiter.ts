interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const bucket = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string) {
  const now = Date.now();
  const entry = bucket.get(identifier);

  if (!entry || entry.resetAt <= now) {
    bucket.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return {
      success: true,
      remaining: MAX_REQUESTS - 1,
      reset: now + WINDOW_MS,
    };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: MAX_REQUESTS - entry.count,
    reset: entry.resetAt,
  };
}
