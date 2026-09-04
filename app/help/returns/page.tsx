"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RotateCcw, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              30-Day Hassle-Free Policy
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Returns &amp; Exchanges
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              We want you to adore your Bhai jewellery. If your piece isn&apos;t completely perfect, you have 30 days from delivery to return or exchange it.
            </p>
          </div>
        </section>

        {/* 3 Step Return Process */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
          
          <div className="space-y-6">
            <h2 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-xl sm:text-2xl font-bold text-neutral-950 text-center"
            >
              How to Return in 3 Simple Steps
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-3">
                <span className="w-8 h-8 rounded-full bg-neutral-950 text-white text-xs font-bold font-mono flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                  Request Return Label
                </h3>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Email our concierge team at <strong className="text-neutral-900">concierge@bhaijeweller.com</strong> with your order number to receive your tracked return label.
                </p>
              </div>

              <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-3">
                <span className="w-8 h-8 rounded-full bg-neutral-950 text-white text-xs font-bold font-mono flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                  Package Your Piece
                </h3>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Place the unworn jewellery piece back inside its original protective micro-suede pouch and signature Bhai gift box.
                </p>
              </div>

              <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-3">
                <span className="w-8 h-8 rounded-full bg-neutral-950 text-white text-xs font-bold font-mono flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                  Fast Refund / Exchange
                </h3>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Once inspected at our London studio, your refund will be processed back to your original payment method within 3-5 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Guidelines */}
          <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
            <h3 className="font-bold text-neutral-950 uppercase tracking-wider text-xs">
              Important Conditions:
            </h3>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>Pieces must be unworn, undamaged, and returned with all original tags and packaging.</li>
              <li>For hygiene reasons, pierced earrings with broken tamper seals are non-returnable unless faulty.</li>
              <li>Bespoke engraved items cannot be returned as they are personalized.</li>
              <li>Faulty items are covered under our comprehensive <strong>2-Year Quality Guarantee</strong>.</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
