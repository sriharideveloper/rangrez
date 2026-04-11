-- Final Cart Sync Fix
-- This ensures that when the webhook or verifier claims a checkout session and places the order securely, 
-- it also wipes the cloud cart for the user so it doesn't reappear on their other devices.

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

    -- CLEAR THE CLOUD CART UPON SUCCESSFUL CHECKOUT
    IF p_user_id IS NOT NULL THEN
        DELETE FROM public.cart_items WHERE user_id = p_user_id;
    END IF;

    RETURN new_order_id;
END;
\$\$;
