"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, ShieldCheck, Sun, Droplets, HeartHandshake } from "lucide-react";

export default function MaterialsCarePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Enduring Radiance
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Materials &amp; Jewellery Care
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Learn about our 18ct Gold Vermeil, Recycled Sterling Silver, and how to preserve your pieces for generations.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-14">
          
          {/* Section 1: Materials */}
          <div className="space-y-6">
            <h2 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-xl sm:text-2xl font-bold text-neutral-950"
            >
              Our Precious Materials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base uppercase tracking-wider text-neutral-950">
                    18ct Gold Vermeil
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-[#E5C158]/20 text-[#8a6800] px-2 py-0.5 rounded-full">
                    2.5+ Microns
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed">
                  Unlike flash plating, Gold Vermeil consists of a thick 2.5-micron layer of solid 18K gold electroplated over certified 925 sterling silver. It offers identical luster, substantial weight, and lasting resilience.
                </p>
              </div>

              <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base uppercase tracking-wider text-neutral-950">
                    Recycled 925 Sterling Silver
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                    100% Ethical
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-neutral-600 font-light leading-relaxed">
                  Crafted using 92.5% pure recycled silver alloyed for maximum durability and strength. Finished with a rhodium protective seal to prevent oxidation and maintain a mirror-like shine.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Care Rules */}
          <div className="space-y-6">
            <h2 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-xl sm:text-2xl font-bold text-neutral-950"
            >
              4 Golden Rules of Jewellery Care
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 border border-neutral-200 rounded-xl space-y-2">
                <Sun className="w-5 h-5 text-[#997b24]" />
                <h4 className="font-bold text-sm text-neutral-950 uppercase tracking-wider">The &quot;Last On, First Off&quot; Rule</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Put your jewellery on last after applying lotions, cosmetics, hairspray, and perfume to avoid chemical tarnishing.
                </p>
              </div>

              <div className="p-5 border border-neutral-200 rounded-xl space-y-2">
                <Droplets className="w-5 h-5 text-[#997b24]" />
                <h4 className="font-bold text-sm text-neutral-950 uppercase tracking-wider">Avoid Water &amp; Chlorine</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Remove pieces prior to swimming in chlorinated pools, ocean salt water, hot tubs, or intense workouts.
                </p>
              </div>

              <div className="p-5 border border-neutral-200 rounded-xl space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#997b24]" />
                <h4 className="font-bold text-sm text-neutral-950 uppercase tracking-wider">Store in Pouch</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Store each piece separately in your Bhai anti-tarnish micro-suede pouch to prevent friction scratches and tangle.
                </p>
              </div>

              <div className="p-5 border border-neutral-200 rounded-xl space-y-2">
                <Sparkles className="w-5 h-5 text-[#997b24]" />
                <h4 className="font-bold text-sm text-neutral-950 uppercase tracking-wider">Gentle Polishing</h4>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Use only soft lint-free micro-suede cloths. Never use abrasive chemical silver dips on 18K gold vermeil.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
