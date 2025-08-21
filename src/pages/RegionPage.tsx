import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: string;
  name: string;
  country: string;
  category: string;
  front_image_url: string;
  profile_image_url?: string;
  slug: string;
  general_phenotype_primary?: string;
  vote_count?: number;
}

interface UserProfileWithVotes extends UserProfile {
  vote_count: number;
}

const RegionPage = () => {
  const { region } = useParams<{ region: string }>();
  const navigate = useNavigate();
  
  // Mapeamento de regiões para general phenotype classifications
  const regionToPheno: Record<string, string[]> = {
    "africa": ["Subsaharan African", "North African", "Ethiopian", "Sudanese"],
    "asia": ["East Asian", "South Asian", "Southeast Asian", "Central Asian"],
    "europe": ["European", "Nordic", "Mediterranean", "Alpine"],
    "americas": ["Native American", "Mixed American", "European American"],
    "middle-east": ["Middle Eastern", "Arabian", "Persian"],
    "oceania": ["Australoid", "Polynesian", "Melanesian"]
  };

  const regionNames: Record<string, string> = {
    "africa": "África",
    "asia": "Ásia", 
    "europe": "Europa",
    "americas": "Américas",
    "middle-east": "Oriente Médio",
    "oceania": "Oceania"
  };

  // Mapeamento de códigos de países para códigos de 3 letras
  const countryCodes: Record<string, string> = {
    "US": "USA", "BR": "BRA", "IN": "IND", "IL": "ISR", "ES": "ESP", 
    "NG": "NGA", "FR": "FRA", "DE": "DEU", "IT": "ITA", "JP": "JPN",
    "CN": "CHN", "KR": "KOR", "MX": "MEX", "CA": "CAN", "AU": "AUS",
    "GB": "GBR", "RU": "RUS", "AR": "ARG", "EG": "EGY", "ZA": "ZAF"
  };

  const regionKey = region?.toLowerCase() || "";
  const regionDisplayName = regionNames[regionKey] || region;
  const relevantPhenotypes = regionToPheno[regionKey] || [];

  // Fetch profiles filtered by general phenotype primary
  const { data: profiles = [], isLoading } = useQuery<UserProfileWithVotes[]>({
    queryKey: ['region-profiles', regionKey],
    queryFn: async (): Promise<UserProfileWithVotes[]> => {
      if (relevantPhenotypes.length === 0) return [];
      
      // Get user profiles with their complete profile data
      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select(`
          id,
          name,
          country,
          category,
          front_image_url,
          profile_image_url,
          slug
        `);

      if (!userProfiles) return [];

      // Get complete profiles with general phenotype data
      const { data: completeProfiles } = await supabase
        .from('complete_profiles')
        .select('profile_id, general_phenotype_primary')
        .in('general_phenotype_primary', relevantPhenotypes);

      if (!completeProfiles) {
        // Add vote count to all profiles if no phenotype filtering
        const profilesWithVotes = await Promise.all(
          userProfiles.map(async (profile) => {
            const { data: votes } = await supabase
              .from('votes')
              .select('id')
              .eq('profile_id', profile.slug);
            
            return {
              ...profile,
              vote_count: votes?.length || 0
            };
          })
        );
        return profilesWithVotes;
      }

      // Filter user profiles that have matching general phenotype
      const matchingProfileIds = completeProfiles.map(cp => cp.profile_id);
      const filteredProfiles = userProfiles.filter(up => 
        matchingProfileIds.includes(up.id)
      );

      // Get vote counts for each profile
      const profilesWithVotes = await Promise.all(
        filteredProfiles.map(async (profile) => {
          const { data: votes } = await supabase
            .from('votes')
            .select('id')
            .eq('profile_id', profile.slug);
          
          return {
            ...profile,
            vote_count: votes?.length || 0
          };
        })
      );

      return profilesWithVotes;
    },
    enabled: !!regionKey && relevantPhenotypes.length > 0
  });

  if (!regionKey || relevantPhenotypes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Região não encontrada</h1>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      
      <div className="container px-4 max-w-none">
        <div className="lg:ml-80 pt-20">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div className="bg-slate-100">
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">{regionDisplayName}</h1>
              <p className="text-muted-foreground mb-4">
                Perfis com fenótipo primário relacionado à {regionDisplayName}
              </p>
              
              {relevantPhenotypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {relevantPhenotypes.map((phenotype) => (
                    <Badge key={phenotype} variant="outline">
                      {phenotype}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-48 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {profiles.map((profile) => (
                  <Card 
                    key={profile.id}
                    className="cursor-pointer transition-transform hover:scale-105 overflow-hidden"
                    onClick={() => navigate(`/user-profile/${profile.slug}`)}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={profile.front_image_url} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span>{profile.vote_count || 0} votos</span>
                      </div>
                      <div className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
                        {countryCodes[profile.country] || "XXX"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-foreground mb-1">{profile.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {profile.category}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {!isLoading && profiles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum perfil encontrado para {regionDisplayName}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Fenótipos procurados: {relevantPhenotypes.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegionPage;