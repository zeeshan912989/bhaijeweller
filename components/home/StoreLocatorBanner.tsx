"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface StoreLocatorBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
}

export default function StoreLocatorBanner({
  title = "Find your jewellery in-store",
  description = "If you would prefer to see our beautiful jewellery in person, visit us at your local store. Our friendly experts are always on hand to help you find the perfect jewellery for yourself or someone special.",
  ctaText = "BOOK AN APPOINTMENT",
  ctaHref = "/stores",
  imageSrc = "/shop_img.jpeg",
}: StoreLocatorBannerProps) {
  return (
    <section className="w-full bg-white py-8 sm:py-14 px-4 sm:px-8 lg:px-12 xl:px-16 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-xl bg-white border border-neutral-200/60 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          
          {/* LEFT: STORE SHOWCASE IMAGE */}
          <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[460px] overflow-hidden bg-neutral-100 group">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* RIGHT: EDITORIAL CONTENT */}
          <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-14 xl:px-18 py-10 sm:py-12 lg:py-0">
            <h2
              style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
              className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-neutral-900 tracking-tight leading-[1.15] mb-5"
            >
              {title}
            </h2>

            <p className="text-sm sm:text-base text-neutral-700 font-light leading-relaxed max-w-lg mb-8">
              {description}
            </p>

            <div>
              <Link
                href={ctaHref}
                className="group/btn inline-flex items-center gap-3 text-xs sm:text-[13px] font-semibold tracking-[0.18em] uppercase text-neutral-900 hover:text-[#997b24] transition-colors"
              >
                <span>{ctaText}</span>
                <span className="transition-transform duration-300 group-hover/btn:translate-x-2 text-neutral-900 group-hover/btn:text-[#997b24]">
                  <svg
                    className="w-6 h-4 stroke-current fill-none stroke-[1.5]"
                    viewBox="0 0 24 16"
                  >
                    <path d="M0 8h22M15 1l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
