"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tag, Sparkles, Gift, ArrowRight } from "lucide-react";

export default function OffersPage() {
  const OFFERS = [
    {
      title: "10% Off First Order",
      code: "WELCOME10",
      description: "Sign up to our complimentary VIP Newsletter and enjoy 10% off your entire first jewellery order.",
      actionLabel: "Shop Best Sellers",
      href: "/collections/earrings"
    },
    {
      title: "Save Up to 20% on Curated Sets",
      code: "AUTO-APPLIED",
      description: "Pair our bestselling chains with matching hoop earrings or chunky bangles with built-in bundle savings.",
      actionLabel: "Explore Jewellery Sets",
      href: "/collections/necklaces"
    },
    {
      title: "15% Student & Graduate Discount",
      code: "STUDENTBEANS / UNIDAYS",
      description: "Verify your student or apprentice status instantly to unlock a permanent 15% discount perk.",
      actionLabel: "Verify Student ID",
      href: "/student-discount"
    },
    {
      title: "15% Key Worker & NHS Discount",
      code: "BLUELIGHT / GOVCERT",
      description: "A special gesture of appreciation for healthcare, emergency services, teachers, and charity workers.",
      actionLabel: "Verify Key Worker",
      href: "/key-worker-discount"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Exclusive Promotions
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Discounts &amp; Offers
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Explore our active seasonal promotions, bundle savings, student perks, and key worker incentives.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {OFFERS.map((offer, idx) => (
              <div key={idx} className="p-6 sm:p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#997b24]/15 text-[#8a6800] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Code: {offer.code}
                    </span>
                    <Tag className="w-4 h-4 text-[#997b24]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950 leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={offer.href}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-950 hover:text-[#997b24] transition-colors"
                  >
                    <span>{offer.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
