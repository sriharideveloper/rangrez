-- It appears the orders table in Supabase has an 'items' column that is NOT NULL.
-- Since we are using an 'order_items' table, we should drop the 'items' column from 'orders'
-- OR we need to populate it. We will drop it if it's there.
ALTER TABLE public.orders DROP COLUMN IF EXISTS items;
