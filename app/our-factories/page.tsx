"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Hammer, Users, ShieldCheck, Award } from "lucide-react";

export default function OurFactoriesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Artisanal Transparency
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Our Ethical Workshops
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              We partner exclusively with multi-generational master goldsmiths and RJC-certified family workshops across Europe and Asia.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-10 text-xs sm:text-[13.5px] text-neutral-700 font-light leading-relaxed">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <Hammer className="w-5 h-5 text-[#997b24]" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                Arezzo &amp; Vicenza, Italy
              </h3>
              <p>
                Renowned for centuries as the world capital of chainmaking. Our Italian atelier manufactures our heavy T-Bar chains, snake chains, and fluid herringbone necklaces using heritage drawing benches.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <Users className="w-5 h-5 text-[#997b24]" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                Jaipur &amp; Bangkok Master Ateliers
              </h3>
              <p>
                Specializing in hand-cast lost wax molding, micro-pavé stone setting, and rigorous multi-stage ultrasonic cleaning and vermeil electroplating.
              </p>
            </div>
          </div>

          <div className="p-6 border border-neutral-200 rounded-xl space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-950">
              100% Traceability &amp; Worker Welfare
            </h3>
            <p>
              Each partner workshop is subject to regular third-party social compliance audits verifying living wages, generous healthcare benefits, and safe, well-ventilated artisanal studios.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
