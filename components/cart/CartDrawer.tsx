"use client";

import React, { useEffect } from "react";
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    items,
    totals,
    itemCount,
    updateQuantity,
    removeItem,
    error,
    clearError,
    addedNotification,
  } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Shipping progress percentage (towards £100 threshold)
  const shippingProgress = Math.min(100, Math.round((totals.subtotal / 100) * 100));

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Right Side Slider Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md sm:max-w-lg bg-white text-neutral-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-neutral-950"
            >
              Shopping Bag
            </h2>
            {itemCount > 0 && (
              <span className="bg-[#d4af37] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                {itemCount}
              </span>
            )}
          </div>

          <button
            onClick={closeCart}
            aria-label="Close Shopping Bag"
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FAF7F2] p-3.5 sm:p-4 border-b border-neutral-200 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-neutral-800 uppercase tracking-wider text-[11px]">
              <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
              {totals.isFreeShipping ? (
                <span className="text-emerald-700">You Qualify for Free UK Next-Day Delivery!</span>
              ) : (
                <span>
                  Add <strong className="text-neutral-950 font-mono">£{totals.amountNeededForFreeShipping.toFixed(2)}</strong> for Free UK Delivery
                </span>
              )}
            </span>
            <span className="text-[10.5px] font-mono text-neutral-500">{shippingProgress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] to-neutral-900 transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Added Notification Banner */}
        {addedNotification && (
          <div className="bg-neutral-950 text-white px-4 py-2.5 flex items-center justify-between text-xs animate-in slide-in-from-top duration-200 flex-shrink-0">
            <span className="flex items-center gap-1.5 font-medium text-[11px] text-[#d4af37]">
              <Check className="w-3.5 h-3.5" />
              <span>Added &ldquo;{addedNotification.name}&rdquo; to your bag</span>
            </span>
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
          </div>
        )}

        {/* Error Notification Alert */}
        {error && (
          <div className="bg-red-50 text-red-800 p-3 flex items-center justify-between text-xs border-b border-red-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-950 font-bold text-[10px] uppercase ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                onRemove={() => removeItem(item.id)}
                onItemClick={closeCart}
                isCompact={true}
              />
            ))
          )}
        </div>

        {/* Sticky Footer Summary (Only if cart has items) */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-neutral-200 flex-shrink-0 shadow-lg">
            <CartSummary
              totals={totals}
              isCompact={true}
              onClose={closeCart}
            />
          </div>
        )}
      </div>
    </>
  );
}
