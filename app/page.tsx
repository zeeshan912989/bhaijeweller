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
import StoreLocatorBanner from "@/components/home/StoreLocatorBanner";
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

      {/* 4. ALGORITHM FEED 1: TRENDING NOW (7-Day Velocity Scoring) */}
      <ProductCarousel
        title="Trending Right Now"
        subtitle="Live Community Feed"
        sort="trending"
        itemCount={6}
      />

      {/* 5. 4-COLUMN CATEGORY SHOWCASE (Necklaces, Earrings, Bracelets, Rings) */}
      <CategoryShowcase />

      {/* 6. ALGORITHM FEED 2: MOST LOVED & BEST SELLERS (All-Time Popularity Scoring) */}
      <ProductCarousel
        title="Most-Loved Best Sellers"
        subtitle="Iconic All-Time Favorites"
        sort="popularity"
        itemCount={6}
      />

      {/* 7. 3-COLUMN EDITORIAL FEATURE BANNERS (Meet Your Match, Under £100, Water-Resistant) */}
      <EditorialFeatureBanners />

      {/* 8. ALGORITHM FEED 3: HIDDEN GEMS (High Wishlist-to-View Ratio) */}
      <ProductCarousel
        title="Hidden Gems & Discoveries"
        subtitle="Exceptional Pieces You Might Miss"
        sort="hidden-gems"
        itemCount={6}
      />

      {/* 9. BRAND TRUST & GUARANTEE PILLARS */}
      <TrustBadges />

      {/* 10. INSPIRATION STATION (VERTICAL VIDEO REELS WITH AUTO-CENTERING ELEVATION) */}
      <InspirationStation />

      {/* 11. CURATED STYLING EDITS & SERVICES */}
      <CuratedEdits />

      {/* 12. IN-STORE SHOPPING & APPOINTMENT BANNER */}
      <StoreLocatorBanner />

      {/* 13. LUXURY FOOTER */}
      <Footer />
    </main>
  );
}
