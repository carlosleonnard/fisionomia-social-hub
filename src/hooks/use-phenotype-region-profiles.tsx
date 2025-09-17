import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * HOOK PARA BUSCAR PERFIS POR GENERAL PHENOTYPE PRIMÁRIO
 * 
 * Este hook busca perfis da tabela complete_profiles filtrados pela região
 * baseado no general_phenotype_primary mais votado para cada perfil.
 */

/**
 * MAPEAMENTO DE GENERAL PHENOTYPE PARA REGIÕES
 * 
 * Define qual região cada general phenotype pertence conforme classificação fornecida.
 */
const phenotypeToRegionMapping: Record<string, string[]> = {
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
 * INTERFACE DO PERFIL COM PHENOTYPE
 * 
 * Define a estrutura dos dados do perfil com informações de phenotype.
 */
export interface PhenotypeProfile {
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
  created_at: string;
  updated_at: string;
  user_id: string;
  profile_id: string;
  general_phenotype_primary: string | null;
  general_phenotype_secondary: string | null;
  general_phenotype_tertiary: string | null;
  slug?: string;
  user_profiles?: {
    slug: string;
  };
}

/**
 * FUNÇÃO PARA DETERMINAR SE UM PHENOTYPE PERTENCE À REGIÃO
 * 
 * Verifica se um general phenotype pertence a uma região específica baseado
 * no mapeamento de classificação fornecido.
 */
const phenotypeBelongsToRegion = (phenotype: string | null, region: string): boolean => {
  if (!phenotype) return false;
  
  const regionKey = region.toLowerCase().replace(/\s+/g, '-');
  const phenotypesForRegion = phenotypeToRegionMapping[regionKey] || [];
  
  return phenotypesForRegion.some(regionPhenotype =>
    phenotype.toLowerCase().includes(regionPhenotype.toLowerCase()) ||
    regionPhenotype.toLowerCase().includes(phenotype.toLowerCase())
  );
};

/**
 * HOOK usePhenotypeRegionProfiles
 * 
 * Hook principal que busca e filtra perfis por região baseado no general phenotype primário.
 * 
 * @param region - Nome da região para filtrar os perfis
 * @returns Objeto contendo os perfis filtrados e estado de carregamento
 */
export const usePhenotypeRegionProfiles = (region: string | undefined) => {
  return useQuery({
    queryKey: ["phenotype-region-profiles", region],
    queryFn: async (): Promise<PhenotypeProfile[]> => {
      // Buscar perfis da tabela complete_profiles com JOIN para pegar o slug
      const { data: profiles, error } = await supabase
        .from("complete_profiles")
        .select(`
          *,
          user_profiles!inner(slug)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar perfis:", error);
        throw error;
      }

      if (!region || !profiles) {
        return [];
      }

      // Filtrar perfis que pertencem à região baseado no general_phenotype_primary
      const filteredProfiles = profiles.filter((profile) => 
        phenotypeBelongsToRegion(profile.general_phenotype_primary, region)
      );

      // Mapear os dados para incluir o slug do user_profiles
      const mappedProfiles = filteredProfiles.map(profile => ({
        ...profile,
        slug: profile.user_profiles?.slug
      }));

      return mappedProfiles as PhenotypeProfile[];
    },
    enabled: !!region, // Só executa a query se a região estiver definida
  });
};