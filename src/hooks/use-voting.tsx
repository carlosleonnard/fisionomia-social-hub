import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface Vote {
  classification: string;
  count: number;
  percentage: number;
}

export const useVoting = (profileId: string) => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVotes = async () => {
    try {
      // Fetch all votes for this profile
      const { data: allVotes } = await supabase
        .from('votes')
        .select('classification')
        .eq('profile_id', profileId)
        .eq('characteristic_type', 'phenotype');

      // Count votes by classification
      const voteCounts: { [key: string]: number } = {};
      allVotes?.forEach(vote => {
        voteCounts[vote.classification] = (voteCounts[vote.classification] || 0) + 1;
      });

      // Calculate total and percentages
      const total = allVotes?.length || 0;
      const voteData: Vote[] = Object.entries(voteCounts).map(([classification, count]) => ({
        classification,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      })).sort((a, b) => b.count - a.count);

      setVotes(voteData);

      // Check if current user has voted
      if (user) {
        const { data: userVoteData } = await supabase
          .from('votes')
          .select('classification')
          .eq('profile_id', profileId)
          .eq('user_id', user.id)
          .eq('characteristic_type', 'phenotype')
          .single();

        setUserVote(userVoteData?.classification || null);
      }
    } catch (error) {
      console.error('Error fetching votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (classification: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Insert or update vote (upsert)
      const { error } = await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          profile_id: profileId,
          classification,
          characteristic_type: 'phenotype'
        });

      if (error) throw error;

      setUserVote(classification);
      await fetchVotes(); // Refresh vote counts

      toast({
        title: "Voto registrado!",
        description: `Você votou em ${classification}`,
      });

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
    fetchVotes();
  }, [profileId, user]);

  const changeVote = async (newClassification: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Update existing vote
      const { error } = await supabase
        .from('votes')
        .update({
          classification: newClassification,
        })
        .eq('user_id', user.id)
        .eq('profile_id', profileId)
        .eq('characteristic_type', 'phenotype');

      if (error) throw error;

      setUserVote(newClassification);
      await fetchVotes(); // Refresh vote counts

      toast({
        title: "Voto atualizado!",
        description: `Você mudou seu voto para ${newClassification}`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar voto",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    votes,
    userVote,
    loading,
    castVote,
    changeVote,
    hasUserVoted: !!userVote
  };
};