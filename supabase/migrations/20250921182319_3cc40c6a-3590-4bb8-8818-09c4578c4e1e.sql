-- Função para contar usuários únicos que votaram em um perfil específico
CREATE OR REPLACE FUNCTION public.count_unique_voters_for_profile(profile_slug text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(DISTINCT user_id)::integer
  FROM public.votes 
  WHERE profile_id = profile_slug;
$$;