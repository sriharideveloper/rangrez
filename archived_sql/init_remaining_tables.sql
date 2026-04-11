-- 1. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Policies for Testimonials
CREATE POLICY "Public can read featured testimonials" 
ON public.testimonials FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials FOR ALL 
USING (auth.jwt() ->> 'role' = 'authenticated');


-- 2. Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Contact Submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for Contact Submissions
CREATE POLICY "Public can insert contact submissions" 
ON public.contact_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions" 
ON public.contact_submissions FOR SELECT 
USING (auth.jwt() ->> 'role' = 'authenticated');


-- 3. Cleanup Mock Data (Orders)
-- WARNING: This clears all existing orders.
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;


-- 4. Ensure Orders RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
-- (Add more policies as needed for the checkout flow)
