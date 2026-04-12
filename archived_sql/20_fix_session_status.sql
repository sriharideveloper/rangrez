-- Create a secure lookup function to check status of payment session without RLS blocking it
CREATE OR REPLACE FUNCTION get_payment_session_status(p_rzp_order_id TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_status TEXT;
BEGIN
    SELECT status INTO v_status
    FROM public.payment_sessions
    WHERE razorpay_order_id = p_rzp_order_id;
    RETURN v_status;
END;
$$;