import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * HOOK PARA PERFIS POR REGIÃO BASEADO EM VOTAÇÃO GEOGRÁFICA
 * 
 * Este hook busca perfis filtrados por região baseado na classificação
 * "Primary Geographic" mais votada para cada perfil na tabela votes.
 */

/**
 * MAPEAMENTO DE CLASSIFICAÇÕES GEOGRÁFICAS PARA REGIÕES
 * 
 * Define quais classificações geográficas pertencem a cada região.
 */
const geographicToRegionMapping: Record<string, string[]> = {
  "europe": [
    "Eastern Europe",
    "Central Europe", 
    "Southern Europe",
    "Northern Europe"
  ],
  "africa": [
    "North Africa",
    "East Africa",
    "Sub-Saharan Africa"
  ],
  "middle-east": [
    "Levant",
    "Anatólia", 
    "Arabian Peninsula",
    "Persian Plateau"
  ],
  "asia": [
    "Central Asia",
    "Eastern Asia",
    "Southern Asia", 
    "Southeastern Asia"
  ],
  "americas": [
    "Northern America",
    "Central America",
    "Southern América"
  ],
  "oceania": [
    "Australia and New Zealand",
    "Melanesia",
    "Polynesia"
  ]
};

/**
 * INTERFACE DO PERFIL REGIONAL
 */
export interface GeographicRegionProfile {
  id: string;
  name: string;
  country: string;
  ancestry: string;
  category: string;
  gender: string;
  height: number;
  front_image_url: string;
  profile_image_url: string | null;
  is_anonymous: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  most_voted_geographic?: string;
}

/**
 * FUNÇÃO PARA DETERMINAR SE UM PERFIL PERTENCE À REGIÃO
 * 
 * Verifica se a classificação geográfica mais votada do perfil
 * pertence à região especificada.
 */
const belongsToRegion = (mostVotedGeographic: string | undefined, region: string): boolean => {
  if (!mostVotedGeographic) return false;
  
  const regionKey = region.toLowerCase().replace(/\s+/g, '-');
  const classificationsForRegion = geographicToRegionMapping[regionKey] || [];
  
  return classificationsForRegion.some(classification =>
    classification.toLowerCase() === mostVotedGeographic.toLowerCase()
  );
};

/**
 * HOOK useGeographicRegionProfiles
 * 
 * Hook principal que busca perfis e os filtra por região baseado
 * na classificação "Primary Geographic" mais votada.
 * 
 * @param region - Nome da região para filtrar os perfis
 * @returns Objeto contendo os perfis filtrados e estado de carregamento
 */
export const useGeographicRegionProfiles = (region: string | undefined) => {
  return useQuery({
    queryKey: ["geographic-region-profiles", region],
    queryFn: async (): Promise<GeographicRegionProfile[]> => {
      // Primeiro, buscar todos os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        throw profilesError;
      }

      if (!profiles || !region) {
        return [];
      }

      // Buscar todas as votações "Primary Geographic"
      const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("profile_id, classification")
        .eq("characteristic_type", "Primary Geographic");

      if (votesError) {
        console.error("Erro ao buscar votações:", votesError);
        throw votesError;
      }

      if (!votes) {
        return [];
      }

      // Agrupar votações por profile_id e contar classificações
      const voteCounts: Record<string, Record<string, number>> = {};
      
      votes.forEach(vote => {
        if (!voteCounts[vote.profile_id]) {
          voteCounts[vote.profile_id] = {};
        }
        
        if (!voteCounts[vote.profile_id][vote.classification]) {
          voteCounts[vote.profile_id][vote.classification] = 0;
        }
        
        voteCounts[vote.profile_id][vote.classification]++;
      });

      // Encontrar a classificação mais votada para cada perfil
      const mostVotedGeographic: Record<string, string> = {};
      
      Object.entries(voteCounts).forEach(([profileId, classifications]) => {
        let maxVotes = 0;
        let mostVoted = "";
        
        Object.entries(classifications).forEach(([classification, count]) => {
          if (count > maxVotes) {
            maxVotes = count;
            mostVoted = classification;
          }
        });
        
        if (mostVoted) {
          mostVotedGeographic[profileId] = mostVoted;
        }
      });

      // Filtrar perfis que pertencem à região baseado na classificação mais votada
      const filteredProfiles = profiles.filter((profile) => {
        const profileMostVoted = mostVotedGeographic[profile.id];
        return belongsToRegion(profileMostVoted, region);
      }).map(profile => ({
        ...profile,
        most_voted_geographic: mostVotedGeographic[profile.id]
      }));

      return filteredProfiles as GeographicRegionProfile[];
    },
    enabled: !!region, // Só executa a query se a região estiver definida
  });
};