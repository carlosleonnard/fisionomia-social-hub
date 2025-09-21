-- Add unique constraint for nickname
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_nickname_unique UNIQUE (nickname);