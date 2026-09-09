"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
}

export const DEFAULT_HERO_CONFIG: HeroBannerProps = {
  title: "The Gold Chain & Link Edition",
  subtitle: "Heavyweight curb links and delicate chains crafted for bold layering.",
  ctaText: "Shop Gold Chains",
  ctaHref: "/collections/necklaces",
  imageSrc: "/hero_section.jpg",
};

export default function HeroBanner(props: HeroBannerProps) {
  const [heroData, setHeroData] = useState<HeroBannerProps>({
    title: props.title || DEFAULT_HERO_CONFIG.title,
    subtitle: props.subtitle || DEFAULT_HERO_CONFIG.subtitle,
    ctaText: props.ctaText || DEFAULT_HERO_CONFIG.ctaText,
    ctaHref: props.ctaHref || DEFAULT_HERO_CONFIG.ctaHref,
    imageSrc: props.imageSrc || DEFAULT_HERO_CONFIG.imageSrc,
  });

  useEffect(() => {
    // 1. Initial load from localStorage
    try {
      const local = localStorage.getItem("bhai_hero_banner_v1");
      if (local) {
        const parsed = JSON.parse(local);
        setHeroData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from Supabase
    const fetchSupabaseHero = async () => {
      try {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "hero_banner").single();
        if (data?.value) {
          setHeroData((prev) => ({ ...prev, ...data.value }));
          try {
            localStorage.setItem("bhai_hero_banner_v1", JSON.stringify(data.value));
          } catch {}
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchSupabaseHero();

    // 3. BroadcastChannel for instant live updates across tabs
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("bhai_realtime_layout");
      channel.onmessage = (event) => {
        if (event.data?.type === "HERO_UPDATED" && event.data.payload) {
          setHeroData((prev) => ({ ...prev, ...event.data.payload }));
        }
        if (event.data?.type === "LAYOUT_UPDATED" && event.data.payload?.hero) {
          setHeroData((prev) => ({ ...prev, ...event.data.payload.hero }));
        }
      };
    }

    // 4. Storage event listener
    const handleStorage = (e: StorageEvent | Event) => {
      try {
        const updated = localStorage.getItem("bhai_hero_banner_v1");
        if (updated) {
          setHeroData((prev) => ({ ...prev, ...JSON.parse(updated) }));
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

  const activeTitle = heroData.title || DEFAULT_HERO_CONFIG.title;
  const activeSubtitle = heroData.subtitle || DEFAULT_HERO_CONFIG.subtitle;
  const activeCtaText = heroData.ctaText || DEFAULT_HERO_CONFIG.ctaText;
  const activeCtaHref = heroData.ctaHref || DEFAULT_HERO_CONFIG.ctaHref;
  const activeImageSrc = heroData.imageSrc || DEFAULT_HERO_CONFIG.imageSrc;

  return (
    <section className="relative w-full h-[84vh] sm:h-[92vh] min-h-[520px] sm:min-h-[560px] max-h-[1080px] overflow-hidden bg-[#0a0a0a] flex items-end">
      {/* 1. BACKGROUND IMAGE (Optimized Focal Point for Mobile & Desktop) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={activeImageSrc || "/hero_section.jpg"}
          alt={activeTitle || "Hero Image"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%] sm:object-center scale-[1.01] transition-all duration-700"
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
          {activeTitle}
        </h1>

        {/* Short & Clean Subtitle (1 line) */}
        <p className="mt-2 text-xs sm:text-sm text-neutral-100 font-light tracking-wide leading-relaxed drop-shadow max-w-lg">
          {activeSubtitle}
        </p>

        {/* Minimalist Underlined Link */}
        <div className="mt-4 sm:mt-5">
          <Link
            href={activeCtaHref || "/collections/necklaces"}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-wider text-white hover:text-[#f7e8b5] transition-all duration-300 pb-0.5 border-b border-white hover:border-[#d4af37]"
          >
            <span>{activeCtaText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#d4af37]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
