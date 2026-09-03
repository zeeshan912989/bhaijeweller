"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryTile {
  title: string;
  linkText: string;
  href: string;
  imageSrc: string;
  alt: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    title: "Layer Up",
    linkText: "Shop Necklaces",
    href: "/collections/necklaces",
    imageSrc: "/necklace.jpeg",
    alt: "Luxury gold necklace layered look",
  },
  {
    title: "Play it By Ear",
    linkText: "Shop Earrings",
    href: "/collections/earrings",
    imageSrc: "/ear.jpeg",
    alt: "Gold and silver fan hoop earrings",
  },
  {
    title: "Ready, Set, Stack",
    linkText: "Shop Bracelets",
    href: "/collections/bracelets",
    imageSrc: "/braclet.jpeg",
    alt: "Gold bangle and chain bracelet stack",
  },
  {
    title: "Ring It In",
    linkText: "Shop Rings",
    href: "/collections/rings",
    imageSrc: "/ring.jpeg",
    alt: "Organic handcrafted gold and silver rings",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="w-full bg-white py-1">
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-1.5 px-1 sm:px-1.5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="group relative h-[260px] sm:h-[380px] md:h-[460px] lg:h-[540px] w-full overflow-hidden bg-neutral-900 flex items-end block"
          >
            {/* 1. BACKGROUND CATEGORY IMAGE */}
            <Image
              src={cat.imageSrc}
              alt={cat.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle Gradient Shadow at Bottom for Optimal Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/90" />

            {/* 2. BOTTOM-LEFT EDITORIAL CONTENT */}
            <div className="relative z-10 p-3.5 sm:p-5 lg:p-7 text-left w-full">
              {/* Category Title */}
              <h3
                style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
                className="text-lg sm:text-2xl lg:text-[26px] font-normal text-white tracking-[0.015em] leading-tight drop-shadow-md"
              >
                {cat.title}
              </h3>

              {/* Underlined Category CTA Link */}
              <div className="mt-1 sm:mt-2">
                <span className="inline-block text-[11px] sm:text-[13px] font-semibold tracking-wider text-white border-b border-white group-hover:border-[#d4af37] group-hover:text-[#f7e8b5] transition-all duration-300 pb-0.5">
                  {cat.linkText}
                </span>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </section>
  );
}
