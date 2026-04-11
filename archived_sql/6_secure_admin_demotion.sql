-- ==========================================
-- SECURE ROLE ASSIGNMENT FUNCTION (UPDATED)
-- Run this script in your Supabase SQL Editor
-- ==========================================

DROP FUNCTION IF EXISTS public.set_user_role;

CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role text)
RETURNS void AS $$
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
          RAISE EXCEPTION 'Cannot demote the last admin account.';
      END IF;
  END IF;

  -- 5. The Fool-Proof Logic
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
$$ LANGUAGE plpgsql SECURITY DEFINER; 

GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, text) TO authenticated;


-- ==========================================
-- SECURE OLD ADMIN EMAIL RPC AS WELL 
-- ==========================================
CREATE OR REPLACE FUNCTION set_admin_role_by_email(p_email TEXT, p_role TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
    rows_affected INTEGER;
    caller_role TEXT;
    total_admins INTEGER;
    target_user_current_role TEXT;
BEGIN
    IF p_role NOT IN ('admin', 'user') THEN
        RETURN 'Invalid role: Must be admin or user';
    END IF;

    -- Security Check
    SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
    SELECT count(*) INTO total_admins FROM public.profiles WHERE role = 'admin';
    IF caller_role != 'admin' AND total_admins > 0 THEN
        RETURN 'Unauthorized';
    END IF;

    -- Look up the user id from auth.users securely
    SELECT id INTO target_user_id FROM auth.users WHERE email = p_email LIMIT 1;

    IF target_user_id IS NULL THEN
        RETURN 'User not found';
    END IF;

    SELECT role INTO target_user_current_role FROM public.profiles WHERE id = target_user_id;

    IF p_role != 'admin' AND target_user_current_role = 'admin' THEN
        IF total_admins <= 1 THEN
            RETURN 'Cannot demote the last admin account.';
        END IF;
    END IF;

    -- Update the role in profiles
    UPDATE public.profiles SET role = p_role WHERE id = target_user_id;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;

    IF rows_affected > 0 THEN
        RETURN 'Success';
    ELSE
        RETURN 'Failed to update profile (profile might not exist)';
    END IF;
END;
$$;

