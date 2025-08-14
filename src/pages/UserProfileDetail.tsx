import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2, Vote, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Voltar ao menu
          </Link>

          {isOwner && (
            <div className="flex gap-2">
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
        </div>
      </header>

      <div className="container mx-auto px-4 pt-20 max-w-6xl">
        <div className="flex gap-8">
          {/* Sidebar - Filtros (placeholder) */}
          <div className="w-80 space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-bold">PHENOTYPE REGION</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Badge variant="outline">Africa</Badge>
                  <Badge variant="outline">Asia</Badge>
                  <Badge variant="outline">Europe</Badge>
                  <Badge variant="outline">Americas</Badge>
                  <Badge variant="outline">Middle East</Badge>
                  <Badge variant="outline">Oceania</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-bold">CATEGORIES</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm">Community</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
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