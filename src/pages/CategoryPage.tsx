import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";

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
}

// Mock data - in a real app this would come from your database
const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Sofia Martinez",
    age: 24,
    location: "São Paulo, Brazil",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    phenotypes: ["Mediterranean", "Latino"],
    likes: 42,
    comments: [],
    votes: [],
    hasUserVoted: false,
    category: "Pop Culture"
  },
  {
    id: "2",
    name: "John Smith",
    age: 28,
    location: "New York, USA",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    phenotypes: ["Nordic", "Alpine"],
    likes: 35,
    comments: [],
    votes: [],
    hasUserVoted: false,
    category: "User Profiles"
  },
  {
    id: "3",
    name: "Maria Silva",
    age: 30,
    location: "Rio de Janeiro, Brazil",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    phenotypes: ["Mediterranean", "Latino"],
    likes: 67,
    comments: [],
    votes: [],
    hasUserVoted: false,
    category: "Pop Culture"
  },
  {
    id: "4",
    name: "Anonymous User",
    age: 25,
    location: "São Paulo, Brazil",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    phenotypes: ["Mediterranean"],
    likes: 18,
    comments: [],
    votes: [],
    hasUserVoted: false,
    category: "User Profiles"
  }
];

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

  const categoryName = category ? categoryNames[category] : "Unknown Category";
  const categoryDescription = category ? categoryDescriptions[category] : "Categoria não encontrada";
  
  // Filter profiles by category
  const filteredProfiles = mockProfiles.filter(profile => 
    profile.category.toLowerCase().replace(' ', '-') === category
  );

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

        <div className="lg:ml-80">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
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
                    onLike={() => {}}
                    onComment={() => {}}
                    onVote={() => {}}
                  />
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