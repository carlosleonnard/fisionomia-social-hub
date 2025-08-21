import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useGeographicVoting = (profileId: string) => {
  const [userGeographicVotes, setUserGeographicVotes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const geographicCharacteristicTypes = [
    'Primary Geographic',
    'Secondary Geographic', 
    'Tertiary Geographic',
    'Primary Phenotype',
    'Secondary Phenotype',
    'Tertiary Phenotype'
  ];

  const fetchGeographicVotes = async () => {
    try {
      // Fetch user's votes if logged in
      if (user) {
        const { data: userVoteData } = await supabase
          .from('votes')
          .select('characteristic_type, classification')
          .eq('profile_id', profileId)
          .eq('user_id', user.id)
          .in('characteristic_type', geographicCharacteristicTypes);

        const votes: { [key: string]: string } = {};
        userVoteData?.forEach(vote => {
          votes[vote.characteristic_type] = vote.classification;
        });
        setUserGeographicVotes(votes);
      }
    } catch (error) {
      console.error('Error fetching geographic votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const castGeographicVote = async (characteristicType: string, classification: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          profile_id: profileId,
          classification,
          characteristic_type: characteristicType
        }, {
          onConflict: 'user_id,profile_id,characteristic_type'
        });

      if (error) throw error;

      setUserGeographicVotes(prev => ({ ...prev, [characteristicType]: classification }));

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao votar",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchGeographicVotes();
  }, [profileId, user]);

  return {
    userGeographicVotes,
    loading,
    castGeographicVote,
    refetchVotes: fetchGeographicVotes
  };
};