-- Final DB Schema Cleanup
-- Resolves conflicts from early table definitions where "total" or "items" were marked NOT NULL natively.
-- App natively uses "total_amount" and "order_items", making these legacy columns crash the API.

DO $$
BEGIN
    ALTER TABLE public.orders ALTER COLUMN "total" DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN 
    -- Column might not exist, ignore freely.
END $$;

DO $$
BEGIN
    ALTER TABLE public.orders ALTER COLUMN "items" DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN 
    -- Column might not exist, ignore freely.
END $$;
