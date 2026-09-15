"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Gift,
  Sparkles
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoCode?: string;
}

export default function CheckoutModal({ isOpen, onClose, promoCode }: CheckoutModalProps) {
  const { items, totals, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "London",
    state: "Greater London",
    postalCode: "W1K 7AA",
    country: "United Kingdom",
    cardNumber: "•••• •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvc: "•••",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items.map((it) => ({
          productId: it.productId,
          name: it.product?.name || "Luxury Jewellery Piece",
          variantId: it.variantId || "Default",
          quantity: it.quantity,
        })),
        promoCode: promoCode || "",
        idempotencyKey: `chk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCompletedOrder(data.order);
        clearCart();
      } else {
        setErrorMessage(data.error || "Unable to complete order. Please verify your details.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network communication error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-none shadow-2xl border border-neutral-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-neutral-950 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#d4af37]" />
            <span 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-xs uppercase tracking-[0.25em] font-bold text-white"
            >
              BHAI • Encrypted Checkout
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmed View */}
        {completedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-widest">
                Payment Confirmed
              </span>
              <h2 
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-2xl font-bold uppercase tracking-wider text-neutral-900"
              >
                Thank you for your order
              </h2>
              <p className="text-sm text-neutral-600">
                Order confirmation and tracking details sent to{" "}
                <strong className="text-neutral-900">{completedOrder.customerEmail}</strong>
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-neutral-50 p-4 border border-neutral-200 text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Order Reference:</span>
                <span className="font-mono font-bold text-neutral-950">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Estimated Delivery:</span>
                <span className="font-medium text-emerald-800">
                  {completedOrder.estimatedDelivery} (Express Delivery)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold pt-1">
                <span className="text-neutral-900">Total Paid:</span>
                <span className="font-mono text-base text-[#d4af37]">
                  {formatPrice(completedOrder.total)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/products"
                onClick={onClose}
                className="flex-1 py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors block text-center cursor-pointer"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Contact */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b border-neutral-200">
                  1. Contact Details
                </h3>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7700 900077"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 focus:border-black outline-none"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b border-neutral-200">
                  2. Shipping Destination
                </h3>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="14 New Bond Street"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 focus:border-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-300 focus:border-black outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="United Kingdom (Next-Day Air)"
                    className="w-full text-xs p-2.5 bg-neutral-100 border border-neutral-300 text-neutral-600"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center justify-between">
                <span>3. Payment Information</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Secured
                </span>
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    disabled
                    value={formData.cardNumber}
                    className="w-full text-xs font-mono p-2.5 bg-neutral-100 border border-neutral-300 text-neutral-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    disabled
                    value={formData.cardExpiry}
                    className="w-full text-xs font-mono p-2.5 bg-neutral-100 border border-neutral-300 text-neutral-600 text-center"
                  />
                </div>
              </div>
            </div>

            {/* Order Total Overview */}
            <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Bag Items ({totals.itemCount} items)</span>
                <span className="font-mono">{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{totals.isFreeShipping ? "FREE" : formatPrice(totals.shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-950 text-sm pt-2 border-t border-neutral-200">
                <span>Authoritative Total</span>
                <span className="font-mono text-base text-[#d4af37]">{formatPrice(totals.total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || totals.itemCount === 0}
              className="w-full py-4 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.25em] transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing & Verifying Stock...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Complete Order • {formatPrice(totals.total)}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
