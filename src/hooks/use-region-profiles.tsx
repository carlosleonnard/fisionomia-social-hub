import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * HOOK PERSONALIZADO PARA PERFIS POR REGIÃO
 * 
 * Este hook busca perfis filtrados por região geográfica baseado no país
 * e ancestralidade dos perfis cadastrados no banco de dados.
 */

/**
 * MAPEAMENTO DE PAÍSES PARA REGIÕES
 * 
 * Define qual região cada país pertence para filtrar os perfis corretamente.
 */
const countryToRegionMapping: Record<string, string[]> = {
  "africa": [
    "África do Sul", "Nigéria", "Egito", "Marrocos", "Quênia", "Gana", 
    "Etiópia", "Uganda", "Tanzânia", "Argélia", "Tunísia", "Líbia",
    "Angola", "Moçambique", "Zimbabue", "Botsuana", "Namíbia", "Zâmbia"
  ],
  "asia": [
    "China", "Japão", "Índia", "Coreia do Sul", "Tailândia", "Vietnã",
    "Filipinas", "Indonésia", "Malásia", "Singapura", "Bangladesh", "Paquistão",
    "Sri Lanka", "Myanmar", "Camboja", "Laos", "Nepal", "Mongólia", "Cazaquistão"
  ],
  "europe": [
    "Reino Unido", "França", "Alemanha", "Itália", "Espanha", "Portugal",
    "Holanda", "Bélgica", "Suíça", "Áustria", "Dinamarca", "Suécia", "Noruega",
    "Finlândia", "Polônia", "República Tcheca", "Hungria", "Grécia", "Croácia",
    "Sérvia", "Bulgária", "Romênia", "Ucrânia", "Rússia"
  ],
  "americas": [
    "Brasil", "Estados Unidos", "Canadá", "México", "Argentina", "Chile",
    "Peru", "Colômbia", "Venezuela", "Equador", "Bolívia", "Uruguai", "Paraguai",
    "Costa Rica", "Guatemala", "Honduras", "Nicarágua", "El Salvador", "Panamá",
    "Cuba", "Jamaica", "Haiti", "República Dominicana"
  ],
  "middle-east": [
    "Arábia Saudita", "Emirados Árabes Unidos", "Irã", "Iraque", "Israel",
    "Jordânia", "Líbano", "Síria", "Kuwait", "Qatar", "Bahrein", "Omã", "Iêmen",
    "Turquia", "Afeganistão"
  ],
  "oceania": [
    "Austrália", "Nova Zelândia", "Fiji", "Papua Nova Guiné", "Samoa",
    "Tonga", "Vanuatu", "Ilhas Salomão"
  ]
};

/**
 * MAPEAMENTO DE ANCESTRALIDADE PARA REGIÕES
 * 
 * Mapeia palavras-chave na ancestralidade para determinar a região.
 */
const ancestryToRegionMapping: Record<string, string[]> = {
  "africa": [
    "africana", "africano", "subsaariana", "nilótica", "bantu", "etíope"
  ],
  "asia": [
    "asiática", "asiático", "chinesa", "japonesa", "coreana", "indiana",
    "mongolóide", "sino", "tibetano", "malaio"
  ],
  "europe": [
    "europeia", "português", "portuguesa", "italiana", "alemã", "francesa",
    "inglesa", "escocesa", "irlandesa", "espanhola", "grega", "bizantina",
    "nórdica", "mediterrâneo", "alpino", "eslava"
  ],
  "americas": [
    "brasileira", "americana", "indígena", "ameríndia", "nativa americana"
  ],
  "middle-east": [
    "árabe", "persa", "turca", "levantina", "mesopotâmica"
  ],
  "oceania": [
    "australiana", "melanésia", "polinésia", "australóide"
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
}

/**
 * FUNÇÃO PARA DETERMINAR SE UM PERFIL PERTENCE À REGIÃO
 * 
 * Verifica se um perfil pertence a uma região específica baseado no
 * país e ancestralidade do perfil.
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
  
  // Verificar por país
  const countriesForRegion = countryToRegionMapping[mappingKey] || [];
  if (countriesForRegion.some(country => 
    profile.country.toLowerCase().includes(country.toLowerCase()) ||
    country.toLowerCase().includes(profile.country.toLowerCase())
  )) {
    return true;
  }
  
  // Verificar por ancestralidade
  const ancestriesForRegion = ancestryToRegionMapping[mappingKey] || [];
  if (ancestriesForRegion.some(ancestry =>
    profile.ancestry.toLowerCase().includes(ancestry.toLowerCase())
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
      // Buscar todos os perfis da tabela user_profiles
      const { data: profiles, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar perfis:", error);
        throw error;
      }

      if (!region || !profiles) {
        return [];
      }

      // Filtrar perfis que pertencem à região especificada
      const filteredProfiles = profiles.filter((profile) => 
        belongsToRegion(profile as RegionProfile, region)
      );

      return filteredProfiles as RegionProfile[];
    },
    enabled: !!region, // Só executa a query se a região estiver definida
  });
};