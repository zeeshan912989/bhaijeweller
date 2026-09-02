<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 💎 Luxury Jewellery E-Commerce Project Guide for AI Agents

> **Primary Blueprint:** Refer to [PROJECT_ARCHITECTURE_GRAPH.md](file:///c:/Users/The%20Laptop%20Sphere/Desktop/sub%20folder/jew/bhai/PROJECT_ARCHITECTURE_GRAPH.md) for full Mermaid flowcharts, ER diagrams, and sequence flows.
> **SEO & Speed Blueprint:** Refer to [ARCHITECTURE_AND_SEO_GUIDE.md](file:///c:/Users/The%20Laptop%20Sphere/Desktop/sub%20folder/jew/bhai/ARCHITECTURE_AND_SEO_GUIDE.md).

---

## 🏛️ Quick Component & Architecture Map

* **Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4.
* **Global Contexts:**
  * `CartContext.tsx` — Cart items, quantities, subtotal, LocalStorage persistence, Drawer trigger.
  * `WishlistContext.tsx` — Saved products, toggle bookmark, LocalStorage persistence.
* **Component Directory Conventions (`components/`):**
  * `components/layout/` → `Navbar.tsx`, `Footer.tsx`, `MobileNav.tsx`, `AnnouncementBar.tsx`
  * `components/home/` → `HeroBanner.tsx`, `CategoryShowcase.tsx`, `FeaturedProducts.tsx`, `BrandHeritage.tsx`, `Testimonials.tsx`
  * `components/products/` → `ProductCard.tsx`, `ProductGrid.tsx`, `FilterSidebar.tsx`, `ProductGallery.tsx`, `QuickViewModal.tsx`
  * `components/cart/` → `CartDrawer.tsx`, `CartItemRow.tsx`
  * `components/ui/` → Reusable atomic UI (Buttons, Badges, Modals)
* **Routes & Pages (`app/`):**
  * `/` → `app/page.tsx` (Hero, Category showcases, Featured products)
  * `/collections` → `app/collections/page.tsx` (All categories)
  * `/collections/[category]` → `app/collections/[category]/page.tsx` (Category products + Filter sidebar)
  * `/products/[slug]` → `app/products/[slug]/page.tsx` (Product detail, specifications, gallery, JSON-LD schema)
  * `/wishlist` → `app/wishlist/page.tsx` (Saved wishlist items)
  * `/cart` & `/checkout` → Cart review & multi-step luxury checkout
  * `sitemap.ts` & `robots.ts` → Dynamic Google SEO indexer

---

## 📜 Mandatory Rules for Any AI Agent Modifying this Codebase

1. **Server vs Client Components:**
   - Keep pages and layouts as **React Server Components (RSC)**.
   - Use `"use client"` only for components requiring React hooks or browser interaction (e.g. `CartDrawer`, `FilterSidebar`, `QuickViewModal`).
2. **Speed & Performance:**
   - Always utilize `next/image` with explicit width/height and responsive sizes.
   - Only place `priority` on the main above-the-fold Hero banner image.
3. **SEO & Structured Data:**
   - Ensure dynamic routes implement `generateMetadata`.
   - Ensure product pages include JSON-LD Product & Breadcrumb schema.
4. **Design & Aesthetics:**
   - Maintain a luxury, high-end look: Gold accents (`#D4AF37`), deep obsidian/emerald or soft alabaster/ivory backgrounds, elegant typography, smooth micro-transitions.

