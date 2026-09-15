import React, { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import AuthForm from "@/components/auth/AuthForm";
import { Sparkles, Truck, RotateCcw, Award, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Sign In / Join | BHAI Fine Jewellery",
  description: "Sign in or create your BHAI luxury fine jewellery account to manage orders, wishlist pieces, and addresses.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen lg:h-screen flex flex-col justify-between bg-[#FAF7F2] text-neutral-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 lg:pt-20 pb-4 lg:pb-2 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* LEFT COLUMN: Luxury Brand Story & VIP Privileges */}
            <div className="lg:col-span-6 space-y-4 text-left py-2">
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#d4af37]/50 text-[#997b24] text-[10px] font-bold uppercase tracking-widest shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>Bhai Privileged Membership</span>
              </div>

              <h1
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-2xl sm:text-3xl lg:text-[32px] font-bold uppercase tracking-[0.14em] text-neutral-950 leading-tight"
              >
                Timeless Fine Jewellery, Handcrafted in London.
              </h1>

              <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed">
                Sign in to track your bespoke orders, curate your private wishlist, and enjoy complimentary UK concierge styling.
              </p>

              {/* VIP Member Perks (Compact) */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-300/60">
                <div className="flex items-center gap-2.5 bg-white/60 p-2 border border-neutral-200/60">
                  <div className="p-1.5 bg-white border border-[#d4af37]/30 text-[#997b24] flex-shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-900">
                      Complimentary Next-Day Delivery
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-light">
                      Tracked & fully insured shipping across the UK.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/60 p-2 border border-neutral-200/60">
                  <div className="p-1.5 bg-white border border-[#d4af37]/30 text-[#997b24] flex-shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-900">
                      Certified 18K Gold & Ethical Diamonds
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-light">
                      Arrives with official certificate of authenticity.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/60 p-2 border border-neutral-200/60">
                  <div className="p-1.5 bg-white border border-[#d4af37]/30 text-[#997b24] flex-shrink-0">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-900">
                      30-Day Hassle-Free Returns
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-light">
                      Complimentary returns & exchanges on all ready pieces.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Combined Auth Form */}
            <div className="lg:col-span-6 flex justify-center">
              <Suspense fallback={<div className="p-8 text-center text-xs text-neutral-400">Loading secure authentication...</div>}>
                <AuthForm />
              </Suspense>
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
