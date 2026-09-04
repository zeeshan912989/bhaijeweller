"use client";

import React, { useState, useTransition } from "react";
import { User, Phone, Mail, CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/account-actions";

interface ProfileFormProps {
  initialProfile: {
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.set("fullName", fullName);
    formData.set("phone", phone);

    startTransition(async () => {
      const res = await updateProfileAction(null, formData);
      if (res.success) {
        setMessage(res.message || "Profile updated successfully.");
      } else {
        setError(res.error || "Failed to update profile.");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-neutral-200 shadow-xs space-y-6">
      
      <div>
        <h2
          style={{ fontFamily: "var(--font-cinzel), serif" }}
          className="text-base font-bold uppercase tracking-[0.16em] text-neutral-950 pb-2 border-b border-neutral-200"
        >
          Personal Details
        </h2>
        <p className="text-xs text-neutral-500 font-light mt-1">
          Manage your contact information for fine jewellery orders and client communications.
        </p>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-3 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
          {fieldErrors.fullName && (
            <p className="text-[11px] text-red-600 mt-1">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email Address (Read-Only) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              Email Address
            </label>
            <span className="text-[10px] uppercase font-mono text-neutral-400">
              Verified Account
            </span>
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              disabled
              value={initialProfile.email}
              className="w-full bg-neutral-100 text-xs text-neutral-500 pl-10 pr-3 py-3 border border-neutral-200 cursor-not-allowed select-none"
            />
          </div>
          <p className="text-[10.5px] text-neutral-400 mt-1 font-light">
            To change your primary email address, please contact our VIP client concierge.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            Phone Number <span className="text-neutral-400 font-normal">(Used for delivery SMS tracking)</span>
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

      </div>

      <div className="pt-2 border-t border-neutral-200">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
