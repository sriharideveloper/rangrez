-- ==========================================
-- SECURE ROLE ASSIGNMENT FUNCTION
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- Drop it if it existed before with a different signature
DROP FUNCTION IF EXISTS public.set_user_role;

CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role text)
RETURNS void AS $$
DECLARE
  current_user_role text;
  total_admins int;
BEGIN
  -- 1. Check the role of the person making the request
  SELECT role INTO current_user_role FROM public.profiles WHERE id = auth.uid();
  
  -- 2. Count total admins in the system
  SELECT count(*) INTO total_admins FROM public.profiles WHERE role = 'admin';

  -- 3. The Fool-Proof Logic
  -- If the caller is an admin, OR there are absolutely zero admins (first-time setup)
  IF current_user_role = 'admin' OR total_admins = 0 THEN
      
      -- Proceed with giving the target user the new role
      UPDATE public.profiles
      SET role = new_role, updated_at = now()
      WHERE id = target_user_id;

      RETURN;
  ELSE
      -- Hacker or unauthorized user trying to run this
      RAISE EXCEPTION 'Unauthorized: Only existing Admins can change roles.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER bypasses RLS so it strictly uses the logic above

-- Ensures authorized authenticated users have execution permission
GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, text) TO authenticated;
