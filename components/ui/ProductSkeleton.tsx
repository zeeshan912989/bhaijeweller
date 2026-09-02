import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] select-none">
      {/* 1. SKELETON IMAGE BOX (Matching Reference Image) */}
      <div className="aspect-[4/5] w-full rounded-lg bg-[#DFE3E8] relative overflow-hidden">
        {/* Smooth Shimmer Light Sweep */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* 2. SKELETON PLACEHOLDER BARS BELOW IMAGE */}
      <div className="pt-3.5 space-y-2">
        <div className="h-3 bg-[#CFD5DC] rounded-full w-4/5" />
        <div className="h-3 bg-[#CFD5DC] rounded-full w-2/5" />
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-stretch gap-4 sm:gap-6 overflow-x-hidden pb-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
