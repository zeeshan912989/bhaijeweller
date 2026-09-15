"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, X, Menu, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { UserRound } from "@/components/animate-ui/icons/user-round";
import { Heart } from "@/components/animate-ui/icons/heart";
import { FEATURED_TBAR_PRODUCTS, BEST_SELLER_PRODUCTS, Product } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import { useCart } from "@/context/CartContext";

interface NavItem {
  id?: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
}

interface NavbarLayoutConfig {
  logoType: "text" | "image";
  logoText: string;
  logoImageUrl: string;
  navFont: "cinzel" | "cormorant" | "playfair" | "inter";
  navItems: NavItem[];
}

const DEFAULT_NAVBAR_CONFIG: NavbarLayoutConfig = {
  logoType: "text",
  logoText: "BHAI",
  logoImageUrl: "",
  navFont: "cinzel",
  navItems: [
    { id: "1", label: "EARRINGS", href: "/collections/earrings", hasDropdown: true },
    { id: "2", label: "NECKLACES", href: "/collections/necklaces", hasDropdown: true },
    { id: "3", label: "BRACELETS", href: "/collections/bracelets", hasDropdown: true },
    { id: "4", label: "RINGS", href: "/collections/rings", hasDropdown: true },
    { id: "5", label: "BEST SELLERS", href: "/collections/best-sellers", hasDropdown: true },
    { id: "6", label: "GIFTS", href: "/collections/gifts", hasDropdown: true },
    { id: "7", label: "SHOP BY", href: "/collections/shop-by", hasDropdown: true },
  ],
};

const FONT_MAP: Record<string, string> = {
  cinzel: "var(--font-cinzel), Georgia, serif",
  cormorant: "var(--font-cormorant), Georgia, serif",
  playfair: "var(--font-playfair), Georgia, serif",
  inter: "var(--font-inter), sans-serif",
};

const NAV_ITEMS: NavItem[] = DEFAULT_NAVBAR_CONFIG.navItems;

interface MegaMenuContent {
  categories: { label: string; href: string; isBold?: boolean; badge?: string }[];
  materials: { name: string; colorHex: string; href: string; karat?: string }[];
  curatedEdits: { title: string; subtitle: string; href: string; tag?: string }[];
  atelierHighlight: {
    title: string;
    quote: string;
    perks: string[];
    href: string;
    buttonText: string;
  };
}

const MEGA_MENU_DATA: Record<string, MegaMenuContent> = {
  EARRINGS: {
    categories: [
      { label: "Shop All Earrings", href: "/collections/earrings", isBold: true },
      { label: "Huggie Hoops", href: "/collections/earrings", badge: "BESTSELLER" },
      { label: "Chunky Statement Hoops", href: "/collections/earrings", badge: "NEW" },
      { label: "Solitaire Stud Earrings", href: "/collections/earrings" },
      { label: "Drop & Dangle Earrings", href: "/collections/earrings" },
      { label: "Ear Cuffs (No Piercing)", href: "/collections/earrings", badge: "POPULAR" },
      { label: "Curated Ear Stacking Sets", href: "/collections/earrings" },
      { label: "Piercing Jewellery Studio", href: "/services/piercing" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/earrings", karat: "Heavy 2.5µm Layer" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/earrings", karat: "Lifetime Purity" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/earrings", karat: "Rhodium Plated" },
      { name: "Rose Gold Edition", colorHex: "#E8A598", href: "/collections/earrings", karat: "18K Rose Glow" },
      { name: "Certified Moissanite & Diamond", colorHex: "#BAE6FD", href: "/collections/earrings", karat: "D-Flawless Clarity" },
    ],
    curatedEdits: [
      { title: "The Everyday Ear Stack", subtitle: "Effortless 24/7 comfort huggies & studs", href: "/collections/earrings", tag: "STYLING EDIT" },
      { title: "Chunky Bold Hoops", subtitle: "Weighty sculptural curves for elevated nights", href: "/collections/earrings", tag: "TRENDING" },
      { title: "Water-Resistant Collection", subtitle: "Shower, sweat, and swim without fading", href: "/collections/earrings", tag: "DURABLE 18K" },
    ],
    atelierHighlight: {
      title: "THE SIGNATURE EAR STACK",
      quote: "Hand-sculpted in Birmingham's Jewellery Quarter from recycled 18K gold vermeil and certified ethical diamonds.",
      perks: ["Complimentary UK Next-Day Delivery", "Luxury Velvet Gift Box Included", "Lifetime Anti-Tarnish Warranty"],
      href: "/collections/earrings",
      buttonText: "Explore Earring Collection",
    },
  },
  NECKLACES: {
    categories: [
      { label: "Shop All Necklaces", href: "/collections/necklaces", isBold: true },
      { label: "T-Bar & Heavy Knot Chains", href: "/collections/necklaces", badge: "ICONIC" },
      { label: "Chunky Curb & Cable Chains", href: "/collections/necklaces" },
      { label: "Pendant & Charm Necklaces", href: "/collections/necklaces", badge: "NEW" },
      { label: "Fine Chokers & Collars", href: "/collections/necklaces" },
      { label: "Multi-Layering Necklace Sets", href: "/collections/necklaces", badge: "SET SAVING" },
      { label: "Heirloom Lockets & Medallions", href: "/collections/necklaces" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/necklaces", karat: "Heavy Gold Core" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/necklaces", karat: "Solid Karat Gold" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/necklaces", karat: "Anti-Tarnish Seal" },
      { name: "Mixed Gold & Silver Links", colorHex: "#E5C158", href: "/collections/necklaces", karat: "Two-Tone Alloy" },
      { name: "Lab-Grown Solitaires", colorHex: "#BAE6FD", href: "/collections/necklaces", karat: "Certified Ethical" },
    ],
    curatedEdits: [
      { title: "T-Bar Heritage Links", subtitle: "Our quintessential British heavyweight chains", href: "/collections/necklaces", tag: "HALLMARK ICON" },
      { title: "3-Tier Layering Guide", subtitle: "Choker, chain, and pendant harmonized", href: "/collections/necklaces", tag: "HOW TO WEAR" },
      { title: "Bespoke Engravable Tags", subtitle: "Initials, dates, and Roman numerals", href: "/collections/necklaces", tag: "CUSTOM" },
    ],
    atelierHighlight: {
      title: "ICONIC T-BAR NECKLACES",
      quote: "Engineered with seamless toggle closures and heavyweight hollow-form links for effortless everyday luxury.",
      perks: ["Free UK Express Tracked Shipping", "Custom Length Extenders Available", "UK Assay Hallmarked"],
      href: "/collections/necklaces",
      buttonText: "Shop All Necklaces",
    },
  },
  BRACELETS: {
    categories: [
      { label: "Shop All Bracelets", href: "/collections/bracelets", isBold: true },
      { label: "Heavy Chain Link Bracelets", href: "/collections/bracelets", badge: "BESTSELLER" },
      { label: "Sparkling Tennis Bracelets", href: "/collections/bracelets", badge: "NEW" },
      { label: "Solid Sculpted Bangles & Cuffs", href: "/collections/bracelets" },
      { label: "Welded Permanent Bracelets", href: "/services/piercing", badge: "IN-STORE" },
      { label: "T-Bar & Charm Bangles", href: "/collections/bracelets" },
      { label: "Delicate Anklets", href: "/collections/bracelets" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/bracelets", karat: "2.5µm Gold Purity" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/bracelets", karat: "Wear 24/7 Forever" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/bracelets", karat: "Rhodium Lustre" },
      { name: "Certified Diamonds", colorHex: "#BAE6FD", href: "/collections/bracelets", karat: "Prong-Set Sparkle" },
    ],
    curatedEdits: [
      { title: "The Permanent Welded Bar", subtitle: "Custom fitted seamlessly onto your wrist", href: "/services/piercing", tag: "EXPERIENCE" },
      { title: "Sculpted Solid Cuffs", subtitle: "High-polished minimalist metal statements", href: "/collections/bracelets", tag: "LUXURY" },
      { title: "Diamond Tennis Stacks", subtitle: "Refined glamour with secure double-lock", href: "/collections/bracelets", tag: "FINE JEWELLERY" },
    ],
    atelierHighlight: {
      title: "SCULPTED WRIST STACKS",
      quote: "Crafted to be stacked or worn solo. Built with precision clasps designed to stay secure through daily life.",
      perks: ["Free 30-Day Resizing & Returns", "Signature Velvet Pouch Included", "Allergy-Safe & Nickel-Free"],
      href: "/collections/bracelets",
      buttonText: "Shop All Bracelets",
    },
  },
  RINGS: {
    categories: [
      { label: "Shop All Rings", href: "/collections/rings", isBold: true },
      { label: "Stacking Ring Bands", href: "/collections/rings", badge: "POPULAR" },
      { label: "Chunky Dome & Statement Rings", href: "/collections/rings", badge: "NEW" },
      { label: "Signet & Pinky Rings", href: "/collections/rings" },
      { label: "Eternity Diamond Bands", href: "/collections/rings", badge: "LUXURY" },
      { label: "Complimentary Ring Sizer", href: "/help/ring-size-guide", badge: "FREE TOOL" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/rings", karat: "Solid Core Vermeil" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/rings", karat: "Solid Karat Gold" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/rings", karat: "Hypoallergenic" },
      { name: "Moissanite & Diamonds", colorHex: "#BAE6FD", href: "/collections/rings", karat: "Hand-Set Pavé" },
    ],
    curatedEdits: [
      { title: "The Signet & Pinky Edit", subtitle: "Hand-engraved initials and crests", href: "/collections/rings", tag: "BESPOKE" },
      { title: "Trio Stacking Rings", subtitle: "Mix mixed metals for an effortless stack", href: "/collections/rings", tag: "STYLING" },
      { title: "Solid Eternity Bands", subtitle: "Seamless diamond ribbons crafted forever", href: "/collections/rings", tag: "TIMELESS" },
    ],
    atelierHighlight: {
      title: "SCULPTED TO PERFECTION",
      quote: "Comfort-fit solid interior contours engineered to sit weightlessly on your fingers with unmatched brilliance.",
      perks: ["Complimentary Ring Size Exchange", "Bespoke Engraving On Request", "UK Hallmarked Authenticity"],
      href: "/collections/rings",
      buttonText: "Shop Ring Collection",
    },
  },
  "BEST SELLERS": {
    categories: [
      { label: "Shop All Best Sellers", href: "/collections/best-sellers", isBold: true },
      { label: "Most Loved Worldwide", href: "/collections/best-sellers", badge: "TOP RATED" },
      { label: "Viral TikTok & Instagram Icons", href: "/collections/best-sellers", badge: "TRENDING" },
      { label: "Restocked Vault Classics", href: "/collections/best-sellers", badge: "RESTOCKED" },
      { label: "Client 5-Star Hall of Fame", href: "/collections/best-sellers" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/best-sellers", karat: "Client Favorite" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/best-sellers", karat: "Lifetime Wear" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/best-sellers", karat: "Pure Radiance" },
    ],
    curatedEdits: [
      { title: "The 10 Iconic Essentials", subtitle: "The core foundations of the BHAI jewellery box", href: "/collections/best-sellers", tag: "FOUNDATIONS" },
      { title: "High-Review Favourites", subtitle: "Over 2,500 verified 5-star customer ratings", href: "/collections/best-sellers", tag: "5-STAR RATED" },
      { title: "Restock Alerts", subtitle: "Limited batches handcrafted weekly", href: "/collections/best-sellers", tag: "LIMITED" },
    ],
    atelierHighlight: {
      title: "THE HALL OF FAME",
      quote: "Discover the timeless pieces our clients reach for every single morning. Designed to never go out of style.",
      perks: ["Free UK Next-Day Delivery Over £100", "Includes Iconic Gift Box Packaging", "30-Day Hassle-Free Returns"],
      href: "/collections/best-sellers",
      buttonText: "Explore Best Sellers",
    },
  },
  GIFTS: {
    categories: [
      { label: "Shop All Gifts", href: "/collections/gifts", isBold: true },
      { label: "Gifts for Her", href: "/collections/gifts", badge: "CURATED" },
      { label: "Birthday & Anniversary Gifts", href: "/collections/gifts" },
      { label: "Gifts Under £100", href: "/collections/gifts", badge: "UNDER £100" },
      { label: "Gifts Under £250", href: "/collections/gifts" },
      { label: "Luxury Gift Cards", href: "/collections/gifts" },
      { label: "Complimentary Gift Wrapping", href: "/collections/gifts", badge: "FREE" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/gifts", karat: "Luxury Gifting" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/gifts", karat: "Milestone Presents" },
      { name: "Sterling Silver", colorHex: "#D1D5DB", href: "/collections/gifts", karat: "Everyday Treasures" },
    ],
    curatedEdits: [
      { title: "Complimentary Gift Wrapping", subtitle: "Signature box, embossed ribbon, and handwritten card", href: "/collections/gifts", tag: "COMPLIMENTARY" },
      { title: "Milestone Jewellery", subtitle: "Commemorate birthdays, graduations and anniversaries", href: "/collections/gifts", tag: "KEEPSAKES" },
      { title: "Instant E-Gift Cards", subtitle: "Delivered straight to their inbox in seconds", href: "/collections/gifts", tag: "INSTANT" },
    ],
    atelierHighlight: {
      title: "THE ART OF GIFTING",
      quote: "Every order arrives ready to gift in our signature embossed presentation box with personalized gift notes.",
      perks: ["Free Handwritten Luxury Card", "Discreet Outer Packaging", "Extended Holiday Return Window"],
      href: "/collections/gifts",
      buttonText: "Explore Gift Guide",
    },
  },
  "SHOP BY": {
    categories: [
      { label: "Shop by Metal & Finish", href: "/collections/shop-by", isBold: true },
      { label: "Shop by Price Range", href: "/collections/shop-by" },
      { label: "Shop New In Arrivals", href: "/collections/shop-by", badge: "NEW" },
      { label: "In-Store Jewellery Styling", href: "/stores" },
      { label: "Welded Bracelet Studio", href: "/services/piercing", badge: "BOOK ONLINE" },
      { label: "Book Showroom Appointment", href: "/stores" },
    ],
    materials: [
      { name: "18K Gold Vermeil", colorHex: "#E5C158", href: "/collections/shop-by", karat: "Gold Vermeil" },
      { name: "14K Solid Gold", colorHex: "#ECC96A", href: "/collections/shop-by", karat: "Solid Gold" },
      { name: "925 Sterling Silver", colorHex: "#D1D5DB", href: "/collections/shop-by", karat: "Sterling Silver" },
      { name: "Rose Gold Edition", colorHex: "#E8A598", href: "/collections/shop-by", karat: "Rose Gold" },
    ],
    curatedEdits: [
      { title: "Visit Our Boutiques", subtitle: "Experience in-person bespoke styling in Birmingham & London", href: "/stores", tag: "STORES" },
      { title: "Permanent Welded Studio", subtitle: "Custom fitted permanent chain welded live", href: "/services/piercing", tag: "IN-STORE" },
      { title: "Piercing & Stacking Bar", subtitle: "Professional ear styling with 14K solid gold", href: "/services/piercing", tag: "STUDIO" },
    ],
    atelierHighlight: {
      title: "VISIT BHAI ATELIER",
      quote: "Book a complimentary one-on-one styling session with our certified jewellery specialists in our boutique showroom.",
      perks: ["1-on-1 Personalized Styling", "Complimentary Champagne & Refreshments", "Exclusive In-Store Pieces"],
      href: "/stores",
      buttonText: "Book In-Store Appointment",
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
  
  // Real-time dynamic navbar configuration (font, logo, dynamic links)
  const [navbarConfig, setNavbarConfig] = useState<NavbarLayoutConfig>(DEFAULT_NAVBAR_CONFIG);

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { itemCount: cartCount, openCart } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close search on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

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

  // Real-time listener for instant banner & navbar changes without page refresh
  useEffect(() => {
    // 1. Initial local load
    try {
      const localBanners = localStorage.getItem("bhai_site_banners_v1");
      if (localBanners) {
        setBannerConfig(JSON.parse(localBanners));
      }
      const localNavbar = localStorage.getItem("bhai_navbar_config_v1");
      if (localNavbar) {
        setNavbarConfig(JSON.parse(localNavbar));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch from Supabase in background
    const fetchSupabaseSettings = async () => {
      try {
        const { data } = await supabase.from("site_settings").select("key, value");
        if (data && Array.isArray(data)) {
          const navSetting = data.find((s) => s.key === "navbar_config");
          if (navSetting?.value) {
            setNavbarConfig(navSetting.value);
            try {
              localStorage.setItem("bhai_navbar_config_v1", JSON.stringify(navSetting.value));
            } catch {}
          }
          const bannerSetting = data.find((s) => s.key === "site_banners");
          if (bannerSetting?.value) {
            setBannerConfig(bannerSetting.value);
            try {
              localStorage.setItem("bhai_site_banners_v1", JSON.stringify(bannerSetting.value));
            } catch {}
          }
        }
      } catch (err) {
        // Fallback to local
      }
    };
    fetchSupabaseSettings();

    // 3. BroadcastChannel for instant zero-latency cross-tab sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("bhai_realtime_layout");
      channel.onmessage = (event) => {
        if (event.data?.type === "BANNERS_UPDATED" && event.data.payload) {
          setBannerConfig(event.data.payload);
        }
        if (event.data?.type === "NAVBAR_CONFIG_UPDATED" && event.data.payload) {
          setNavbarConfig(event.data.payload);
        }
        if (event.data?.type === "LAYOUT_UPDATED") {
          if (event.data.payload?.navbar) setNavbarConfig(event.data.payload.navbar);
          if (event.data.payload?.banners) setBannerConfig(event.data.payload.banners);
        }
      };
    }

    // 4. Storage event listener for standard storage updates
    const handleStorage = (e: StorageEvent | Event) => {
      try {
        const updatedBanners = localStorage.getItem("bhai_site_banners_v1");
        if (updatedBanners) setBannerConfig(JSON.parse(updatedBanners));
        const updatedNavbar = localStorage.getItem("bhai_navbar_config_v1");
        if (updatedNavbar) setNavbarConfig(JSON.parse(updatedNavbar));
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
              gallery: Array.isArray(row.gallery_images) ? row.gallery_images : [],
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

  const activeMegaMenu = hoveredNav
    ? (MEGA_MENU_DATA[hoveredNav] || MEGA_MENU_DATA[hoveredNav.toUpperCase()] || MEGA_MENU_DATA[hoveredNav.trim().toUpperCase()])
    : null;

  const activeMobileSubMenu = mobileSubMenu
    ? (MEGA_MENU_DATA[mobileSubMenu] || MEGA_MENU_DATA[mobileSubMenu.toUpperCase()] || MEGA_MENU_DATA[mobileSubMenu.trim().toUpperCase()])
    : null;

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
              {navbarConfig.logoType === "image" && navbarConfig.logoImageUrl ? (
                <div className="relative h-9 sm:h-11 w-28 sm:w-36 flex items-center">
                  <Image
                    src={navbarConfig.logoImageUrl}
                    alt={navbarConfig.logoText || "Brand Logo"}
                    fill
                    sizes="150px"
                    className="object-contain object-left"
                    priority
                  />
                </div>
              ) : (
                <span
                  style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                  className={`text-2xl lg:text-[28px] font-bold tracking-[0.22em] transition-colors duration-300 ${
                    isHeaderWhite ? "text-neutral-950" : "text-white"
                  }`}
                >
                  {navbarConfig.logoText || "BHAI"}
                </span>
              )}
            </Link>
          </div>

          {/* DESKTOP NAVIGATION LINKS WITH MEGA-MENU TRIGGER */}
          <div 
            style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
            className="hidden xl:flex items-center gap-5 2xl:gap-7 h-full"
          >
            {(navbarConfig.navItems && navbarConfig.navItems.length > 0 ? navbarConfig.navItems : NAV_ITEMS).map((item) => (
              <div
                key={item.id || item.label}
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
            
            {/* SEARCH ICON BUTTON (TRIGGERS TOP SLIDE-DOWN SEARCH BAR) */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }}
              aria-label="Search jewellery"
              className={`p-1.5 rounded-full relative transition-all hover:scale-105 cursor-pointer ${
                isHeaderWhite
                  ? "text-neutral-900 hover:text-black"
                  : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              }`}
              title="Search jewellery"
            >
              <Search className="w-[19px] h-[19px] stroke-[1.6]" />
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
              className={`p-1.5 rounded-full transition-all hover:scale-105 inline-flex items-center justify-center ${
                isHeaderWhite
                  ? "text-neutral-900 hover:text-black"
                  : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              }`}
            >
              <UserRound size={19} animateOnHover />
            </Link>

            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Open Wishlist Drawer"
              className={`p-1.5 rounded-full relative transition-all hover:scale-105 cursor-pointer inline-flex items-center justify-center ${
                isHeaderWhite
                  ? "text-neutral-900 hover:text-black"
                  : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              }`}
            >
              <Heart size={19} animateOnHover />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label="Shopping Bag"
              className={`p-1.5 rounded-full relative transition-all hover:scale-105 cursor-pointer ${
                isHeaderWhite
                  ? "text-neutral-900 hover:text-black"
                  : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
              }`}
            >
              <ShoppingBag className="w-[19px] h-[19px] stroke-[1.6]" />
              {cartCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse font-mono">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* 4. CLEAN & SIMPLE LUXURY DROPDOWN */}
        {hoveredNav && activeMegaMenu && (
          <div
            onMouseEnter={() => handleNavMouseEnter(hoveredNav)}
            onMouseLeave={handleNavMouseLeave}
            className="hidden xl:block absolute top-full left-0 right-0 w-full bg-white text-neutral-900 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border-t border-neutral-100 border-b border-neutral-200 z-40 animate-in fade-in duration-150"
          >
            <div className="w-full px-8 lg:px-12 py-7 max-w-5xl mx-auto">
              <div className="grid grid-cols-3 gap-10 items-start">

                {/* COL 1: CATEGORIES */}
                <div>
                  <p
                    style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                    className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3.5 pb-1 border-b border-neutral-100"
                  >
                    COLLECTIONS
                  </p>
                  <ul className="space-y-2">
                    {activeMegaMenu.categories?.map((cat, i) => (
                      <li key={i}>
                        <Link
                          href={cat.href}
                          onClick={() => setHoveredNav(null)}
                          className={`text-[14.5px] block transition-colors ${
                            cat.isBold
                              ? "font-semibold text-neutral-950 hover:text-[#997b24]"
                              : "text-neutral-600 hover:text-neutral-950"
                          }`}
                          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                        >
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* COL 2: BY MATERIAL */}
                {activeMegaMenu.materials && (
                  <div>
                    <p
                      style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                      className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3.5 pb-1 border-b border-neutral-100"
                    >
                      SHOP BY METAL
                    </p>
                    <ul className="space-y-2.5">
                      {activeMegaMenu.materials.map((mat, i) => (
                        <li key={i}>
                          <Link
                            href={mat.href}
                            onClick={() => setHoveredNav(null)}
                            className="flex items-center gap-2.5 text-[14.5px] text-neutral-600 hover:text-neutral-950 transition-colors group"
                            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0 group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: mat.colorHex }}
                            />
                            <span>{mat.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* COL 3: CURATED EDITS */}
                {activeMegaMenu.curatedEdits && (
                  <div>
                    <p
                      style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                      className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3.5 pb-1 border-b border-neutral-100"
                    >
                      CURATED EDITS
                    </p>
                    <ul className="space-y-3">
                      {activeMegaMenu.curatedEdits.map((edit, idx) => (
                        <li key={idx}>
                          <Link
                            href={edit.href}
                            onClick={() => setHoveredNav(null)}
                            className="group block"
                          >
                            <p
                              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                              className="text-[14.5px] font-medium text-neutral-900 group-hover:text-[#997b24] transition-colors leading-tight"
                            >
                              {edit.title}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                              {edit.subtitle}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                ) : navbarConfig.logoType === "image" && navbarConfig.logoImageUrl ? (
                  <div className="relative h-8 w-28">
                    <Image
                      src={navbarConfig.logoImageUrl}
                      alt={navbarConfig.logoText || "Brand Logo"}
                      fill
                      sizes="120px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span
                    style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                    className="text-xl font-bold tracking-[0.2em] text-neutral-950"
                  >
                    {navbarConfig.logoText || "BHAI"}
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
                  {(navbarConfig.navItems && navbarConfig.navItems.length > 0 ? navbarConfig.navItems : NAV_ITEMS).map((item) => {
                    const upper = item.label.toUpperCase();
                    const hasSub = Boolean(MEGA_MENU_DATA[upper] || MEGA_MENU_DATA[item.label]);
                    return hasSub ? (
                      <button
                        key={item.id || item.label}
                        type="button"
                        onClick={() => {
                          setMobileSubMenu(MEGA_MENU_DATA[upper] ? upper : item.label);
                        }}
                        style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                        className="w-full flex items-center justify-between px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-neutral-950 hover:bg-neutral-50 text-left border-b border-neutral-50 cursor-pointer"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 text-neutral-400 -rotate-90 stroke-[2]" />
                      </button>
                    ) : (
                      <Link
                        key={item.id || item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                        className="w-full flex items-center justify-between px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-neutral-950 hover:bg-neutral-50 text-left border-b border-neutral-50 cursor-pointer"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </Link>
                    );
                  })}

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
                      <UserRound size={18} animateOnHover />
                      <span>Sign In | Register</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsWishlistOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-6 py-3 text-[13.5px] font-medium text-neutral-900 hover:bg-neutral-50 text-left cursor-pointer"
                    >
                      <Heart size={18} animateOnHover />
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
                      {activeMobileSubMenu?.categories?.map((cat, i) => (
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
                      {activeMobileSubMenu?.materials?.map((mat, i) => (
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

                  {/* Curated Styling Edits in Mobile */}
                  {activeMobileSubMenu?.curatedEdits && (
                    <div className="pt-2 border-t border-neutral-100">
                      <p
                        style={{ fontFamily: FONT_MAP[navbarConfig.navFont] || "var(--font-cinzel), serif" }}
                        className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3"
                      >
                        FEATURED
                      </p>
                      <div className="space-y-2">
                        {activeMobileSubMenu.curatedEdits.map((edit, i) => (
                          <Link
                            key={i}
                            href={edit.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileSubMenu(null);
                            }}
                            className="block py-1"
                          >
                            <p 
                              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                              className="text-[15px] font-medium text-neutral-900 leading-tight"
                            >
                              {edit.title}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {edit.subtitle}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
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

      {/* 5. LUXURY TOP SLIDE-DOWN SEARCH OVERLAY (FULL-WIDTH DESKTOP & MOBILE) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-200">
          {/* Dark Backdrop */}
          <div
            onClick={() => setIsSearchOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Top Slide-Down Container */}
          <div className="relative w-full bg-white text-neutral-900 shadow-2xl border-b border-neutral-200 z-10 animate-in slide-in-from-top duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
              
              {/* Search Input Row */}
              <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-neutral-200">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="SEARCH JEWELLERY (NECKLACES, RINGS, EARRINGS, GOLD...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-base sm:text-xl md:text-2xl font-normal text-neutral-950 placeholder:text-neutral-400 outline-none bg-transparent uppercase"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all cursor-pointer border border-neutral-200"
                >
                  <span>Close</span>
                  <span className="hidden sm:inline text-[10px] text-neutral-400 font-mono">ESC</span>
                </button>
              </div>

              {/* Popular Searches Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1">
                  Popular:
                </span>
                {["T-Bar Chains", "Earrings", "Tennis Bracelets", "Rings", "18K Gold Vermeil", "Best Sellers"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      searchInputRef.current?.focus();
                    }}
                    className="text-[11.5px] px-2.5 py-1 bg-[#FAF8F5] hover:bg-neutral-900 hover:text-white border border-neutral-200 text-neutral-700 transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Live Search Results */}
              {searchQuery.trim() && (
                <div className="mt-6 pt-4 border-t border-neutral-100 max-h-[60vh] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                      {searchResults.length > 0
                        ? `Found ${searchResults.length} pieces for "${searchQuery}"`
                        : `No results for "${searchQuery}"`}
                    </span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {searchResults.slice(0, 8).map((prod) => (
                        <Link
                          key={prod.id || prod.slug}
                          href={`/products/${prod.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="group flex flex-col bg-white border border-neutral-200/80 rounded-[5px] overflow-hidden hover:shadow-md transition-all p-2"
                        >
                          <div className="relative aspect-square w-full bg-[#FAF9F6] rounded-[4px] overflow-hidden mb-2">
                            <Image
                              src={prod.images.primary}
                              alt={prod.name}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            />
                            {prod.badge && (
                              <span className="absolute top-1.5 left-1.5 text-[8.5px] font-bold uppercase tracking-wider bg-white/95 px-1.5 py-0.5 border border-neutral-200 text-neutral-800">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <p
                            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                            className="text-[14px] font-semibold text-neutral-950 group-hover:text-[#997b24] truncate"
                          >
                            {prod.name}
                          </p>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xs font-bold text-neutral-900">
                              £{prod.price.toFixed(2)}
                            </span>
                            {prod.originalPrice && (
                              <span className="text-[10px] text-neutral-400 line-through">
                                £{prod.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-neutral-500 text-sm">
                      Try searching for general keywords like &quot;necklace&quot;, &quot;gold&quot;, or &quot;ring&quot;.
                    </div>
                  )}
                </div>
              )}

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
