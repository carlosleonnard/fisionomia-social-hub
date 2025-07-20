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

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  phenotypes: string[];
  likes: number;
  comments: any[];
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
      comments: []
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
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Diversidade fenotípica" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
        </div>
        
        <div className="relative container px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Descubra e Classifique
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Fenótipos Únicos
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma social para explorar e classificar a diversidade fenotípica humana.
              Conecte-se, aprenda e compartilhe conhecimento sobre características físicas.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <AddProfileModal onAddProfile={handleAddProfile} />
              <Button variant="outline" size="lg" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Ver Tendências
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border/50 p-6 text-center">
              <div className="space-y-2">
                <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">1,247</h3>
                <p className="text-muted-foreground">Perfis Ativos</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 p-6 text-center">
              <div className="space-y-2">
                <div className="h-12 w-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">5,892</h3>
                <p className="text-muted-foreground">Classificações</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 p-6 text-center">
              <div className="space-y-2">
                <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">98%</h3>
                <p className="text-muted-foreground">Precisão</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="py-12">
        <div className="container px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Feed principal */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Feed de Classificações</h2>
                <div className="flex gap-2">
                  <Badge variant="secondary">Recentes</Badge>
                  <Badge variant="outline">Populares</Badge>
                  <Badge variant="outline">Tendências</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    onLike={handleLike}
                    onComment={handleComment}
                    onClassify={handleClassify}
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
      </section>
    </div>
  );
};

export default Index;
