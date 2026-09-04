"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles } from "lucide-react";

export default function SizeGuidesPage() {
  const [activeTab, setActiveTab] = useState<"necklaces" | "bracelets" | "earrings">("necklaces");

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 sm:pt-36 lg:pt-44 pb-24">
        
        {/* Header */}
        <section className="bg-[#FAF7F2] border-b border-[#EAE4D9] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#997b24]">
              Styling &amp; Proportions
            </span>
            <h1 
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-3xl sm:text-5xl font-bold tracking-wider text-neutral-950"
            >
              Complete Size Guides
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-light leading-relaxed">
              Explore layering lengths, bracelet wrist fits, and earring hoop proportions for flawless styling.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
          
          {/* Tabs */}
          <div className="flex border-b border-neutral-200 justify-center gap-6 sm:gap-10">
            <button
              onClick={() => setActiveTab("necklaces")}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 -mb-[2px] ${
                activeTab === "necklaces" ? "border-neutral-950 text-neutral-950 font-extrabold" : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Necklace Lengths
            </button>
            <button
              onClick={() => setActiveTab("bracelets")}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 -mb-[2px] ${
                activeTab === "bracelets" ? "border-neutral-950 text-neutral-950 font-extrabold" : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Bracelet Sizing
            </button>
            <button
              onClick={() => setActiveTab("earrings")}
              className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 -mb-[2px] ${
                activeTab === "earrings" ? "border-neutral-950 text-neutral-950 font-extrabold" : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Hoop &amp; Huggie Diameters
            </button>
          </div>

          {/* Tab 1: Necklaces */}
          {activeTab === "necklaces" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
                  <h3 className="font-bold text-sm text-neutral-950 font-mono">35cm - 40cm (14&quot; - 16&quot;) • Choker / Collar</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Sits snugly around the base of the throat. Ideal for delicate snake chains, tennis chokers, and base layering pieces.
                  </p>
                </div>
                <div className="p-5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
                  <h3 className="font-bold text-sm text-neutral-950 font-mono">45cm (18&quot;) • Princess Length (Most Popular)</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Rests gracefully on the collarbone. Perfect for T-Bar pendants, coin medallions, and everyday statement chains.
                  </p>
                </div>
                <div className="p-5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
                  <h3 className="font-bold text-sm text-neutral-950 font-mono">50cm (20&quot;) • Matinee Length</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Falls a few inches below the collarbone. Great for plunge necklines, chunky curb chains, and layering anchors.
                  </p>
                </div>
                <div className="p-5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
                  <h3 className="font-bold text-sm text-neutral-950 font-mono">60cm (24&quot;) • Opera Length</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Sits at or below the center of the bust. Ideal for heavy statement lockets, talismans, and winter knitwear layering.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Bracelets */}
          {activeTab === "bracelets" && (
            <div className="space-y-6">
              <div className="border border-neutral-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm font-mono">
                  <thead className="bg-[#FAF7F2] border-b border-neutral-200 text-neutral-900 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3.5 sm:p-4">Size</th>
                      <th className="p-3.5 sm:p-4">Wrist Circumference</th>
                      <th className="p-3.5 sm:p-4">Recommended Piece</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-neutral-700">
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3.5 sm:p-4 font-bold text-neutral-950">Small (S)</td>
                      <td className="p-3.5 sm:p-4">14.0cm - 15.5cm</td>
                      <td className="p-3.5 sm:p-4 font-sans text-xs">Petite chains &amp; snug cuffs</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3.5 sm:p-4 font-bold text-neutral-950">Medium (M) - Standard</td>
                      <td className="p-3.5 sm:p-4">16.0cm - 17.5cm</td>
                      <td className="p-3.5 sm:p-4 font-sans text-xs">Fits 80% of collectors</td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="p-3.5 sm:p-4 font-bold text-neutral-950">Large (L)</td>
                      <td className="p-3.5 sm:p-4">18.0cm - 19.5cm</td>
                      <td className="p-3.5 sm:p-4 font-sans text-xs">Chunky link bangles &amp; relaxed drape</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Earrings */}
          {activeTab === "earrings" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
                <h3 className="font-bold text-sm font-mono text-neutral-950">10mm - 12mm • Huggies</h3>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Hugs the earlobe closely. Ideal for second/third lobe piercings and sleeping in comfortably.
                </p>
              </div>
              <div className="p-5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
                <h3 className="font-bold text-sm font-mono text-neutral-950">18mm - 25mm • Midi Hoops</h3>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Our everyday signature size. Noticeable weight and high shine without pulling on the lobe.
                </p>
              </div>
              <div className="p-5 bg-[#FAF7F2] border border-[#EAE4D9] rounded-xl space-y-2">
                <h3 className="font-bold text-sm font-mono text-neutral-950">35mm+ • Statement Hoops</h3>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  Bold, sculptural, and glamorous for evening wear and standout editorial styling.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
