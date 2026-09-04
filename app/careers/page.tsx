"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const OPEN_ROLES = [
    { title: "Senior Jewellery CAD & Product Designer", location: "Mayfair Studio, London", type: "Full-Time" },
    { title: "Luxury Retail Boutique & Styling Manager", location: "Central London", type: "Full-Time" },
    { title: "Digital Merchandising & E-Commerce Specialist", location: "London / Hybrid", type: "Full-Time" },
    { title: "Customer Experience & VIP Concierge Advisor", location: "London Atelier", type: "Full-Time" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Join Our Atelier
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Careers at Bhai
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Shape the future of contemporary sustainable luxury with our dynamic team in London.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-10">
          
          <h2 
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-xl font-bold text-neutral-950"
          >
            Current Openings
          </h2>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {OPEN_ROLES.map((role, idx) => (
              <div key={idx} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-neutral-950 group-hover:text-[#997b24] transition-colors">
                    {role.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-light">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{role.location}</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono">{role.type}</span>
                  </div>
                </div>

                <a
                  href={`mailto:careers@bhaijeweller.com?subject=Application for ${encodeURIComponent(role.title)}`}
                  className="px-5 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors rounded-none w-fit"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl text-center space-y-2">
            <p className="text-xs text-neutral-600 font-light">
              Don&apos;t see an exact match for your skills? We always welcome spontaneous applications from exceptional talent at <strong className="text-neutral-900">careers@bhaijeweller.com</strong>.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
