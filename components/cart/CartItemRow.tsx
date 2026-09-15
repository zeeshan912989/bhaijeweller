"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2, Sparkles } from "lucide-react";
import { CartItem } from "@/lib/cart/types";
import QuantitySelector from "./QuantitySelector";
import { useCurrency } from "@/context/CurrencyContext";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => Promise<boolean>;
  onRemove: () => Promise<boolean>;
  isCompact?: boolean;
  onItemClick?: () => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  isCompact = false,
  onItemClick,
}: CartItemRowProps) {
  const { formatPrice } = useCurrency();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQty: number) => {
    setIsUpdating(true);
    await onUpdateQuantity(newQty);
    setIsUpdating(false);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  return (
    <div
      className={`group relative flex gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white border border-neutral-200/80 transition-all duration-300 hover:border-neutral-400 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${
        isRemoving ? "opacity-40 pointer-events-none scale-95" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 flex-shrink-0 overflow-hidden border border-neutral-200">
        <Image
          src={item.product.image || "/ear.jpeg"}
          alt={item.product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="96px"
        />
        {isUpdating && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
          </div>
        )}
      </div>

      {/* Product Info & Controls */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.product.slug}`}
              onClick={onItemClick}
              className="font-serif text-xs sm:text-sm font-medium text-neutral-900 hover:text-[#d4af37] transition-colors line-clamp-2"
            >
              {item.product.name}
            </Link>

            {/* Remove Item Button */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label="Remove item"
              className="text-neutral-400 hover:text-rose-600 transition-colors p-1 -mr-1 -mt-1 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Variant / Metal Specification */}
          <div className="flex items-center gap-2 mt-1">
            {item.variantId && item.variantId !== "Default" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-700 px-2 py-0.5 border border-neutral-200">
                <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
                {item.variantId}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
              {item.product.category}
            </span>
          </div>
        </div>

        {/* Quantity Controls & Line Total */}
        <div className="flex items-center justify-between gap-2 pt-2.5 mt-1 border-t border-neutral-100">
          <QuantitySelector
            quantity={item.quantity}
            onUpdate={handleQuantityChange}
            disabled={isUpdating || isRemoving}
            size={isCompact ? "sm" : "md"}
          />

          <div className="text-right">
            <p className="font-mono font-bold text-xs sm:text-sm text-neutral-950">
              {formatPrice(item.lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[9.5px] text-neutral-400 font-mono">
                {formatPrice(item.product.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
