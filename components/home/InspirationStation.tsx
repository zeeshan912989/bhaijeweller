"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

interface InspirationItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    thumbnail: string;
    href: string;
  };
}

const INSPIRATION_ITEMS: InspirationItem[] = [
  {
    id: "insp-1",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-jewelry-41584-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "Lucy Williams Square Malachite Necklace | 18ct Gold Vermeil",
      price: 135.0,
      thumbnail: "/necklace.jpeg",
      href: "/products/chunky-knot-t-bar-chain-necklace",
    },
  },
  {
    id: "insp-2",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-model-wearing-a-gold-necklace-41585-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "Lucy Williams Engravable Roman Arc Coin Necklace | 18ct Gold",
      price: 149.0,
      thumbnail: "/necklace.jpeg",
      href: "/products/roman-arc-coin-pendant-necklace",
    },
  },
  {
    id: "insp-3",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-earrings-and-a-necklace-41586-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "Claw Pavé Huggies | 18ct Gold Plated/Cubic Zirconia",
      price: 85.0,
      thumbnail: "/ring2.jpeg",
      href: "/products/classic-pave-huggie-hoop-earrings",
    },
  },
  {
    id: "insp-4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-gold-chain-41587-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "The Everyday Layering Necklace Set | 18ct Gold Vermeil",
      price: 289.0,
      originalPrice: 345.0,
      thumbnail: "/necklace.jpeg",
      href: "/products/the-pearl-t-bar-layered-necklace-set",
    },
  },
  {
    id: "insp-5",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-golden-earrings-drinking-coffee-41588-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1611591477292-624021798361?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "Ripple Oversized Stud Earrings",
      price: 135.0,
      thumbnail: "/ear.jpeg",
      href: "/products/knot-t-bar-charm-hoop-earrings",
    },
  },
  {
    id: "insp-6",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-showing-silver-and-gold-rings-41589-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "Lucy Williams Gold Chunky Bangle / Silver Cable",
      price: 165.0,
      thumbnail: "/braclet2.jpeg",
      href: "/products/solitaire-claw-stacking-ring",
    },
  },
  {
    id: "insp-7",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-bikini-near-the-pool-41590-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1576022160538-23214b7e997f?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "Square Malachite Square Hoop Earrings",
      price: 115.0,
      thumbnail: "/ear.jpeg",
      href: "/products/knot-t-bar-charm-hoop-earrings",
    },
  },
  {
    id: "insp-8",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-model-wearing-a-gold-necklace-41585-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop",
    product: {
      name: "Lucy Williams Engravable Roman Arc Coin Necklace",
      price: 149.0,
      thumbnail: "/necklace.jpeg",
      href: "/products/roman-arc-coin-pendant-necklace",
    },
  },
];

export default function InspirationStation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeVideoId, setActiveVideoId] = useState<string>("insp-4");
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    "insp-1": true,
    "insp-2": true,
    "insp-3": true,
    "insp-4": true,
    "insp-5": true,
    "insp-6": true,
    "insp-7": true,
    "insp-8": true,
  });

  // Function to smoothly scroll clicked video to the exact center
  const selectAndCenterVideo = (id: string) => {
    setActiveVideoId(id);
    const targetElem = itemRefs.current[id];
    const container = scrollRef.current;
    
    if (targetElem && container) {
      const containerWidth = container.clientWidth;
      const targetLeft = targetElem.offsetLeft;
      const targetWidth = targetElem.offsetWidth;
      const scrollPosition = targetLeft - (containerWidth / 2) + (targetWidth / 2);
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  };

  // Center initial active video on load
  useEffect(() => {
    const timer = setTimeout(() => {
      selectAndCenterVideo("insp-4");
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMutedStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleArrowNavigation = (direction: "left" | "right") => {
    const currentIndex = INSPIRATION_ITEMS.findIndex((item) => item.id === activeVideoId);
    let nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= INSPIRATION_ITEMS.length) nextIndex = INSPIRATION_ITEMS.length - 1;

    const nextId = INSPIRATION_ITEMS[nextIndex].id;
    selectAndCenterVideo(nextId);
  };

  return (
    <section className="w-full bg-white pt-16 pb-20 border-b border-neutral-200/70 overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* CENTER TITLE & ARROWS */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <div className="w-8 hidden sm:block" />
          
          <h2
            style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
            className="text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-900 tracking-[0.015em] text-center"
          >
            Inspiration Station
          </h2>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleArrowNavigation("left")}
              aria-label="Previous inspiration"
              className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.75]" />
            </button>
            <button
              onClick={() => handleArrowNavigation("right")}
              aria-label="Next inspiration"
              className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition-all cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* HORIZONTAL CAROUSEL WITH AUTO-CENTERING & ELEVATED CENTER REEL */}
        <div
          ref={scrollRef}
          className="flex items-end gap-3 sm:gap-4 overflow-x-auto scrollbar-none pt-14 pb-6 px-4 sm:px-10 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {INSPIRATION_ITEMS.map((item) => {
            const isFeatured = activeVideoId === item.id;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                onClick={() => selectAndCenterVideo(item.id)}
                className={`flex flex-col flex-shrink-0 transition-all duration-500 cursor-pointer select-none ${
                  isFeatured
                    ? "w-[240px] sm:w-[265px] md:w-[285px] -translate-y-8 z-20"
                    : "w-[185px] sm:w-[205px] md:w-[220px] opacity-95 hover:opacity-100 z-10"
                }`}
              >
                {/* 1. VERTICAL VIDEO REEL (Taller when active/featured) */}
                <div
                  className={`relative w-full rounded-2xl overflow-hidden bg-neutral-900 transition-all duration-500 ${
                    isFeatured
                      ? "h-[390px] sm:h-[430px] md:h-[460px] shadow-2xl ring-1 ring-neutral-900/15"
                      : "h-[310px] sm:h-[340px] md:h-[365px] shadow-sm border border-neutral-200/90 hover:shadow-md"
                  }`}
                >
                  <video
                    src={item.videoUrl}
                    poster={item.posterUrl}
                    autoPlay
                    loop
                    muted={mutedStates[item.id]}
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

                  {/* Volume Toggle Button at Bottom-Right */}
                  <button
                    onClick={(e) => toggleMute(item.id, e)}
                    aria-label={mutedStates[item.id] ? "Unmute video" : "Mute video"}
                    className="absolute bottom-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/45 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-all cursor-pointer shadow-sm"
                  >
                    {mutedStates[item.id] ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* 2. ATTACHED PRODUCT CARD DIRECTLY BELOW VIDEO */}
                <Link
                  href={item.product.href}
                  className={`mt-2 p-2 bg-white rounded-lg transition-all duration-300 flex items-center gap-2 group/prod ${
                    isFeatured
                      ? "border border-neutral-300 shadow-md"
                      : "border border-neutral-200/80 hover:border-neutral-900 hover:shadow-sm"
                  }`}
                >
                  {/* Product Thumbnail */}
                  <div className="w-9 h-9 relative rounded-md overflow-hidden bg-[#FAF7F2] border border-neutral-200/50 flex-shrink-0 p-0.5">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Name & Price */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[10px] sm:text-[10.5px] font-medium text-neutral-900 line-clamp-1 group-hover/prod:text-[#b8860b] transition-colors leading-tight">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-900 mt-0.5">
                      {item.product.originalPrice ? (
                        <>
                          <span className="line-through text-neutral-400 font-light text-[10px]">
                            £{item.product.originalPrice.toFixed(0)}
                          </span>
                          <span className="text-rose-700">
                            £{item.product.price.toFixed(0)}
                          </span>
                        </>
                      ) : (
                        <span>£{item.product.price.toFixed(0)}</span>
                      )}
                    </div>
                  </div>

                  {/* Expand Chevron */}
                  <div className="text-neutral-400 group-hover/prod:text-neutral-900 transition-colors flex-shrink-0">
                    <ChevronUp className="w-4 h-4 stroke-[1.75]" />
                  </div>
                </Link>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
