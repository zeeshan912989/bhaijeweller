import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] select-none group">
      {/* 1. SKELETON IMAGE BOX (Luxury Shimmer Animation) */}
      <div className="aspect-[4/5] w-full rounded-2xl bg-[#F5F2EC] relative overflow-hidden border border-neutral-200/70">
        {/* Shimmer Light Sweep */}
        <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
      </div>

      {/* 2. SKELETON PLACEHOLDER BARS BELOW IMAGE */}
      <div className="pt-3.5 space-y-2.5">
        {/* Title skeleton */}
        <div className="h-3.5 bg-[#EAE5DB] rounded-full w-4/5 relative overflow-hidden">
          <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
        </div>
        {/* Price skeleton */}
        <div className="h-3 bg-[#EFEAE0] rounded-full w-2/5 relative overflow-hidden">
          <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
        </div>
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
