"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ChevronDown, HelpCircle, Package, RefreshCcw, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "Orders & Delivery" | "Jewellery & Materials" | "Returns & Exchanges" | "Care & Warranty";
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "Orders & Delivery",
    question: "How long does delivery take?",
    answer: "Standard UK Tracked delivery takes 2-3 business days (complimentary on all orders over £100). Next-day express delivery is available for orders placed before 3pm Monday-Friday. International express delivery typically delivers within 3-5 business days."
  },
  {
    category: "Orders & Delivery",
    question: "How can I track my order?",
    answer: "As soon as your handcrafted piece is dispatched from our London studio, you will receive an email containing your tracking number and a live carrier tracking link. You can also view live tracking status anytime under your Account Dashboard."
  },
  {
    category: "Orders & Delivery",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 120 countries worldwide via DHL Express. All international shipments are fully tracked and insured against loss or transit damage."
  },
  {
    category: "Jewellery & Materials",
    question: "What is 18ct Gold Vermeil?",
    answer: "Gold vermeil is a premium precious metal crafted by coating solid 925 sterling silver with a minimum 2.5-micron thickness of genuine 18-karat gold. It provides the enduring luster, weight, and feel of solid gold at an accessible luxury price."
  },
  {
    category: "Jewellery & Materials",
    question: "Is Bhai jewellery waterproof and tarnish-resistant?",
    answer: "Our pieces are engineered with an advanced anti-tarnish protective coating over certified recycled metals. While resilient to daily handwashing, we recommend removing jewellery before swimming in chlorinated pools, saunas, or applying harsh perfumes."
  },
  {
    category: "Jewellery & Materials",
    question: "Are your metals ethically sourced?",
    answer: "100% of the precious metals used in Bhai pieces are certified recycled gold and sterling silver. Our workshops adhere strictly to the highest ethical and environmental standards set by the Responsible Jewellery Council (RJC)."
  },
  {
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer: "We offer a 30-day hassle-free return and exchange policy on all unworn items in their original packaging. For hygiene reasons, earrings with broken tamper-evident seals cannot be returned unless faulty."
  },
  {
    category: "Returns & Exchanges",
    question: "How do I initiate a return or exchange?",
    answer: "Visit our Returns portal or contact our concierge team at concierge@bhaijeweller.com with your order number. We will provide a pre-paid tracked return shipping label."
  },
  {
    category: "Care & Warranty",
    question: "Do you offer a warranty on jewellery?",
    answer: "Every Bhai piece comes with our complimentary 2-Year Comprehensive Quality Guarantee covering manufacturing defects, stone settings, and plating wear."
  },
  {
    category: "Care & Warranty",
    question: "How should I clean my jewellery?",
    answer: "Gently wipe your pieces with the micro-suede polishing cloth provided in your signature gift box. For deeper cleaning, soak in warm water with mild natural soap and dry thoroughly with a soft cloth."
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ["All", "Orders & Delivery", "Jewellery & Materials", "Returns & Exchanges", "Care & Warranty"];

  const filtered = FAQ_DATA.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Hero Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Customer Care &amp; Support
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Find instant answers to common questions about orders, shipping, sizing, precious metals, and our 2-Year Guarantee.
            </p>

            {/* Search Box */}
            <div className="pt-4 max-w-lg mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions (e.g. delivery, gold vermeil, returns)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-300 text-xs sm:text-[13px] outline-none focus:border-black shadow-xs font-medium rounded-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <div className="flex flex-wrap items-center justify-center gap-2 pb-6 border-b border-neutral-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none ${
                  activeCategory === cat
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-[#FAF7F2] text-neutral-700 hover:bg-neutral-200 border border-neutral-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion FAQ List */}
          <div className="pt-8 divide-y divide-neutral-200">
            {filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="py-4 sm:py-5">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#997b24] transition-colors pr-4">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-500 transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? "rotate-180 text-black" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-[13.5px] text-neutral-600 font-light leading-relaxed pr-6 animate-in fade-in duration-200">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-3">
                <p className="text-sm text-neutral-500 font-medium">No questions matched your search query.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  className="text-xs font-bold uppercase tracking-wider text-[#997b24] underline cursor-pointer"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>

          {/* Still Need Help Box */}
          <div className="mt-16 bg-[#FAF7F2] border border-[#EAE4D9] p-8 text-center space-y-4 rounded-2xl">
            <h3 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-xl font-bold text-neutral-950"
            >
              Still Have Questions?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-light max-w-md mx-auto">
              Our London styling and concierge team is available Monday through Friday to assist you with order inquiries, bespoke sizing, and gift advice.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
              >
                Contact Concierge
              </Link>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
