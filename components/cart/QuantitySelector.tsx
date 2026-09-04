"use client";

import React from "react";
import { Minus, Plus, Loader2 } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onUpdate: (newQuantity: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

export default function QuantitySelector({
  quantity,
  onUpdate,
  disabled = false,
  min = 1,
  max = 20,
  size = "md",
}: QuantitySelectorProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMin && !disabled) {
      onUpdate(quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMax && !disabled) {
      onUpdate(quantity + 1);
    }
  };

  const buttonPadding = size === "sm" ? "p-1.5" : "p-2";
  const textPadding = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <div
      className={`inline-flex items-center border border-neutral-300 bg-white select-none transition-colors ${
        disabled ? "opacity-60 pointer-events-none" : "hover:border-neutral-400"
      }`}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isMin || disabled}
        aria-label="Decrease quantity"
        className={`${buttonPadding} text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer`}
      >
        <Minus className={iconSize} />
      </button>

      <span className={`${textPadding} font-mono font-bold text-neutral-950 min-w-[28px] text-center`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={isMax || disabled}
        aria-label="Increase quantity"
        className={`${buttonPadding} text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
