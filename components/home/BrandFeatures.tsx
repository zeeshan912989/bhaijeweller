"use client";

import React, { useState, useEffect, useRef } from "react";

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FEATURES: FeatureItem[] = [
  {
    id: "eco-designed",
    title: "ECO-DESIGNED",
    description:
      "Crafted with as many recycled and bio-sourced materials as possible, they're some of the most sustainably made.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-8 sm:h-8 text-neutral-900 fill-none stroke-current stroke-[1.35]"
        viewBox="0 0 32 32"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Sleek Minimalist 3-Arrow Eco Cycle */}
        <path d="M16 5 C21 5 25.2 8 26.8 12.2" />
        <path d="M26.8 8.2 V12.5 H22.5" />
        <path d="M27.2 16.5 C26.8 22.2 22 26.8 16 26.8 C13.2 26.8 10.6 25.7 8.7 23.8" />
        <path d="M6.2 26.2 L8.8 23.6 L12.5 25.8" />
        <path d="M5.2 17.5 C4.9 16.7 4.8 15.9 4.8 15 C4.8 10.4 7.8 6.5 12 5.2" />
        <path d="M12.5 9 L12 5 L8 5.6" />
      </svg>
    ),
  },
  {
    id: "comfortable",
    title: "COMFORTABLE",
    description:
      "Designed for life on-the-go, they cradle your feet in comfort like a warm hug from an old friend.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-8 sm:h-8 text-neutral-900 fill-none stroke-current stroke-[1.35]"
        viewBox="0 0 32 32"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Refined Smooth Contour Cloud */}
        <path d="M9.5 22.5 H22.5 A5 5 0 0 0 24 12.8 A7.5 7.5 0 0 0 9 14.8 A4.5 4.5 0 0 0 9.5 22.5 Z" />
      </svg>
    ),
  },
  {
    id: "lightweight",
    title: "LIGHTWEIGHT",
    description:
      "Weighing less that 14oz on average per pair, they're easy to wear and easy to travel with.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-8 sm:h-8 text-neutral-900 fill-none stroke-current stroke-[1.35]"
        viewBox="0 0 32 32"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Luxury Modern Floating Feather */}
        <path d="M27 4.5 C21.5 5 12 11 8 19.5 C6 23.8 4.5 27 4.5 27 C4.5 27 7.8 25.5 12 23.5 C20.5 19.5 26.5 10 27 4.5 Z" />
        <path d="M4.5 27 L17 14.5" />
        <path d="M13 18.5 C15.5 17 17.5 17 17.5 17" />
        <path d="M10 21.5 C12 20.5 13.5 20.5 13.5 20.5" />
        <path d="M16 15.5 C18.5 14 20.5 14 20.5 14" />
      </svg>
    ),
  },
  {
    id: "committed",
    title: "COMMITTED",
    description:
      "In partnership with 1% for the Planet, every pair of SAOLA's protects bio-diversity conservation efforts around the world.",
    icon: (
      <svg
        className="w-8 h-8 sm:w-8 sm:h-8 text-neutral-900 fill-none stroke-current stroke-[1.35]"
        viewBox="0 0 32 32"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Refined Luxury Globe Outline */}
        <circle cx="16" cy="16" r="11" />
        <path d="M5 16 H27" />
        <ellipse cx="16" cy="16" rx="5" ry="11" />
        <path d="M7.8 10.5 C10.5 11.8 13.2 12.3 16 12.3 C18.8 12.3 21.5 11.8 24.2 10.5" />
        <path d="M7.8 21.5 C10.5 20.2 13.2 19.7 16 19.7 C18.8 19.7 21.5 20.2 24.2 21.5" />
      </svg>
    ),
  },
];

export default function BrandFeatures() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll on mobile every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 35) {
      // Swiped Left -> Next item
      setCurrentIndex((prev) => (prev + 1) % FEATURES.length);
    } else if (diff < -35) {
      // Swiped Right -> Previous item
      setCurrentIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
    }

    setTouchStartX(null);
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-5 sm:py-6 md:py-8 border-y border-[#EAE6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-14 xl:px-16">
        
        {/* 1. MOBILE VIEW: SMOOTH AUTO-SCROLL SLIDER WITH DOTS (Visible on Mobile) */}
        <div
          className="block md:hidden overflow-hidden w-full relative select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Sliding Track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {FEATURES.map((item) => (
              <div
                key={item.id}
                className="w-full flex-shrink-0 flex flex-col items-center justify-center text-center px-4"
              >
                {/* Icon */}
                <div className="h-10 flex items-center justify-center mb-2.5">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-[13px] font-bold tracking-[0.14em] text-neutral-900 uppercase mb-1.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[11.5px] text-neutral-600 leading-[1.55] max-w-[270px] mx-auto font-normal">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Dots Indicator (Matching screenshot) */}
          <div className="flex items-center justify-center gap-1.5 mt-3.5">
            {FEATURES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-2 h-2 bg-neutral-900"
                    : "w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2. TABLET & DESKTOP VIEW: CLEAN 4-COLUMN GRID */}
        <div className="hidden md:grid md:grid-cols-4 gap-x-10 lg:gap-x-16 xl:gap-x-20 text-center items-start">
          {FEATURES.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-start group"
            >
              {/* Stylish Icon Container */}
              <div className="h-8 sm:h-9 flex items-center justify-center mb-2 sm:mb-2.5 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[12.5px] sm:text-[13px] font-bold tracking-[0.14em] text-neutral-900 uppercase mb-1.5">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[11.5px] sm:text-[12px] text-neutral-600 leading-[1.55] max-w-[220px] sm:max-w-[240px] mx-auto font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
