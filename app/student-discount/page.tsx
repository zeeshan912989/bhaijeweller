"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

export default function StudentDiscountPage() {
  const [verified, setVerified] = useState(false);

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Student &amp; Apprentice Perks
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              15% Student Discount
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Unlock a permanent 15% discount on all full-price Bhai fine jewellery pieces throughout your studies.
            </p>
          </div>
        </section>

        <div className="max-w-xl mx-auto px-4 sm:px-6 pt-12 text-center space-y-8">
          
          <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-6">
            <GraduationCap className="w-10 h-10 text-[#997b24] mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-neutral-950">Verify Your Student Status</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Connect your Student Beans, UNiDAYS, or university institutional email address to get your unique single-use promo code.
              </p>
            </div>

            {verified ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold text-xs uppercase tracking-wider text-emerald-950">Your 15% Code: <span className="font-mono text-sm">STUDENT-15-BHAI</span></p>
                <p className="text-[11px] text-emerald-700">Apply this code at checkout for 15% off full-price pieces.</p>
              </div>
            ) : (
              <button
                onClick={() => setVerified(true)}
                className="w-full py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer"
              >
                Instant Student Verification
              </button>
            )}
          </div>

          <div className="text-xs text-neutral-500 font-light leading-relaxed">
            * Valid on all full-priced jewellery items. Cannot be combined with active flash sale codes or archived items.
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
