"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

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
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#FAF7F2] text-neutral-900 border-t border-[#EAE4D9] pt-14 lg:pt-18 pb-10 mt-auto">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14">

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#E8E1D4]">

          {/* LEFT SECTION: NEWSLETTER SIGNUP (5 COLS) */}
          <div className="lg:col-span-5 max-w-md">
            <h3 className="text-sm sm:text-base font-bold tracking-[0.16em] uppercase text-neutral-900 mb-6">
              SIGN UP FOR 10% OFF
            </h3>

            {/* Newsletter Form with Underline Input */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative border-b border-neutral-900 pb-1.5 flex items-center justify-between">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-neutral-900 placeholder-neutral-500 focus:outline-none pr-8 font-light"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="text-neutral-900 hover:text-[#d4af37] transition-colors p-1 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 stroke-[1.75]" />
                </button>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-[10.5px] sm:text-[11px] text-neutral-600 leading-tight cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-400 text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span>
                  By signing up, you agree to our{" "}
                  <Link href="/privacy" className="underline hover:text-black">
                    Security & Privacy Policy
                  </Link>
                  .*
                </span>
              </label>

              {subscribed && (
                <p className="text-xs text-[#2e7d32] font-medium pt-1">
                  ✓ Thank you! Please check your inbox for your 10% discount code.
                </p>
              )}
            </form>

            {/* Country / Currency Dropdown Box */}
            <div className="mt-8 relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="inline-flex items-center justify-between w-56 px-3.5 py-2 bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:border-neutral-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">🇬🇧</span>
                  <span>United Kingdom (GBP £)</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {currencyOpen && (
                <div className="absolute left-0 bottom-full mb-1 w-56 bg-white border border-neutral-200 shadow-lg py-1 z-20 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrencyOpen(false)}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🇬🇧</span> United Kingdom (GBP £)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyOpen(false)}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🇺🇸</span> United States (USD $)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyOpen(false)}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🇪🇺</span> Europe (EUR €)
                  </button>
                </div>
              )}
            </div>

            {/* Payment Gateways Row */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="h-6 w-10 relative flex items-center justify-center bg-white border border-neutral-200/80 rounded-sm p-0.5"
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

          {/* RIGHT SECTION: 3 LINK COLUMNS (7 COLS) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">

            {/* COLUMN 1: HELP */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-neutral-900 mb-4">
                HELP
              </h4>
              <ul className="space-y-2.5 text-[11px] sm:text-xs text-neutral-700 font-light">
                <li><Link href="/help/faqs" className="hover:text-black hover:underline transition-all">FAQs</Link></li>
                <li><Link href="/help/shipping" className="hover:text-black hover:underline transition-all">Shipping</Link></li>
                <li><Link href="/help/returns" className="hover:text-black hover:underline transition-all">Returns</Link></li>
                <li><Link href="/help/withdrawal" className="hover:text-black hover:underline transition-all">EU Right of Withdrawal</Link></li>
                <li><Link href="/help/ring-size-guide" className="hover:text-black hover:underline transition-all">Ring Size Guide</Link></li>
                <li><Link href="/help/size-guides" className="hover:text-black hover:underline transition-all">Size Guides</Link></li>
                <li><Link href="/help/materials-care" className="hover:text-black hover:underline transition-all">Materials & Care</Link></li>
                <li><Link href="/help/klarna" className="hover:text-black hover:underline transition-all">How to Pay with Klarna</Link></li>
                <li><Link href="/contact" className="hover:text-black hover:underline transition-all">Contact Us</Link></li>
                <li><Link href="/accessibility" className="hover:text-black hover:underline transition-all">Accessibility</Link></li>
              </ul>
            </div>

            {/* COLUMN 2: ABOUT US */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-neutral-900 mb-4">
                ABOUT US
              </h4>
              <ul className="space-y-2.5 text-[11px] sm:text-xs text-neutral-700 font-light">
                <li><Link href="/about" className="hover:text-black hover:underline transition-all">About Bhai</Link></li>
                <li><Link href="/sustainability" className="hover:text-black hover:underline transition-all">Sustainability</Link></li>
                <li><Link href="/our-factories" className="hover:text-black hover:underline transition-all">Our Factories</Link></li>
                <li><Link href="/craftsmanship" className="hover:text-black hover:underline transition-all">Craftsmanship</Link></li>
                <li><Link href="/careers" className="hover:text-black hover:underline transition-all">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-black hover:underline transition-all">Blog</Link></li>
              </ul>
            </div>

            {/* COLUMN 3: MORE INFO */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-neutral-900 mb-4">
                MORE INFO
              </h4>
              <ul className="space-y-2.5 text-[11px] sm:text-xs text-neutral-700 font-light">
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

        {/* LOWER BAR: BRAND LOGO, COPYRIGHT & SOCIAL ICONS */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Brand & Copyright */}
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

          {/* Social Icons (Rounded Outline Circles matching reference) */}
          <div className="flex items-center gap-2.5">
            {/* Instagram */}
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.6]" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>

            {/* Facebook */}
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.6]" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>

            {/* TikTok */}
            <Link
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors text-[9.5px] font-bold"
              aria-label="TikTok"
            >
              TT
            </Link>

            {/* Pinterest */}
            <Link
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors text-[10px] font-serif font-bold"
              aria-label="Pinterest"
            >
              P
            </Link>

            {/* YouTube */}
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[1.6]" viewBox="0 0 24 24">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3v6Z" />
              </svg>
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
