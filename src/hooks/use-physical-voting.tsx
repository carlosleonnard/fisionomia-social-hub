import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface CharacteristicVote {
  option: string;
  count: number;
  percentage: number;
}

interface PhysicalCharacteristic {
  name: string;
  votes: CharacteristicVote[];
  userVote?: string;
}

const characteristicOptions: { [key: string]: string[] } = {
  "Hair Color": ["Black", "Dark Brown", "Brown", "Light Brown", "Blonde", "Red", "Gray", "White"],
  "Hair Texture": ["Liso", "Ondulado", "Cacheado", "Muito Cacheado"],
  "Eye Color": ["Brown", "Hazel", "Green", "Blue", "Gray", "Amber"],
  "Skin Tone": ["Very Light", "Light", "Light Brown", "Medium Brown", "Dark Brown", "Very Dark", "Olive"],
  "Nasal Breadth": ["Estreito", "Médio", "Largo"],
  "Facial Breadth": ["Estreito", "Médio", "Largo"],
  "Body Type": ["Ectomorfo", "Mesomorfo", "Endomorfo"],
  "Jaw Type": ["Arredondado", "Angular", "Quadrado"],
  "Head Breadth": ["Estreito", "Médio", "Largo"],
  "Face Shape": ["Round", "Oval", "Square", "Heart", "Diamond", "Oblong"]
};

export const usePhysicalVoting = (profileId: string) => {
  const [characteristics, setCharacteristics] = useState<PhysicalCharacteristic[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCharacteristics = async () => {
    try {
      const characteristicNames = Object.keys(characteristicOptions);
      const characteristicData: PhysicalCharacteristic[] = [];

      for (const name of characteristicNames) {
        // Fetch all votes for this characteristic
        const { data: allVotes } = await supabase
          .from('votes')
          .select('classification, user_id')
          .eq('profile_id', profileId)
          .eq('characteristic_type', name.toLowerCase().replace(' ', '_'));

        // Count votes by option
        const voteCounts: { [key: string]: number } = {};
        const total = allVotes?.length || 0;
        
        allVotes?.forEach(vote => {
          voteCounts[vote.classification] = (voteCounts[vote.classification] || 0) + 1;
        });

        // Create vote data with percentages
        const votes: CharacteristicVote[] = characteristicOptions[name].map(option => ({
          option,
          count: voteCounts[option] || 0,
          percentage: total > 0 ? ((voteCounts[option] || 0) / total) * 100 : 0
        })).sort((a, b) => b.count - a.count);

        // Get user's vote for this characteristic
        const userVote = user ? allVotes?.find(v => v.user_id === user.id)?.classification : undefined;

        characteristicData.push({
          name,
          votes,
          userVote
        });
      }

      setCharacteristics(characteristicData);
    } catch (error) {
      console.error('Error fetching physical characteristics:', error);
    } finally {
      setLoading(false);
    }
  };

  const castCharacteristicVote = async (characteristicName: string, option: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar",
        variant: "destructive",
      });
      return false;
    }

    try {
      const characteristicType = characteristicName.toLowerCase().replace(' ', '_');
      
      const { error } = await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          profile_id: profileId,
          classification: option,
          characteristic_type: characteristicType
        });

      if (error) throw error;

      await fetchCharacteristics(); // Refresh data

      toast({
        title: "Voto registrado!",
        description: `Você votou em ${option} para ${characteristicName}`,
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

  const changeCharacteristicVote = async (characteristicName: string, newOption: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar",
        variant: "destructive",
      });
      return false;
    }

    try {
      const characteristicType = characteristicName.toLowerCase().replace(' ', '_');
      
      const { error } = await supabase
        .from('votes')
        .update({
          classification: newOption,
        })
        .eq('user_id', user.id)
        .eq('profile_id', profileId)
        .eq('characteristic_type', characteristicType);

      if (error) throw error;

      await fetchCharacteristics(); // Refresh data

      toast({
        title: "Voto atualizado!",
        description: `Você mudou seu voto para ${newOption} em ${characteristicName}`,
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

  useEffect(() => {
    fetchCharacteristics();
  }, [profileId, user]);

  return {
    characteristics,
    loading,
    castCharacteristicVote,
    changeCharacteristicVote,
    characteristicOptions
  };
};