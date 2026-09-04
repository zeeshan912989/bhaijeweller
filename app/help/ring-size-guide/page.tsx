"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, HelpCircle, Check } from "lucide-react";

const RING_SIZES = [
  { uk: "H", us: "4", eu: "47", insideDiamMm: "14.9", circumferenceMm: "46.8" },
  { uk: "I", us: "4.5", eu: "48", insideDiamMm: "15.3", circumferenceMm: "48.0" },
  { uk: "J", us: "5", eu: "49", insideDiamMm: "15.7", circumferenceMm: "49.3" },
  { uk: "K", us: "5.5", eu: "50", insideDiamMm: "16.1", circumferenceMm: "50.6" },
  { uk: "L", us: "6", eu: "51.5", insideDiamMm: "16.5", circumferenceMm: "51.9" },
  { uk: "M", us: "6.5", eu: "53", insideDiamMm: "16.9", circumferenceMm: "53.1" },
  { uk: "N", us: "7", eu: "54", insideDiamMm: "17.3", circumferenceMm: "54.4" },
  { uk: "O", us: "7.5", eu: "55.5", insideDiamMm: "17.7", circumferenceMm: "55.7" },
  { uk: "P", us: "8", eu: "56.5", insideDiamMm: "18.1", circumferenceMm: "57.0" },
  { uk: "Q", us: "8.5", eu: "58", insideDiamMm: "18.5", circumferenceMm: "58.3" },
  { uk: "R", us: "9", eu: "59", insideDiamMm: "18.9", circumferenceMm: "59.5" },
  { uk: "S", us: "9.5", eu: "60.5", insideDiamMm: "19.4", circumferenceMm: "60.8" },
];

export default function RingSizeGuidePage() {
  const [selectedUnit, setSelectedUnit] = useState<"uk" | "us" | "eu">("uk");

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Perfect Fit Guaranteed
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Ring Size Guide
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Find your precise ring size with our international conversion chart and easy at-home measurement techniques.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
          
          {/* Conversion Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-xl font-bold text-neutral-950"
              >
                International Sizing Chart
              </h2>
            </div>

            <div className="border border-neutral-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7F2] border-b border-neutral-200 text-neutral-900 uppercase tracking-wider text-[11px] font-extrabold">
                  <tr>
                    <th className="p-3 sm:p-4">UK / AUS</th>
                    <th className="p-3 sm:p-4">US / CAN</th>
                    <th className="p-3 sm:p-4">EU</th>
                    <th className="p-3 sm:p-4">Inside Diameter (mm)</th>
                    <th className="p-3 sm:p-4">Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-light text-neutral-700 font-mono">
                  {RING_SIZES.map((size) => (
                    <tr key={size.uk} className="hover:bg-neutral-50/70">
                      <td className="p-3 sm:p-4 font-bold text-neutral-950">{size.uk}</td>
                      <td className="p-3 sm:p-4">{size.us}</td>
                      <td className="p-3 sm:p-4">{size.eu}</td>
                      <td className="p-3 sm:p-4">{size.insideDiamMm} mm</td>
                      <td className="p-3 sm:p-4 text-[#997b24] font-semibold">{size.circumferenceMm} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sizing Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                Method 1: Measure An Existing Ring
              </h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Take a ring that fits your desired finger comfortably. Measure the inside diameter (in millimeters) straight across the center and match it to our chart above.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-950">
                Method 2: Measure Your Finger
              </h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Wrap a strip of paper or string snug around the base of your finger. Mark where the ends meet, measure the length in mm with a ruler, and find your circumference in the table.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
