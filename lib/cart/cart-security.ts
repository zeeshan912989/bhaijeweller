import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const CART_COOKIE_NAME = "bhai_cart_session";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// -------------------------------------------------------------
// In-Memory Sliding Window Rate Limiter
// -------------------------------------------------------------
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

/**
 * Checks rate limiting for a given key within a sliding 1-minute window
 * @param key unique identifier (e.g., ip:action or session:action)
 * @param limit maximum allowed requests per minute
 * @returns { allowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  key: string,
  limit: number = 60
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = 60000; // 1 minute

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetInSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetInSeconds: 60,
  };
}

/**
 * Extracts Client IP address securely from standard Next.js headers
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Generates a cryptographically secure random session token for guest carts
 */
export function generateGuestSessionToken(): string {
  return crypto.randomUUID();
}

/**
 * Attaches the secure guest cart cookie to the response
 */
export function setGuestCartCookie(res: NextResponse, sessionToken: string): void {
  res.cookies.set({
    name: CART_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}
