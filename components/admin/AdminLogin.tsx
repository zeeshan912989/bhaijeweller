"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityPin, setSecurityPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Verify Email & Password
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanEmail === "bhaijeweller@gmail.com" && cleanPass === "bhai909") {
        setStep(2);
      } else {
        setErrorMsg("Invalid administrator credentials. Please check email and password.");
      }
    }, 600);
  };

  // Step 2: Verify 2nd Layer Security PIN (9090)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanPin = securityPin.trim();

      if (cleanPin === "9090") {
        // Save 24-Hour Active Session Token
        const sessionPayload = {
          authenticated: true,
          email: "bhaijeweller@gmail.com",
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours
          sessionId: `bhai_auth_${Math.random().toString(36).substring(2, 12)}`,
        };
        try {
          localStorage.setItem("bhai_admin_session_v1", JSON.stringify(sessionPayload));
        } catch (e) {
          console.error("Storage error", e);
        }
        onLoginSuccess();
      } else {
        setErrorMsg("Invalid 2nd Layer Security Key. Access denied.");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Login Box (Square Luxury UI) */}
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 p-8 sm:p-10 relative z-10 shadow-2xl rounded-none">
        
        {/* Brand Header */}
        <div className="text-center pb-8 border-b border-neutral-900 mb-8">
          <span
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-2xl font-bold tracking-[0.25em] text-white block mb-1"
          >
            BHAI
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Encrypted Vault Portal</span>
          </div>
        </div>

        {/* Security Alert / Error Box */}
        {errorMsg && (
          <div className="p-3 mb-6 bg-red-950/40 border border-red-800 text-red-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Primary Credentials */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5 text-xs animate-in fade-in duration-300">
            <div className="text-left mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Administrator Sign In</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">Enter registered boutique credentials to authenticate</p>
            </div>

            <div>
              <label className="block font-bold text-neutral-400 uppercase tracking-widest mb-2 text-[10.5px]">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="bhaijeweller@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white pl-10 pr-3.5 py-3 outline-none focus:border-[#d4af37] text-xs rounded-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-400 uppercase tracking-widest mb-2 text-[10.5px]">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white pl-10 pr-3.5 py-3 outline-none focus:border-[#d4af37] text-xs rounded-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-[#d4af37] hover:bg-[#c5a030] text-neutral-950 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none disabled:opacity-50"
            >
              <span>{isLoading ? "Verifying..." : "Verify & Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Second Layer Security Key (9090) */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5 text-xs animate-in fade-in duration-300">
            <div className="text-left mb-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Step 1 Authenticated</span>
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">2nd Layer Security Key</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">Enter the 4-digit security PIN for session authorization</p>
            </div>

            <div>
              <label className="block font-bold text-neutral-400 uppercase tracking-widest mb-2 text-[10.5px]">
                Security PIN Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="••••"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white pl-10 pr-3.5 py-3 outline-none focus:border-[#d4af37] text-base font-mono tracking-[0.4em] rounded-none transition-colors text-center"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <span>Session Duration</span>
              <span className="text-neutral-300 font-bold">24-Hour Active Login</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSecurityPin("");
                  setErrorMsg("");
                }}
                className="w-1/3 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-xs transition-colors rounded-none cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 py-3.5 bg-[#d4af37] hover:bg-[#c5a030] text-neutral-950 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none disabled:opacity-50"
              >
                <span>{isLoading ? "Authorizing..." : "Unlock Vault"}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono">
          <span>TLS 1.3 256-Bit</span>
          <span>BHAI Security System</span>
        </div>

      </div>

    </div>
  );
}
