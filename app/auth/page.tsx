import React, { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { Sparkles, ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

export const metadata = {
  title: "Sign In / Join | BHAI Fine Jewellery",
  description: "Sign in or create your BHAI luxury fine jewellery account to manage orders, wishlist pieces, and addresses.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-neutral-900">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Luxury Brand Story & VIP Privileges (5 Columns) */}
            <div className="lg:col-span-6 space-y-6 text-left py-4">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#d4af37]/40 text-[#997b24] text-[10.5px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>Bhai Privileged Membership</span>
              </div>

              <h1
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-3xl sm:text-4xl font-bold uppercase tracking-[0.16em] text-neutral-950 leading-tight"
              >
                Timeless Fine Jewellery, Handcrafted in London.
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                Sign in to track your bespoke orders, save your curated wishlist, manage your delivery addresses, and enjoy complimentary UK concierge services.
              </p>

              {/* VIP Member Perks */}
              <div className="space-y-3.5 pt-4 border-t border-neutral-300/60">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-neutral-200 text-[#997b24] flex-shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Complimentary Next-Day Delivery
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-light">
                      Tracked & fully insured delivery on orders over £100 across the UK.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-neutral-200 text-[#997b24] flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Certified 18K Solid Gold & Ethical Diamonds
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-light">
                      Every piece arrives with an official certificate of authenticity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-neutral-200 text-[#997b24] flex-shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      30-Day Hassle-Free Returns
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-light">
                      Complimentary returns and exchanges on all ready-to-ship fine pieces.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Combined Auth Form (6 Columns) */}
            <div className="lg:col-span-6 flex justify-center">
              <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading secure authentication...</div>}>
                <AuthForm />
              </Suspense>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
