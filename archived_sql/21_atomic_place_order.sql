-- 21_atomic_place_order.sql
CREATE OR REPLACE FUNCTION place_order(
    p_user_id UUID, p_email TEXT, p_phone TEXT, p_name TEXT,
    p_shipping JSONB, p_subtotal DECIMAL, p_discount DECIMAL,
    p_coupon TEXT, p_shipping_fee DECIMAL, p_total DECIMAL, p_items JSONB
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    new_order_id UUID;
    item JSONB;
BEGIN
    -- 1. Insert order
    INSERT INTO public.orders (
        user_id, customer_email, customer_phone, customer_name,
        shipping_address, subtotal, discount_amount, coupon_code, shipping_fee, total, total_amount, payment_status, items
    ) VALUES (
        p_user_id, p_email, p_phone, p_name,
        p_shipping, p_subtotal, p_discount, p_coupon, p_shipping_fee, p_total, p_total, 'pending', p_items
    ) RETURNING id INTO new_order_id;

    -- 2. Insert order items & Update stock
    FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        -- Remove the stock >= quantity restriction so paid orders are never dropped
        UPDATE public.products 
        SET stock = stock - COALESCE((item->>'quantity')::INTEGER, 1) 
        WHERE id = (item->>'product_id')::UUID;
        
        INSERT INTO public.order_items (order_id, product_id, title, quantity, price_at_time)
        VALUES (
            new_order_id,
            (item->>'product_id')::UUID,
            COALESCE(item->>'title', 'Rangrez Product'),
            COALESCE((item->>'quantity')::INTEGER, 1),
            COALESCE((item->>'price')::DECIMAL, 0)
        );
    END LOOP;

    -- 3. Update coupon usage
    IF p_coupon IS NOT NULL THEN
        UPDATE public.coupons SET times_used = COALESCE(times_used, 0) + 1 
        WHERE code = p_coupon AND active = true;
    END IF;

    RETURN new_order_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to place order: %', SQLERRM;
END;
$$;

-- Safely finalize the order metadata and session status after payment capture
CREATE OR REPLACE FUNCTION finalize_payment_session(
    p_order_id UUID,
    p_rzp_order_id TEXT,
    p_payment_id TEXT
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.orders 
    SET payment_id = p_payment_id, 
        razorpay_payment_id = p_payment_id,
        razorpay_order_id = p_rzp_order_id,
        payment_status = 'paid'
    WHERE id = p_order_id;

    UPDATE public.payment_sessions 
    SET status = 'paid', updated_at = now()
    WHERE razorpay_order_id = p_rzp_order_id;
END;
$$;
