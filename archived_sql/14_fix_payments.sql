-- 1) Allow inserting a payment session securely, bypassing RLS
CREATE OR REPLACE FUNCTION create_payment_session(
    p_rzp_order_id TEXT,
    p_user_id UUID,
    p_order_data JSONB
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS \$\$
BEGIN
    INSERT INTO public.payment_sessions (razorpay_order_id, user_id, order_data)
    VALUES (p_rzp_order_id, p_user_id, p_order_data);
END;
\$\$;

-- 2) Safely finalize the order metadata and session status after payment capture
CREATE OR REPLACE FUNCTION finalize_payment_session(
    p_order_id UUID,
    p_rzp_order_id TEXT,
    p_payment_id TEXT
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS \$\$
BEGIN
    UPDATE public.orders 
    SET payment_id = p_payment_id, payment_status = 'paid'
    WHERE id = p_order_id;

    UPDATE public.payment_sessions 
    SET status = 'paid', updated_at = now()
    WHERE razorpay_order_id = p_rzp_order_id;
END;
\$\$;
