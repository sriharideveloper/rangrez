DELETE FROM public.orders WHERE payment_id = 'pay_test_12345'; DELETE FROM public.payment_sessions WHERE razorpay_order_id LIKE 'order_test_%';
