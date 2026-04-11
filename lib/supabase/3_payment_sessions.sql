-- Peak Security: Zero Drop Payments Sessions Table
CREATE TABLE IF NOT EXISTS public.payment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razorpay_order_id TEXT UNIQUE,
    user_id UUID,
    order_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ACID Transaction to atomically claim a session and prevent double-processing
CREATE OR REPLACE FUNCTION claim_payment_session(p_rzp_order_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS \$\$
DECLARE
    session_data JSONB;
BEGIN
    UPDATE public.payment_sessions
    SET status = 'processing', updated_at = now()
    WHERE razorpay_order_id = p_rzp_order_id AND status = 'pending'
    RETURNING order_data INTO session_data;
    
    RETURN session_data;
END;
\$\$;