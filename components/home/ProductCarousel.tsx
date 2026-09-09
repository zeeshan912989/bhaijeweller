"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/data/products";

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  itemCount?: number;
  sort?: "trending" | "popularity" | "hidden-gems" | "newest" | string;
  category?: string;
  initialProducts?: Product[];
}

export default function ProductCarousel({
  title = "Trending Jewellery Pieces",
  subtitle = "Popularity Algorithm",
  itemCount = 6,
  sort = "trending",
  category = "all",
  initialProducts,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchDynamicProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?sort=${sort}&category=${category}&limit=${itemCount}`);
        if (!res.ok) throw new Error("Failed to load products");
        const json = await res.json();

        if (isMounted && json.success && Array.isArray(json.products)) {
          // Transform API output to Product schema
          const mapped: Product[] = json.products.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category,
            price: p.price,
            originalPrice: p.originalPrice,
            badge:
              p.badge ||
              (sort === "trending" ? "🔥 Trending" : sort === "hidden-gems" ? "💎 Hidden Gem" : undefined),
            images: {
              primary: p.primaryImage || "/ear.jpeg",
              hover: p.hoverImage || undefined,
              gallery: p.galleryImages || [],
            },
            metals: p.metals && p.metals.length > 0
              ? p.metals
              : [
                  { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
                  { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
                ],
            inStock: p.inStock ?? true,
          }));

          setProducts(mapped);
        }
      } catch (err) {
        console.warn("ProductCarousel dynamic fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDynamicProducts();

    return () => {
      isMounted = false;
    };
  }, [sort, category, itemCount, initialProducts]);

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

        {/* HORIZONTAL SCROLLABLE CAROUSEL */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            Array.from({ length: itemCount }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))
          ) : products.length > 0 ? (
            products.map((prod) => (
              <ProductCard key={prod.id || prod.slug} product={prod} />
            ))
          ) : (
            <div className="w-full py-10 flex flex-col items-center justify-center border border-dashed border-neutral-200 rounded-xl bg-[#FAF9F6]">
              <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                New jewellery pieces arriving soon
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
