"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, CheckCircle2, ShieldCheck, Gem } from "lucide-react";

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Heritage Techniques
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Master Craftsmanship
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              From hand-carved wax molds to micron-thick gold vermeil electroplating, discover the obsessive attention to detail behind every Bhai creation.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-neutral-950 text-white text-xs font-bold font-mono flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                Sculptural Wax Modeling
              </h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Every bespoke silhouette is sculpted in green jeweller&apos;s wax by hand in London, ensuring natural curves, tactile thickness, and weight balance.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-neutral-950 text-white text-xs font-bold font-mono flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                Lost Wax Casting
              </h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Molten certified recycled 925 sterling silver is vacuum-cast into investment molds, creating solid, seamless metal foundations.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <span className="w-8 h-8 rounded-full bg-neutral-950 text-white text-xs font-bold font-mono flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                18ct Vermeil Plating
              </h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Hand-polished through 4 grades of diamond paste, then electroplated with 2.5+ microns of pure 18K yellow or rose gold for enduring luster.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
