-- ==========================================
-- ULTIMATE SECURE ROLE ASSIGNMENT FUNCTION
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- We are dropping the old function to rebuild it.
-- Returning TEXT instead of VOID stops Supabase from throwing HTTP 400 errors, 
-- allowing the UI to actually read the custom error message.
DROP FUNCTION IF EXISTS public.set_user_role;

CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role text)
RETURNS text AS $$
DECLARE
  current_user_role text;
  total_admins int;
  target_user_current_role text;
BEGIN
  -- 1. Check the role of the person making the request
  SELECT role INTO current_user_role FROM public.profiles WHERE id = auth.uid();
  
  -- 2. Count total admins in the system
  SELECT count(*) INTO total_admins FROM public.profiles WHERE role = 'admin';

  -- 3. Check the target's current role
  SELECT role INTO target_user_current_role FROM public.profiles WHERE id = target_user_id;

  -- 4. Prevent demotion of the last admin
  IF new_role != 'admin' AND target_user_current_role = 'admin' THEN
      IF total_admins <= 1 THEN
          RETURN 'FAIL: Cannot demote the last admin account.';
      END IF;
  END IF;

  -- 5. The Fool-Proof Logic
  -- If the caller is an admin, OR there are absolutely zero admins (first-time setup)
  IF current_user_role = 'admin' OR total_admins = 0 THEN
      
      -- Proceed with giving the target user the new role
      UPDATE public.profiles
      SET role = new_role, updated_at = now()
      WHERE id = target_user_id;

      RETURN 'SUCCESS';
  ELSE
      -- Hacker or unauthorized user trying to run this
      RETURN 'FAIL: Unauthorized - Only existing Admins can change roles.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 

GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, text) TO authenticated;
