"use client";

import React from "react";

export default function TrustBadges() {
  return (
    <section className="w-full bg-[#42210B] text-white py-7 sm:py-8 border-y border-[#52290D]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-center text-center">
          
          {/* 1. 2 YEAR WARRANTY */}
          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="mb-2.5 transition-transform duration-300 group-hover:scale-110">
              {/* Rosette Ribbon Badge with Checkmark SVG */}
              <svg className="w-7 h-7 stroke-white fill-none stroke-[1.4]" viewBox="0 0 24 24">
                <circle cx="12" cy="10" r="6" />
                <path d="m9.5 10 1.5 1.5 3.5-3.5" />
                <path d="M8.5 15.5 7 21l5-2.5 5 2.5-1.5-5.5" />
              </svg>
            </div>
            <span
              style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
              className="text-base sm:text-[18px] font-normal text-white/95 tracking-[0.02em] group-hover:text-[#F7E8B5] transition-colors"
            >
              2 Year Warranty
            </span>
          </div>

          {/* 2. FREE DELIVERY +£100 */}
          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="mb-2.5 transition-transform duration-300 group-hover:scale-110">
              {/* Delivery Truck with Speed Lines SVG */}
              <svg className="w-7 h-7 stroke-white fill-none stroke-[1.4]" viewBox="0 0 24 24">
                <path d="M2 7h4M1 10h4M2 13h3" />
                <path d="M7 6h8a1 1 0 0 1 1 1v8H7V6z" />
                <path d="M16 9h3.5a1 1 0 0 1 .8.4l2.2 3A1 1 0 0 1 23 13v2a1 1 0 0 1-1 1h-6V9z" />
                <circle cx="9.5" cy="17.5" r="2.5" />
                <circle cx="18.5" cy="17.5" r="2.5" />
              </svg>
            </div>
            <span
              style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
              className="text-base sm:text-[18px] font-normal text-white/95 tracking-[0.02em] group-hover:text-[#F7E8B5] transition-colors"
            >
              Free Delivery +£100
            </span>
          </div>

          {/* 3. 60-DAY RETURNS */}
          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="mb-2.5 transition-transform duration-300 group-hover:scale-110">
              {/* Box Package with Return Arrow SVG */}
              <svg className="w-7 h-7 stroke-white fill-none stroke-[1.4]" viewBox="0 0 24 24">
                <path d="M4 8.5 12 4l8 4.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5z" />
                <path d="m4 8.5 8 4.5 8-4.5" />
                <path d="M12 13v6" />
                <path d="M8 15.5 5 18.5l3 3" />
                <path d="M5 18.5h6a3 3 0 0 0 3-3v-1" />
              </svg>
            </div>
            <span
              style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
              className="text-base sm:text-[18px] font-normal text-white/95 tracking-[0.02em] group-hover:text-[#F7E8B5] transition-colors"
            >
              60-Day Returns
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
