import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * HOOK PERSONALIZADO PARA PERFIS POR REGIÃO
 * 
 * Este hook busca perfis filtrados por região geográfica baseado no
 * fenótipo geral primário dos perfis cadastrados no banco de dados.
 */

/**
 * MAPEAMENTO DE FENÓTIPOS PARA REGIÕES
 * 
 * Define qual região cada fenótipo geral pertence baseado na classificação.
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
 * INTERFACE DO PERFIL REGIONAL
 * 
 * Define a estrutura dos dados do perfil retornados pela consulta.
 */
export interface RegionProfile {
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
  general_phenotype_primary: string;
}

/**
 * FUNÇÃO PARA DETERMINAR SE UM PERFIL PERTENCE À REGIÃO
 * 
 * Verifica se um perfil pertence a uma região específica baseado no
 * fenótipo geral primário do perfil.
 */
const belongsToRegion = (profile: RegionProfile, region: string): boolean => {
  const regionKey = region.toLowerCase().replace(/\s+/g, '-');
  
  // Mapear region key para as chaves do mapeamento
  const mappingKey = (() => {
    switch (regionKey) {
      case 'middle-east':
        return 'middle-east';
      default:
        return regionKey;
    }
  })();
  
  // Verificar por fenótipo geral primário
  const phenotypesForRegion = phenotypeToRegionMapping[mappingKey] || [];
  if (phenotypesForRegion.some(phenotype =>
    profile.general_phenotype_primary?.toLowerCase().includes(phenotype.toLowerCase()) ||
    phenotype.toLowerCase().includes(profile.general_phenotype_primary?.toLowerCase() || '')
  )) {
    return true;
  }
  
  return false;
};

/**
 * HOOK useRegionProfiles
 * 
 * Hook principal que busca e filtra perfis por região geográfica.
 * 
 * @param region - Nome da região para filtrar os perfis
 * @returns Objeto contendo os perfis filtrados e estado de carregamento
 */
export const useRegionProfiles = (region: string | undefined) => {
  return useQuery({
    queryKey: ["region-profiles", region],
    queryFn: async (): Promise<RegionProfile[]> => {
      // Buscar perfis da tabela complete_profiles com JOIN em user_profiles
      const { data: profiles, error } = await supabase
        .from("complete_profiles")
        .select(`
          *,
          user_profiles!inner(
            id,
            name,
            country,
            ancestry,
            category,
            gender,
            height,
            front_image_url,
            profile_image_url,
            is_anonymous,
            slug,
            created_at,
            updated_at,
            user_id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar perfis:", error);
        throw error;
      }

      if (!region || !profiles) {
        return [];
      }

      // Mapear os dados para a interface RegionProfile
      const mappedProfiles: RegionProfile[] = profiles.map(profile => ({
        id: profile.user_profiles.id,
        name: profile.user_profiles.name,
        country: profile.user_profiles.country,
        ancestry: profile.user_profiles.ancestry,
        category: profile.user_profiles.category,
        gender: profile.user_profiles.gender,
        height: profile.user_profiles.height,
        front_image_url: profile.user_profiles.front_image_url,
        profile_image_url: profile.user_profiles.profile_image_url,
        is_anonymous: profile.user_profiles.is_anonymous,
        slug: profile.user_profiles.slug,
        created_at: profile.user_profiles.created_at,
        updated_at: profile.user_profiles.updated_at,
        user_id: profile.user_profiles.user_id,
        general_phenotype_primary: profile.general_phenotype_primary || ""
      }));

      // Filtrar perfis que pertencem à região especificada
      const filteredProfiles = mappedProfiles.filter((profile) => 
        belongsToRegion(profile, region)
      );

      return filteredProfiles;
    },
    enabled: !!region, // Só executa a query se a região estiver definida
  });
};