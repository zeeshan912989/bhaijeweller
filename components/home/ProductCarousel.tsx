"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductSkeleton from "@/components/ui/ProductSkeleton";

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  itemCount?: number;
}

export default function ProductCarousel({
  title = "Which T-Bar Are You?",
  subtitle,
  itemCount = 6,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-neutral-200/70">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* HEADER: TITLE, SUBTITLE & CAROUSEL CONTROLS */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            {subtitle && (
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-1">
                {subtitle}
              </p>
            )}
            <h2
              style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
              className="text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-900 tracking-[0.015em]"
            >
              {title}
            </h2>
          </div>

          {/* Minimalist Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous products"
              className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.75]" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Next products"
              className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition-all cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* HORIZONTAL SCROLLABLE SKELETON PLACEHOLDERS */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {Array.from({ length: itemCount }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
