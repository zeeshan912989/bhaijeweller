-- =========================================================
-- BHAI LUXURY JEWELLERY - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- =========================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'earrings', 'necklaces', 'bracelets', 'rings'
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    badge TEXT, -- 'Bestseller', 'Statement', 'New In', 'Everyday Staple'
    primary_image TEXT NOT NULL,
    hover_image TEXT,
    metals JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'Paid', -- 'Paid', 'Pending', 'Refunded'
    fulfillment_status TEXT DEFAULT 'Processing', -- 'Processing', 'Fulfilled', 'Unfulfilled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    location TEXT,
    tier TEXT DEFAULT 'Member', -- 'Gold VIP', 'Silver Tier', 'Member'
    total_orders INT DEFAULT 0,
    total_spend NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_text TEXT NOT NULL, -- '10% OFF', '20% OFF'
    discount_percent INT,
    status TEXT DEFAULT 'Active',
    uses_count INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SITE SETTINGS TABLE (Header Banners & Real-Time Layout Customizer)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS POLICIES
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public coupons are viewable by everyone" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public site_settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- FULL ACCESS FOR SERVICE ROLE / AUTHENTICATED
CREATE POLICY "Service role full access on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Service role full access on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Service role full access on customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Service role full access on coupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Service role full access on site_settings" ON public.site_settings FOR ALL USING (true);

-- 7. SHOPPABLE REELS & VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.shoppable_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_url TEXT NOT NULL,
    poster_url TEXT,
    product_name TEXT NOT NULL,
    product_price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    product_thumbnail TEXT NOT NULL,
    product_href TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shoppable_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public shoppable_videos are viewable by everyone" ON public.shoppable_videos FOR SELECT USING (true);
CREATE POLICY "Service role full access on shoppable_videos" ON public.shoppable_videos FOR ALL USING (true);

-- 8. PRODUCT REVIEWS TABLE (Real Customer Reviews & Ratings)
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT,
    product_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    metal_chosen TEXT,
    verified BOOLEAN DEFAULT true,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public product_reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Public can insert product_reviews" ON public.product_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update product_reviews helpful count" ON public.product_reviews FOR UPDATE USING (true);
CREATE POLICY "Service role full access on product_reviews" ON public.product_reviews FOR ALL USING (true);




