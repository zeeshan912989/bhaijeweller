"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  Gift, 
  Truck,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { CartTotals } from "@/lib/cart/types";

interface CartSummaryProps {
  totals: CartTotals;
  onCheckout?: () => void;
  isCompact?: boolean;
  onClose?: () => void;
}

export default function CartSummary({
  totals,
  onCheckout,
  isCompact = false,
  onClose,
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingCheckout, setIsValidatingCheckout] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();

    if (!code) return;

    if (code === "WELCOME10" || code === "BHAI10" || code === "GOLD20") {
      setPromoApplied(true);
      setPromoError(null);
    } else {
      setPromoError("Invalid or expired promo code.");
      setPromoApplied(false);
    }
  };

  const handleCheckoutClick = async () => {
    setIsValidatingCheckout(true);
    try {
      // Validate cart state before checkout
      const res = await fetch("/api/cart/validate", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        if (onCheckout) {
          onCheckout();
        } else {
          // Fallback demo checkout redirect
          alert("Proceeding to secure 256-bit encrypted checkout with validated order total: £" + data.checkout.total.toFixed(2));
        }
      } else {
        alert(data.error || "Unable to proceed to checkout. Please check item stock.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsValidatingCheckout(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Promo Code Input */}
      {!isCompact && (
        <form onSubmit={handleApplyPromo} className="pt-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoError(null);
                }}
                className="w-full bg-neutral-50 text-xs font-bold uppercase tracking-wider pl-9 pr-3 py-2.5 border border-neutral-300 outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>

          {promoApplied && (
            <p className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1.5">
              <Check className="w-3.5 h-3.5" />
              Promo code {promoCode} applied! (10% discount on final step)
            </p>
          )}

          {promoError && (
            <p className="flex items-center gap-1 text-[11px] text-red-600 font-medium mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {promoError}
            </p>
          )}
        </form>
      )}

      {/* Cost Breakdown */}
      <div className="space-y-2 text-xs border-t border-neutral-200 pt-3 text-neutral-700">
        <div className="flex justify-between items-center">
          <span className="text-neutral-600">Subtotal ({totals.itemCount} items)</span>
          <span className="font-mono font-bold text-neutral-950">
            £{totals.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-neutral-600">
            <Truck className="w-3 h-3 text-[#d4af37]" />
            UK Next-Day Delivery
          </span>
          <span className="font-mono font-bold">
            {totals.isFreeShipping ? (
              <span className="text-emerald-700 uppercase tracking-wider text-[11px]">
                FREE
              </span>
            ) : (
              `£${totals.shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center text-neutral-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Gift className="w-3 h-3 text-[#d4af37]" />
            Luxury Gift Packaging
          </span>
          <span className="text-emerald-700 font-bold uppercase tracking-wider">
            COMPLIMENTARY
          </span>
        </div>

        {/* Final Total */}
        <div className="flex justify-between items-baseline pt-3 border-t border-neutral-300 text-sm">
          <span className="font-bold uppercase tracking-widest text-neutral-950">
            Estimated Total
          </span>
          <div className="text-right">
            <span className="font-mono font-extrabold text-base text-neutral-950">
              £{totals.total.toFixed(2)}
            </span>
            <p className="text-[10px] text-neutral-400 font-light">
              Includes 20% UK VAT
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleCheckoutClick}
          disabled={isValidatingCheckout || totals.itemCount === 0}
          className="w-full py-4 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.22em] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
        >
          {isValidatingCheckout ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Securing Session...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Checkout • £{totals.total.toFixed(2)}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {isCompact && (
          <Link
            href="/cart"
            onClick={onClose}
            className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors block text-center border border-neutral-300 cursor-pointer"
          >
            View Full Shopping Bag
          </Link>
        )}

        {/* Express Shop Pay Button */}
        <button
          type="button"
          onClick={handleCheckoutClick}
          disabled={isValidatingCheckout || totals.itemCount === 0}
          className="w-full py-3 bg-[#5A31F4] hover:bg-[#4824d6] text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Buy with Shop Pay</span>
        </button>
      </div>

      {/* Security Assurance Badge */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-medium pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>256-Bit Encrypted Secure Checkout • 30-Day Returns</span>
      </div>
    </div>
  );
}
