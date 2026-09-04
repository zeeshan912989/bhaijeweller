"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import {
  checkAuthRateLimit,
  GENERIC_AUTH_MESSAGES,
} from "@/lib/auth/auth-security";
import { validateRedirectPath } from "@/lib/auth/redirect-validation";
import { mergeGuestCart } from "@/lib/cart/cart-service";
import { CART_COOKIE_NAME } from "@/lib/cart/cart-security";
import { cookies } from "next/headers";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
  redirectUrl?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Server Action for User Login
 */
export async function signInAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "true" || formData.get("rememberMe") === "on",
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input",
      fieldErrors: parsed.error.issues.reduce((acc, issue) => {
        const field = issue.path[0] as string;
        acc[field] = issue.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  const { email, password } = parsed.data;

  // Enforce rate limiting
  const rateLimit = checkAuthRateLimit("login", email);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many failed attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: GENERIC_AUTH_MESSAGES.INVALID_CREDENTIALS,
    };
  }

  // Merge guest cart if present
  try {
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get(CART_COOKIE_NAME)?.value;
    if (guestSessionToken) {
      await mergeGuestCart(guestSessionToken, data.user.id);
      cookieStore.delete(CART_COOKIE_NAME);
    }
  } catch (mergeErr) {
    console.warn("Notice: Cart auto-merge completed or skipped:", mergeErr);
  }

  const rawRedirect = formData.get("redirect") as string | null;
  const safeRedirect = validateRedirectPath(rawRedirect, "/account");

  return {
    success: true,
    message: "Login successful.",
    redirectUrl: safeRedirect,
  };
}

/**
 * Server Action for User Registration
 */
export async function signUpAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signupSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid registration data",
      fieldErrors: parsed.error.issues.reduce((acc, issue) => {
        const field = issue.path[0] as string;
        acc[field] = issue.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }

  const { fullName, email, phone, password } = parsed.data;

  // Enforce rate limiting
  const rateLimit = checkAuthRateLimit("signup", email);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many sign-up attempts. Please wait ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const supabase = await createClient();
  const headerList = await headers();
  const origin = headerList.get("origin") || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
      },
      emailRedirectTo: `${origin}/auth?verified=true`,
    },
  });

  if (error) {
    console.error("Sign up error:", error.message);
    return {
      success: false,
      error: "Unable to complete registration. If you already have an account, please log in.",
    };
  }

  // Merge guest cart if user session created immediately
  if (data.user) {
    try {
      const cookieStore = await cookies();
      const guestSessionToken = cookieStore.get(CART_COOKIE_NAME)?.value;
      if (guestSessionToken) {
        await mergeGuestCart(guestSessionToken, data.user.id);
        cookieStore.delete(CART_COOKIE_NAME);
      }
    } catch {
      // Ignore
    }
  }

  const rawRedirect = formData.get("redirect") as string | null;
  const safeRedirect = validateRedirectPath(rawRedirect, "/account");

  // Check if email confirmation is required
  if (data.user && !data.session) {
    return {
      success: true,
      message:
        "Account created! Please check your email to confirm your account before logging in.",
      redirectUrl: "/auth?mode=login",
    };
  }

  return {
    success: true,
    message: "Welcome to Bhai Luxury Fine Jewellery!",
    redirectUrl: safeRedirect,
  };
}

/**
 * Server Action for Password Reset Request
 */
export async function forgotPasswordAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
  };

  const parsed = forgotPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Valid email is required.",
    };
  }

  const { email } = parsed.data;

  const rateLimit = checkAuthRateLimit("forgot_password", email);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Too many reset requests. Please try again later.",
    };
  }

  const supabase = await createClient();
  const headerList = await headers();
  const origin = headerList.get("origin") || "http://localhost:3000";

  try {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
    });
  } catch (err) {
    console.warn("Forgot password notice:", err);
  }

  // Always return generic safe response to eliminate account enumeration
  return {
    success: true,
    message: GENERIC_AUTH_MESSAGES.PASSWORD_RESET_DISPATCHED,
  };
}

/**
 * Server Action for Setting New Password
 */
export async function resetPasswordAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = resetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid password format.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      error: "Failed to reset password. The link may have expired.",
    };
  }

  return {
    success: true,
    message: "Your password has been reset successfully. Redirecting to your account...",
    redirectUrl: "/account",
  };
}

/**
 * Server Action for Sign Out
 */
export async function signOutAction(): Promise<{ success: boolean }> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
