# 🚀 Luxury Jewellery Website — SEO & Speed Optimization Guide

---

## 1. SEO Optimization Strategy

### A. Clean Keyword-Rich Dynamic URLs
* `/collections/rings` — Targets high-intent searches like *"buy luxury rings online"*.
* `/collections/necklaces` — Targets *"diamond & gold necklaces"*.
* `/products/solitaire-diamond-ring-18k` — Product-specific keyword targeting.

### B. Dynamic Metadata & OpenGraph (`generateMetadata`)
Har category aur product page ke liye automated metadata generate hoga:
* **Unique Title:** e.g., `Solitaire Diamond Ring in 18K Yellow Gold | [Brand Name]`
* **Meta Description:** Precise product specs and shipping guarantee.
* **OpenGraph Tags:** Social media sharing (WhatsApp, Facebook, Instagram) par luxury image aur details preview ke liye.

### C. Structured Data (JSON-LD Schema)
Google crawlers ko structured information provide karna:
* **Product Schema:** Name, Image, Price, Currency, Availability (`InStock`), AggregateRating.
* **BreadcrumbList Schema:** `Home > Collections > Rings > Solitaire Diamond Ring`.
* **Organization Schema:** Brand logo, contact, and social profiles.

### D. Automated Sitemap & Robots
* `app/sitemap.ts` dynamic routes ko automatically scan karke fresh `sitemap.xml` build karta hai.
* `app/robots.ts` search engine crawlers ko fast indexing guide karta hai.

---

## 2. Speed & Performance Optimization (Google PageSpeed 90+)

| Optimization Technique | Implementation | Benefit |
| :--- | :--- | :--- |
| **`next/image` Engine** | Automatic WebP/AVIF compression, responsive sizing, blur placeholder | 70-80% smaller image payloads, zero Cumulative Layout Shift (CLS) |
| **Hero Image Priority** | `priority={true}` on above-the-fold banner image | Ultra-fast Largest Contentful Paint (LCP < 1.2s) |
| **React Server Components (RSC)** | Keep pages and layouts as server components by default | 0 KB JavaScript sent to browser for non-interactive content |
| **Selective Client Components** | `"use client"` only for CartDrawer, Wishlist, Filter toggles | Keeps initial JavaScript bundle extremely tiny |
| **Dynamic Imports (`next/dynamic`)** | Lazy load QuickView modals, Cart drawer, Reviews popup | Initial page loads in under 1 second |
| **Google Font Zero-Flicker (`next/font`)** | Self-hosted Google Fonts (e.g., Cormorant Garamond, Inter) | No external network roundtrips, no font flash (FOIT/FOUT) |
| **Instant Link Prefetching (`next/link`)** | Hovering on any collection or product preloads the page | Instant app-like transitions without reload |
| **Tailwind CSS v4 Zero-Runtime** | Automated dead-code elimination and single small CSS bundle | CSS bundle stays between 10KB - 20KB |

---

## 3. Development Roadmap & Milestones

1. **Phase 1: Foundation & Design System**
   * Configure luxury typography, color palette (Gold `#D4AF37`, Emerald/Obsidian, Soft Ivory).
   * Set up TypeScript models (`types/index.ts`) and product dataset (`data/products.ts`).
2. **Phase 2: Global State & Layout Components**
   * Build `Navbar`, `Footer`, `AnnouncementBar`, `CartContext`, `WishlistContext`, `CartDrawer`.
3. **Phase 3: Luxury Home Page**
   * Hero banner with smooth animations, category tiles, featured products carousel, craftsmanship banner.
4. **Phase 4: Dynamic Collections & Product Detail Pages**
   * `/collections/[category]` with live filtering (Price, Metal, Gemstone).
   * `/products/[slug]` with image gallery zoom, specifications table, Add-to-Cart with quantity selector.
5. **Phase 5: Cart, Wishlist, Checkout & SEO Finalization**
   * Wishlist page, Cart page, Checkout form with validation.
   * Add JSON-LD schema, dynamic metadata, sitemap, and Core Web Vitals optimization.
