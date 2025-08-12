import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfileCreator = (profileId: string) => {
  return useQuery({
    queryKey: ['profile-creator', profileId],
    queryFn: async () => {
      // First get the profile data to find the user_id (creator)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles_data')
        .select('user_id, created_at')
        .eq('profile_id', profileId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        return null;
      }

      // Then get the creator's profile information
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', profileData.user_id)
        .single();

      if (creatorError) {
        throw creatorError;
      }

      return {
        creatorName: creatorData?.name || 'Usuário',
        createdAt: profileData.created_at
      };
    },
    enabled: !!profileId
  });
};