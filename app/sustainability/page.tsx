"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Leaf, Recycle, Box, Award, ShieldCheck } from "lucide-react";

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Responsible Luxury
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Sustainability &amp; Ethics
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Our ongoing commitment to 100% recycled metals, certified supply chains, and FSC-certified plastic-free packaging.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <Recycle className="w-6 h-6 text-[#997b24]" />
              <h3 className="font-bold text-base uppercase tracking-wider text-neutral-950">100% Recycled Precious Metals</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                We use exclusively certified recycled silver and gold, cutting mining emissions by over 99% while delivering pristine metallurgical quality.
              </p>
            </div>

            <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <Box className="w-6 h-6 text-[#997b24]" />
              <h3 className="font-bold text-base uppercase tracking-wider text-neutral-950">FSC Certified Packaging</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Our signature gift boxes, mailer boxes, and cards are manufactured from FSC-certified sustainable forestry paper and are 100% recyclable.
              </p>
            </div>

            <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <Award className="w-6 h-6 text-[#997b24]" />
              <h3 className="font-bold text-base uppercase tracking-wider text-neutral-950">RJC Code of Practices</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Our workshop partners are audited and certified by the Responsible Jewellery Council, ensuring fair wages, safe workplaces, and zero child labor.
              </p>
            </div>

            <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-3">
              <Leaf className="w-6 h-6 text-[#997b24]" />
              <h3 className="font-bold text-base uppercase tracking-wider text-neutral-950">Carbon-Neutral Shipping</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                We offset 100% of carbon emissions generated through our global express delivery shipments through accredited reforestation initiatives.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
