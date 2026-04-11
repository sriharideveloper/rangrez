-- ==========================================
-- FIX PROFILES VISIBILITY ERROR
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- Right now, your Row Level Security (RLS) is likely restricting users to ONLY see their own profile.
-- Since the Admin page queries the profile table using your current session, 
-- it returns an array of length 1 (Just YOU), which triggers the "adminCount <= 1" button lock!

-- 1. Drop the restrictive SELECT policy if it exists
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2. Create the correct policy so the Dashboard can accurately count all users and admins
-- (Profiles only contain ID, Name, Avatar, and Role, which are safe to be public for a store)
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles
FOR SELECT USING (true);
