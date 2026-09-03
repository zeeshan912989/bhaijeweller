"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FeatureTile {
  title: string;
  linkText: string;
  href: string;
  imageSrc: string;
  alt: string;
}

const FEATURE_TILES: FeatureTile[] = [
  {
    title: "Meet Your Match",
    linkText: "Shop Tennis Jewellery",
    href: "/collections/tennis",
    imageSrc: "/braclet2.jpeg",
    alt: "Luxury tennis bracelet and gold chain stack",
  },
  {
    title: "Under £100",
    linkText: "Shop The Edit",
    href: "/collections/under-100",
    imageSrc: "/ring2.jpeg",
    alt: "Pavé gold huggie hoop earrings under 100 pounds",
  },
  {
    title: "Water-Resistant",
    linkText: "Make a Splash",
    href: "/collections/water-resistant",
    imageSrc: "/red.jpeg",
    alt: "Water resistant 18k gold chain jewellery",
  },
];

export default function EditorialFeatureBanners() {
  return (
    <section className="w-full bg-white py-1">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-1.5 px-1 sm:px-1.5">
        {FEATURE_TILES.map((tile, idx) => (
          <Link
            key={tile.title}
            href={tile.href}
            className={`group relative w-full overflow-hidden bg-neutral-900 flex items-end block ${
              idx === 2
                ? "col-span-2 md:col-span-1 h-[230px] sm:h-[360px] md:h-[480px] lg:h-[560px]"
                : "col-span-1 h-[230px] sm:h-[360px] md:h-[480px] lg:h-[560px]"
            }`}
          >
            {/* 1. BACKGROUND EDITORIAL IMAGE */}
            <Image
              src={tile.imageSrc}
              alt={tile.alt}
              fill
              sizes={idx === 2 ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 33vw"}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle Gradient Shadow at Bottom for Optimal Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/90" />

            {/* 2. BOTTOM-LEFT EDITORIAL CONTENT */}
            <div className="relative z-10 p-3.5 sm:p-6 lg:p-8 text-left w-full">
              {/* Feature Title */}
              <h3
                style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
                className="text-lg sm:text-2xl lg:text-[28px] font-normal text-white tracking-[0.015em] leading-tight drop-shadow-md"
              >
                {tile.title}
              </h3>

              {/* Underlined Feature CTA Link */}
              <div className="mt-1 sm:mt-2.5">
                <span className="inline-block text-[11px] sm:text-[13px] font-semibold tracking-wider text-white border-b border-white group-hover:border-[#d4af37] group-hover:text-[#f7e8b5] transition-all duration-300 pb-0.5">
                  {tile.linkText}
                </span>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </section>
  );
}
