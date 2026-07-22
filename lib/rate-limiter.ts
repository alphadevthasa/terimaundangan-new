/**
 * Simple in-memory rate limiter.
 * Note: In-memory store resets on server restart/cold start.
 * For production at scale, replace with Redis-based store.
 */
const store = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_CONFIG = {
  maxRequests: 3,
  windowSeconds: 300,
};

export function checkRateLimit(key: string, config: { maxRequests?: number; windowSeconds?: number } = {}): { allowed: boolean; retryAfter?: number } {
  const { maxRequests, windowSeconds } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true };
  }
  if (existing.count >= maxRequests) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  existing.count += 1;
  return { allowed: true };
}

export function rateLimitKey(prefix: string, ip: string): string {
  return `${prefix}:${ip}`;
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xri = request.headers.get('x-real-ip');
  if (xri) return xri;
  return 'unknown';
}
