"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface InspirationItem {
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

export default function InspirationStation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string>("");
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Real-time synchronization for shoppable video reels from Supabase & localStorage
  useEffect(() => {
    // 1. Initial local load
    try {
      const stored = localStorage.getItem("bhai_shoppable_reels_v1");
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          if (parsed.length > 0) {
            setActiveVideoId(parsed[0].id);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Load from Supabase Database
    async function loadFromDb() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "shoppable_reels")
          .maybeSingle();

        if (!error && data && Array.isArray(data.value)) {
          setItems(data.value);
          if (data.value.length > 0) {
            setActiveVideoId(data.value[0].id);
          }
          localStorage.setItem("bhai_shoppable_reels_v1", JSON.stringify(data.value));
        }
      } catch (err) {
        console.warn("Supabase reels fetch notice:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadFromDb();

    // 3. BroadcastChannel for instant zero-latency cross-tab sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("bhai_realtime_videos");
      channel.onmessage = (event) => {
        if (event.data?.type === "REELS_UPDATED" && Array.isArray(event.data.payload)) {
          setItems(event.data.payload);
          if (event.data.payload.length > 0) {
            setActiveVideoId(event.data.payload[0].id);
          }
        }
      };
    }

    // 4. Storage event listener
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("bhai_shoppable_reels_v1");
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Smoothly scroll clicked video to center
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
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleMute = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMutedStates((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const scrollHorizontally = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // If no videos exist in database/admin panel, cleanly hide the section (no fake/broken demo videos)
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FAF7F2] py-16 sm:py-20 border-b border-[#ece7de] overflow-hidden">
      
      {/* 1. TOP HEADER & ARROW CONTROLS */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-1.5 block">
              AS SEEN ON YOU
            </span>
            <h2
              style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
              className="text-2xl sm:text-3xl lg:text-[38px] font-normal tracking-[0.02em] text-neutral-950 capitalize"
            >
              Inspiration Station
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollHorizontally("left")}
              aria-label="Scroll left"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-300 bg-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200 flex items-center justify-center text-neutral-800 shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </button>
            <button
              onClick={() => scrollHorizontally("right")}
              aria-label="Scroll right"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-300 bg-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200 flex items-center justify-center text-neutral-800 shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SMOOTH HORIZONTAL VIDEO REEL CAROUSEL */}
      <div className="w-full relative">
        <div
          ref={scrollRef}
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 lg:px-12 xl:px-14 py-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((item) => {
            const isFeatured = activeVideoId === item.id;
            const isMuted = mutedStates[item.id] !== false;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                onClick={() => selectAndCenterVideo(item.id)}
                className={`flex-shrink-0 transition-all duration-500 cursor-pointer ${
                  isFeatured
                    ? "w-[240px] sm:w-[280px] md:w-[310px] scale-100 z-10"
                    : "w-[170px] sm:w-[210px] md:w-[230px] opacity-85 hover:opacity-100"
                }`}
                style={{ scrollSnapAlign: "center" }}
              >
                {/* 1. VIDEO CONTAINER */}
                <div
                  className={`relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-neutral-950 transition-all duration-500 shadow-md ${
                    isFeatured
                      ? "ring-2 ring-neutral-950 shadow-2xl"
                      : "border border-neutral-300/80"
                  }`}
                >
                  <video
                    src={item.videoUrl}
                    poster={item.posterUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                  />

                  {/* Top Sound Toggle Pill */}
                  <button
                    onClick={(e) => toggleMute(e, item.id)}
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-200 z-20"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 stroke-[2]" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 stroke-[2]" />
                    )}
                  </button>
                </div>

                {/* 2. ATTACHED PRODUCT CARD DIRECTLY BELOW VIDEO */}
                {item.product && (
                  <Link
                    href={item.product.href || `/collections/earrings`}
                    className={`mt-2 p-2 bg-white rounded-lg transition-all duration-300 flex items-center gap-2 group/prod ${
                      isFeatured
                        ? "border border-neutral-300 shadow-md"
                        : "border border-neutral-200/80 hover:border-neutral-900 hover:shadow-sm"
                    }`}
                  >
                    {/* Product Thumbnail */}
                    <div className="w-9 h-9 relative rounded-md overflow-hidden bg-[#FAF7F2] border border-neutral-200/50 flex-shrink-0 p-0.5">
                      <Image
                        src={item.product.thumbnail || "/ear.jpeg"}
                        alt={item.product.name || "Jewellery"}
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
                          <span>£{item.product.price ? item.product.price.toFixed(0) : "0"}</span>
                        )}
                      </div>
                    </div>

                    {/* Expand Chevron */}
                    <div className="text-neutral-400 group-hover/prod:text-neutral-900 transition-colors flex-shrink-0">
                      <ChevronUp className="w-4 h-4 stroke-[1.75]" />
                    </div>
                  </Link>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
