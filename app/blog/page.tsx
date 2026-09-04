"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles } from "lucide-react";

const ARTICLES = [
  {
    title: "How to Layer Mixed Metals Like A Parisian Stylist",
    date: "September 2026",
    category: "Styling Guide",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    excerpt: "Break the outdated single-tone rule. Discover how pairing chunky 18ct Gold Vermeil with crisp Recycled Sterling Silver creates dimension.",
    readTime: "4 min read"
  },
  {
    title: "The Anatomy of Gold Vermeil: What Makes It Endure?",
    date: "August 2026",
    category: "Materials & Care",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    excerpt: "Understand the critical differences between cheap flash plating and authentic 2.5-micron gold vermeil over solid sterling silver.",
    readTime: "5 min read"
  },
  {
    title: "The Ultimate Ear Stack: Huggies, Cuffs & Midi Hoops",
    date: "July 2026",
    category: "Lookbook",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    excerpt: "Create a balanced curated ear without extra piercings using our anatomical clip-on cuffs and graduated huggie sets.",
    readTime: "3 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              The Journal
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Editorial &amp; Styling Stories
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Curated styling advice, craftsmanship deep-dives, and seasonal lookbooks from our London studio.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((art, idx) => (
              <div key={idx} className="group space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden mb-3 border border-neutral-200">
                    <Image src={art.image} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-white/95 text-[10px] font-extrabold uppercase tracking-wider text-[#997b24] px-2.5 py-1 rounded-full">
                      {art.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mb-1">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-bold text-base text-neutral-950 group-hover:text-[#997b24] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-light mt-1 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover:text-[#997b24] transition-colors">
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
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
