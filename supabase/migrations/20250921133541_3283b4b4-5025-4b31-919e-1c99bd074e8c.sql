-- Create function to generate random nicknames
CREATE OR REPLACE FUNCTION public.generate_random_nickname()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  adjectives text[] := ARRAY[
    'Happy', 'Swift', 'Bright', 'Cool', 'Smart', 'Bold', 'Quick', 'Calm', 'Fair', 'Kind',
    'Wise', 'Fast', 'Strong', 'Gentle', 'Sharp', 'Quiet', 'Brave', 'Clear', 'Warm', 'Fresh'
  ];
  nouns text[] := ARRAY[
    'Eagle', 'Tiger', 'Wolf', 'Bear', 'Lion', 'Fox', 'Hawk', 'Owl', 'Deer', 'Rabbit',
    'Dolphin', 'Whale', 'Shark', 'Falcon', 'Raven', 'Puma', 'Lynx', 'Jaguar', 'Leopard', 'Cheetah'
  ];
  random_adjective text;
  random_noun text;
  random_number text;
  nickname text;
BEGIN
  -- Select random adjective and noun
  random_adjective := adjectives[floor(random() * array_length(adjectives, 1) + 1)];
  random_noun := nouns[floor(random() * array_length(nouns, 1) + 1)];
  random_number := lpad(floor(random() * 1000)::text, 3, '0');
  
  -- Combine them
  nickname := random_adjective || random_noun || random_number;
  
  RETURN nickname;
END;
$$;

-- Update the handle_new_user function to generate random nickname
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  random_nickname text;
BEGIN
  -- Generate random nickname
  random_nickname := public.generate_random_nickname();
  
  -- Insert into profiles table with random nickname
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', random_nickname), 
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    updated_at = now();
    
  RETURN NEW;
END;
$$;