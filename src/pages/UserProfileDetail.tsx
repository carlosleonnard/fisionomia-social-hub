import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2, Vote, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { useUserProfiles } from "@/hooks/use-user-profiles";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { EditUserProfileModal } from "@/components/EditUserProfileModal";

export default function UserProfileDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProfileBySlug, deleteProfile } = useUserProfiles();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', slug],
    queryFn: () => getProfileBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-foreground">Carregando perfil...</div>
      </div>
    );
  }

  if (error || !profile) {
    return <Navigate to="/404" replace />;
  }

  const isOwner = user?.id === profile.user_id;

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
      try {
        await deleteProfile.mutateAsync(profile.id);
        navigate('/');
      } catch (error) {
        console.error('Erro ao excluir perfil:', error);
      }
    }
  };

  // Preparar imagens para o carrossel
  const images = [
    { src: profile.front_image_url, alt: `${profile.name} - frente`, label: "Frente" }
  ];
  
  if (profile.profile_image_url) {
    images.push({ 
      src: profile.profile_image_url, 
      alt: `${profile.name} - perfil`, 
      label: "Perfil" 
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-phindex-dark/20 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Button 
          onClick={() => navigate("/")} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao menu
        </Button>

        {isOwner && (
          <div className="flex gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteProfile.isPending}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleteProfile.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        )}

        <div className="lg:ml-80 pt-20">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div>
            {/* Image Carousel */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex flex-col items-center space-y-2">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-80 h-80 object-cover rounded-lg border-2 border-border"
                          />
                          <span className="text-sm text-muted-foreground">{image.label}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {images.length > 1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-primary">{profile.name}</h1>
              
              <Badge variant="secondary" className="text-sm">
                {profile.category}
              </Badge>

              {/* Placeholder for classification badges */}
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-primary/10 text-primary">1º Indefinido</Badge>
                <Badge className="bg-secondary/10 text-secondary">2º Indefinido</Badge>
                <Badge className="bg-muted/10 text-muted-foreground">3º Indefinido</Badge>
              </div>

              <div className="text-muted-foreground">
                Altura: {profile.height}m • {profile.gender} • {profile.country}
              </div>
            </div>

            {/* Known Ancestry */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Ancestralidade Conhecida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.ancestry}
                </p>
              </CardContent>
            </Card>

            {/* Profile Metadata */}
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>Criado por Usuário em {new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
              
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  <span>0 votos</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>0 comentários</span>
                </div>
              </div>

              {!user && (
                <Button variant="outline" className="mt-2">
                  Login para votar
                </Button>
              )}
            </div>

            {/* Classification Sections */}
            <div className="space-y-6">
              {/* General Phenotype Classification */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">General Phenotype Classification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Primary</h4>
                      <p className="text-sm text-muted-foreground">Nenhuma classificação ainda</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary mb-2">Secondary</h4>
                      <p className="text-sm text-muted-foreground">Nenhuma classificação ainda</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-muted-foreground mb-2">Tertiary</h4>
                      <p className="text-sm text-muted-foreground">Nenhuma classificação ainda</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specific Phenotype Classification */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Specific Phenotype Classification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Primary</h4>
                      <p className="text-sm text-muted-foreground">Nenhuma classificação ainda</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary mb-2">Secondary</h4>
                      <p className="text-sm text-muted-foreground">Nenhuma classificação ainda</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-muted-foreground mb-2">Tertiary</h4>
                      <p className="text-sm text-muted-foreground">Nenhuma classificação ainda</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Characteristics */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Physical Characteristics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "Hair Color", "Hair Texture", "Eye Color", "Skin Tone",
                      "Nasal Breadth", "Facial Breadth", "Body Type", "Jaw Type",
                      "Head Breadth", "Face Shape"
                    ].map((characteristic) => (
                      <div key={characteristic} className="space-y-2">
                        <h4 className="font-semibold text-sm">{characteristic}</h4>
                        <p className="text-xs text-muted-foreground">Nenhuma classificação ainda</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comments Section Placeholder */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comentários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">
                  Nenhum comentário ainda. {user ? 'Seja o primeiro a comentar!' : 'Faça login para comentar.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Edit Modal */}
      {showEditModal && (
        <EditUserProfileModal
          profile={profile}
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}