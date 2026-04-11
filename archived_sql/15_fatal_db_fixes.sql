-- 1. FIX: Never drop a paid order due to inventory lag. Let the database reserve negative stock if needed, so the admin can handle a refund or backorder manually.
CREATE OR REPLACE FUNCTION place_order(
    p_user_id UUID, p_email TEXT, p_phone TEXT, p_name TEXT,
    p_shipping JSONB, p_subtotal DECIMAL, p_discount DECIMAL,
    p_coupon TEXT, p_total DECIMAL, p_items JSONB
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    new_order_id UUID;
    item JSONB;
BEGIN
    INSERT INTO public.orders (
        user_id, customer_email, customer_phone, customer_name,
        shipping_address, subtotal, discount_amount, coupon_code, total_amount, payment_status, items
    ) VALUES (
        p_user_id, p_email, p_phone, p_name,
        p_shipping, p_subtotal, p_discount, p_coupon, p_total, 'pending', p_items
    ) RETURNING id INTO new_order_id;

    FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        -- Remove the stock >= quantity restriction so paid orders are never dropped
        UPDATE public.products 
        SET stock = stock - (item->>'quantity')::INTEGER 
        WHERE id = (item->>'product_id')::UUID;
        
        INSERT INTO public.order_items (order_id, product_id, title, quantity, price_at_time) VALUES (
            new_order_id, (item->>'product_id')::UUID, item->>'title', (item->>'quantity')::INTEGER, (item->>'price')::DECIMAL
        );
    END LOOP;

    IF p_coupon IS NOT NULL THEN
        UPDATE public.coupons SET times_used = COALESCE(times_used, 0) + 1 
        WHERE code = p_coupon AND active = true;
    END IF;

    RETURN new_order_id;
END;
$$;

-- 2. FIX: Ensure Admin Dashboard can ALWAYS view and manage ANY order and update DTDC tracking!

DROP POLICY IF EXISTS "Admins manage all orders" ON public.orders;
CREATE POLICY "Admins manage all orders" ON public.orders
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins manage all payment sessions" ON public.payment_sessions;
CREATE POLICY "Admins manage all payment sessions" ON public.payment_sessions
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admins manage all order items" ON public.order_items;
CREATE POLICY "Admins manage all order items" ON public.order_items
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Note: Users still view own orders because of the SELECT policy created earlier limit to auth.uid() = user_id.

