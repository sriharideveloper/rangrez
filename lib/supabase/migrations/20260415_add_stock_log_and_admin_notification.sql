-- Migration: Add stock_log table and admin notification trigger for low/out-of-stock

-- 1. Create stock_log table for auditing stock changes
CREATE TABLE IF NOT EXISTS public.stock_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    change INTEGER NOT NULL,
    old_stock INTEGER,
    new_stock INTEGER,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create admin_notifications table for low/out-of-stock alerts
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_read BOOLEAN DEFAULT false
);

-- 3. Add trigger function to log stock changes and notify admin if stock is low or out
CREATE OR REPLACE FUNCTION log_stock_change_and_notify()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock IS DISTINCT FROM OLD.stock THEN
        INSERT INTO public.stock_log (product_id, order_id, change, old_stock, new_stock, reason)
        VALUES (NEW.id, NULL, NEW.stock - OLD.stock, OLD.stock, NEW.stock, 'manual/admin update');

        IF NEW.stock <= 5 THEN
            INSERT INTO public.admin_notifications (type, message, product_id)
            VALUES ('stock',
                CASE WHEN NEW.stock = 0 THEN 'Product is OUT OF STOCK!'
                     ELSE 'Product stock is LOW: ' || NEW.stock END,
                NEW.id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach trigger to products table
DROP TRIGGER IF EXISTS trg_log_stock_change ON public.products;
CREATE TRIGGER trg_log_stock_change
AFTER UPDATE OF stock ON public.products
FOR EACH ROW EXECUTE FUNCTION log_stock_change_and_notify();
