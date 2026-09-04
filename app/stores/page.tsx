"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Clock, Sparkles, Calendar } from "lucide-react";

export default function StoresPage() {
  const STORES = [
    {
      city: "London Flagship Atelier",
      address: "Mayfair, London W1K, United Kingdom",
      hours: "Mon – Sat: 10:00am – 7:00pm | Sun: 11:00am – 5:00pm",
      phone: "+44 (0) 20 7946 0912",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      services: ["Ear Piercing Studio", "Complimentary Ring Sizing", "Bespoke Layering Appointments", "Same-Day Collection"]
    },
    {
      city: "Covent Garden Boutique",
      address: "Floral Street, Covent Garden, London WC2E",
      hours: "Mon – Sat: 10:00am – 8:00pm | Sun: 12:00pm – 6:00pm",
      phone: "+44 (0) 20 7946 0918",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      services: ["Permanent Welded Bracelets", "Laser Engraving Studio", "Gift Wrapping Bar"]
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
              Visit Our Ateliers
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Stores &amp; Styling Services
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Experience the weight and shine of our pieces in person, enjoy bespoke styling consultations, and custom engraving.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STORES.map((store, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] bg-neutral-100">
                    <Image src={store.image} alt={store.city} fill className="object-cover" />
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      className="text-xl font-bold text-neutral-950"
                    >
                      {store.city}
                    </h3>
                    <div className="space-y-2 text-xs text-neutral-600 font-light">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#997b24] flex-shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-[#997b24] flex-shrink-0 mt-0.5" />
                        <span>{store.hours}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Boutique Services Available:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {store.services.map((srv) => (
                          <span key={srv} className="text-[10.5px] bg-[#FAF7F2] border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full font-medium">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/contact"
                    className="w-full py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest text-center block transition-colors rounded-none"
                  >
                    Book A Styling Appointment
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
