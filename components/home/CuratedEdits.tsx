"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ServiceTile {
  title: string;
  linkText: string;
  href: string;
  imageSrc: string;
  alt: string;
}

const SERVICES_TILES: ServiceTile[] = [
  {
    title: "Our Stores",
    linkText: "Plan Your Visit",
    href: "/stores",
    imageSrc: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=800&auto=format&fit=crop",
    alt: "Luxury jewellery boutique store interior",
  },
  {
    title: "Permanent Bracelets",
    linkText: "Book an Appointment",
    href: "/services/welding",
    imageSrc: "/braclet3.jpeg",
    alt: "Custom welded permanent bracelet on wrist",
  },
  {
    title: "Piercing Studio",
    linkText: "Book an Appointment",
    href: "/services/piercing",
    imageSrc: "/ear ring.jpeg",
    alt: "Fine jewellery piercing studio styling",
  },
  {
    title: "Materials & Care",
    linkText: "Learn More",
    href: "/materials-and-care",
    imageSrc: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=800&auto=format&fit=crop",
    alt: "Handcrafted gemstone setting and craftsmanship",
  },
];

export default function CuratedEdits() {
  return (
    <section className="w-full bg-white py-10 sm:py-18 border-b border-neutral-200/70">
      <div className="w-full px-3.5 sm:px-8 lg:px-12 xl:px-14">
        
        {/* 4-COLUMN SQUARE GRID (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-7">
          {SERVICES_TILES.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group block text-left select-none"
            >
              {/* 1. SQUARE IMAGE BOX (1:1 Aspect Ratio) */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <Image
                  src={tile.imageSrc}
                  alt={tile.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* 2. TEXT BELOW IMAGE */}
              <div className="pt-3 sm:pt-4 text-left">
                {/* Title */}
                <h3
                  style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
                  className="text-lg sm:text-2xl lg:text-[26px] font-normal text-neutral-900 tracking-[0.01em] leading-tight group-hover:text-[#b8860b] transition-colors"
                >
                  {tile.title}
                </h3>

                {/* Underlined Link */}
                <div className="mt-1 sm:mt-2">
                  <span className="inline-block text-[11px] sm:text-[13px] font-semibold tracking-wider text-neutral-900 border-b border-neutral-900 group-hover:border-[#b8860b] group-hover:text-[#b8860b] transition-all duration-300 pb-0.5">
                    {tile.linkText}
                  </span>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
