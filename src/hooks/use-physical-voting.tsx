import { useState, useEffect } from 'react';
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
  const [userVotes, setUserVotes] = useState<{ [key: string]: string }>(() => {
    // Load pending votes from localStorage
    if (typeof window !== 'undefined') {
      const pendingVotes = localStorage.getItem(`pendingPhysicalVotes_${profileId}`);
      if (pendingVotes) {
        try {
          return JSON.parse(pendingVotes);
        } catch {
          return {};
        }
      }
    }
    return {};
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const physicalCharacteristicTypes = [
    'Skin Color',
    'Hair Color',
    'Hair Texture', 
    'Head Breadth',
    'Body Type',
    'Nasal Breadth',
    'Facial Breadth',
    'Jaw Type',
    'Eye Color'
  ];

  const fetchPhysicalVotes = async () => {
    try {
      const characteristicsData: PhysicalCharacteristic[] = [];

      for (const characteristicType of physicalCharacteristicTypes) {
        // Fetch all votes for this characteristic
        const { data: allVotes } = await supabase
          .from('votes')
          .select('classification')
          .eq('profile_id', profileId)
          .eq('characteristic_type', characteristicType);

        // Count votes by classification
        const voteCounts: { [key: string]: number } = {};
        allVotes?.forEach(vote => {
          voteCounts[vote.classification] = (voteCounts[vote.classification] || 0) + 1;
        });

        // Calculate total and percentages
        const total = allVotes?.length || 0;
        const voteData: PhysicalVote[] = Object.entries(voteCounts).map(([option, count]) => ({
          option,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0
        })).sort((a, b) => b.count - a.count);

        characteristicsData.push({
          name: characteristicType,
          votes: voteData
        });
      }

      setCharacteristics(characteristicsData);

      // Fetch user's votes if logged in
      if (user) {
        const { data: userVoteData } = await supabase
          .from('votes')
          .select('characteristic_type, classification')
          .eq('profile_id', profileId)
          .eq('user_id', user.id)
          .in('characteristic_type', physicalCharacteristicTypes);

        const votes: { [key: string]: string } = {};
        userVoteData?.forEach(vote => {
          votes[vote.characteristic_type] = vote.classification;
        });
        
        // Merge with any pending votes from localStorage
        const pendingVotes = localStorage.getItem(`pendingPhysicalVotes_${profileId}`);
        if (pendingVotes) {
          try {
            const parsedPendingVotes = JSON.parse(pendingVotes);
            Object.assign(votes, parsedPendingVotes);
          } catch {
            // Invalid JSON, ignore
          }
        }
        
        setUserVotes(votes);
      }
    } catch (error) {
      console.error('Error fetching physical votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (characteristicType: string, classification: string) => {
    if (!user) {
      // Store pending vote in localStorage for non-logged users
      const newVotes = { ...userVotes, [characteristicType]: classification };
      setUserVotes(newVotes);
      localStorage.setItem(`pendingPhysicalVotes_${profileId}`, JSON.stringify(newVotes));
      
      toast({
        title: "Login required",
        description: "You need to be logged in to vote",
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

      const newVotes = { ...userVotes, [characteristicType]: classification };
      setUserVotes(newVotes);
      
      // Update localStorage with current votes
      localStorage.setItem(`pendingPhysicalVotes_${profileId}`, JSON.stringify(newVotes));
      
      await fetchPhysicalVotes();

      return true;
    } catch (error: any) {
      toast({
        title: "Voting error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPhysicalVotes();
  }, [profileId, user]);

  return {
    characteristics,
    userVotes,
    loading,
    castVote,
    hasUserVoted: (characteristicType: string) => !!userVotes[characteristicType]
  };
};