import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import { useUserProfiles } from "@/hooks/use-user-profiles";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  phenotypes: string[];
  likes: number;
  comments: any[];
  votes: any[];
  hasUserVoted: boolean;
  description?: string;
  category: string;
  country: string;
}


const categoryDescriptions: Record<string, string> = {
  "community": "Perfis de pessoas anônimas e usuários comuns da plataforma",
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
  "community": "User Profiles",
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
  const { profiles, profilesLoading } = useUserProfiles();

  const categoryName = category ? categoryNames[category] : "Unknown Category";
  const categoryDescription = category ? categoryDescriptions[category] : "Categoria não encontrada";
  
  // Map URL category to database category names
  const categoryMapping: Record<string, string> = {
    "community": "User Profiles",
    "pop-culture": "Pop Culture",
    "music-and-entertainment": "Music and Entertainment",
    "arts": "Arts",
    "philosophy": "Philosophy",
    "sciences": "Sciences",
    "sports": "Sports",
    "business": "Business",
    "politics": "Politics"
  };
  
  // Filter profiles by category
  const filteredProfiles = profiles?.filter(profile => {
    const dbCategoryName = categoryMapping[category || ""];
    return profile.category === dbCategoryName;
  }) || [];

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
            {profilesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="bg-gradient-card border-phindex-teal/20">
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => navigate(`/user-profile/${profile.slug}`)}
                  >
                    <Card className="bg-gradient-card border-phindex-teal/20 overflow-hidden">
                      <div className="relative">
                         <img 
                           src={profile.front_image_url} 
                           alt={profile.name}
                           className="profile-image-thumbnail rounded-lg"
                         />
                        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-xs font-medium">{profile.country}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{profile.ancestry}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Altura: {profile.height}m</span>
                          <span>{profile.gender}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
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