"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Inclusive Luxury For All
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Accessibility Statement
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Bhai Fine Jewellery is committed to ensuring digital accessibility for people of all abilities.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 space-y-8 text-xs sm:text-[13.5px] text-neutral-700 font-light leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              1. Our Digital Commitment
            </h2>
            <p>
              We continually improve the user experience for everyone, applying relevant accessibility standards (WCAG 2.1 Level AA) across our website, mobile interface, and digital checkout flows.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              2. Key Accessibility Features
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>High-contrast visual hierarchy and legible typography scalable across devices.</li>
              <li>ARIA labels and keyboard navigability across modals, product carousels, and buy boxes.</li>
              <li>Descriptive alt text for all luxury product imagery and editorial lookbooks.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
              3. Feedback &amp; Assistance
            </h2>
            <p>
              If you experience any difficulty accessing content or navigating any part of our site, please contact us at <strong className="text-neutral-900">accessibility@bhaijeweller.com</strong> and our team will gladly assist you.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
