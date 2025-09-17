import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { CommentsSection } from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGeographicRegionProfiles } from "@/hooks/use-geographic-region-profiles";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

/**
 * PÁGINA DE PERFIS POR REGIÃO
 * 
 * Exibe perfis filtrados por região geográfica baseado nos dados
 * reais cadastrados no banco de dados.
 */

const RegionPage = () => {
  const { region } = useParams<{ region: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Buscar perfis reais do banco de dados filtrados por região baseado em votação geográfica
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useGeographicRegionProfiles(region);

  /**
   * MAPEAMENTO DE NOMES DE REGIÕES
   * 
   * Converte os slugs das URLs para nomes de exibição das regiões.
   */
  const regionNames: Record<string, string> = {
    "africa": "África",
    "asia": "Ásia", 
    "europe": "Europa",
    "americas": "Américas",
    "middle-east": "Oriente Médio",
    "oceania": "Oceania"
  };

  // Obter o nome de exibição da região atual
  const regionKey = region?.toLowerCase() || "";
  const regionDisplayName = regionNames[regionKey] || region;

  /**
   * TRATAMENTO DE ERRO NA BUSCA DE PERFIS
   * 
   * Exibe mensagem de erro caso não consiga carregar os perfis do banco.
   */
  if (profilesError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Erro ao carregar perfis</h1>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar os perfis desta região.
            </p>
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

  /**
   * VALIDAÇÃO DA REGIÃO
   * 
   * Verifica se a região da URL é válida antes de exibir o conteúdo.
   */
  if (!regionKey || !regionNames[regionKey]) {
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
                Voltar
              </Button>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">{regionDisplayName}</h1>
              <p className="text-muted-foreground">
                Explore os perfis da {regionDisplayName}
              </p>
            </div>

            {/* Exibir loading enquanto carrega os perfis */}
            {profilesLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="bg-gradient-card border-border/50 animate-pulse">
                    <CardContent className="p-4">
                      <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Exibir perfis se não estiver carregando */}
            {!profilesLoading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">
                    Perfis da {regionDisplayName}
                  </h2>
                  <Badge variant="secondary" className="px-3 py-1">
                    {profiles?.length || 0} perfil{profiles?.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Verificar se há perfis para exibir */}
                {!profiles || profiles.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Nenhum perfil encontrado
                    </h3>
                    <p className="text-muted-foreground">
                      Não há perfis cadastrados para a região {regionDisplayName}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {profiles.map((profile) => (
                      <Link
                        key={profile.id}
                        to={`/user-profile/${profile.slug}`}
                        className="group block"
                      >
                        <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg">
                          <CardContent className="p-4">
                            <div className="relative overflow-hidden rounded-lg mb-4">
                              <img
                                src={profile.front_image_url}
                                alt={profile.name}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder.svg';
                                }}
                              />
                              <div className="absolute top-2 right-2">
                                <Badge 
                                  variant={profile.is_anonymous ? "secondary" : "default"} 
                                  className="text-xs"
                                >
                                  {profile.is_anonymous ? "Anônimo" : "Famoso"}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🏳️</span>
                                <span className="text-sm font-medium text-muted-foreground">
                                  {profile.country}
                                </span>
                              </div>
                              
                              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {profile.name}
                              </h3>
                              
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <span className="w-3 h-3 rounded-full bg-primary/20"></span>
                                  {profile.ancestry}
                                </span>
                                <span>{profile.height}m</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {profile.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
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