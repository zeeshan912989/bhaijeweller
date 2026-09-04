"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { signInAction, signUpAction } from "@/lib/actions/auth-actions";

interface AuthFormProps {
  initialMode?: "login" | "signup";
  redirectPath?: string;
}

export default function AuthForm({
  initialMode = "login",
  redirectPath = "/account",
}: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || redirectPath;
  const verified = searchParams.get("verified") === "true";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // State
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    verified ? "Your email has been verified successfully. Please sign in." : null
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Real-time password strength rules
  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("redirect", redirect);

    startTransition(async () => {
      if (mode === "login") {
        formData.set("rememberMe", String(rememberMe));
        const res = await signInAction(null, formData);

        if (res.success) {
          router.push(res.redirectUrl || "/account");
          router.refresh();
        } else {
          setErrorMessage(res.error || "Unable to sign in.");
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        }
      } else {
        formData.set("fullName", fullName);
        if (phone) formData.set("phone", phone);
        formData.set("confirmPassword", confirmPassword);

        const res = await signUpAction(null, formData);

        if (res.success) {
          setSuccessMessage(
            res.message || "Account created! Please check your email to verify your account."
          );
          if (res.redirectUrl && !res.redirectUrl.includes("mode=login")) {
            router.push(res.redirectUrl);
            router.refresh();
          } else {
            setMode("login");
            setPassword("");
            setConfirmPassword("");
          }
        } else {
          setErrorMessage(res.error || "Registration could not be completed.");
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        }
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-neutral-200 p-6 sm:p-8 shadow-xl">
      
      {/* Tab Mode Toggle */}
      <div className="flex border-b border-neutral-200 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMessage(null);
            setFieldErrors({});
          }}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all cursor-pointer relative ${
            mode === "login"
              ? "text-neutral-950"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <span>Sign In</span>
          {mode === "login" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMessage(null);
            setFieldErrors({});
          }}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all cursor-pointer relative ${
            mode === "signup"
              ? "text-neutral-950"
              : "text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <span>Create Account</span>
          {mode === "signup" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]" />
          )}
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Notification Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Form Elements */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Sign Up: Full Name */}
        {mode === "signup" && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lord / Lady Jane Doe"
                className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-3 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.fullName}</p>
            )}
          </div>
        )}

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@bhaijewellery.com"
              className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-3 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
          {fieldErrors.email && (
            <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Sign Up: Optional Phone */}
        {mode === "signup" && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Phone Number <span className="text-[10px] text-neutral-400 font-normal">(Optional for delivery updates)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7123 456789"
                className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-3 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Password <span className="text-red-500">*</span>
            </label>
            {mode === "login" && (
              <Link
                href="/auth/forgot-password"
                className="text-[11px] font-semibold text-neutral-500 hover:text-black hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-10 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password}</p>
          )}

          {/* Sign Up Password Strength Indicator */}
          {mode === "signup" && password.length > 0 && (
            <div className="p-3 mt-2 bg-neutral-50 border border-neutral-200 text-[10.5px] space-y-1 text-neutral-600">
              <p className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">
                Password Requirements:
              </p>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <span className={hasMinLength ? "text-emerald-700 font-bold" : "text-neutral-400"}>
                  {hasMinLength ? "✓" : "•"} At least 10 chars
                </span>
                <span className={hasUppercase ? "text-emerald-700 font-bold" : "text-neutral-400"}>
                  {hasUppercase ? "✓" : "•"} Uppercase letter
                </span>
                <span className={hasLowercase ? "text-emerald-700 font-bold" : "text-neutral-400"}>
                  {hasLowercase ? "✓" : "•"} Lowercase letter
                </span>
                <span className={hasNumber ? "text-emerald-700 font-bold" : "text-neutral-400"}>
                  {hasNumber ? "✓" : "•"} Number
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sign Up: Confirm Password */}
        {mode === "signup" && (
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-10 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Login: Remember Me Checkbox */}
        {mode === "login" && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-black border-neutral-300 rounded-none focus:ring-0 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-xs text-neutral-600 cursor-pointer select-none">
              Remember my session securely
            </label>
          </div>
        )}

        {/* Submit Action Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.22em] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === "login" ? "Authenticating..." : "Creating Account..."}</span>
              </>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In to Account" : "Join Bhai VIP Membership"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

      {/* Security Assurance Footer */}
      <div className="mt-6 pt-5 border-t border-neutral-200 text-center flex items-center justify-center gap-2 text-[10.5px] text-neutral-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>256-Bit TLS Encrypted • Protected Session</span>
      </div>

    </div>
  );
}
