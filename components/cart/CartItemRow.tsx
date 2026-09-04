"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2, Sparkles } from "lucide-react";
import { CartItem } from "@/lib/cart/types";
import QuantitySelector from "./QuantitySelector";

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
      className={`relative flex gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white border border-neutral-200 transition-all hover:border-neutral-300 ${
        isRemoving ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {/* Product Image Thumbnail */}
      <Link
        href={`/products/${item.product.slug}`}
        onClick={onItemClick}
        className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-[#FAF7F2] border border-neutral-200 overflow-hidden group"
      >
        <Image
          src={item.product.image || "/ear.jpeg"}
          alt={item.product.name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Item Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.product.slug}`}
              onClick={onItemClick}
              className="font-bold text-xs sm:text-sm text-neutral-950 uppercase tracking-wider hover:text-[#997b24] transition-colors line-clamp-2"
            >
              {item.product.name}
            </Link>

            {/* Remove Trash Button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label="Remove item"
              className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
              title="Remove from bag"
            >
              {isRemoving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
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
              £{item.lineTotal.toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[9.5px] text-neutral-400 font-mono">
                £{item.product.price.toFixed(2)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
