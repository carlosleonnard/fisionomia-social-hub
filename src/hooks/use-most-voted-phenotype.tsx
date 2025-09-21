import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MostVotedPhenotype {
  classification: string;
  count: number;
}

export const useMostVotedPhenotype = (profileSlug: string) => {
  const [mostVotedPhenotype, setMostVotedPhenotype] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostVotedPhenotype = async () => {
      if (!profileSlug) {
        setLoading(false);
        return;
      }

      try {
        // Query para buscar o fenótipo específico mais votado
        const { data, error } = await supabase
          .from('votes')
          .select('classification')
          .eq('profile_id', profileSlug)
          .eq('characteristic_type', 'specific_phenotype_primary')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching most voted phenotype:', error);
          setMostVotedPhenotype(null);
          return;
        }

        if (!data || data.length === 0) {
          setMostVotedPhenotype(null);
          return;
        }

        // Contar ocorrências de cada classificação
        const counts: Record<string, number> = {};
        data.forEach(vote => {
          counts[vote.classification] = (counts[vote.classification] || 0) + 1;
        });

        // Encontrar o mais votado
        const mostVoted = Object.entries(counts).reduce((max, [classification, count]) => {
          return count > max.count ? { classification, count } : max;
        }, { classification: '', count: 0 });

        setMostVotedPhenotype(mostVoted.count > 0 ? mostVoted.classification : null);
      } catch (error) {
        console.error('Error fetching most voted phenotype:', error);
        setMostVotedPhenotype(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMostVotedPhenotype();
  }, [profileSlug]);

  return { mostVotedPhenotype, loading };
};