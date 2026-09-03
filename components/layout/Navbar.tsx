"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, X, Menu, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { FEATURED_TBAR_PRODUCTS, BEST_SELLER_PRODUCTS, Product } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";
import WishlistDrawer from "@/components/layout/WishlistDrawer";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "EARRINGS", href: "/collections/earrings", hasDropdown: true },
  { label: "NECKLACES", href: "/collections/necklaces", hasDropdown: true },
  { label: "BRACELETS", href: "/collections/bracelets", hasDropdown: true },
  { label: "RINGS", href: "/collections/rings", hasDropdown: true },
  { label: "BEST SELLERS", href: "/collections/best-sellers", hasDropdown: true },
  { label: "GIFTS", href: "/collections/gifts", hasDropdown: true },
  { label: "SHOP BY", href: "/collections/shop-by", hasDropdown: true },
];

interface MegaMenuContent {
  categories: { label: string; href: string; isBold?: boolean }[];
  materials: { name: string; colorHex: string; href: string }[];
  circleStyles: { name: string; image: string; href: string }[];
  featured: {
    title: string;
    subtitle: string;
    image: string;
    href: string;
    buttonText: string;
  };
}

const MEGA_MENU_DATA: Record<string, MegaMenuContent> = {
  EARRINGS: {
    categories: [
      { label: "Shop All Earrings", href: "/collections/earrings", isBold: true },
      { label: "Huggie Hoops", href: "/collections/earrings" },
      { label: "Chunky Statement Hoops", href: "/collections/earrings" },
      { label: "Stud Earrings", href: "/collections/earrings" },
      { label: "Drop & Dangle Earrings", href: "/collections/earrings" },
      { label: "Ear Cuffs (No Piercing)", href: "/collections/earrings" },
      { label: "Ear Stacking Sets", href: "/collections/earrings" },
      { label: "Piercing Jewellery", href: "/services/piercing" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/earrings" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/earrings" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/earrings" },
      { name: "Rose Gold", colorHex: "#E8A598", href: "/collections/earrings" },
      { name: "Certified Moissanite & Diamond", colorHex: "#BAE6FD", href: "/collections/earrings" },
    ],
    circleStyles: [
      { name: "Hoops & Huggies", image: "/ear.jpeg", href: "/collections/earrings" },
      { name: "Studs & Solitaire", image: "/ear ring.jpeg", href: "/collections/earrings" },
      { name: "Ear Cuffs", image: "/shop_img.jpeg", href: "/collections/earrings" },
      { name: "Statement Drops", image: "/hero_section.jpg", href: "/collections/earrings" },
    ],
    featured: {
      title: "THE SIGNATURE EAR STACK",
      subtitle: "Mix, match and stack with our iconic 18K gold and diamond ear pieces.",
      image: "/ear ring.jpeg",
      href: "/collections/earrings",
      buttonText: "Explore Earrings",
    },
  },
  NECKLACES: {
    categories: [
      { label: "Shop All Necklaces", href: "/collections/necklaces", isBold: true },
      { label: "T-Bar & Knot Chains", href: "/collections/necklaces" },
      { label: "Chunky Chain Necklaces", href: "/collections/necklaces" },
      { label: "Pendant & Charm Necklaces", href: "/collections/necklaces" },
      { label: "Fine Chokers & Collars", href: "/collections/necklaces" },
      { label: "Layered Necklace Sets", href: "/collections/necklaces" },
      { label: "Lockets & Medallions", href: "/collections/necklaces" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/necklaces" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/necklaces" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/necklaces" },
      { name: "Mixed Gold & Silver", colorHex: "#E5C158", href: "/collections/necklaces" },
      { name: "Lab Grown Diamonds", colorHex: "#BAE6FD", href: "/collections/necklaces" },
    ],
    circleStyles: [
      { name: "T-Bar Chains", image: "/necklace.jpeg", href: "/collections/necklaces" },
      { name: "Pendants", image: "/red.jpeg", href: "/collections/necklaces" },
      { name: "Layering Sets", image: "/shop_img.jpeg", href: "/collections/necklaces" },
      { name: "Fine Chains", image: "/hero_section.jpg", href: "/collections/necklaces" },
    ],
    featured: {
      title: "ICONIC T-BAR COLLECTION",
      subtitle: "Bold statement chunky links handcrafted in Birmingham's Jewellery Quarter.",
      image: "/necklace.jpeg",
      href: "/collections/necklaces",
      buttonText: "Shop Necklaces",
    },
  },
  BRACELETS: {
    categories: [
      { label: "Shop All Bracelets", href: "/collections/bracelets", isBold: true },
      { label: "Chain Link Bracelets", href: "/collections/bracelets" },
      { label: "Tennis Bracelets", href: "/collections/bracelets" },
      { label: "Solid Bangles & Cuffs", href: "/collections/bracelets" },
      { label: "Welded Permanent Bracelets", href: "/services/piercing" },
      { label: "Charm Bracelets", href: "/collections/bracelets" },
      { label: "Anklets", href: "/collections/bracelets" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/bracelets" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/bracelets" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/bracelets" },
      { name: "Sparkling Diamonds", colorHex: "#BAE6FD", href: "/collections/bracelets" },
    ],
    circleStyles: [
      { name: "Chain Links", image: "/braclet.jpeg", href: "/collections/bracelets" },
      { name: "Tennis Bangles", image: "/braclet2.jpeg", href: "/collections/bracelets" },
      { name: "Solid Cuffs", image: "/braclet3.jpeg", href: "/collections/bracelets" },
      { name: "Welded Bracelets", image: "/shop_img.jpeg", href: "/services/piercing" },
    ],
    featured: {
      title: "LUXURY WRIST STACKS",
      subtitle: "Seamlessly engineered links designed for effortless 24/7 wear.",
      image: "/braclet.jpeg",
      href: "/collections/bracelets",
      buttonText: "Shop Bracelets",
    },
  },
  RINGS: {
    categories: [
      { label: "Shop All Rings", href: "/collections/rings", isBold: true },
      { label: "Stacking Ring Bands", href: "/collections/rings" },
      { label: "Chunky Statement Rings", href: "/collections/rings" },
      { label: "Signet & Pinky Rings", href: "/collections/rings" },
      { label: "Eternity Diamond Bands", href: "/collections/rings" },
      { label: "Ring Sizer & Guides", href: "/help/ring-size-guide" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/rings" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/rings" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/rings" },
      { name: "Certified Diamonds", colorHex: "#BAE6FD", href: "/collections/rings" },
    ],
    circleStyles: [
      { name: "Stacking Bands", image: "/ring.jpeg", href: "/collections/rings" },
      { name: "Statement Domes", image: "/ring2.jpeg", href: "/collections/rings" },
      { name: "Signet Rings", image: "/shop_img.jpeg", href: "/collections/rings" },
      { name: "Diamond Rings", image: "/hero_section.jpg", href: "/collections/rings" },
    ],
    featured: {
      title: "SCULPTED TO PERFECTION",
      subtitle: "Comfort-fit solid gold and sterling silver rings crafted to last a lifetime.",
      image: "/ring.jpeg",
      href: "/collections/rings",
      buttonText: "Shop Rings",
    },
  },
  "BEST SELLERS": {
    categories: [
      { label: "Shop All Best Sellers", href: "/collections/best-sellers", isBold: true },
      { label: "Most Loved Jewellery", href: "/collections/best-sellers" },
      { label: "Trending on TikTok & Instagram", href: "/collections/best-sellers" },
      { label: "Restocked Icons", href: "/collections/best-sellers" },
      { label: "Customer Top 5-Star Rated", href: "/collections/best-sellers" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/best-sellers" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/best-sellers" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/best-sellers" },
    ],
    circleStyles: [
      { name: "T-Bar Chains", image: "/necklace.jpeg", href: "/collections/necklaces" },
      { name: "Knot Hoops", image: "/ear ring.jpeg", href: "/collections/earrings" },
      { name: "Link Bracelets", image: "/braclet.jpeg", href: "/collections/bracelets" },
      { name: "Dome Rings", image: "/ring.jpeg", href: "/collections/rings" },
    ],
    featured: {
      title: "THE HALL OF FAME",
      subtitle: "Discover the iconic luxury pieces our clients wear every single day.",
      image: "/hero_section.jpg",
      href: "/collections/best-sellers",
      buttonText: "Shop Best Sellers",
    },
  },
  GIFTS: {
    categories: [
      { label: "Shop All Gifts", href: "/collections/gifts", isBold: true },
      { label: "Gifts for Her", href: "/collections/gifts" },
      { label: "Birthday & Milestone Gifts", href: "/collections/gifts" },
      { label: "Gifts Under £100", href: "/collections/gifts" },
      { label: "Gifts Under £250", href: "/collections/gifts" },
      { label: "Luxury Gift Cards", href: "/collections/gifts" },
      { label: "Complimentary Gift Wrapping", href: "/collections/gifts" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/gifts" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/gifts" },
      { name: "Sterling Silver", colorHex: "#D1D5DB", href: "/collections/gifts" },
    ],
    circleStyles: [
      { name: "Gift Sets", image: "/red.jpeg", href: "/collections/gifts" },
      { name: "Earring Gifts", image: "/ear.jpeg", href: "/collections/gifts" },
      { name: "Ring Presents", image: "/ring2.jpeg", href: "/collections/gifts" },
      { name: "Luxury Packaging", image: "/braclet3.jpeg", href: "/collections/gifts" },
    ],
    featured: {
      title: "THE ART OF GIFTING",
      subtitle: "Unbox unforgettable moments with signature packaging and custom cards.",
      image: "/shop_img.jpeg",
      href: "/collections/gifts",
      buttonText: "Explore Gifts",
    },
  },
  "SHOP BY": {
    categories: [
      { label: "Shop by Metal", href: "/collections/shop-by", isBold: true },
      { label: "Shop by Price Range", href: "/collections/shop-by" },
      { label: "Shop New In Arrivals", href: "/collections/shop-by" },
      { label: "In-Store Jewellery Styling", href: "/stores" },
      { label: "Welded Bracelet Studio", href: "/services/piercing" },
      { label: "Book Store Appointment", href: "/stores" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/shop-by" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/shop-by" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/shop-by" },
      { name: "Rose Gold", colorHex: "#E8A598", href: "/collections/shop-by" },
    ],
    circleStyles: [
      { name: "Store Experience", image: "/shop_img.jpeg", href: "/stores" },
      { name: "New In", image: "/hero_section.jpg", href: "/collections/shop-by" },
      { name: "Fine Chains", image: "/necklace.jpeg", href: "/collections/necklaces" },
      { name: "Piercing Studio", image: "/ear ring.jpeg", href: "/services/piercing" },
    ],
    featured: {
      title: "VISIT BHAI SHOWROOM",
      subtitle: "Meet our jewellery specialists in Birmingham and try our iconic pieces in person.",
      image: "/shop_img.jpeg",
      href: "/stores",
      buttonText: "Book Appointment",
    },
  },
};

const POPULAR_SEARCHES = ["T-Bar", "Necklaces", "Earrings", "Bracelets", "Rings", "18K Gold"];

const ALL_SEARCH_PRODUCTS: Product[] = [...FEATURED_TBAR_PRODUCTS, ...BEST_SELLER_PRODUCTS].filter(
  (item, index, self) => index === self.findIndex((t) => t.slug === item.slug)
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPromoBar, setShowPromoBar] = useState(true);
  
  // Real-time dynamic banner configuration
  const [bannerConfig, setBannerConfig] = useState({
    topBannerText: "SIGN UP FOR 10% OFF YOUR FIRST ORDER",
    topBannerEnabled: true,
    secondaryBannerText: "FREE UK DELIVERY ON ORDERS OVER £100",
    secondaryBannerBg: "#3D1E08",
    secondaryBannerEnabled: true,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [desktopSearchFocused, setDesktopSearchFocused] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync real-time wishlist items count and open drawer event
  useEffect(() => {
    const updateWishlist = () => {
      try {
        const stored = localStorage.getItem("bhai_wishlist_items_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlistCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          setWishlistCount(0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateWishlist();
    window.addEventListener("bhai_wishlist_updated", updateWishlist);
    window.addEventListener("storage", updateWishlist);

    const handleOpenDrawer = () => setIsWishlistOpen(true);
    window.addEventListener("bhai_open_wishlist", handleOpenDrawer);

    return () => {
      window.removeEventListener("bhai_wishlist_updated", updateWishlist);
      window.removeEventListener("storage", updateWishlist);
      window.removeEventListener("bhai_open_wishlist", handleOpenDrawer);
    };
  }, []);

  // Real-time listener for instant banner changes without page refresh
  useEffect(() => {
    // 1. Initial local load
    try {
      const local = localStorage.getItem("bhai_site_banners_v1");
      if (local) {
        setBannerConfig(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. BroadcastChannel for instant zero-latency cross-tab sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("bhai_realtime_layout");
      channel.onmessage = (event) => {
        if (event.data?.type === "BANNERS_UPDATED" && event.data.payload) {
          setBannerConfig(event.data.payload);
        }
      };
    }

    // 3. Storage event listener for standard storage updates
    const handleStorage = (e: StorageEvent | Event) => {
      try {
        const updated = localStorage.getItem("bhai_site_banners_v1");
        if (updated) {
          setBannerConfig(JSON.parse(updated));
        }
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isHeaderWhite = !isHomePage || isScrolled || Boolean(hoveredNav);

  const handleNavMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredNav(label);
  };

  const handleNavMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 120);
  };

  // Live products loaded from Supabase database
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  // Fetch live store products from Supabase for real-time search
  useEffect(() => {
    async function loadProductsForSearch() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((row) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            category: row.category,
            price: Number(row.price),
            originalPrice: row.original_price ? Number(row.original_price) : undefined,
            badge: row.badge || undefined,
            images: {
              primary: row.primary_image,
              hover: row.hover_image || undefined,
            },
            metals: row.metals || [
              { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
              { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" }
            ],
            inStock: Boolean(row.in_stock),
          }));
          setLiveProducts(mapped);
        }
      } catch (err) {
        console.warn("Live search products error:", err);
      }
    }

    loadProductsForSearch();
  }, []);

  // Filtered live results across all fields
  const searchResults = searchQuery.trim()
    ? liveProducts.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q)) ||
          p.metals.some((m) => m.name.toLowerCase().includes(q))
        );
      })
    : [];

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [mobileSearchOpen]);

  // Click outside listener for desktop search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setDesktopSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      onMouseLeave={handleNavMouseLeave}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* 1. TOP PROMO BAR (DISMISSIBLE WHITE BAR - Smoothly hides on scroll) */}
      {bannerConfig.topBannerEnabled && showPromoBar && (
        <div
          style={{ fontFamily: "var(--font-neue-haas)" }}
          className={`bg-white text-neutral-950 border-neutral-100 text-center relative transition-all duration-300 overflow-hidden ${
            isScrolled
              ? "max-h-0 py-0 opacity-0 border-b-0 pointer-events-none"
              : "max-h-12 py-1.5 px-4 sm:px-8 opacity-100 border-b"
          }`}
        >
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-black">
            {bannerConfig.topBannerText}
          </p>
          <button
            onClick={() => setShowPromoBar(false)}
            aria-label="Close promotion banner"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>
        </div>
      )}

      {/* 2. SECONDARY UTILITY BAR (RICH BROWN / BRONZE / DYNAMIC) */}
      {bannerConfig.secondaryBannerEnabled && (
        <div 
          style={{ 
            fontFamily: "var(--font-neue-haas)",
            backgroundColor: bannerConfig.secondaryBannerBg || "#3D1E08"
          }}
          className="text-white py-1.5 px-4 sm:px-8 lg:px-12 text-[11px] tracking-[0.14em] transition-colors duration-300"
        >
          <div className="w-full flex items-center justify-between">
            <div className="hidden lg:block w-48"></div>
            <p className="font-extrabold uppercase text-center flex-1 tracking-[0.16em] text-white">
              {bannerConfig.secondaryBannerText}
            </p>
            <div className="hidden lg:flex items-center gap-6 justify-end w-48 text-[11px] text-neutral-200">
              <Link href="/services/piercing" className="hover:text-white transition-colors whitespace-nowrap">Piercing & Welding</Link>
              <Link href="/stores" className="hover:text-white transition-colors whitespace-nowrap">Our Stores</Link>
              <Link href="/blog" className="hover:text-white transition-colors whitespace-nowrap">Blog</Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN NAVBAR (TURNS WHITE ON SCROLL OR ON MEGA MENU HOVER) */}
      <nav
        className={`nav-transition w-full relative transition-colors duration-300 ${
          isHeaderWhite
            ? "bg-white text-neutral-900 shadow-[0_4px_25px_rgba(0,0,0,0.08)] border-b border-neutral-100"
            : "bg-gradient-to-b from-black/50 via-black/25 to-transparent text-white"
        }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14 h-16 lg:h-[72px] flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:opacity-80 transition-opacity"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="group flex items-center focus:outline-none">
              <span
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className={`text-2xl lg:text-[28px] font-bold tracking-[0.22em] transition-colors duration-300 ${
                  isHeaderWhite ? "text-neutral-950" : "text-white"
                }`}
              >
                BHAI
              </span>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION LINKS WITH MEGA-MENU TRIGGER */}
          <div 
            style={{ fontFamily: "var(--font-neue-haas)" }}
            className="hidden xl:flex items-center gap-5 2xl:gap-7 h-full"
          >
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                onMouseEnter={() => handleNavMouseEnter(item.label)}
                className="h-full flex items-center"
              >
                <Link
                  href={item.href}
                  className={`relative text-[13px] 2xl:text-[13.5px] font-bold tracking-[0.14em] uppercase transition-all duration-200 py-6 group ${
                    isHeaderWhite
                      ? hoveredNav === item.label
                        ? "text-black font-extrabold"
                        : "text-neutral-900 hover:text-black"
                      : "text-white hover:text-neutral-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-3 left-0 h-[2px] transition-all duration-300 ${
                      hoveredNav === item.label ? "w-full bg-neutral-950" : "w-0 group-hover:w-full"
                    } ${isHeaderWhite ? "bg-neutral-950" : "bg-white"}`}
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* RIGHT ICONS & UTILITIES */}
          <div className="flex items-center gap-3 sm:gap-4 xl:gap-5 justify-end">
            
            {/* SQUARE DESKTOP SEARCH BAR */}
            <div ref={desktopSearchRef} className="relative hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="SEARCH JEWELLERY..."
                  value={searchQuery}
                  onFocus={() => setDesktopSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-44 lg:w-56 focus:w-80 text-[11px] font-bold tracking-wider pl-3.5 pr-8 py-2 rounded-none transition-all duration-300 outline-none uppercase ${
                    isHeaderWhite
                      ? "bg-neutral-100 text-neutral-950 border border-neutral-300 focus:border-black focus:bg-white placeholder:text-neutral-400"
                      : "bg-white/20 text-white border border-white/40 focus:border-white focus:bg-black/90 placeholder:text-white/70 backdrop-blur-sm"
                  }`}
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Search
                    className={`w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                      isHeaderWhite ? "text-neutral-700" : "text-white"
                    }`}
                  />
                )}
              </div>

              {/* SQUARE SEARCH DROPDOWN OVERLAY */}
              {desktopSearchFocused && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-none shadow-2xl border border-neutral-300 overflow-hidden z-50 text-neutral-900 animate-in fade-in duration-200">
                  
                  {/* Dropdown Header */}
                  <div className="p-3.5 bg-neutral-900 text-white flex items-center justify-between text-xs border-b border-neutral-800">
                    <span className="font-bold tracking-widest uppercase text-[10.5px] text-[#d4af37] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{searchQuery.trim() ? `${searchResults.length} Pieces Found` : "Trending Searches"}</span>
                    </span>
                    <button
                      onClick={() => setDesktopSearchFocused(false)}
                      className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* If Search Query is Empty -> Show Trending Suggestions */}
                  {!searchQuery.trim() ? (
                    <div className="p-4 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        Popular Suggestions:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Earrings", "Gold Huggies", "Necklaces", "T-Bar Chains", "Rings", "Bracelets"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-3 py-1 bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-800 text-xs font-semibold rounded-none border border-neutral-200 transition-all cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Search Results List */
                    <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                      {searchResults.length > 0 ? (
                        <>
                          {searchResults.map((item) => (
                            <Link
                              key={item.id || item.slug}
                              href={`/products/${item.slug}`}
                              onClick={() => {
                                setDesktopSearchFocused(false);
                                setSearchQuery("");
                              }}
                              className="p-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors group"
                            >
                              <div className="w-12 h-12 relative rounded-none overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                                <Image
                                  src={item.images.primary}
                                  alt={item.name}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                {item.badge && (
                                  <span className="text-[9px] font-extrabold text-[#997b24] uppercase tracking-wider block">
                                    {item.badge}
                                  </span>
                                )}
                                <p className="text-xs font-bold text-neutral-950 group-hover:text-[#997b24] transition-colors truncate uppercase">
                                  {item.name}
                                </p>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                  <span className="text-xs font-bold text-neutral-950 font-mono">
                                    £{item.price.toFixed(2)}
                                  </span>
                                  {item.originalPrice && (
                                    <span className="text-[10px] text-neutral-400 line-through font-mono">
                                      £{item.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 group-hover:text-black transition-all flex-shrink-0" />
                            </Link>
                          ))}

                          <div className="p-2.5 bg-neutral-50 text-center border-t border-neutral-200">
                            <Link
                              href={`/collections/earrings`}
                              onClick={() => setDesktopSearchFocused(false)}
                              className="text-[10.5px] font-bold uppercase tracking-widest text-neutral-900 hover:text-[#997b24] transition-colors"
                            >
                              View All Matching Collections →
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="p-8 text-center space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                            No Pieces Found for &ldquo;{searchQuery}&rdquo;
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            Try searching for &quot;Gold&quot;, &quot;Earrings&quot;, &quot;Necklace&quot; or &quot;Ring&quot;.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-1.5 rounded-full hover:opacity-80 transition-opacity"
              aria-label="Search jewellery"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              aria-label="Select currency (UK GBP)"
              className={`flex items-center gap-1 px-1.5 py-1 rounded-md text-xs font-medium transition-all ${
                isHeaderWhite ? "hover:bg-neutral-100 text-neutral-800" : "hover:bg-white/10 text-white"
              }`}
              title="United Kingdom (£ GBP)"
            >
              <span className="text-base leading-none">🇬🇧</span>
            </button>

            <Link
              href="/account"
              aria-label="My Account"
              className={`p-1.5 rounded-full transition-all hover:scale-105 ${
                isHeaderWhite
                  ? "text-neutral-900 hover:text-black"
                  : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              }`}
            >
              <User className="w-[19px] h-[19px] stroke-[1.6]" />
            </Link>

            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Open Wishlist Drawer"
              className={`p-1.5 rounded-full relative transition-all hover:scale-105 cursor-pointer ${
                isHeaderWhite
                  ? "text-neutral-900 hover:text-black"
                  : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              }`}
            >
              <Heart className="w-[19px] h-[19px] stroke-[1.6]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className={`p-1.5 rounded-full relative transition-all hover:scale-105 ${
                isHeaderWhite
                  ? "text-neutral-900 hover:text-black"
                  : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              }`}
            >
              <ShoppingBag className="w-[19px] h-[19px] stroke-[1.6]" />
              {cartCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {/* 4. FULL-WIDTH LUXURY MEGA MENU DROPDOWN */}
        {hoveredNav && MEGA_MENU_DATA[hoveredNav] && (
          <div
            onMouseEnter={() => handleNavMouseEnter(hoveredNav)}
            onMouseLeave={handleNavMouseLeave}
            className="hidden xl:block absolute top-full left-0 right-0 w-full bg-white text-neutral-900 shadow-[0_20px_45px_rgba(0,0,0,0.12)] border-t border-neutral-100 border-b border-neutral-200 z-40 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="w-full px-8 lg:px-14 py-9 max-w-[1360px] mx-auto">
              <div className="grid grid-cols-12 gap-10 items-start">

                {/* COL 1: CATEGORIES LIST (4 COLS) */}
                <div className="col-span-4 border-r border-neutral-100 pr-10">
                  <p
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                    className="text-xs font-bold tracking-[0.24em] uppercase text-neutral-950 mb-4 pb-2 border-b border-neutral-100"
                  >
                    CATEGORIES
                  </p>
                  <ul className="space-y-2">
                    {MEGA_MENU_DATA[hoveredNav].categories.map((cat, i) => (
                      <li key={i}>
                        <Link
                          href={cat.href}
                          onClick={() => setHoveredNav(null)}
                          style={{ fontFamily: "var(--font-cormorant), serif" }}
                          className={`transition-all block py-0.5 ${
                            cat.isBold
                              ? "text-[18px] font-bold text-neutral-950 hover:text-[#d4af37] underline decoration-neutral-300 underline-offset-4"
                              : "text-[16.5px] font-medium text-neutral-800 hover:text-black hover:translate-x-1.5 transition-transform inline-block"
                          }`}
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* COL 2: SHOP BY MATERIAL (4 COLS) */}
                <div className="col-span-4 border-r border-neutral-100 pr-10">
                  <p
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                    className="text-xs font-bold tracking-[0.24em] uppercase text-neutral-950 mb-4 pb-2 border-b border-neutral-100"
                  >
                    SHOP BY MATERIAL
                  </p>
                  <ul className="space-y-2.5">
                    {MEGA_MENU_DATA[hoveredNav].materials.map((mat, i) => (
                      <li key={i}>
                        <Link
                          href={mat.href}
                          onClick={() => setHoveredNav(null)}
                          className="flex items-center gap-3 group py-0.5"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-neutral-300 shadow-sm flex-shrink-0 group-hover:scale-110 group-hover:border-black transition-all"
                            style={{ backgroundColor: mat.colorHex }}
                          />
                          <span
                            style={{ fontFamily: "var(--font-cormorant), serif" }}
                            className="text-[17px] font-semibold text-neutral-850 group-hover:text-black group-hover:translate-x-1 transition-transform"
                          >
                            {mat.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <p
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-neutral-950 mb-1"
                    >
                      CRAFTSMANSHIP
                    </p>
                    <p
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                      className="text-[14.5px] italic text-neutral-600 leading-relaxed"
                    >
                      Certified solid metals and responsibly sourced diamonds built for everyday luxury.
                    </p>
                  </div>
                </div>

                {/* COL 3: FEATURED STYLES (SMALL CIRCULAR IMAGES ONLY) (4 COLS) */}
                <div className="col-span-4">
                  <p
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                    className="text-xs font-bold tracking-[0.24em] uppercase text-neutral-950 mb-4 pb-2 border-b border-neutral-100"
                  >
                    FEATURED STYLES
                  </p>
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {MEGA_MENU_DATA[hoveredNav].circleStyles.map((style, i) => (
                      <Link
                        key={i}
                        href={style.href}
                        onClick={() => setHoveredNav(null)}
                        className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        {/* SMALL CIRCLE IMAGE */}
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-200 group-hover:border-black shadow-sm relative transition-all duration-300">
                          <Image
                            src={style.image}
                            alt={style.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <span
                          style={{ fontFamily: "var(--font-cinzel), serif" }}
                          className="text-[10.5px] font-bold tracking-[0.12em] uppercase text-neutral-900 group-hover:text-black mt-2 leading-tight"
                        >
                          {style.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                      className="text-[15px] italic text-neutral-600"
                    >
                      Complimentary UK shipping over £100
                    </span>
                    <Link
                      href={MEGA_MENU_DATA[hoveredNav].categories[0].href}
                      onClick={() => setHoveredNav(null)}
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      className="text-xs font-bold tracking-[0.16em] uppercase text-neutral-950 hover:text-[#d4af37] underline underline-offset-4"
                    >
                      View All →
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 4. FULL-SCREEN SQUARE MOBILE SEARCH MODAL */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
          <div className="p-4 border-b border-neutral-300 flex items-center gap-3 bg-white">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="SEARCH RINGS, NECKLACES, EARRINGS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 text-xs font-bold text-neutral-900 pl-10 pr-9 py-3 rounded-none border border-neutral-300 outline-none focus:border-black uppercase tracking-wider"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-black px-2 py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <p className="text-[10.5px] font-bold tracking-widest uppercase text-neutral-400 mb-2.5">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Earrings", "Gold Huggies", "Necklaces", "T-Bar Chains", "Rings", "Bracelets"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-950 hover:text-white rounded-none border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {searchQuery.trim() && (
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-neutral-200 pb-2">
                  <p className="text-xs font-bold text-neutral-950 uppercase tracking-widest">
                    Matching Pieces ({searchResults.length})
                  </p>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-2.5">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id || item.slug}
                        href={`/products/${item.slug}`}
                        onClick={() => {
                          setMobileSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3.5 p-3 bg-white hover:bg-neutral-50 rounded-none border border-neutral-200 transition-colors"
                      >
                        <div className="w-14 h-14 relative rounded-none overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                          <Image
                            src={item.images.primary}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {item.badge && (
                            <span className="text-[9px] font-bold text-[#997b24] uppercase tracking-wider block">
                              {item.badge}
                            </span>
                          )}
                          <p className="text-xs font-bold text-neutral-950 uppercase truncate">
                            {item.name}
                          </p>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xs font-extrabold text-neutral-950 font-mono">
                              £{item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-[10px] text-neutral-400 line-through font-mono">
                                £{item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0 mr-1" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-neutral-500">
                    No jewellery found for &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;Necklace&rdquo; or &ldquo;Ring&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MOBILE DRAWER NAVIGATION WITH DRILL-DOWN SUB-MENUS */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileSubMenu(null);
            }}
          />
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white text-neutral-900 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Top Header */}
              <div className="p-4 px-5 flex items-center justify-between border-b border-neutral-100">
                {mobileSubMenu ? (
                  <button
                    onClick={() => setMobileSubMenu(null)}
                    className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-neutral-900 hover:text-black"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90 stroke-[2.5]" />
                    <span>ALL</span>
                  </button>
                ) : (
                  <span
                    style={{ fontFamily: "var(--font-cinzel), serif" }}
                    className="text-xl font-bold tracking-[0.2em] text-neutral-950"
                  >
                    BHAI
                  </span>
                )}
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileSubMenu(null);
                  }}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar in Mobile Drawer */}
              {!mobileSubMenu && (
                <div className="p-4 border-b border-neutral-100">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileSearchOpen(true);
                    }}
                    className="w-full bg-neutral-100 text-xs px-4 py-2.5 rounded-full flex items-center justify-between text-neutral-500 hover:text-neutral-900"
                  >
                    <span>Search jewellery...</span>
                    <Search className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              )}

              {/* MAIN MENU LIST (When no sub-menu is active) */}
              {!mobileSubMenu ? (
                <div className="py-2">
                  {/* Primary Jewellery Categories */}
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (MEGA_MENU_DATA[item.label]) {
                          setMobileSubMenu(item.label);
                        } else {
                          setMobileMenuOpen(false);
                        }
                      }}
                      className="w-full flex items-center justify-between px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-neutral-950 hover:bg-neutral-50 text-left border-b border-neutral-50 cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 text-neutral-400 -rotate-90 stroke-[2]" />
                    </button>
                  ))}

                  {/* Secondary Curated Links matching reference */}
                  <div className="pt-2">
                    <Link
                      href="/collections/necklaces"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-3 text-[13.5px] font-bold tracking-[0.12em] text-neutral-900 hover:bg-neutral-50"
                    >
                      LUCY WILLIAMS
                    </Link>
                    <Link
                      href="/collections/necklaces"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-3 text-[13.5px] font-bold tracking-[0.12em] text-neutral-900 hover:bg-neutral-50"
                    >
                      T-BAR JEWELLERY
                    </Link>
                    <Link
                      href="/services/piercing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-3 text-[13.5px] font-medium text-neutral-800 hover:bg-neutral-50"
                    >
                      Piercing & Welding
                    </Link>
                    <Link
                      href="/stores"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-3 text-[13.5px] font-medium text-neutral-800 hover:bg-neutral-50"
                    >
                      Our Stores
                    </Link>
                    <Link
                      href="/blog"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-3 text-[13.5px] font-medium text-neutral-800 hover:bg-neutral-50"
                    >
                      Blog
                    </Link>
                  </div>

                  {/* Divider Line */}
                  <div className="px-6 py-2">
                    <hr className="border-neutral-200" />
                  </div>

                  {/* User Account & Wishlist Links (Exactly as in screenshot) */}
                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 text-[13.5px] font-medium text-neutral-900 hover:bg-neutral-50"
                    >
                      <User className="w-[18px] h-[18px] stroke-[1.6]" />
                      <span>Sign In | Register</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsWishlistOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-6 py-3 text-[13.5px] font-medium text-neutral-900 hover:bg-neutral-50 text-left cursor-pointer"
                    >
                      <Heart className="w-[18px] h-[18px] stroke-[1.6]" />
                      <span>My Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="ml-auto bg-[#d4af37] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* DRILL-DOWN SUB-MENU (When e.g. EARRINGS is clicked) */
                <div className="p-5 space-y-6 animate-in fade-in duration-200">
                  {/* Category Title */}
                  <div className="border-b border-neutral-200 pb-3">
                    <h3
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      className="text-base font-extrabold tracking-[0.18em] uppercase text-neutral-950"
                    >
                      {mobileSubMenu}
                    </h3>
                  </div>

                  {/* Sub-Category Links */}
                  <div>
                    <p
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3"
                    >
                      CATEGORIES
                    </p>
                    <ul className="space-y-2.5">
                      {MEGA_MENU_DATA[mobileSubMenu]?.categories.map((cat, i) => (
                        <li key={i}>
                          <Link
                            href={cat.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileSubMenu(null);
                            }}
                            style={{ fontFamily: "var(--font-cormorant), serif" }}
                            className={`block py-1 ${
                              cat.isBold
                                ? "text-[18px] font-bold text-neutral-950 underline decoration-neutral-300 underline-offset-4"
                                : "text-[16.5px] font-medium text-neutral-800 hover:text-black"
                            }`}
                          >
                            {cat.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Shop by Material in Mobile */}
                  <div className="pt-2 border-t border-neutral-100">
                    <p
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3"
                    >
                      SHOP BY MATERIAL
                    </p>
                    <ul className="space-y-2.5">
                      {MEGA_MENU_DATA[mobileSubMenu]?.materials.map((mat, i) => (
                        <li key={i}>
                          <Link
                            href={mat.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileSubMenu(null);
                            }}
                            className="flex items-center gap-2.5 py-1"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-sm"
                              style={{ backgroundColor: mat.colorHex }}
                            />
                            <span
                              style={{ fontFamily: "var(--font-cormorant), serif" }}
                              className="text-[16px] font-medium text-neutral-800"
                            >
                              {mat.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Featured Style Circular Thumbnails */}
                  <div className="pt-2 border-t border-neutral-100">
                    <p
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3"
                    >
                      FEATURED STYLES
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {MEGA_MENU_DATA[mobileSubMenu]?.circleStyles.map((style, i) => (
                        <Link
                          key={i}
                          href={style.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileSubMenu(null);
                          }}
                          className="flex items-center gap-2.5 p-2 bg-[#FAF7F2] rounded-xl border border-neutral-200/70"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-300 relative flex-shrink-0">
                            <Image
                              src={style.image}
                              alt={style.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span
                            style={{ fontFamily: "var(--font-cinzel), serif" }}
                            className="text-[10px] font-bold tracking-wider uppercase text-neutral-900 truncate"
                          >
                            {style.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Currency Selector Bar (Matching screenshot) */}
            <div className="p-4 px-6 bg-neutral-50 border-t border-neutral-200">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">🇬🇧</span>
                  <span>United Kingdom (GBP £)</span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-600 stroke-[2]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. LUXURY WISHLIST LEFT SLIDE-OUT DRAWER */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </header>
  );
}
