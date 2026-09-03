"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
}

export default function HeroBanner({
  title = "The Gold Chain & Link Edition",
  subtitle = "Heavyweight curb links and delicate chains crafted for bold layering.",
  ctaText = "Shop Gold Chains",
  ctaHref = "/collections/necklaces",
  imageSrc = "/hero_section.jpg",
}: HeroBannerProps) {
  return (
    <section className="relative w-full h-[84vh] sm:h-[92vh] min-h-[520px] sm:min-h-[560px] max-h-[1080px] overflow-hidden bg-[#0a0a0a] flex items-end">
      {/* 1. BACKGROUND IMAGE (Optimized Focal Point for Mobile & Desktop) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%] sm:object-center scale-[1.01]"
        />
        {/* Subtle Gradient Overlay for Clean Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 sm:from-black/60 sm:via-transparent sm:to-black/35 pointer-events-none" />
      </div>

      {/* 2. BOTTOM-LEFT EDITORIAL CONTENT (Compact, Clean & Elegant) */}
      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-12 xl:px-14 pb-7 sm:pb-10 lg:pb-12 max-w-2xl text-left">
        
        {/* Refined Title (Cormorant Garamond, delicate size) */}
        <h1
          style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
          className="text-[26px] sm:text-3xl md:text-4xl lg:text-[42px] font-medium text-white tracking-[0.02em] leading-[1.18] drop-shadow-md"
        >
          {title}
        </h1>

        {/* Short & Clean Subtitle (1 line) */}
        <p className="mt-2 text-xs sm:text-sm text-neutral-100 font-light tracking-wide leading-relaxed drop-shadow max-w-lg">
          {subtitle}
        </p>

        {/* Minimalist Underlined Link */}
        <div className="mt-4 sm:mt-5">
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-wider text-white hover:text-[#f7e8b5] transition-all duration-300 pb-0.5 border-b border-white hover:border-[#d4af37]"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#d4af37]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
