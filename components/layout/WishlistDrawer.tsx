"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Share2,
  ExternalLink
} from "lucide-react";
import { Product } from "@/data/products";

import { useCart } from "@/context/CartContext";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  metal?: string;
  inStock?: boolean;
}

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: WishlistItem) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  onAddToCart,
}: WishlistDrawerProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [addedToastItem, setAddedToastItem] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Load wishlist items from localStorage & listen to cross-component updates
  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem("bhai_wishlist_items_v1");
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleUpdate = () => loadWishlist();
    window.addEventListener("bhai_wishlist_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("bhai_wishlist_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Remove Item
  const handleRemove = (id: string) => {
    const updated = items.filter((it) => it.id !== id && it.slug !== id);
    setItems(updated);
    try {
      localStorage.setItem("bhai_wishlist_items_v1", JSON.stringify(updated));
      window.dispatchEvent(new Event("bhai_wishlist_updated"));
    } catch (e) {
      console.error(e);
    }
  };

  // Move Item to Shopping Bag
  const handleMoveToBag = async (item: WishlistItem) => {
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      await addToCart(
        item.id || item.slug,
        item.metal || "18K Gold Vermeil",
        1,
        {
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
        }
      );
      onClose();
    }
    setAddedToastItem(item.name);
    setTimeout(() => setAddedToastItem(null), 2500);
  };

  // Clear all
  const handleClearAll = () => {
    setItems([]);
    try {
      localStorage.setItem("bhai_wishlist_items_v1", JSON.stringify([]));
      window.dispatchEvent(new Event("bhai_wishlist_updated"));
    } catch (e) {
      console.error(e);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] transition-visibility duration-500 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      
      {/* 1. DARK BACKDROP OVERLAY WITH LUXURY SMOOTH FADE */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 transition-all duration-500 ease-out cursor-pointer ${
          isOpen ? "opacity-100 backdrop-blur-xs" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* 2. RIGHT SLIDE-OUT DRAWER PANEL (FULL 60FPS HARDWARE-ACCELERATED TRANSLATE ANIMATION) */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[450px] max-w-[90vw] bg-white h-full shadow-2xl border-l border-neutral-300 flex flex-col justify-between z-10 rounded-none text-neutral-950 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        
        {/* Top Header */}
        <div className="p-5 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
            <h2
              style={{ fontFamily: "var(--font-neue-haas)" }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-white"
            >
              My Wishlist ({items.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close wishlist drawer"
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Toast Notification */}
        {addedToastItem && (
          <div className="bg-emerald-950 text-emerald-100 px-4 py-2 text-xs flex items-center gap-2 border-b border-emerald-800 animate-in fade-in duration-200">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">&quot;{addedToastItem}&quot; moved to shopping bag!</span>
          </div>
        )}

        {/* Middle Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            
            /* EMPTY WISHLIST STATE */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-neutral-200 flex items-center justify-center text-neutral-400 mb-2">
                <Heart className="w-7 h-7 stroke-[1.25]" />
              </div>

              <div className="space-y-1">
                <h3
                  style={{ fontFamily: "var(--font-neue-haas)" }}
                  className="text-sm font-bold uppercase tracking-wider text-neutral-950"
                >
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs font-light leading-relaxed">
                  Save your favourite fine jewellery pieces by tapping the heart icon while exploring our boutique collections.
                </p>
              </div>

              <div className="pt-3 w-full space-y-2">
                <Link
                  href="/collections/earrings"
                  onClick={onClose}
                  className="block w-full py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all rounded-none text-center shadow-xs"
                >
                  Explore Earrings
                </Link>
                <Link
                  href="/collections/necklaces"
                  onClick={onClose}
                  className="block w-full py-3 border border-neutral-300 hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-widest transition-colors rounded-none text-center"
                >
                  Explore Necklaces
                </Link>
              </div>
            </div>

          ) : (

            /* WISHLIST ITEMS LIST */
            <div className="space-y-3 divide-y divide-neutral-100">
              {items.map((item, idx) => (
                <div
                  key={item.id || item.slug}
                  className="pt-3 first:pt-0 flex items-center gap-3.5 group animate-in fade-in slide-in-from-right-4 duration-300"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Square Image Thumbnail */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={onClose}
                    className="w-20 h-20 relative bg-[#FAF7F2] border border-neutral-200 flex-shrink-0 overflow-hidden rounded-none"
                  >
                    <Image
                      src={item.image || "/ear.jpeg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9.5px] uppercase font-bold text-[#997b24] tracking-wider block">
                      {item.metal || item.category || "Fine Jewellery"}
                    </span>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="text-xs font-bold text-neutral-950 uppercase truncate block hover:text-[#997b24] transition-colors"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-neutral-950 font-mono">
                        £{item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[10.5px] text-neutral-400 line-through font-mono">
                          £{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Move to Bag CTA */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="px-3 py-1.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all rounded-none cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move To Bag</span>
                      </button>

                      <button
                        onClick={() => handleRemove(item.id || item.slug)}
                        aria-label="Remove item"
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>

        {/* Bottom Footer Actions (When items exist) */}
        {items.length > 0 && (
          <div className="p-5 bg-[#FAF7F2] border-t border-neutral-200 space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-neutral-700">
                Total Wishlist Value:
              </span>
              <span className="font-extrabold text-neutral-950 text-sm font-mono">
                £{items.reduce((acc, it) => acc + it.price, 0).toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  items.forEach((it) => onAddToCart && onAddToCart(it));
                  setAddedToastItem("All Wishlist Pieces");
                  setTimeout(() => setAddedToastItem(null), 2500);
                }}
                className="py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all rounded-none cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All To Bag</span>
              </button>

              <button
                onClick={handleClearAll}
                className="py-3 border border-neutral-300 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
