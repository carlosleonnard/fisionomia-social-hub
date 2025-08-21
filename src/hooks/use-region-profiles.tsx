import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RegionProfile {
  id: string;
  slug: string;
  name: string;
  country: string;
  category: string;
  ancestry: string;
  front_image_url: string;
  profile_image_url?: string;
  height: number;
  gender: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  vote_count?: number;
}

export const useRegionProfiles = (region: string) => {
  return useQuery({
    queryKey: ['region-profiles', region],
    queryFn: async () => {
      // First get profiles from complete_profiles where region matches
      const { data: completeProfiles, error: completeError } = await supabase
        .from('complete_profiles')
        .select('*')
        .eq('region', region);

      if (completeError) {
        console.error('Error fetching complete profiles:', completeError);
        throw completeError;
      }

      if (!completeProfiles || completeProfiles.length === 0) {
        return [];
      }

      // Get corresponding user profiles
      const profileIds = completeProfiles.map(cp => cp.profile_id);
      
      const { data: userProfiles, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', profileIds);

      if (userError) {
        console.error('Error fetching user profiles:', userError);
        throw userError;
      }

      // Get vote counts for each profile
      const profilesWithVotes = await Promise.all(
        (userProfiles || []).map(async (profile) => {
          const { data: votes } = await supabase
            .from('votes')
            .select('id')
            .eq('profile_id', profile.slug);
          
          return {
            ...profile,
            vote_count: votes?.length || 0
          };
        })
      );

      // Sort by vote count descending
      return profilesWithVotes.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    },
    enabled: !!region,
  });
};