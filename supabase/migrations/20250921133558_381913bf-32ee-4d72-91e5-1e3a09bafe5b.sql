-- Fix search path for security
CREATE OR REPLACE FUNCTION public.generate_random_nickname()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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