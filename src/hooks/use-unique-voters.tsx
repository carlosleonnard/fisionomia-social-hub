import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para obter a contagem de usuários únicos que votaram em um perfil específico
 */
export const useUniqueVoters = (profileSlug: string) => {
  return useQuery({
    queryKey: ['unique-voters', profileSlug],
    queryFn: async () => {
      if (!profileSlug) return 0;

      const { data, error } = await supabase.rpc('count_unique_voters_for_profile', {
        profile_slug: profileSlug
      });

      if (error) {
        console.error('Erro ao buscar contagem de votantes únicos:', error);
        return 0;
      }

      return data || 0;
    },
    enabled: !!profileSlug,
  });
};