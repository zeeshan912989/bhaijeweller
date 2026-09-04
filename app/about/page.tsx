"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Hero Section */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Our Heritage &amp; Vision
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950 leading-tight"
            >
              Artisanal Luxury Designed To Be Lived In
            </h1>
            <p className="text-xs sm:text-base text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
              Founded with the belief that fine jewellery should not be locked in a safe, Bhai creates sculptural, modern classics in certified 18ct Gold Vermeil and Recycled Sterling Silver.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 space-y-20">
          
          {/* Story Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/5] bg-[#FAF7F2] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80"
                alt="Bhai Fine Jewellery Atelier"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#997b24]">
                The Crafting Philosophy
              </span>
              <h2 
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-2xl sm:text-3xl font-bold text-neutral-950 leading-snug"
              >
                Modern Heirlooms For Everyday Elegance
              </h2>
              <p className="text-xs sm:text-[13.5px] text-neutral-600 font-light leading-relaxed">
                Every piece begins as a hand-carved wax model in our London studio, refined until it achieves effortless ergonomic balance and tactile weight.
              </p>
              <p className="text-xs sm:text-[13.5px] text-neutral-600 font-light leading-relaxed">
                By utilizing exclusively 100% recycled precious metals and thick 2.5-micron gold vermeil, we deliver pieces that feel decadent, wear comfortably from day to night, and last for generations.
              </p>
              <div className="pt-2">
                <Link
                  href="/craftsmanship"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-950 hover:text-[#997b24] transition-colors group"
                >
                  <span>Explore Our Craftsmanship</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl text-center space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#997b24] mx-auto" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">100% Recycled Metals</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Certified RJC recycled gold and sterling silver that drastically reduce environmental impact without sacrificing purity.
              </p>
            </div>

            <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl text-center space-y-3">
              <Award className="w-6 h-6 text-[#997b24] mx-auto" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">2-Year Guarantee</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Every creation comes with our comprehensive 2-year warranty covering manufacturing and finish integrity.
              </p>
            </div>

            <div className="p-8 bg-[#FAF7F2] border border-[#EAE4D9] rounded-2xl text-center space-y-3">
              <Heart className="w-6 h-6 text-[#997b24] mx-auto" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">Ethical Artisans</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Handcrafted by master goldsmiths working under fair, safe, and dignified conditions.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
