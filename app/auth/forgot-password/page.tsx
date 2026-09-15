"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { forgotPasswordAction } from "@/lib/actions/auth-actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.set("email", email);

    startTransition(async () => {
      const res = await forgotPasswordAction(null, formData);
      if (res.success) {
        setMessage(res.message || "If an account exists, a reset link has been sent.");
      } else {
        setError(res.error || "Unable to process request.");
      }
    });
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col justify-between bg-[#FAF7F2] text-neutral-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 lg:pt-24 pb-6 lg:pb-2 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
          
          <div className="bg-white border border-neutral-200/90 p-5 sm:p-7 shadow-xl">
            
            <div className="text-center space-y-1.5 mb-5">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
                <KeyRound className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h1
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-lg sm:text-xl font-bold uppercase tracking-[0.16em] text-neutral-950"
              >
                Reset Password
              </h1>
              <p className="text-[11.5px] text-neutral-500 font-light">
                Enter your registered email address to receive a secure reset link.
              </p>
            </div>

            {message && (
              <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="leading-snug font-medium text-[11.5px]">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="leading-snug font-medium text-[11.5px]">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@bhaijewellery.com"
                    className="w-full bg-neutral-50 text-xs text-neutral-950 pl-8 pr-3 py-2.5 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-neutral-200 text-center">
              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>

          </div>

        </div>
      </main>

      {/* Sleek Minimal Auth Footer */}
      <footer className="py-2.5 px-4 border-t border-neutral-200/80 bg-white/70 backdrop-blur-xs text-center text-[10.5px] text-neutral-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} BHAI Fine Jewellery London. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/pages/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/pages/terms-and-conditions" className="hover:text-black transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-black transition-colors">Concierge Assistance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
