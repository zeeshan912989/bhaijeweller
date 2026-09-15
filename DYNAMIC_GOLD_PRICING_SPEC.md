# BHAI Fine Jewellery — Dynamic UK Live Gold Market Pricing Engine
> **Document Version:** 1.0  
> **Target Implementation:** Scheduled Next Sprint / Tomorrow  
> **Target Market:** United Kingdom (LBMA Spot Rate in GBP £)

---

## 1. Executive Summary & Objective

This document outlines the complete architectural and mathematical specification for implementing a **Real-Time Live UK Gold Market Rate Pricing Engine** for the **BHAI Fine Jewellery** e-commerce store, specifically tailored for **22 Karat (916 Hallmark) & 24 Karat (999 Fine Gold)** high-purity collections.

### The Objective:
Enable automated, market-linked price adjustments for **22K & 24K solid gold pieces** based on live LBMA (London Bullion Market Association) gold spot rates in GBP (£), supporting both **Per-Gram Making Charges** and **Flat Craftsmanship Fees**, with Gram and Tola weight transparency.

---

## 2. 22K & 24K Jewellery Pricing Formula & Mathematics

For high-purity 22K & 24K jewellery, pricing follows the UK bullion and fine jewellery benchmark:

$$\mathbf{P_{\text{final}}} = \left[ \left( W_{\text{grams}} \times R_{\text{live 24K/g}} \times F_{\text{karat}} \right) + C_{\text{making}} + C_{\text{gem}} \right] \times (1 + M_{\text{margin}}) \times (1 + V_{\text{VAT}})$$

### Making Charges Options ($C_{\text{making}}$):
In 22K/24K trade, making charges are calculated in two flexible ways:
1. **Per-Gram Making Charge:** $C_{\text{making}} = W_{\text{grams}} \times \text{Making Rate per Gram}$ *(e.g., $10\text{g} \times £12/\text{g} = £120$)*
2. **Fixed Piece Fee:** Fixed craftsmanship bench fee for intricate handmade or laser designs.

---

## 3. High-Purity Metal Multipliers ($F_{\text{karat}}$)

| Metal Specification | UK Hallmark Stamp | Purity ($F_{\text{karat}}$) | Primary Usage in BHAI |
| :--- | :---: | :---: | :--- |
| **24K Fine Gold** | **999 / 999.9** | **`1.000` (100%)** | **Primary:** Pure gold pendants, investment coins/bars, minimal bullion sets |
| **22K Crown Gold** | **916** | **`0.9167` (91.67%)** | **Primary Signature:** Bridal sets, bangles, necklaces, chains, earrings, rings |
| **18K Solid Gold** | 750 | `0.750` (75.0%) | Diamond settings & delicate fine pieces |
| **9K Solid Gold** | 375 | `0.375` (37.5%) | Everyday entry solid gold |
| **18K Gold Vermeil** | 925 | Custom | Recycled silver base with 2.5µm gold coat |

### Weight Standards Supported:
* **Grams (g):** Official UK metric standard (e.g., `4.850g`).
* **Tola (tolas):** 1 Tola = `11.6638 grams` (Auto-displayed in transparency breakdown for traditional 22K/24K clients).

---

## 4. System Architecture & Data Flow

```mermaid
flowchart TD
    A[External Live Metal API: GoldAPI / MetalPriceAPI] -->|Hourly Poll / London AM-PM Fix| B[Next.js API Route: /api/cron/sync-gold-rates]
    B -->|Store & Cache Rates| C[(Supabase Table: gold_market_rates)]
    C -->|Fetch Active Market Rate| D[Live Pricing Service: lib/pricing/goldPricingEngine.ts]
    E[(Supabase Table: products)] -->|Product Metal Weight & Making Charges| D
    D -->|Realtime Calculated Price| F[Frontend PDP & PLP Product Cards]
    F -->|Interactive Breakdown Modal| G[Customer 'Live Gold Breakdown' UI]
    F -->|Add To Bag| H[Cart & 15-Minute Checkout Price Lock]
```

---

## 5. Database Schema Requirements (Supabase)

### Table 1: `gold_market_rates`
Stores historic and active spot rates for caching to eliminate excessive API bills and optimize page load latency.

```sql
CREATE TABLE IF NOT EXISTS public.gold_market_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal VARCHAR(10) NOT NULL DEFAULT 'XAU', -- XAU = Gold, XAG = Silver
    currency VARCHAR(5) NOT NULL DEFAULT 'GBP',
    rate_per_gram_24k NUMERIC(10, 4) NOT NULL,
    rate_per_oz NUMERIC(12, 4) NOT NULL,
    source VARCHAR(50) DEFAULT 'LBMA_FEED',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table 2: `products` Schema Enhancements
Add columns to allow dynamic metal calculation per product:

```sql
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_dynamic_gold_pricing BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gold_weight_grams NUMERIC(8, 3) DEFAULT 0.000,
ADD COLUMN IF NOT EXISTS gold_karat VARCHAR(20) DEFAULT '18k',
ADD COLUMN IF NOT EXISTS making_charges_gbp NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS gemstone_cost_gbp NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS margin_percentage NUMERIC(5, 2) DEFAULT 25.00;
```

---

## 6. Live Rate Fetcher & Fallback Protection

### Primary & Fallback API Providers:
1. **GoldAPI.io** (Fast JSON responses in GBP per gram).
2. **MetalPriceAPI.com** (LBMA reliable real-time rates).
3. **Hardcoded Safety Fallback** (Guarantees the website never crashes or displays £0 if third-party APIs experience downtime).

### Rate Refresh Schedule:
* Synchronize during London Market trading hours (10:30 AM GMT & 3:00 PM GMT fixes, plus hourly updates).
* Cache validity: 60 minutes.

---

## 7. Frontend UI / UX Features to Build

### 1. "Live Gold Linked" Luxury Trust Badge
* Displayed on Product Detail Page (PDP) next to price.
* Glowing subtle green/gold pulse indicator: `● Live UK Gold Market Linked`.

### 2. Transparent Price Breakdown Modal / Tooltip
Customers can click a *"How is this priced?"* link to view exact transparency:
* **Gold Purity & Weight:** e.g., $18\text{K Gold} \times 4.20\text{g} = £214.83$
* **Artisan Craftsmanship & Finishing:** $£55.00$
* **Total Transparent Price:** $£269.83$

### 3. Cart & Checkout "Price Lock Timer" (15 Minutes)
* When a customer initiates checkout, lock the calculated price for **15 minutes** using a cryptographic session token.
* Prevents price fluctuation during active credit card entry.

---

## 8. Implementation Steps (Plan for Tomorrow)

| Step # | Task Component | Deliverables |
| :---: | :--- | :--- |
| **Phase 1** | **Database & SQL Setup** | Create `gold_market_rates` table and add dynamic pricing columns to `products`. |
| **Phase 2** | **Pricing Engine Utility** | Build `lib/pricing/goldEngine.ts` containing pure calculation formulas, purity maps, and fallback handlers. |
| **Phase 3** | **API Sync Endpoint** | Create `/api/cron/sync-gold-rates` with API key authentication and error fallbacks. |
| **Phase 4** | **Admin Panel Toggle** | Add dynamic gold weight, karat, and making charges inputs inside `AddProductView.tsx` & `ProductsView.tsx`. |
| **Phase 5** | **PDP & PLP UI Integration** | Connect real-time dynamic pricing to Product Detail Page, Product Cards, and Multi-Currency Converter. |
| **Phase 6** | **Checkout Price Lock** | Add 15-minute price preservation during checkout validation. |

---

## 9. Safety & Risk Controls

1. **Maximum Price Delta Cap:** If an external API reports a sudden glitch/anomaly ($\pm 15\%$ deviation in 1 hour), reject update and alert admin.
2. **Minimum Floor Price:** Products cannot sell below physical gold bullion melt value.
3. **Admin Manual Override:** Admin can toggle any product between `Fixed Static Price` and `Dynamic Gold Market Price` with one click.
