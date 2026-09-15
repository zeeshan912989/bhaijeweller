import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import BrandStatement from "@/components/home/BrandStatement";
import ProductCarousel from "@/components/home/ProductCarousel";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BrandFeatures from "@/components/home/BrandFeatures";
import TrustBadges from "@/components/home/TrustBadges";
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
        title="More Than Just Jewellery"
        subtitle="Timeless pieces for your most precious moments."
        ctaText="Explore Collection"
        ctaHref="/collections"
        imageSrc="/hero_desktop.jpg"
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

      {/* 5. BRAND FEATURES & SUSTAINABILITY PILLARS (ECO-DESIGNED, COMFORTABLE, LIGHTWEIGHT, COMMITTED) */}
      <BrandFeatures />

      {/* 6. ALGORITHM FEED 2: MOST LOVED & BEST SELLERS (All-Time Popularity Scoring) */}
      <ProductCarousel
        title="Most-Loved Best Sellers"
        subtitle="Iconic All-Time Favorites"
        sort="popularity"
        itemCount={6}
      />

      {/* 7. 4-COLUMN CATEGORY SHOWCASE (Necklaces, Earrings, Bracelets, Rings) */}
      <CategoryShowcase />

      {/* 8. ALGORITHM FEED 3: HIDDEN GEMS (High Wishlist-to-View Ratio) */}
      <ProductCarousel
        title="Hidden Gems & Discoveries"
        subtitle="Exceptional Pieces You Might Miss"
        sort="hidden-gems"
        itemCount={6}
      />

      {/* 9. BRAND TRUST & GUARANTEE PILLARS */}
      <TrustBadges />

      {/* 10. CURATED STYLING EDITS & SERVICES */}
      <CuratedEdits />

      {/* 12. IN-STORE SHOPPING & APPOINTMENT BANNER */}
      <StoreLocatorBanner />

      {/* 13. LUXURY FOOTER */}
      <Footer />
    </main>
  );
}
