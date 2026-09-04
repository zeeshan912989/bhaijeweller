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
CREATE POLICY "Users can view own cart" ON public.carts 
    FOR SELECT USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update own cart" ON public.carts 
    FOR UPDATE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Allow users to manage their cart items
CREATE POLICY "Users can view own cart items" ON public.cart_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
            AND carts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own cart items" ON public.cart_items 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
            AND carts.user_id = auth.uid()
        )
    );

-- Elevated Service Role Full Access (Used by Server Endpoints for Guest Token and Authoritative Mutations)
CREATE POLICY "Service role full access on carts" ON public.carts FOR ALL USING (true);
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

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

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

CREATE POLICY "Users can view own addresses" ON public.addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON public.addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
    FOR DELETE USING (auth.uid() = user_id);

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


