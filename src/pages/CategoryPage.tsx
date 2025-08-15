import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfilesList } from "@/components/UserProfilesList";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/use-user-profiles";

const categoryDescriptions: Record<string, string> = {
  "user-profiles": "Perfis de pessoas anônimas e usuários comuns da plataforma",
  "pop-culture": "Celebridades, influenciadores e personalidades da cultura pop",
  "music-and-entertainment": "Artistas, músicos, atores e profissionais do entretenimento",
  "arts": "Artistas visuais, escritores e profissionais das artes",
  "philosophy": "Filósofos, pensadores e intelectuais",
  "sciences": "Cientistas, pesquisadores e acadêmicos",
  "sports": "Atletas, esportistas e profissionais do esporte",
  "business": "Empresários, executivos e líderes de negócios",
  "politics": "Políticos, líderes governamentais e figuras políticas"
};

const categoryNames: Record<string, string> = {
  "user-profiles": "User Profiles",
  "pop-culture": "Pop Culture",
  "music-and-entertainment": "Music and Entertainment",
  "arts": "Arts",
  "philosophy": "Philosophy",
  "sciences": "Sciences",
  "sports": "Sports",
  "business": "Business",
  "politics": "Politics"
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // Convert URL slug back to category name for database query
  const getCategoryFromSlug = (slug: string): string => {
    const categoryMap: Record<string, string> = {
      "user-profiles": "User Profiles",
      "pop-culture": "Pop Culture", 
      "music-and-entertainment": "Music and Entertainment",
      "arts": "Arts",
      "philosophy": "Philosophy",
      "sciences": "Sciences",
      "sports": "Sports",
      "business": "Business",
      "politics": "Politics"
    };
    return categoryMap[slug] || "";
  };

  const categoryName = category ? categoryNames[category] : "Unknown Category";
  const categoryDescription = category ? categoryDescriptions[category] : "Categoria não encontrada";
  const dbCategoryName = category ? getCategoryFromSlug(category) : "";

  // Fetch profiles from database filtered by category
  const { data: filteredProfiles = [], isLoading, error } = useQuery({
    queryKey: ['category-profiles', dbCategoryName],
    queryFn: async () => {
      if (!dbCategoryName) return [];
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('category', dbCategoryName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: !!dbCategoryName,
  });

  if (!category || !categoryNames[category]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-phindex-dark/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Categoria não encontrada</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-phindex-dark/20 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="lg:ml-80 pt-20">
            <AppSidebar />
            <div className="text-center">
              <div className="text-foreground">Carregando perfis...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-phindex-dark/20 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="lg:ml-80 pt-20">
            <AppSidebar />
            <div className="text-center">
              <div className="text-destructive">Erro ao carregar perfis da categoria</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
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
          Voltar
        </Button>

        <div className="lg:ml-80 pt-20">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div>
            {/* Category Header */}
            <Card className="bg-gradient-card border-phindex-teal/20 mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-phindex-teal/10 text-phindex-teal text-lg px-4 py-2">
                    {categoryName}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{filteredProfiles.length} perfis</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Categoria: {categoryName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {categoryDescription}
                </p>
              </CardContent>
            </Card>

            {/* Profiles Grid */}
            {filteredProfiles.length > 0 ? (
              <UserProfilesList profiles={filteredProfiles} />
            ) : (
              <Card className="bg-gradient-card border-phindex-teal/20">
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum perfil encontrado
                  </h3>
                  <p className="text-muted-foreground">
                    Ainda não há perfis cadastrados nesta categoria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}