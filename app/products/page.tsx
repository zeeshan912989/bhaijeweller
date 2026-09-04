"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, SlidersHorizontal, ArrowUpDown, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabaseClient";

interface ProductItem {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  images?: { primary?: string; hover?: string; gallery?: string[] } | string[] | any;
  image?: string;
  badge?: string;
  rating?: number;
  inStock?: boolean;
}

export default function ProductsIndexPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const categories = [
    { id: "all", name: "All Jewellery" },
    { id: "earrings", name: "Earrings" },
    { id: "necklaces", name: "Necklaces" },
    { id: "bracelets", name: "Bracelets" },
    { id: "rings", name: "Rings" },
  ];

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Supabase load error:", error.message);
          // Fallback static items if DB is empty or unreachable
          setProducts([
            {
              id: "bhai-lucy-necklace",
              name: "Lucy Williams Roman Arc Coin Necklace",
              slug: "lucy-williams-roman-arc-coin-necklace",
              category: "necklaces",
              price: 165,
              originalPrice: 195,
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
              badge: "Bestseller",
              inStock: true,
            },
            {
              id: "bhai-chubby-hoops",
              name: "Chubby Medium Dome Huggie Hoops",
              slug: "chubby-medium-dome-huggie-hoops",
              category: "earrings",
              price: 110,
              image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800",
              badge: "New In",
              inStock: true,
            },
            {
              id: "bhai-snake-chain",
              name: "Axiom Twisted Rope Chain Bracelet",
              slug: "axiom-twisted-rope-chain-bracelet",
              category: "bracelets",
              price: 125,
              image: "https://images.unsplash.com/photo-1611591475104-a690e1f70d24?auto=format&fit=crop&q=80&w=800",
              badge: "Statement",
              inStock: true,
            },
            {
              id: "bhai-signet-ring",
              name: "Molten Malachite Shield Signet Ring",
              slug: "molten-malachite-shield-signet-ring",
              category: "rings",
              price: 145,
              image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
              badge: "Bestseller",
              inStock: true,
            },
          ]);
        } else if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeCategory === "all") return true;
    return (p.category || "").toLowerCase() === activeCategory.toLowerCase();
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const getProductImage = (p: ProductItem) => {
    if (p.image) return p.image;
    if (typeof p.images === "object" && p.images?.primary) return p.images.primary;
    if (Array.isArray(p.images) && p.images.length > 0) return p.images[0];
    return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-[#f4efe6] flex flex-col selection:bg-[#c5a880] selection:text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#c5a880]">The Complete Collection</span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-[#f4efe6]">
            All Jewellery
          </h1>
          <p className="text-sm text-neutral-400 font-light max-w-lg mx-auto">
            Handcrafted with recycled 18ct gold vermeil, sterling silver, and ethically sourced gemstones.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-800/80 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-[#c5a880] text-[#0d0d0f] font-medium shadow-md shadow-[#c5a880]/10"
                    : "bg-[#141419] text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-neutral-500 font-light">
              {filteredProducts.length} Pieces
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="bg-[#141419] border border-neutral-800 text-neutral-300 text-xs rounded-full px-4 py-2 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#c5a880]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="space-y-3">
                <div className="aspect-[4/5] bg-neutral-900 rounded-xl" />
                <div className="h-4 bg-neutral-900 rounded w-3/4" />
                <div className="h-3 bg-neutral-900 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-neutral-400 text-sm font-light">No jewellery pieces found in this category.</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="text-xs uppercase tracking-widest text-[#c5a880] hover:underline"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((prod) => {
              const href = `/products/${prod.slug || prod.id}`;
              const imgUrl = getProductImage(prod);

              return (
                <Link
                  key={prod.id}
                  href={href}
                  className="group flex flex-col bg-[#141419]/50 rounded-2xl border border-neutral-800/60 overflow-hidden hover:border-[#c5a880]/50 transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                    <Image
                      src={imgUrl}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {prod.badge && (
                      <span className="absolute top-3 left-3 bg-[#0d0d0f]/80 backdrop-blur-md text-[#c5a880] text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#c5a880]/30 font-medium">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-light">
                        {prod.category || "Jewellery"}
                      </span>
                      <h2 className="font-serif text-xs md:text-sm text-[#f4efe6] line-clamp-1 group-hover:text-[#c5a880] transition-colors mt-0.5">
                        {prod.name}
                      </h2>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs md:text-sm text-[#c5a880] font-serif">
                        £{prod.price}
                      </span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-[10px] text-neutral-500 line-through">
                          £{prod.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
