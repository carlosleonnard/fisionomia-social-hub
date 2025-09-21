-- Add nickname and avatar_url columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN nickname TEXT,
ADD COLUMN avatar_url TEXT;

-- Add unique constraint for nickname
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_nickname_unique UNIQUE (nickname);

-- Update existing profiles with random nicknames
UPDATE public.profiles 
SET nickname = public.generate_random_nickname() 
WHERE nickname IS NULL;

-- Make nickname NOT NULL after setting values
ALTER TABLE public.profiles 
ALTER COLUMN nickname SET NOT NULL;

-- Update the handle_new_user function to include nickname
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
DECLARE
  random_nickname text;
BEGIN
  -- Generate random nickname
  random_nickname := public.generate_random_nickname();
  
  -- Insert into profiles table with random nickname
  INSERT INTO public.profiles (id, name, email, nickname)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', random_nickname), 
    NEW.email,
    random_nickname
  )
  ON CONFLICT (id) DO UPDATE SET
    updated_at = now();
    
  RETURN NEW;
END;
$$;