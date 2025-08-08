import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import { CommentsSection } from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

const RegionPage = () => {
  const { region } = useParams<{ region: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedPhenotype, setSelectedPhenotype] = useState<string | null>(null);

  // Mapeamento de regiões e seus fenótipos
  const regionPhenotypes: Record<string, string[]> = {
    "africa": ["Negrillo", "Hottentot", "South African", "Sudanese", "Tropical", "Nilotic"],
    "asia": ["Dravídico", "Indo-Ariano", "Mongolóide", "Malaio", "Sino-Tibetano"],
    "europa": ["Mediterrâneo", "Nórdico", "Alpino", "Dinárico", "Ibérico", "Catalão"],
    "america-do-norte": ["Ameríndio", "Anglo-Saxão", "Hispânico"],
    "america-do-sul": ["Atlântida", "Ameríndio", "Mestiço"],
    "oceania": ["Australóide", "Melanésio", "Polinésio"]
  };

  const regionNames: Record<string, string> = {
    "africa": "Africa",
    "asia": "Asia", 
    "europe": "Europe",
    "north-america": "North America",
    "south-america": "South America",
    "oceania": "Oceania"
  };

  // Dados mockados dos perfis (mesmo dados da página principal)
  const [profiles] = useState<Profile[]>([
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
      comments: []
    },
    {
      id: "4",
      name: "Amara",
      age: 26,
      location: "Lagos, Nigéria",
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Negrillo", "Sudanese"],
      likes: 73,
      votes: [
        { classification: "Negrillo", count: 67, percentage: 78.8 },
        { classification: "Sudanese", count: 12, percentage: 21.2 }
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
        { classification: "Dravídico", count: 34, percentage: 100 }
      ],
      hasUserVoted: false,
      comments: []
    }
  ]);

  const regionKey = region?.toLowerCase() || "";
  const regionDisplayName = regionNames[regionKey] || region;
  const phenotypes = regionPhenotypes[regionKey] || [];

  // Filtrar perfis baseado no fenótipo selecionado e região
  const filteredProfiles = profiles.filter(profile => {
    // Filtrar por fenótipos da região
    const hasRegionPhenotype = profile.phenotypes.some(phenotype => 
      phenotypes.some(regionPhenotype => 
        phenotype.toLowerCase().includes(regionPhenotype.toLowerCase()) ||
        regionPhenotype.toLowerCase().includes(phenotype.toLowerCase())
      )
    );
    
    if (!hasRegionPhenotype) return false;
    
    // Se um fenótipo específico está selecionado, filtrar por ele
    if (selectedPhenotype) {
      return profile.phenotypes.some(phenotype => 
        phenotype.toLowerCase().includes(selectedPhenotype.toLowerCase()) ||
        selectedPhenotype.toLowerCase().includes(phenotype.toLowerCase())
      );
    }
    
    return true;
  });

  const handleLike = (profileId: string) => {
    toast({
      title: "Like added!",
      description: "Profile liked successfully.",
    });
  };

  const handleComment = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleClassify = (profileId: string, classification: string) => {
    toast({
      title: "Classification added!",
      description: `Profile classified as ${classification}.`,
    });
  };

  const selectedProfileData = profiles.find(p => p.id === selectedProfile);

  if (!regionKey || !phenotypes.length) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-phindex-dark mb-4">Region not found</h1>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="lg:ml-80 pt-20">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div>
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <h1 className="text-3xl font-bold text-phindex-dark mb-2">{regionDisplayName}</h1>
              <p className="text-muted-foreground">Explore the phenotypes of {regionDisplayName}</p>
            </div>

            {/* Filter bar */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedPhenotype ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedPhenotype(null)}
                >
                  All
                </Button>
                {phenotypes.map((phenotype) => (
                  <Button
                    key={phenotype}
                    variant={selectedPhenotype === phenotype ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedPhenotype(phenotype)}
                  >
                    {phenotype}
                  </Button>
                ))}
              </div>
            </div>

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
                        onLike={handleLike}
                        onComment={handleComment}
                        onVote={handleClassify}
                      />
                    </div>
                  ))}
                </div>
                
                {filteredProfiles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No profiles found for {selectedPhenotype ? selectedPhenotype : regionDisplayName}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar com comentários */}
              {selectedProfile && selectedProfileData && (
                <div className="lg:w-96">
                  <div className="sticky top-24">
                    <CommentsSection
                      profileId={selectedProfile}
                      comments={selectedProfileData.comments}
                      onAddComment={() => {}}
                      onLikeComment={() => {}}
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

export default RegionPage;