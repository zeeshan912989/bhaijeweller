import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limiter map (Zero Redis required)
const ipRateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired keys periodically every 2 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipRateLimitMap.entries()) {
      if (now > record.resetTime) {
        ipRateLimitMap.delete(key);
      }
    }
  }, 120_000);
}

export interface RateLimitConfig {
  maxRequests: number; // Maximum allowed requests
  windowMs: number;    // Time window in milliseconds (e.g. 60_000 for 1 minute)
}

const ROUTE_RATE_LIMITS: Array<{ prefix: string; config: RateLimitConfig }> = [
  { prefix: "/api/checkout", config: { maxRequests: 10, windowMs: 60_000 } },          // 10 orders/min per IP
  { prefix: "/api/admin/products/bulk", config: { maxRequests: 6, windowMs: 60_000 } }, // 6 bulk imports/min per IP
  { prefix: "/api/auth", config: { maxRequests: 20, windowMs: 60_000 } },              // 20 auth attempts/min per IP
  { prefix: "/api/cart", config: { maxRequests: 60, windowMs: 60_000 } },              // 60 cart updates/min per IP
  { prefix: "/api/", config: { maxRequests: 120, windowMs: 60_000 } },                 // 120 general API calls/min
];

export function checkRateLimit(request: NextRequest): { allowed: boolean; response?: NextResponse } {
  const pathname = request.nextUrl.pathname;

  // Find matching rule
  const matchedRule = ROUTE_RATE_LIMITS.find((r) => pathname.startsWith(r.prefix));
  if (!matchedRule) {
    return { allowed: true };
  }

  // Extract IP identifier
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";

  const key = `${clientIp}:${matchedRule.prefix}`;
  const now = Date.now();
  const record = ipRateLimitMap.get(key);

  const { maxRequests, windowMs } = matchedRule.config;

  if (!record || now > record.resetTime) {
    // New or expired window
    ipRateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true };
  }

  // Existing window
  if (record.count >= maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    const response = NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please slow down.",
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfterSec.toString(),
          "X-RateLimit-Limit": maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.ceil(record.resetTime / 1000).toString(),
        },
      }
    );
    return { allowed: false, response };
  }

  record.count += 1;
  return { allowed: true };
}
