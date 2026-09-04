"use client";

import React, { useState, useTransition } from "react";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  Bell,
  AlertTriangle
} from "lucide-react";
import { changePasswordAction } from "@/lib/actions/account-actions";

export default function AccountSecurity() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Communication Preferences toggles
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [smsTracking, setSmsTracking] = useState(true);

  const hasMinLength = newPassword.length >= 10;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.set("currentPassword", currentPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmNewPassword", confirmNewPassword);

    startTransition(async () => {
      const res = await changePasswordAction(null, formData);
      if (res.success) {
        setMessage(res.message || "Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError(res.error || "Failed to update password.");
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PASSWORD UPDATE FORM */}
      <form onSubmit={handlePasswordSubmit} className="p-6 bg-white border border-neutral-200 shadow-xs space-y-5">
        
        <div>
          <h2
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-base font-bold uppercase tracking-[0.16em] text-neutral-950 flex items-center gap-2 pb-2 border-b border-neutral-200"
          >
            <KeyRound className="w-4 h-4 text-[#997b24]" />
            <span>Update Password</span>
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Ensure your account is protected with a unique, strong password.
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
          
          {/* Current Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-10 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-10 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.newPassword && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.newPassword}</p>
            )}

            {newPassword.length > 0 && (
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

          {/* Confirm New Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-50 text-xs text-neutral-950 pl-10 pr-10 py-3 border border-neutral-300 outline-none focus:border-black focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.confirmNewPassword && (
              <p className="text-[11px] text-red-600 mt-1">{fieldErrors.confirmNewPassword}</p>
            )}
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
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Change Password</span>
            )}
          </button>
        </div>

      </form>

      {/* 2. COMMUNICATION PREFERENCES */}
      <div className="p-6 bg-white border border-neutral-200 shadow-xs space-y-4">
        <h2
          style={{ fontFamily: "var(--font-cinzel), serif" }}
          className="text-base font-bold uppercase tracking-[0.16em] text-neutral-950 flex items-center gap-2 pb-2 border-b border-neutral-200"
        >
          <Bell className="w-4 h-4 text-[#997b24]" />
          <span>Communication Preferences</span>
        </h2>

        <div className="divide-y divide-neutral-100 text-xs text-neutral-700">
          
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-900">Order & Delivery Notifications</p>
              <p className="text-neutral-500 font-light">Essential email updates about your purchase and delivery status.</p>
            </div>
            <input
              type="checkbox"
              checked={orderNotifications}
              onChange={(e) => setOrderNotifications(e.target.checked)}
              className="w-4 h-4 text-black border-neutral-300 rounded-none cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-900">SMS Tracking Alerts</p>
              <p className="text-neutral-500 font-light">Instant text notifications when your fine jewellery parcel is out for delivery.</p>
            </div>
            <input
              type="checkbox"
              checked={smsTracking}
              onChange={(e) => setSmsTracking(e.target.checked)}
              className="w-4 h-4 text-black border-neutral-300 rounded-none cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-900">VIP Private Atelier Previews</p>
              <p className="text-neutral-500 font-light">Exclusive invitation-only access to new collection launches and limited editions.</p>
            </div>
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="w-4 h-4 text-black border-neutral-300 rounded-none cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* 3. DANGER ZONE */}
      <div className="p-6 bg-white border border-red-200 shadow-xs space-y-3">
        <h2
          style={{ fontFamily: "var(--font-cinzel), serif" }}
          className="text-base font-bold uppercase tracking-[0.16em] text-red-900 flex items-center gap-2 pb-2 border-b border-red-100"
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Account Controls</span>
        </h2>

        <p className="text-xs text-neutral-600 font-light leading-relaxed">
          If you wish to deactivate or close your account and remove your personal data, please reach out to our client concierge team. Note that completed financial order records are retained as required by UK accounting law.
        </p>

        <button
          type="button"
          onClick={() => alert("To request account deactivation, please email concierge@bhaijewellery.com with your verified account address.")}
          className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Request Account Closure
        </button>
      </div>

    </div>
  );
}
