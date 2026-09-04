"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

interface EmptyCartProps {
  onClose?: () => void;
}

export default function EmptyCart({ onClose }: EmptyCartProps) {
  const collections = [
    { name: "Earrings", href: "/collections/earrings" },
    { name: "Necklaces", href: "/collections/necklaces" },
    { name: "Rings", href: "/collections/rings" },
    { name: "Bracelets", href: "/collections/bracelets" },
  ];

  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
        <ShoppingBag className="w-7 h-7 stroke-[1.25]" />
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h3
          style={{ fontFamily: "var(--font-cinzel), serif" }}
          className="text-base font-bold uppercase tracking-widest text-neutral-900"
        >
          Your Shopping Bag is Empty
        </h3>
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          Discover our curated collection of handcrafted solid gold and diamond jewellery.
        </p>
      </div>

      {/* Suggested Quick Links */}
      <div className="w-full max-w-xs space-y-2 pt-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Explore Popular Collections:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {collections.map((col) => (
            <Link
              key={col.name}
              href={col.href}
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 bg-neutral-50 hover:bg-neutral-950 hover:text-white border border-neutral-200 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span>{col.name}</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#d4af37]" />
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/collections/earrings"
        onClick={onClose}
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md mt-2"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Start Shopping</span>
      </Link>
    </div>
  );
}
