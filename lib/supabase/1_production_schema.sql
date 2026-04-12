-- ==========================================
-- RANGREZ PRODUCTION E-COMMERCE SCHEMA
-- Realtime, Stock-based, and Courier-Ready
-- ==========================================

-- 1. PRODUCTS 
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    images TEXT[] DEFAULT '{}',
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);

-- 2. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0,
    max_uses INTEGER,
    times_used INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage';
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS discount_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS min_order_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS max_uses INTEGER;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS times_used INTEGER DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS valid_from TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS valid_until TIMESTAMPTZ;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active coupons" ON public.coupons;
CREATE POLICY "Public can read active coupons" ON public.coupons FOR SELECT USING (active = true);

-- 3. ORDERS 
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT,
    customer_phone TEXT,
    customer_name TEXT,
    shipping_address JSONB,
    billing_address JSONB,
    subtotal DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    coupon_code TEXT,
    total_amount DECIMAL(10,2),
    payment_status TEXT DEFAULT 'pending',
    payment_provider TEXT DEFAULT 'razorpay',
    payment_id TEXT,
    order_status TEXT DEFAULT 'processing',
    courier_name TEXT DEFAULT 'DTDC',
    tracking_number TEXT,
    tracking_url TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS billing_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'razorpay';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'processing';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier_name TEXT DEFAULT 'DTDC';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- 4. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

-- 5. REALTIME SYNCHRONIZATION
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'products') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'coupons') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
    END IF;
END \$\$;

-- 6. STOCK DEDUCTION TRANSACTION FUNCTION (RPC)
CREATE OR REPLACE FUNCTION place_order(
    p_user_id UUID, p_email TEXT, p_phone TEXT, p_name TEXT,
    p_shipping JSONB, p_subtotal DECIMAL, p_discount DECIMAL,
    p_coupon TEXT, p_total DECIMAL, p_items JSONB
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS \$\$
DECLARE
    new_order_id UUID;
    item JSONB;
    current_stock INTEGER;
BEGIN
    INSERT INTO public.orders (
        user_id, customer_email, customer_phone, customer_name,
        shipping_address, subtotal, discount_amount, coupon_code, total_amount, payment_status
    ) VALUES (
        p_user_id, p_email, p_phone, p_name,
        p_shipping, p_subtotal, p_discount, p_coupon, p_total, 'pending'
    ) RETURNING id INTO new_order_id;

    FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        UPDATE public.products SET stock = stock - (item->>'quantity')::INTEGER WHERE id = (item->>'product_id')::UUID AND stock >= (item->>'quantity')::INTEGER RETURNING stock INTO current_stock;

        IF current_stock IS NULL THEN RAISE EXCEPTION 'Insufficient stock for %', (item->>'title'); END IF;

        INSERT INTO public.order_items (order_id, product_id, title, quantity, price_at_time) VALUES (
            new_order_id, (item->>'product_id')::UUID, item->>'title', (item->>'quantity')::INTEGER, (item->>'price')::DECIMAL
        );
    END LOOP;

    IF p_coupon IS NOT NULL THEN
        UPDATE public.coupons SET times_used = COALESCE(times_used, 0) + 1 WHERE code = p_coupon AND active = true AND (max_uses IS NULL OR times_used < max_uses);
    END IF;

    RETURN new_order_id;
END;
\$\$;
