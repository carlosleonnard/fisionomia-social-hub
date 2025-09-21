-- Create function to get public profile nickname
CREATE OR REPLACE FUNCTION public.get_public_profile_nickname(p_user_id uuid)
 RETURNS TABLE(id uuid, nickname text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT id, nickname FROM public.profiles WHERE id = p_user_id;
$function$;