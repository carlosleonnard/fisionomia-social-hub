import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Voltar ao início
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

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Fotos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Foto de Frente</h4>
                  <img
                    src={profile.front_image_url}
                    alt={`Foto de frente de ${profile.name}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                {profile.profile_image_url && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Foto de Perfil</h4>
                    <img
                      src={profile.profile_image_url}
                      alt={`Foto de perfil de ${profile.name}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-foreground">{profile.name}</CardTitle>
                  <Badge variant={profile.is_anonymous ? "secondary" : "default"}>
                    {profile.is_anonymous ? "Anônimo" : "Famoso"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">País</h4>
                    <p className="text-foreground">{profile.country}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Gênero</h4>
                    <p className="text-foreground">{profile.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Categoria</h4>
                    <p className="text-foreground">{profile.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Altura</h4>
                    <p className="text-foreground">{profile.height}m</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Ancestralidade</h4>
                  <p className="text-foreground leading-relaxed">{profile.ancestry}</p>
                </div>

                <div className="text-sm text-muted-foreground pt-4 border-t border-border">
                  <p>Criado em: {new Date(profile.created_at).toLocaleDateString('pt-BR')}</p>
                  {profile.updated_at !== profile.created_at && (
                    <p>Atualizado em: {new Date(profile.updated_at).toLocaleDateString('pt-BR')}</p>
                  )}
                </div>
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