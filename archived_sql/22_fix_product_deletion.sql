-- Drop the existing constraint that prevents product deletion
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Allow product_id to be NULL when a product is deleted
ALTER TABLE public.order_items ALTER COLUMN product_id DROP NOT NULL;

-- Re-add the constraint with ON DELETE SET NULL
-- This ensures past orders keep their text details (title, price, quantity) even if the product is deleted.
ALTER TABLE public.order_items 
  ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
