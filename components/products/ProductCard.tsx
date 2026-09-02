"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedMetalIndex, setSelectedMetalIndex] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group flex flex-col flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] select-none">
      
      {/* 1. PRODUCT IMAGE CONTAINER (With Hover Image Swap & Bottom Action Icons) */}
      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#FBF9F5] border border-neutral-200/80 transition-all duration-500 group-hover:shadow-md">
        
        {/* Top-Left Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-block px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[10.5px] font-semibold tracking-wide text-neutral-800 rounded-full shadow-2xs border border-neutral-100">
              {product.badge}
            </span>
          </div>
        )}

        {/* Product Image Link with Smooth Cross-Fade On Hover */}
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          {/* Primary Image */}
          <Image
            src={product.images.primary}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 240px, 280px"
            className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 p-3"
          />

          {/* Secondary Hover Image (Smooth Fade-in on Hover) */}
          {product.images.hover && (
            <Image
              src={product.images.hover}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 768px) 240px, 280px"
              className="object-cover object-center transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 p-3 absolute inset-0"
            />
          )}
        </Link>

        {/* Bottom Floating Action Bar: Left Add to Bag Icon Button + Right Wishlist Icon Button */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          
          {/* LEFT: Add To Cart Icon Button */}
          <button
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            title="Add to Cart"
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border border-neutral-200/80 transition-all cursor-pointer ${
              addedToBag
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white/95 text-neutral-900 hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
            }`}
          >
            {addedToBag ? (
              <Check className="w-4 h-4 stroke-[2]" />
            ) : (
              <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
            )}
          </button>

          {/* RIGHT: Wishlist Heart Icon Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label="Add to wishlist"
            title="Add to Wishlist"
            className="w-9 h-9 rounded-xl bg-white/95 text-neutral-700 hover:text-black hover:bg-white border border-neutral-200/80 flex items-center justify-center shadow-sm transition-all cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-rose-500 text-rose-500" : "text-neutral-700 hover:text-black"
              }`}
            />
          </button>

        </div>

      </div>

      {/* 2. PRODUCT DETAILS */}
      <div className="pt-3.5 flex flex-col flex-1 text-left">
        
        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="text-xs sm:text-[13px] font-semibold text-neutral-900 line-clamp-1 hover:text-[#b8860b] transition-colors leading-tight"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-1 flex items-center gap-2 text-xs">
          {product.originalPrice ? (
            <>
              <span className="line-through text-neutral-400 font-light">
                £{product.originalPrice.toFixed(2)}
              </span>
              <span className="font-semibold text-rose-700">
                £{product.price.toFixed(2)}
              </span>
              {discountPercent && (
                <span className="text-[11px] text-rose-700 font-medium">
                  (-{discountPercent}%)
                </span>
              )}
            </>
          ) : (
            <span className="font-medium text-neutral-900">
              £{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Metal Color Swatches */}
        {product.metals && product.metals.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {product.metals.map((metal, idx) => (
              <button
                key={metal.name}
                type="button"
                onClick={() => setSelectedMetalIndex(idx)}
                title={metal.name}
                className={`w-4 h-4 rounded-full p-[1px] transition-all cursor-pointer ${
                  selectedMetalIndex === idx
                    ? "ring-1.5 ring-neutral-900 ring-offset-1"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                {metal.type === "mixed" && metal.secondaryColorHex ? (
                  /* Half Gold / Half Silver split swatch */
                  <div className="w-full h-full rounded-full overflow-hidden flex border border-neutral-300">
                    <div className="w-1/2 h-full bg-[#E5C158]" />
                    <div className="w-1/2 h-full bg-[#D1D5DB]" />
                  </div>
                ) : (
                  /* Solid metal swatch */
                  <div
                    className="w-full h-full rounded-full border border-neutral-300"
                    style={{ backgroundColor: metal.colorHex }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
