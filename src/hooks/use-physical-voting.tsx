import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface PhysicalVote {
  option: string;
  count: number;
  percentage: number;
}

interface PhysicalCharacteristic {
  name: string;
  votes: PhysicalVote[];
}

export const usePhysicalVoting = (profileId: string) => {
  const [characteristics, setCharacteristics] = useState<PhysicalCharacteristic[]>([]);
  const [userVotes, setUserVotes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const physicalCharacteristicTypes = [
    'Hair Color',
    'Hair Texture', 
    'Eye Color',
    'Skin Tone',
    'Nasal Breadth',
    'Facial Breadth',
    'Body Type',
    'Jaw Type',
    'Head Breadth',
    'Face Shape'
  ];

  const fetchPhysicalVotes = useCallback(async () => {
    if (!profileId) return;
    
    try {
      // Fetch all votes at once instead of multiple queries
      const { data: allVotes } = await supabase
        .from('votes')
        .select('classification, characteristic_type, user_id')
        .eq('profile_id', profileId)
        .in('characteristic_type', physicalCharacteristicTypes);

      if (!allVotes) {
        setCharacteristics([]);
        setUserVotes({});
        return;
      }

      // Process characteristics data
      const characteristicsData: PhysicalCharacteristic[] = [];
      const userVotesData: { [key: string]: string } = {};

      physicalCharacteristicTypes.forEach(characteristicType => {
        const typeVotes = allVotes.filter(vote => vote.characteristic_type === characteristicType);
        
        // Count votes by classification
        const voteCounts: { [key: string]: number } = {};
        typeVotes.forEach(vote => {
          voteCounts[vote.classification] = (voteCounts[vote.classification] || 0) + 1;
          
          // Track user's votes
          if (user && vote.user_id === user.id) {
            userVotesData[characteristicType] = vote.classification;
          }
        });

        // Calculate total and percentages
        const total = typeVotes.length;
        const voteData: PhysicalVote[] = Object.entries(voteCounts).map(([option, count]) => ({
          option,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0
        })).sort((a, b) => b.count - a.count);

        characteristicsData.push({
          name: characteristicType,
          votes: voteData
        });
      });

      setCharacteristics(characteristicsData);
      setUserVotes(userVotesData);
    } catch (error) {
      console.error('Error fetching physical votes:', error);
    } finally {
      setLoading(false);
    }
  }, [profileId, user?.id, physicalCharacteristicTypes]);

  const castVote = async (characteristicType: string, classification: string) => {
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

      setUserVotes(prev => ({ ...prev, [characteristicType]: classification }));
      await fetchPhysicalVotes();

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
    setLoading(true);
    fetchPhysicalVotes();
  }, [fetchPhysicalVotes]);

  return {
    characteristics,
    userVotes,
    loading,
    castVote,
    hasUserVoted: (characteristicType: string) => !!userVotes[characteristicType]
  };
};