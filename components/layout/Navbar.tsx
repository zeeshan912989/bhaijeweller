"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, X, Menu, ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "EARRINGS", href: "/collections/earrings" },
  { label: "NECKLACES", href: "/collections/necklaces" },
  { label: "BRACELETS", href: "/collections/bracelets" },
  { label: "RINGS", href: "/collections/rings" },
  { label: "BEST SELLERS", href: "/collections/best-sellers" },
  { label: "GIFTS", href: "/collections/gifts" },
  { label: "SHOP BY", href: "/collections/shop-by", hasDropdown: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPromoBar, setShowPromoBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Scroll listener to detect when page is scrolled down
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* 1. TOP PROMO BAR (DISMISSIBLE WHITE BAR) */}
      {showPromoBar && (
        <div className="bg-white text-neutral-950 border-b border-neutral-100 py-1.5 px-4 sm:px-8 text-center relative transition-all duration-300">
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-black">
            SIGN UP FOR 10% OFF YOUR FIRST ORDER
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

      {/* 2. SECONDARY UTILITY BAR (RICH BROWN / BRONZE) */}
      <div className="bg-[#3D1E08] text-white py-1.5 px-4 sm:px-8 lg:px-12 text-[11px] tracking-[0.14em]">
        <div className="w-full flex items-center justify-between">
          {/* Left spacer for perfect center alignment */}
          <div className="hidden lg:block w-48"></div>

          {/* Center Announcement */}
          <p className="font-extrabold uppercase text-center flex-1 tracking-[0.16em] text-white">
            FREE UK DELIVERY ON ORDERS OVER £100
          </p>

          {/* Right Utility Links (Shifted to right) */}
          <div className="hidden lg:flex items-center gap-6 justify-end w-48 text-[11px] text-neutral-200">
            <Link
              href="/services/piercing"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Piercing & Welding
            </Link>
            <Link
              href="/stores"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Our Stores
            </Link>
            <Link
              href="/blog"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVBAR (TRANSPARENT -> WHITE ON SCROLL) */}
      <nav
        className={`nav-transition w-full ${isScrolled
            ? "bg-white/98 text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-neutral-100"
            : "bg-gradient-to-b from-black/40 via-black/20 to-transparent text-white"
          }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14 h-16 lg:h-[72px] flex items-center justify-between gap-4">

          {/* LEFT: Mobile Menu Button & Brand Logo (Shifted to the left edge) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:opacity-80 transition-opacity"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* BRAND LOGO: BHAI */}
            <Link
              href="/"
              className="group flex items-center focus:outline-none"
            >
              <span
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className={`text-2xl lg:text-[28px] font-bold tracking-[0.22em] transition-colors duration-300 ${isScrolled ? "text-neutral-950" : "text-white"
                  }`}
              >
                BHAI
              </span>
            </Link>
          </div>

          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          <div className="hidden xl:flex items-center gap-5 2xl:gap-7">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-[11px] font-medium tracking-[0.16em] uppercase transition-all duration-200 py-2 group ${isScrolled
                    ? "text-neutral-900 hover:text-black"
                    : "text-white hover:text-neutral-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                  }`}
              >
                <span className="flex items-center gap-1">
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
                  )}
                </span>
                {/* Micro-animation underline */}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-neutral-950" : "bg-white"
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* RIGHT: SEARCH & UTILITY ICONS (Shifted nicely to the right edge) */}
          <div className="flex items-center gap-3 sm:gap-4 xl:gap-5 justify-end">

            {/* Search Pill Input */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-36 lg:w-44 focus:w-56 text-xs pl-3.5 pr-8 py-1.5 rounded-full transition-all duration-300 outline-none ${isScrolled
                    ? "bg-neutral-100/90 text-neutral-900 border border-neutral-300/80 focus:border-neutral-900 focus:bg-white placeholder-neutral-500"
                    : "bg-white/15 text-white border border-white/35 focus:border-white focus:bg-black/30 placeholder-white/80 backdrop-blur-sm"
                  }`}
              />
              <Search
                className={`w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isScrolled ? "text-neutral-600" : "text-white"
                  }`}
              />
            </div>

            {/* Mobile Search Icon Button */}
            <button
              className="md:hidden p-1.5 rounded-full hover:opacity-80 transition-opacity"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* UK Flag / Currency Selector */}
            <button
              aria-label="Select currency (UK GBP)"
              className={`flex items-center gap-1 px-1.5 py-1 rounded-md text-xs font-medium transition-all ${isScrolled ? "hover:bg-neutral-100 text-neutral-800" : "hover:bg-white/10 text-white"
                }`}
              title="United Kingdom (£ GBP)"
            >
              <span className="text-base leading-none">🇬🇧</span>
            </button>

            {/* Account Icon */}
            <Link
              href="/account"
              aria-label="My Account"
              className={`p-1.5 rounded-full transition-all hover:scale-105 ${isScrolled ? "text-neutral-900 hover:text-black" : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                }`}
            >
              <User className="w-[19px] h-[19px] stroke-[1.6]" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={`p-1.5 rounded-full relative transition-all hover:scale-105 ${isScrolled ? "text-neutral-900 hover:text-black" : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                }`}
            >
              <Heart className="w-[19px] h-[19px] stroke-[1.6]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon with Counter */}
            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className={`p-1.5 rounded-full relative transition-all hover:scale-105 ${isScrolled ? "text-neutral-900 hover:text-black" : "text-white hover:text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
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
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 left-0 w-[82%] max-w-sm bg-white text-neutral-900 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div>
              <div className="p-5 flex items-center justify-between border-b border-neutral-100">
                <span
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                  className="text-xl font-bold tracking-[0.2em] text-neutral-950"
                >
                  BHAI
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <div className="p-4 border-b border-neutral-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jewellery..."
                    className="w-full bg-neutral-100 text-xs px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {/* Nav Links */}
              <div className="py-3">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-neutral-800 hover:bg-neutral-50 hover:text-black border-b border-neutral-50"
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />}
                  </Link>
                ))}
              </div>
            </div>

            {/* Drawer Footer Utility Links */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-100 text-xs space-y-3">
              <div className="flex items-center gap-2 text-neutral-600">
                <span>🇬🇧 United Kingdom (£ GBP)</span>
              </div>
              <div className="pt-2 flex flex-col gap-2 text-neutral-500">
                <Link href="/services/piercing" className="hover:text-black">Piercing & Welding</Link>
                <Link href="/stores" className="hover:text-black">Our Stores</Link>
                <Link href="/blog" className="hover:text-black">Blog</Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
