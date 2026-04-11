-- Drop both potential conflicting signatures explicitly to fully clean the database cache
DROP FUNCTION IF EXISTS public.set_user_role(uuid, text);
DROP FUNCTION IF EXISTS public.set_user_role();

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
  IF current_user_role = 'admin' OR total_admins = 0 THEN
      UPDATE public.profiles
      SET role = new_role, updated_at = now()
      WHERE id = target_user_id;

      RETURN 'SUCCESS';
  ELSE
      RETURN 'FAIL: Unauthorized - Only existing Admins can change roles.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 

GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, text) TO authenticated;

-- Force Supabase cache reload
NOTIFY pgrst, 'reload schema';
