import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import BrandStatement from "@/components/home/BrandStatement";
import ProductCarousel from "@/components/home/ProductCarousel";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import EditorialFeatureBanners from "@/components/home/EditorialFeatureBanners";
import TrustBadges from "@/components/home/TrustBadges";
import InspirationStation from "@/components/home/InspirationStation";
import CuratedEdits from "@/components/home/CuratedEdits";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/* 1. FIXED LUXURY NAVBAR */}
      <Navbar />

      {/* 2. HERO BANNER */}
      <HeroBanner
        title="The Gold Chain & Link Edition"
        subtitle="Heavyweight curb links and delicate chains crafted for bold layering."
        ctaText="Shop Gold Chains"
        ctaHref="/collections/necklaces"
        imageSrc="/hero_section.jpg"
      />

      {/* 3. BRAND STATEMENT TAGLINE */}
      <BrandStatement
        text="Jewellery to live in. The finishing touches for effortless everyday style."
      />

      {/* 4. PRODUCT SKELETON CAROUSEL 1: T-BAR COLLECTION */}
      <ProductCarousel
        title="Which T-Bar Are You?"
        subtitle="Iconic Signatures"
        itemCount={6}
      />

      {/* 5. 4-COLUMN CATEGORY SHOWCASE (Necklaces, Earrings, Bracelets, Rings) */}
      <CategoryShowcase />

      {/* 6. PRODUCT SKELETON CAROUSEL 2: MOST LOVED BEST SELLERS */}
      <ProductCarousel
        title="Most-Loved Best Sellers"
        subtitle="Trending This Season"
        itemCount={6}
      />

      {/* 7. 3-COLUMN EDITORIAL FEATURE BANNERS (Meet Your Match, Under £100, Water-Resistant) */}
      <EditorialFeatureBanners />

      {/* 8. BRAND TRUST & GUARANTEE PILLARS */}
      <TrustBadges />

      {/* 9. INSPIRATION STATION (VERTICAL VIDEO REELS WITH AUTO-CENTERING ELEVATION) */}
      <InspirationStation />

      {/* 10. CURATED STYLING EDITS & SERVICES (SQUARE 1:1 GRID: Stores, Permanent Bracelets, Piercing Studio, Materials & Care) */}
      <CuratedEdits />

      {/* 11. LUXURY FOOTER */}
      <Footer />
    </main>
  );
}
