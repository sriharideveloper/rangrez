-- FIX: Prevent Stuck "Processing" Deadlock. If a server crashes while processing, the session unlocks after 2 minutes so webhooks or retries can process it.
CREATE OR REPLACE FUNCTION claim_payment_session(p_rzp_order_id TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS \$\$
DECLARE
    session_data JSONB;
BEGIN
    UPDATE public.payment_sessions
    SET status = 'processing', updated_at = now()
    WHERE razorpay_order_id = p_rzp_order_id 
    AND (status = 'pending' OR (status = 'processing' AND updated_at < now() - interval '2 minutes'))
    RETURNING order_data INTO session_data;
    
    RETURN session_data;
END;
\$\$;

-- FIX: Provide a rollback function if order placement fails, unlocking the session instantly.
CREATE OR REPLACE FUNCTION rollback_payment_session(p_rzp_order_id TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS \$\$
BEGIN
    UPDATE public.payment_sessions
    SET status = 'pending', updated_at = now()
    WHERE razorpay_order_id = p_rzp_order_id AND status = 'processing';
END;
\$\$;
