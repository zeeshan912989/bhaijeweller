// -------------------------------------------------------------
// Authentication Rate Limiting & Account Enumeration Defense
// -------------------------------------------------------------

interface RateRecord {
  timestamps: number[];
}

const authRateLimitMap = new Map<string, RateRecord>();

// Cleanup stale records every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of authRateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000); // 1 hour max window
      if (record.timestamps.length === 0) {
        authRateLimitMap.delete(key);
      }
    }
  }, 600000);
}

export type AuthActionType =
  | "login"
  | "signup"
  | "forgot_password"
  | "reset_password"
  | "profile_update";

const ACTION_LIMITS: Record<AuthActionType, { max: number; windowMs: number }> = {
  login: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  signup: { max: 5, windowMs: 60 * 60 * 1000 }, // 5 signups per hour
  forgot_password: { max: 3, windowMs: 60 * 60 * 1000 }, // 3 resets per hour
  reset_password: { max: 5, windowMs: 30 * 60 * 1000 }, // 5 attempts per 30 minutes
  profile_update: { max: 20, windowMs: 10 * 60 * 1000 }, // 20 updates per 10 minutes
};

/**
 * Enforces rate limiting on sensitive authentication actions
 */
export function checkAuthRateLimit(
  action: AuthActionType,
  identifier: string
): { allowed: boolean; retryAfterSeconds: number } {
  const config = ACTION_LIMITS[action];
  const key = `${action}:${identifier.toLowerCase()}`;
  const now = Date.now();

  let record = authRateLimitMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    authRateLimitMap.set(key, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter((ts) => now - ts < config.windowMs);

  if (record.timestamps.length >= config.max) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + config.windowMs - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.timestamps.push(now);
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Generic safe error messages that prevent Account Enumeration attacks
 */
export const GENERIC_AUTH_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  PASSWORD_RESET_DISPATCHED:
    "If an account exists with this email address, a password reset link has been sent.",
  RATE_LIMIT_EXCEEDED:
    "Too many attempts. Please wait a few minutes before trying again.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again later.",
};
