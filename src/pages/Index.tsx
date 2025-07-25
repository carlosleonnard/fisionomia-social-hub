import { useState } from "react";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { AddProfileModal } from "@/components/AddProfileModal";
import { CommentsSection } from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
    }
  ]);

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

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
      title: "Perfil adicionado!",
      description: `${newProfileData.name} foi adicionado com sucesso.`,
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
      title: "Classificação adicionada!",
      description: `Perfil classificado como ${classification}.`,
    });
  };

  const handleAddComment = (profileId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: { 
        name: "Você", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
      },
      content,
      timestamp: "agora",
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

  const selectedProfileData = profiles.find(p => p.id === selectedProfile);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4">
        <div className="flex gap-8 pt-8">
          {/* Sidebar com categorias */}
          <div className="w-72 hidden lg:block">
            <Card className="bg-card border-border/50 p-6 sticky top-24">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Filtrar por fenótipo</label>
                  <select className="w-full mt-2 p-3 border border-border rounded-lg bg-muted/30 focus:border-primary/50">
                    <option>Select a phenotype</option>
                    <option>Mediterrâneo</option>
                    <option>Nórdico</option>
                    <option>Atlântida</option>
                    <option>Alpino</option>
                    <option>Dinárico</option>
                    <option>Báltico</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-phindex-dark">CATEGORIES</h3>
                  <div className="space-y-3">
                    {[
                      { letter: "A", name: "Pop Culture" },
                      { letter: "B", name: "Music and Entertainment" },
                      { letter: "Γ", name: "Arts" },
                      { letter: "Δ", name: "Philosophy" },
                      { letter: "E", name: "Sciences" },
                      { letter: "Z", name: "Sports" },
                      { letter: "H", name: "Business" },
                      { letter: "Θ", name: "Internet" }
                    ].map((category) => (
                      <button
                        key={category.letter}
                        className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-phindex-teal font-bold text-lg">{category.letter}</span>
                        <span className="text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <AddProfileModal onAddProfile={handleAddProfile} />
                </div>
              </div>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-phindex-dark mb-2">MOST VIEWED PROFILES</h2>
              <p className="text-muted-foreground">Descubra e vote nos fenótipos mais populares</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Grid de perfis */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {profiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
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
    </div>
  );
};

export default Index;
