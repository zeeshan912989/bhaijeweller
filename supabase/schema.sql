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
    gallery_images JSONB DEFAULT '[]'::jsonb,
    metals JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PERFORMANCE INDEXES FOR PRODUCTS
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_price ON public.products(category, price);

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

-- PERFORMANCE INDEXES FOR ORDERS, REVIEWS & COUPONS
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON public.coupons(status);

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

-- PUBLIC READ ACCESS POLICIES (Idempotent)
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public coupons are viewable by everyone" ON public.coupons;
CREATE POLICY "Public coupons are viewable by everyone" ON public.coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public site_settings are viewable by everyone" ON public.site_settings;
CREATE POLICY "Public site_settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

-- FULL ACCESS FOR SERVICE ROLE / AUTHENTICATED
DROP POLICY IF EXISTS "Service role full access on products" ON public.products;
CREATE POLICY "Service role full access on products" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on orders" ON public.orders;
CREATE POLICY "Service role full access on orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on customers" ON public.customers;
CREATE POLICY "Service role full access on customers" ON public.customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on coupons" ON public.coupons;
CREATE POLICY "Service role full access on coupons" ON public.coupons FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on site_settings" ON public.site_settings;
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
DROP POLICY IF EXISTS "Public shoppable_videos are viewable by everyone" ON public.shoppable_videos;
CREATE POLICY "Public shoppable_videos are viewable by everyone" ON public.shoppable_videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access on shoppable_videos" ON public.shoppable_videos;
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

CREATE INDEX IF NOT EXISTS idx_product_reviews_slug ON public.product_reviews(product_slug);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public product_reviews are viewable by everyone" ON public.product_reviews;
CREATE POLICY "Public product_reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert product_reviews" ON public.product_reviews;
CREATE POLICY "Public can insert product_reviews" ON public.product_reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update product_reviews helpful count" ON public.product_reviews;
CREATE POLICY "Public can update product_reviews helpful count" ON public.product_reviews FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Service role full access on product_reviews" ON public.product_reviews;
CREATE POLICY "Service role full access on product_reviews" ON public.product_reviews FOR ALL USING (true);


-- 9. SHOPPING CARTS TABLE
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    session_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'merged', 'abandoned', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days') NOT NULL
);

-- 10. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    variant_id TEXT DEFAULT 'Default',
    quantity INT NOT NULL CHECK (quantity > 0 AND quantity <= 20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(cart_id, product_id, variant_id)
);

-- INDEXES FOR CART PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON public.carts(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON public.cart_items(product_id);

-- CART ROW LEVEL SECURITY (RLS)
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view & update only their own carts
DROP POLICY IF EXISTS "Users can view own cart" ON public.carts;
CREATE POLICY "Users can view own cart" ON public.carts 
    FOR SELECT USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own cart" ON public.carts;
CREATE POLICY "Users can update own cart" ON public.carts 
    FOR UPDATE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Allow users to manage their cart items
DROP POLICY IF EXISTS "Users can view own cart items" ON public.cart_items;
CREATE POLICY "Users can view own cart items" ON public.cart_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
            AND carts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
CREATE POLICY "Users can manage own cart items" ON public.cart_items 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
            AND carts.user_id = auth.uid()
        )
    );

-- Elevated Service Role Full Access (Used by Server Endpoints for Guest Token and Authoritative Mutations)
DROP POLICY IF EXISTS "Service role full access on carts" ON public.carts;
CREATE POLICY "Service role full access on carts" ON public.carts FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role full access on cart_items" ON public.cart_items;
CREATE POLICY "Service role full access on cart_items" ON public.cart_items FOR ALL USING (true);

-- 11. PROFILES TABLE (User Profile Metadata Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role full access on profiles" ON public.profiles;
CREATE POLICY "Service role full access on profiles" ON public.profiles FOR ALL USING (true);

-- Auto-create profile trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. ADDRESSES TABLE (User Address Book with Default Address Protection)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'United Kingdom',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
CREATE POLICY "Users can view own addresses" ON public.addresses
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
CREATE POLICY "Users can insert own addresses" ON public.addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
CREATE POLICY "Users can update own addresses" ON public.addresses
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;
CREATE POLICY "Users can delete own addresses" ON public.addresses
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access on addresses" ON public.addresses;
CREATE POLICY "Service role full access on addresses" ON public.addresses FOR ALL USING (true);

-- Add user_id column to orders if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
    END IF;

    -- Add gallery_images to products if not present
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'gallery_images'
    ) THEN
        ALTER TABLE public.products ADD COLUMN gallery_images JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 13. SUPABASE STORAGE BUCKET: 'product-images' (Photos, Videos, Reels)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to uploaded images & videos
DROP POLICY IF EXISTS "Public Access product-images" ON storage.objects;
CREATE POLICY "Public Access product-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');


-- Allow authenticated and anon upload to product-images
-- 14. PRODUCT SETS & BUNDLES TABLE (Save As A Set / More Styles)
CREATE TABLE IF NOT EXISTS public.product_sets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    target_product_slug TEXT NOT NULL DEFAULT 'all',
    set_title TEXT NOT NULL,
    set_slug TEXT,
    badge_text TEXT NOT NULL DEFAULT 'SAVE AS A SET',
    discount_description TEXT NOT NULL DEFAULT 'Save 15% with our jewellery sets.',
    bundle_image TEXT NOT NULL,
    bundle_price NUMERIC(10, 2) NOT NULL,
    original_total_price NUMERIC(10, 2),
    included_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    more_styles JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public product_sets are viewable by everyone" ON public.product_sets;
CREATE POLICY "Public product_sets are viewable by everyone" ON public.product_sets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public product_sets insert update delete" ON public.product_sets;
CREATE POLICY "Public product_sets insert update delete" ON public.product_sets FOR ALL USING (true);

-- 15. SEE IT IRL TABLE (Community Real-Life Styled Gallery)
CREATE TABLE IF NOT EXISTS public.see_it_irl (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    image_url TEXT NOT NULL,
    video_url TEXT,
    poster_url TEXT,
    customer_handle TEXT NOT NULL,
    caption TEXT,
    product_slug TEXT DEFAULT 'all',
    product_name TEXT,
    product_price NUMERIC(10, 2),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.see_it_irl ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public see_it_irl are viewable by everyone" ON public.see_it_irl;
CREATE POLICY "Public see_it_irl are viewable by everyone" ON public.see_it_irl FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public see_it_irl insert update delete" ON public.see_it_irl;
CREATE POLICY "Public see_it_irl insert update delete" ON public.see_it_irl FOR ALL USING (true);

-- 16. POPULARITY & DISCOVERY ALGORITHM TABLES
-- 16A. RAW USER ACTIONS STREAM (With Session Deduplication)
CREATE TABLE IF NOT EXISTS public.product_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_slug TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL DEFAULT 'anon',
    event_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist even if table was created previously without them
ALTER TABLE public.product_events ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_events ADD COLUMN IF NOT EXISTS product_slug TEXT;
ALTER TABLE public.product_events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.product_events ADD COLUMN IF NOT EXISTS session_id TEXT NOT NULL DEFAULT 'anon';
ALTER TABLE public.product_events ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE public.product_events ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_events_product_id ON public.product_events(product_id);
CREATE INDEX IF NOT EXISTS idx_events_product_slug ON public.product_events(product_slug);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.product_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.product_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_session_product ON public.product_events(session_id, product_id, event_type);

ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public product_events insert" ON public.product_events;
CREATE POLICY "Public product_events insert" ON public.product_events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public product_events select" ON public.product_events;
CREATE POLICY "Public product_events select" ON public.product_events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role full access on product_events" ON public.product_events;
CREATE POLICY "Service role full access on product_events" ON public.product_events FOR ALL USING (true);

-- 16B. AGGREGATED PRODUCT ANALYTICS & PRE-COMPUTED SCORES
CREATE TABLE IF NOT EXISTS public.product_analytics (
    product_id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    product_slug TEXT,
    views_7d INT DEFAULT 0,
    views_total INT DEFAULT 0,
    zooms_7d INT DEFAULT 0,
    cart_adds_7d INT DEFAULT 0,
    wishlist_adds_7d INT DEFAULT 0,
    sales_7d INT DEFAULT 0,
    sales_total INT DEFAULT 0,
    trending_score NUMERIC(10, 2) DEFAULT 0.00,
    popularity_score NUMERIC(10, 2) DEFAULT 0.00,
    hidden_gem_score NUMERIC(10, 2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure all columns exist even if table was created previously without them
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS product_slug TEXT;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS views_7d INT DEFAULT 0;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS views_total INT DEFAULT 0;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS zooms_7d INT DEFAULT 0;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS cart_adds_7d INT DEFAULT 0;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS wishlist_adds_7d INT DEFAULT 0;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS sales_7d INT DEFAULT 0;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS sales_total INT DEFAULT 0;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS trending_score NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS popularity_score NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS hidden_gem_score NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.product_analytics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_analytics_slug ON public.product_analytics(product_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_trending ON public.product_analytics(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_popularity ON public.product_analytics(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_hidden_gem ON public.product_analytics(hidden_gem_score DESC);

ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public product_analytics select" ON public.product_analytics;
CREATE POLICY "Public product_analytics select" ON public.product_analytics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role full access on product_analytics" ON public.product_analytics;
CREATE POLICY "Service role full access on product_analytics" ON public.product_analytics FOR ALL USING (true);

-- 16C. AUTOMATED POPULARITY BATCH RECOMPUTATION PROCEDURE
CREATE OR REPLACE FUNCTION public.recalculate_popularity_scores()
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.product_analytics (
        product_id,
        product_slug,
        views_7d,
        views_total,
        zooms_7d,
        cart_adds_7d,
        wishlist_adds_7d,
        sales_7d,
        sales_total,
        trending_score,
        popularity_score,
        hidden_gem_score,
        updated_at
    )
    SELECT 
        p.id AS product_id,
        p.slug AS product_slug,
        COUNT(DISTINCT CASE WHEN e.event_type = 'PRODUCT_VIEW' AND e.created_at >= NOW() - INTERVAL '7 days' THEN e.session_id END)::INT AS views_7d,
        COUNT(DISTINCT CASE WHEN e.event_type = 'PRODUCT_VIEW' THEN e.session_id END)::INT AS views_total,
        COUNT(CASE WHEN e.event_type = 'IMAGE_ZOOM' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::INT AS zooms_7d,
        COUNT(CASE WHEN e.event_type = 'ADD_TO_CART' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::INT AS cart_adds_7d,
        COUNT(CASE WHEN e.event_type = 'ADD_TO_WISHLIST' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::INT AS wishlist_adds_7d,
        COUNT(CASE WHEN e.event_type = 'PURCHASE_COMPLETED' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END)::INT AS sales_7d,
        COUNT(CASE WHEN e.event_type = 'PURCHASE_COMPLETED' THEN 1 END)::INT AS sales_total,
        
        -- 🔥 TRENDING NOW SCORE (Weighted on 7-day velocity + Logarithmic Normalization)
        ROUND((
            (LOG(GREATEST(COUNT(DISTINCT CASE WHEN e.event_type = 'PRODUCT_VIEW' AND e.created_at >= NOW() - INTERVAL '7 days' THEN e.session_id END), 0) + 1) * 20.0) +
            (LOG(GREATEST(COUNT(CASE WHEN e.event_type = 'IMAGE_ZOOM' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END), 0) + 1) * 15.0) +
            (LOG(GREATEST(COUNT(CASE WHEN e.event_type = 'ADD_TO_WISHLIST' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END), 0) + 1) * 25.0) +
            (LOG(GREATEST(COUNT(CASE WHEN e.event_type = 'ADD_TO_CART' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END), 0) + 1) * 20.0) +
            (LOG(GREATEST(COUNT(CASE WHEN e.event_type = 'PURCHASE_COMPLETED' AND e.created_at >= NOW() - INTERVAL '7 days' THEN 1 END), 0) + 1) * 40.0)
        )::NUMERIC, 2) AS trending_score,

        -- 👑 MOST POPULAR SCORE (All-time sustained engagement)
        ROUND((
            (LOG(GREATEST(COUNT(DISTINCT CASE WHEN e.event_type = 'PRODUCT_VIEW' THEN e.session_id END), 0) + 1) * 15.0) +
            (LOG(GREATEST(COUNT(CASE WHEN e.event_type = 'ADD_TO_WISHLIST' THEN 1 END), 0) + 1) * 30.0) +
            (LOG(GREATEST(COUNT(CASE WHEN e.event_type = 'ADD_TO_CART' THEN 1 END), 0) + 1) * 20.0) +
            (LOG(GREATEST(COUNT(CASE WHEN e.event_type = 'PURCHASE_COMPLETED' THEN 1 END), 0) + 1) * 50.0)
        )::NUMERIC, 2) AS popularity_score,

        -- 💎 HIDDEN GEMS (High Intent/Views Conversion Ratio)
        ROUND((
            CASE WHEN COUNT(DISTINCT CASE WHEN e.event_type = 'PRODUCT_VIEW' THEN e.session_id END) > 0 THEN
                ((COUNT(CASE WHEN e.event_type = 'ADD_TO_WISHLIST' THEN 1 END)::NUMERIC / 
                  GREATEST(COUNT(DISTINCT CASE WHEN e.event_type = 'PRODUCT_VIEW' THEN e.session_id END), 1)::NUMERIC) * 60.0) +
                ((COUNT(CASE WHEN e.event_type = 'PURCHASE_COMPLETED' THEN 1 END)::NUMERIC / 
                  GREATEST(COUNT(DISTINCT CASE WHEN e.event_type = 'PRODUCT_VIEW' THEN e.session_id END), 1)::NUMERIC) * 100.0)
            ELSE 0.0 END
        )::NUMERIC, 2) AS hidden_gem_score,

        NOW() AS updated_at
    FROM public.products p
    LEFT JOIN public.product_events e ON e.product_id = p.id OR (e.product_slug IS NOT NULL AND e.product_slug = p.slug)
    GROUP BY p.id, p.slug
    ON CONFLICT (product_id) DO UPDATE SET
        product_slug = EXCLUDED.product_slug,
        views_7d = EXCLUDED.views_7d,
        views_total = EXCLUDED.views_total,
        zooms_7d = EXCLUDED.zooms_7d,
        cart_adds_7d = EXCLUDED.cart_adds_7d,
        wishlist_adds_7d = EXCLUDED.wishlist_adds_7d,
        sales_7d = EXCLUDED.sales_7d,
        sales_total = EXCLUDED.sales_total,
        trending_score = EXCLUDED.trending_score,
        popularity_score = EXCLUDED.popularity_score,
        hidden_gem_score = EXCLUDED.hidden_gem_score,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- 16D. AUTO-SYNC TRIGGER WHEN ADMIN ADDS/MODIFIES PRODUCT
CREATE OR REPLACE FUNCTION public.handle_product_upsert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.product_analytics (
        product_id,
        product_slug,
        views_7d,
        views_total,
        trending_score,
        popularity_score,
        hidden_gem_score,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.slug,
        1,
        1,
        50.00, -- New Arrival boost for live discovery
        50.00,
        10.00,
        NOW()
    )
    ON CONFLICT (product_id) DO UPDATE SET
        product_slug = EXCLUDED.product_slug,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_product_created_or_updated ON public.products;
CREATE TRIGGER on_product_created_or_updated
    AFTER INSERT OR UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_product_upsert();


