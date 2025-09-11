-- Phase 1: Restrict email exposure on profiles and provide safe RPC for public name access

-- 1) Drop overly permissive public SELECT policy on profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Profiles são públicos (select)'
  ) THEN
    EXECUTE 'DROP POLICY "Profiles são públicos (select)" ON public.profiles';
  END IF;
END $$;

-- 2) Create stricter SELECT policy: users can only view their own profile row
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 3) RPC to fetch only public-safe fields (id, name)
CREATE OR REPLACE FUNCTION public.get_public_profile_name(p_user_id uuid)
RETURNS TABLE (id uuid, name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name FROM public.profiles WHERE id = p_user_id;
$$;

-- Phase 2: Harden functions with explicit search_path

-- can_view_sensitive_profile_data
CREATE OR REPLACE FUNCTION public.can_view_sensitive_profile_data(target_user_id uuid, target_profile_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Users can see their own sensitive data
  SELECT auth.uid() = target_user_id;
$$;

-- update_user_profiles_updated_at
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- delete_comment_and_children
CREATE OR REPLACE FUNCTION public.delete_comment_and_children(comment_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all child comments first (recursively)
  DELETE FROM public.comments 
  WHERE parent_comment_id = comment_id_param;
  
  -- Delete the parent comment
  DELETE FROM public.comments 
  WHERE id = comment_id_param AND user_id = auth.uid();
END;
$$;

-- compute_region_from_general
CREATE OR REPLACE FUNCTION public.compute_region_from_general(primary_text text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF primary_text IS NULL OR btrim(primary_text) = '' THEN
    RETURN NULL;
  END IF;

  -- Normalize to lowercase for comparisons
  IF lower(primary_text) LIKE '%africa%' THEN
    RETURN 'Africa';
  ELSIF lower(primary_text) LIKE '%americas%' OR lower(primary_text) LIKE '%america%' THEN
    RETURN 'Americas';
  ELSIF lower(primary_text) LIKE '%asia%' THEN
    RETURN 'Asia';
  ELSIF lower(primary_text) LIKE '%australia%' OR lower(primary_text) LIKE '%melanesia%' OR lower(primary_text) LIKE '%polynesia%' THEN
    RETURN 'Oceania';
  ELSIF lower(primary_text) LIKE '%levant%' OR lower(primary_text) LIKE '%anatolia%' OR lower(primary_text) LIKE '%arabian peninsula%' OR lower(primary_text) LIKE '%persian plateau%' THEN
    RETURN 'Middle East';
  ELSE
    RETURN NULL; -- Not matched to specified regions
  END IF;
END;
$$;

-- set_region_from_general
CREATE OR REPLACE FUNCTION public.set_region_from_general()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.region := public.compute_region_from_general(NEW.general_phenotype_primary);
  RETURN NEW;
END;
$$;

-- generate_unique_slug
CREATE OR REPLACE FUNCTION public.generate_unique_slug(profile_name text, profile_id uuid DEFAULT NULL::uuid)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Create base slug from name (lowercase, replace spaces with hyphens, remove special chars)
  base_slug := lower(regexp_replace(trim(profile_name), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'profile';
  END IF;
  
  final_slug := base_slug;
  
  -- Check if slug exists (excluding current profile if updating)
  WHILE EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE slug = final_slug 
    AND (profile_id IS NULL OR id != profile_id)
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- create_notification
CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id uuid,
  notification_type text,
  notification_message text,
  target_profile_id text DEFAULT NULL::text,
  target_comment_id uuid DEFAULT NULL::uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, message, profile_id, comment_id)
  VALUES (target_user_id, notification_type, notification_message, target_profile_id, target_comment_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;