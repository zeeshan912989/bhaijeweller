"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Lock,
  Sparkles
} from "lucide-react";

export default function CartPage() {
  const { items, totals, itemCount, updateQuantity, removeItem, clearCart, isLoading } = useCart();

  const shippingProgress = Math.min(100, Math.round((totals.subtotal / 100) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Header */}
          <div className="py-6 border-b border-neutral-200">
            <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest mb-3">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <span className="text-neutral-900 font-bold">Shopping Bag</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.2em] text-neutral-950"
                >
                  Shopping Bag
                </h1>
                {itemCount > 0 && (
                  <span className="bg-[#d4af37] text-black text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                    {itemCount} {itemCount === 1 ? "Piece" : "Pieces"}
                  </span>
                )}
              </div>

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-600 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Bag</span>
                </button>
              )}
            </div>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="py-16">
              <EmptyCart />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
              
              {/* LEFT COLUMN: Items List (7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Free Delivery Bar */}
                <div className="bg-[#FAF7F2] p-4 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-neutral-800 uppercase tracking-wider text-[11px]">
                      <Truck className="w-4 h-4 text-[#d4af37]" />
                      {totals.isFreeShipping ? (
                        <span className="text-emerald-700">Congratulations! You Qualify for Free UK Next-Day Delivery!</span>
                      ) : (
                        <span>
                          Add <strong className="text-neutral-950 font-mono">£{totals.amountNeededForFreeShipping.toFixed(2)}</strong> for Free UK Delivery
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">{shippingProgress}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af37] to-neutral-900 transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* List of Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>

                {/* Continue Shopping Button */}
                <div className="pt-4">
                  <Link
                    href="/collections/earrings"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-700 hover:text-black transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>

                {/* USPs Trust Strip */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-200 text-center">
                  <div className="p-3.5 bg-[#FAF7F2]/60 border border-neutral-200 space-y-1">
                    <ShieldCheck className="w-4 h-4 text-[#997b24] mx-auto" />
                    <p className="text-[10.5px] font-bold uppercase tracking-wider">Authentic 18K Gold</p>
                    <p className="text-[9.5px] text-neutral-500 font-light">Hallmarked & Certified</p>
                  </div>
                  <div className="p-3.5 bg-[#FAF7F2]/60 border border-neutral-200 space-y-1">
                    <Truck className="w-4 h-4 text-[#997b24] mx-auto" />
                    <p className="text-[10.5px] font-bold uppercase tracking-wider">Free Delivery</p>
                    <p className="text-[9.5px] text-neutral-500 font-light">On orders over £100</p>
                  </div>
                  <div className="p-3.5 bg-[#FAF7F2]/60 border border-neutral-200 space-y-1">
                    <RotateCcw className="w-4 h-4 text-[#997b24] mx-auto" />
                    <p className="text-[10.5px] font-bold uppercase tracking-wider">30-Day Returns</p>
                    <p className="text-[9.5px] text-neutral-500 font-light">Complimentary returns</p>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Sticky Order Summary (5 Columns) */}
              <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
                <div className="p-6 bg-[#FAF7F2] border border-neutral-200 shadow-xs space-y-4">
                  <h2
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                    className="text-base font-bold uppercase tracking-[0.2em] text-neutral-950 pb-3 border-b border-neutral-200 flex items-center justify-between"
                  >
                    <span>Order Summary</span>
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  </h2>

                  <CartSummary totals={totals} />
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
