"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Truck, ShieldCheck, Clock, Globe, ArrowRight, Gift } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Worldwide Express Delivery
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Shipping &amp; Delivery
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Every Bhai piece is meticulously packaged in our signature luxury presentation box and shipped fully tracked and insured.
            </p>
          </div>
        </section>

        {/* Content Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
          
          {/* Shipping Rates Table */}
          <div className="space-y-4">
            <h2 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-xl font-bold text-neutral-950"
            >
              Delivery Rates &amp; Timelines
            </h2>

            <div className="border border-neutral-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7F2] border-b border-neutral-200 text-neutral-900 uppercase tracking-wider text-[11px] font-extrabold">
                  <tr>
                    <th className="p-3.5 sm:p-4">Destination</th>
                    <th className="p-3.5 sm:p-4">Service</th>
                    <th className="p-3.5 sm:p-4">Delivery Time</th>
                    <th className="p-3.5 sm:p-4">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-light text-neutral-700">
                  <tr className="hover:bg-neutral-50/60">
                    <td className="p-3.5 sm:p-4 font-semibold text-neutral-950">UK Mainland</td>
                    <td className="p-3.5 sm:p-4">Royal Mail Tracked 48</td>
                    <td className="p-3.5 sm:p-4">2-3 business days</td>
                    <td className="p-3.5 sm:p-4 font-bold text-[#997b24]">Free over £100 (or £3.95)</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/60">
                    <td className="p-3.5 sm:p-4 font-semibold text-neutral-950">UK Express</td>
                    <td className="p-3.5 sm:p-4">DPD Next-Day Priority</td>
                    <td className="p-3.5 sm:p-4">Next business day (order before 3pm)</td>
                    <td className="p-3.5 sm:p-4 font-bold">£6.95</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/60">
                    <td className="p-3.5 sm:p-4 font-semibold text-neutral-950">Europe (EU)</td>
                    <td className="p-3.5 sm:p-4">DHL Express International</td>
                    <td className="p-3.5 sm:p-4">2-4 business days</td>
                    <td className="p-3.5 sm:p-4 font-bold">Free over €150 (or €9.95)</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/60">
                    <td className="p-3.5 sm:p-4 font-semibold text-neutral-950">USA &amp; Canada</td>
                    <td className="p-3.5 sm:p-4">DHL Express Worldwide</td>
                    <td className="p-3.5 sm:p-4">3-5 business days</td>
                    <td className="p-3.5 sm:p-4 font-bold">Free over $150 (or $12.00)</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/60">
                    <td className="p-3.5 sm:p-4 font-semibold text-neutral-950">Rest of World</td>
                    <td className="p-3.5 sm:p-4">DHL Express Global</td>
                    <td className="p-3.5 sm:p-4">4-7 business days</td>
                    <td className="p-3.5 sm:p-4 font-bold">£15.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2 text-center">
              <Gift className="w-6 h-6 text-[#997b24] mx-auto" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">Signature Gifting</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Every piece arrives encased in a protective anti-tarnish micro-suede pouch and embossed gift box.
              </p>
            </div>
            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2 text-center">
              <ShieldCheck className="w-6 h-6 text-[#997b24] mx-auto" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">100% Insured</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                All dispatches are fully insured against loss, theft, or transit damage with end-to-end tracking.
              </p>
            </div>
            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2 text-center">
              <Globe className="w-6 h-6 text-[#997b24] mx-auto" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">Duties Paid (DDP)</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                No surprise customs fees. All UK, US, and EU taxes and import duties are calculated and handled at checkout.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
