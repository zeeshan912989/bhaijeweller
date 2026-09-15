"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useCurrency, SUPPORTED_CURRENCIES, CurrencyCode } from "@/context/CurrencyContext";

const PAYMENT_METHODS = [
  { name: "Visa", src: "/visa.png" },
  { name: "Apple Pay", src: "/applepay.png" },
  { name: "Google Pay", src: "/gpay.png" },
  { name: "Mastercard", src: "/mastercard.png" },
  { name: "American Express", src: "/amex.png" },
  { name: "Shop Pay", src: "/shoppay.png" },
  { name: "PayPal", src: "/paypal.png" },
  { name: "Klarna", src: "/klarna.png" },
];

export default function Footer() {
  const { currency, setCurrency } = useCurrency();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
    pinterest: "https://pinterest.com",
    youtube: "https://youtube.com",
  });

  // Sync social links in real time with Admin Panel
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("bhai_social_links_v1");
      if (stored) {
        setSocialLinks(JSON.parse(stored));
      }
    } catch (e) {}

    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("bhai_social_links_v1");
        if (stored) setSocialLinks(JSON.parse(stored));
      } catch (e) {}
    };
    window.addEventListener("storage", handleStorage);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("bhai_realtime_layout");
      channel.onmessage = (event) => {
        if (event.data?.socials) {
          setSocialLinks(event.data.socials);
        }
      };
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#FAF7F2] text-neutral-900 border-t border-[#EAE4D9] pt-12 lg:pt-18 pb-10 mt-auto">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14">

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-10 lg:pb-14 border-b border-[#E8E1D4]">

          {/* LEFT SECTION: NEWSLETTER SIGNUP (5 COLS) */}
          <div className="lg:col-span-5 max-w-md">
            <h3 className="text-base sm:text-lg font-extrabold tracking-[0.16em] uppercase text-neutral-950 mb-5 sm:mb-6">
              SIGN UP FOR 10% OFF
            </h3>

            {/* Newsletter Form with Underline Input */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative border-b-2 border-neutral-900 pb-2 flex items-center justify-between">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-[15px] font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none pr-9"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="text-neutral-950 hover:text-[#d4af37] transition-colors p-1 cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5 stroke-[2]" />
                </button>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-xs sm:text-[12.5px] font-medium text-neutral-700 leading-snug cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-400 text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>
                  By signing up, you agree to our{" "}
                  <Link href="/privacy" className="underline font-semibold hover:text-black">
                    Security & Privacy Policy
                  </Link>
                  .*
                </span>
              </label>

              {subscribed && (
                <p className="text-xs sm:text-sm text-[#2e7d32] font-semibold pt-1">
                  ✓ Thank you! Please check your inbox for your 10% discount code.
                </p>
              )}
            </form>

            {/* Country / Currency Dropdown Box (Desktop placement) */}
            <div className="hidden lg:block mt-8 relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="inline-flex items-center justify-between w-60 px-4 py-2.5 bg-white border border-neutral-300 text-xs sm:text-[13px] font-semibold text-neutral-900 hover:border-neutral-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{currency.flag}</span>
                  <span>{currency.label}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-600" />
              </button>

              {currencyOpen && (
                <div className="absolute left-0 bottom-full mb-1 w-60 bg-white border border-neutral-200 shadow-lg py-1 z-20 text-xs sm:text-[13px] font-medium">
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCurrency(c.code as CurrencyCode);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center justify-between cursor-pointer ${
                        currency.code === c.code ? "bg-[#FAF7F2] font-bold text-[#997b24]" : "text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Gateways (Desktop placement) */}
            <div className="hidden lg:flex mt-6 flex-wrap items-center gap-2">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="h-6 w-11 relative flex items-center justify-center bg-white border border-neutral-200/80 rounded-sm p-0.5"
                  title={method.name}
                >
                  <Image
                    src={method.src}
                    alt={method.name}
                    width={36}
                    height={20}
                    className="max-h-4 w-auto object-contain"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT SECTION: 3 LINK COLUMNS (Desktop) / COLLAPSIBLE ACCORDIONS (Mobile) */}
          <div className="lg:col-span-7 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-8 border-t lg:border-t-0 border-neutral-200/60">

            {/* 1. HELP ACCORDION / COLUMN */}
            <div className="border-b lg:border-b-0 border-neutral-200/60 py-4 lg:py-0">
              <button
                type="button"
                onClick={() => toggleSection("help")}
                className="w-full flex items-center justify-between lg:pointer-events-none text-left py-1 lg:py-0"
              >
                <h4 className="text-[13px] sm:text-[14px] font-extrabold tracking-[0.18em] uppercase text-neutral-950 lg:mb-4">
                  HELP
                </h4>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-600 lg:hidden transition-transform duration-300 stroke-[2] ${
                    openSections["help"] ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openSections["help"] ? "max-h-96 pt-3" : "max-h-0 lg:max-h-none"
                }`}
              >
                <ul className="space-y-3 text-xs sm:text-[13px] font-medium text-neutral-800 pb-2 lg:pb-0">
                  <li><Link href="/help/faqs" className="hover:text-black hover:underline transition-all">FAQs</Link></li>
                  <li><Link href="/help/shipping" className="hover:text-black hover:underline transition-all">Shipping</Link></li>
                  <li><Link href="/help/returns" className="hover:text-black hover:underline transition-all">Returns</Link></li>
                  <li><Link href="/help/withdrawal" className="hover:text-black hover:underline transition-all">EU Right of Withdrawal</Link></li>
                  <li><Link href="/help/ring-size-guide" className="hover:text-black hover:underline transition-all">Ring Size Guide</Link></li>
                  <li><Link href="/help/size-guides" className="hover:text-black hover:underline transition-all">Size Guides</Link></li>
                  <li><Link href="/help/materials-care" className="hover:text-black hover:underline transition-all">Materials &amp; Care</Link></li>
                  <li><Link href="/contact" className="hover:text-black hover:underline transition-all">Contact Us</Link></li>
                  <li><Link href="/accessibility" className="hover:text-black hover:underline transition-all">Accessibility</Link></li>
                </ul>
              </div>
            </div>

            {/* 2. ABOUT US ACCORDION / COLUMN */}
            <div className="border-b lg:border-b-0 border-neutral-200/60 py-4 lg:py-0">
              <button
                type="button"
                onClick={() => toggleSection("about")}
                className="w-full flex items-center justify-between lg:pointer-events-none text-left py-1 lg:py-0"
              >
                <h4 className="text-[13px] sm:text-[14px] font-extrabold tracking-[0.18em] uppercase text-neutral-950 lg:mb-4">
                  ABOUT US
                </h4>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-600 lg:hidden transition-transform duration-300 stroke-[2] ${
                    openSections["about"] ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openSections["about"] ? "max-h-96 pt-3" : "max-h-0 lg:max-h-none"
                }`}
              >
                <ul className="space-y-3 text-xs sm:text-[13px] font-medium text-neutral-800 pb-2 lg:pb-0">
                  <li><Link href="/about" className="hover:text-black hover:underline transition-all">About Bhai</Link></li>
                  <li><Link href="/sustainability" className="hover:text-black hover:underline transition-all">Sustainability</Link></li>
                  <li><Link href="/our-factories" className="hover:text-black hover:underline transition-all">Our Factories</Link></li>
                  <li><Link href="/craftsmanship" className="hover:text-black hover:underline transition-all">Craftsmanship</Link></li>
                  <li><Link href="/careers" className="hover:text-black hover:underline transition-all">Careers</Link></li>
                  <li><Link href="/blog" className="hover:text-black hover:underline transition-all">Blog</Link></li>
                </ul>
              </div>
            </div>

            {/* 3. MORE INFO ACCORDION / COLUMN */}
            <div className="border-b lg:border-b-0 border-neutral-200/60 py-4 lg:py-0">
              <button
                type="button"
                onClick={() => toggleSection("more")}
                className="w-full flex items-center justify-between lg:pointer-events-none text-left py-1 lg:py-0"
              >
                <h4 className="text-[13px] sm:text-[14px] font-extrabold tracking-[0.18em] uppercase text-neutral-950 lg:mb-4">
                  MORE INFO
                </h4>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-600 lg:hidden transition-transform duration-300 stroke-[2] ${
                    openSections["more"] ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openSections["more"] ? "max-h-96 pt-3" : "max-h-0 lg:max-h-none"
                }`}
              >
                <ul className="space-y-3 text-xs sm:text-[13px] font-medium text-neutral-800 pb-2 lg:pb-0">
                  <li><Link href="/stores" className="hover:text-black hover:underline transition-all">Stores & Services</Link></li>
                  <li><Link href="/offers" className="hover:text-black hover:underline transition-all">Discounts & Offers</Link></li>
                  <li><Link href="/student-discount" className="hover:text-black hover:underline transition-all">Student Discount</Link></li>
                  <li><Link href="/key-worker-discount" className="hover:text-black hover:underline transition-all">Key Worker Discount</Link></li>
                  <li><Link href="/terms" className="hover:text-black hover:underline transition-all">Terms & Conditions</Link></li>
                  <li><Link href="/privacy" className="hover:text-black hover:underline transition-all">Privacy & Security</Link></li>
                  <li><Link href="/products" className="hover:text-black hover:underline transition-all">Products</Link></li>
                  <li><Link href="/collections" className="hover:text-black hover:underline transition-all">Collections</Link></li>
                </ul>
              </div>
            </div>

          </div>

        </div>

        {/* MOBILE UTILITY SECTION (Currency, Payment Icons & Socials matching screenshot) */}
        <div className="lg:hidden pt-8 space-y-6">
          {/* Country / Currency Dropdown Box (Mobile Full Width) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="w-full inline-flex items-center justify-between px-4 py-3.5 bg-white border border-neutral-300 text-xs sm:text-sm font-semibold text-neutral-900 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{currency.flag}</span>
                <span>{currency.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-600 stroke-[2]" />
            </button>

            {currencyOpen && (
              <div className="absolute left-0 bottom-full mb-1 w-full bg-white border border-neutral-200 shadow-lg py-1 z-20 text-xs sm:text-sm font-medium">
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code as CurrencyCode);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center justify-between cursor-pointer ${
                      currency.code === c.code ? "bg-[#FAF7F2] font-bold text-[#997b24]" : "text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Gateways (Centered 2 Rows on Mobile) */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="flex items-center justify-center gap-3">
              {PAYMENT_METHODS.slice(0, 5).map((method) => (
                <div
                  key={method.name}
                  className="h-6 w-11 relative flex items-center justify-center bg-white border border-neutral-200/80 rounded-sm p-0.5"
                  title={method.name}
                >
                  <Image
                    src={method.src}
                    alt={method.name}
                    width={36}
                    height={20}
                    className="max-h-4 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              {PAYMENT_METHODS.slice(5).map((method) => (
                <div
                  key={method.name}
                  className="h-6 w-11 relative flex items-center justify-center bg-white border border-neutral-200/80 rounded-sm p-0.5"
                  title={method.name}
                >
                  <Image
                    src={method.src}
                    alt={method.name}
                    width={36}
                    height={20}
                    className="max-h-4 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social Icons (Centered on Mobile) */}
          <div className="flex items-center justify-center gap-3 pt-2 pb-4">
            {/* Instagram */}
            <Link
              href={socialLinks.instagram || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.75]" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>

            {/* Facebook */}
            <Link
              href={socialLinks.facebook || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>

            {/* TikTok - Real Vector SVG Icon */}
            <Link
              href={socialLinks.tiktok || "https://tiktok.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </Link>

            {/* Pinterest - Real Vector SVG Icon */}
            <Link
              href={socialLinks.pinterest || "https://pinterest.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Pinterest"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </Link>

            {/* YouTube */}
            <Link
              href={socialLinks.youtube || "https://youtube.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* LOWER BAR: BRAND LOGO & COPYRIGHT */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-t lg:border-t-0 border-neutral-200/50">
          <div className="text-center sm:text-left space-y-1">
            <p
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-sm font-bold tracking-[0.2em] text-neutral-950 uppercase"
            >
              BHAI
            </p>
            <p className="text-[11px] text-neutral-500 font-light">
              © {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>

          {/* Social Icons (Desktop only - mobile rendered above) */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Instagram */}
            <Link
              href={socialLinks.instagram || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.75]" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>

            {/* Facebook */}
            <Link
              href={socialLinks.facebook || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>

            {/* TikTok */}
            <Link
              href={socialLinks.tiktok || "https://tiktok.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </Link>

            {/* Pinterest */}
            <Link
              href={socialLinks.pinterest || "https://pinterest.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Pinterest"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </Link>

            {/* YouTube */}
            <Link
              href={socialLinks.youtube || "https://youtube.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
