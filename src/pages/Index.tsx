import { useState } from "react";
import { Sparkles, TrendingUp, Users, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import { AddProfileModal } from "@/components/AddProfileModal";
import { CommentsSection } from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-diversity.jpg";

interface Vote {
  classification: string;
  count: number;
  percentage: number;
}

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  phenotypes: string[];
  likes: number;
  comments: any[];
  votes: Vote[];
  hasUserVoted: boolean;
  description?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "1",
      name: "Sofia",
      age: 24,
      location: "São Paulo, SP",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Mediterrâneo", "Dinárico"],
      likes: 47,
      votes: [
        { classification: "Mediterrâneo", count: 15, percentage: 65 },
        { classification: "Dinárico", count: 8, percentage: 35 }
      ],
      hasUserVoted: false,
      comments: [
        {
          id: "c1",
          user: { name: "Carlos", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
          content: "Definitivamente traços mediterrâneos!",
          timestamp: "2h",
          likes: 5,
          isLiked: false
        }
      ]
    },
    {
      id: "2", 
      name: "Gabriel",
      age: 28,
      location: "Rio de Janeiro, RJ",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Atlântida", "Nórdico"],
      likes: 32,
      votes: [
        { classification: "Atlântida", count: 12, percentage: 75 },
        { classification: "Nórdico", count: 4, percentage: 25 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "3",
      name: "Ana",
      age: 22,
      location: "Belo Horizonte, MG", 
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Alpino"],
      likes: 28,
      votes: [
        { classification: "Alpino", count: 10, percentage: 100 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "4",
      name: "Amara",
      age: 26,
      location: "Lagos, Nigéria",
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Africano Subsaariano"],
      likes: 73,
      votes: [
        { classification: "Africano Subsaariano", count: 67, percentage: 78.8 },
        { classification: "Nigeriano", count: 12, percentage: 14.1 },
        { classification: "Banto", count: 6, percentage: 7.1 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "5",
      name: "Rajesh",
      age: 31,
      location: "Mumbai, Índia",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Dravídico"],
      likes: 29,
      votes: [
        { classification: "Dravídico", count: 34, percentage: 56.7 },
        { classification: "Indo-Ariano", count: 18, percentage: 30.0 },
        { classification: "Indiano", count: 8, percentage: 13.3 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "6",
      name: "Isabella",
      age: 25,
      location: "Barcelona, Espanha",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Ibérico"],
      likes: 51,
      votes: [
        { classification: "Ibérico", count: 41, percentage: 60.3 },
        { classification: "Mediterrâneo", count: 19, percentage: 27.9 },
        { classification: "Catalão", count: 8, percentage: 11.8 }
      ],
      hasUserVoted: false,
      comments: []
    }
  ]);

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPhenotype, setSelectedPhenotype] = useState<string | null>(null);

  // Mapeamento de regiões e seus fenótipos
  const regionPhenotypes: Record<string, string[]> = {
    "Africa": ["Negrillo", "Hottentot", "South African", "Sudanese", "Tropical", "Nilotic"],
    "Asia": ["Dravidian", "Indo-Aryan", "Mongoloid", "Malay", "Sino-Tibetan"],
    "Europe": ["Mediterranean", "Nordic", "Alpine", "Dinaric", "Iberian", "Catalan"],
    "North America": ["Amerindian", "Anglo-Saxon", "Hispanic"],
    "South America": ["Atlantid", "Amerindian", "Mestizo"],
    "Oceania": ["Australoid", "Melanesian", "Polynesian"]
  };

  const handleAddProfile = (newProfileData: {
    name: string;
    age: number;
    location: string;
    imageUrl: string;
    description: string;
  }) => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      ...newProfileData,
      phenotypes: [],
      likes: 0,
      comments: [],
      votes: [],
      hasUserVoted: false
    };
    
    setProfiles(prev => [newProfile, ...prev]);
    toast({
      title: "Profile added!",
      description: `${newProfileData.name} was added successfully.`,
    });
  };

  const handleLike = (profileId: string) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, likes: profile.likes + 1 }
          : profile
      )
    );
  };

  const handleComment = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleClassify = (profileId: string, classification: string) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId
          ? { 
              ...profile, 
              phenotypes: profile.phenotypes.includes(classification) 
                ? profile.phenotypes 
                : [...profile.phenotypes, classification]
            }
          : profile
      )
    );
    
    toast({
      title: "Classification added!",
      description: `Profile classified as ${classification}.`,
    });
  };

  const handleAddComment = (profileId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: { 
        name: "You", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
      },
      content,
      timestamp: "now",
      likes: 0,
      isLiked: false
    };

    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId
          ? { ...profile, comments: [...profile.comments, newComment] }
          : profile
      )
    );
  };

  const handleLikeComment = (commentId: string) => {
    setProfiles(prev => 
      prev.map(profile => ({
        ...profile,
        comments: profile.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1, isLiked: !comment.isLiked }
            : comment
        )
      }))
    );
  };

  // Função para filtrar perfis baseado na região/fenótipo selecionado
  const filteredProfiles = profiles.filter(profile => {
    if (!selectedPhenotype) return true;
    return profile.phenotypes.some(phenotype => 
      phenotype.toLowerCase().includes(selectedPhenotype.toLowerCase()) ||
      selectedPhenotype.toLowerCase().includes(phenotype.toLowerCase())
    );
  });

  const handleRegionClick = (region: string) => {
    // Converter nome da região para URL slug
    const regionSlug = region.toLowerCase()
      .replace(/\s+/g, '-')
      .replace('á', 'a')
      .replace('é', 'e')
      .replace('í', 'i')
      .replace('ó', 'o')
      .replace('ú', 'u')
      .replace('ã', 'a')
      .replace('õ', 'o')
      .replace('ç', 'c');
    
    navigate(`/region/${regionSlug}`);
  };

  const handlePhenotypeClick = (phenotype: string) => {
    setSelectedPhenotype(phenotype);
  };

  const clearFilters = () => {
    setSelectedRegion(null);
    setSelectedPhenotype(null);
  };

  const selectedProfileData = profiles.find(p => p.id === selectedProfile);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4">
        <div className="flex gap-8 pt-8">
          {/* Sidebar */}
          <AppSidebar />

          {/* Conteúdo principal */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-phindex-dark mb-2">MOST VIEWED PROFILES</h2>
              <p className="text-muted-foreground">Discover and vote on the most popular phenotypes</p>
            </div>

            {/* Barra de filtros horizontal (estilo Spotify) */}
            {selectedRegion && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-phindex-dark">{selectedRegion}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!selectedPhenotype ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedPhenotype(null)}
                  >
                    All
                  </Button>
                  {regionPhenotypes[selectedRegion]?.map((phenotype) => (
                    <Button
                      key={phenotype}
                      variant={selectedPhenotype === phenotype ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handlePhenotypeClick(phenotype)}
                    >
                      {phenotype}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Grid de perfis */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {filteredProfiles.map((profile) => (
                    <div 
                      key={profile.id}
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => navigate(`/profile/${profile.id}`)}
                    >
                      <ProfileCard
                        id={profile.id}
                        name={profile.name}
                        age={profile.age}
                        location={profile.location}
                        imageUrl={profile.imageUrl}
                        phenotypes={profile.phenotypes}
                        likes={profile.likes}
                        comments={profile.comments.length}
                        votes={profile.votes}
                        hasUserVoted={profile.hasUserVoted}
                        onLike={(id) => {
                          handleLike(id);
                        }}
                        onComment={(id) => {
                          handleComment(id);
                        }}
                        onVote={handleClassify}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar com comentários */}
              {selectedProfile && selectedProfileData && (
                <div className="lg:w-96">
                  <div className="sticky top-24">
                    <CommentsSection
                      profileId={selectedProfile}
                      comments={selectedProfileData.comments}
                      onAddComment={handleAddComment}
                      onLikeComment={handleLikeComment}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
