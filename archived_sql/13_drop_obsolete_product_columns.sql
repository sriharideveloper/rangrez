-- Remove old obsolete schema fields from products
ALTER TABLE public.products
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS category;
