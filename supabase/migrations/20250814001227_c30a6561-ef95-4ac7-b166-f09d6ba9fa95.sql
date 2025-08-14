-- Create user_profiles table for storing profile data created by authenticated users
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  country text NOT NULL,
  gender text NOT NULL,
  category text NOT NULL,
  height numeric NOT NULL,
  ancestry text NOT NULL,
  front_image_url text NOT NULL,
  profile_image_url text,
  is_anonymous boolean NOT NULL DEFAULT false,
  slug text NOT NULL UNIQUE, -- URL-friendly identifier
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view user profiles
CREATE POLICY "Anyone can view user profiles" 
ON public.user_profiles 
FOR SELECT 
USING (true);

-- Users can create their own profiles
CREATE POLICY "Users can create their own profiles" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY "Users can update their own profiles" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own profiles
CREATE POLICY "Users can delete their own profiles" 
ON public.user_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_user_profiles_updated_at();

-- Create function to generate unique slug
CREATE OR REPLACE FUNCTION public.generate_unique_slug(profile_name text, profile_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
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