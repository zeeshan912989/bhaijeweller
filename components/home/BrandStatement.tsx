import React from "react";

interface BrandStatementProps {
  text?: string;
}

export default function BrandStatement({
  text = "Jewellery to live in. The finishing touches for effortless everyday style.",
}: BrandStatementProps) {
  return (
    <section className="w-full bg-[#FAF7F2] py-5 sm:py-7 border-b border-[#ece7de]">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14">
        <p
          style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
          className="text-sm sm:text-base md:text-lg lg:text-[20px] font-normal text-neutral-900 tracking-[0.015em] leading-normal max-w-4xl"
        >
          {text}
        </p>
      </div>
    </section>
  );
}
