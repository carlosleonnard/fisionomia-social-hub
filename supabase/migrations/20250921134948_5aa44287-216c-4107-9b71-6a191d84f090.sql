-- Update handle_new_user function to not use Google Auth data
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
  
  -- Insert into profiles table with random nickname only, no Google Auth data
  INSERT INTO public.profiles (id, nickname, email)
  VALUES (
    NEW.id, 
    random_nickname,
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    updated_at = now();
    
  RETURN NEW;
END;
$$;