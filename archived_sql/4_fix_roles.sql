-- 1. Drop the restrictive or incorrect constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Add a relaxed constraint supporting 'user' and 'admin'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));

-- 3. Just in case, fix up any roles that were set to null or something else
UPDATE public.profiles SET role = 'user' WHERE role NOT IN ('user', 'admin') OR role IS NULL;

-- 4. Automatically create profiles for any users that got skipped because of the previous errors!
INSERT INTO public.profiles (id, full_name, role)
SELECT 
    id, 
    raw_user_meta_data->>'full_name', 
    'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
