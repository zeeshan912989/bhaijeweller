"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth-actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await resetPasswordAction(null, formData);
      if (res.success) {
        setMessage(res.message || "Password reset successfully!");
        setTimeout(() => {
          router.push(res.redirectUrl || "/account");
          router.refresh();
        }, 1500);
      } else {
        setError(res.error || "Unable to reset password.");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-neutral-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 flex items-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
          
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xl">
            
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
                <KeyRound className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h1
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-xl sm:text-2xl font-bold uppercase tracking-[0.16em] text-neutral-950"
              >
                Set New Password
              </h1>
              <p className="text-xs text-neutral-500 font-light">
                Please create a secure password for your fine jewellery account.
              </p>
            </div>

            {message && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
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

                {password.length > 0 && (
                  <div className="p-3 mt-2 bg-neutral-50 border border-neutral-200 text-[10.5px] space-y-1 text-neutral-600">
                    <p className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">
                      Requirements:
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

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
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
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.22em] transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
