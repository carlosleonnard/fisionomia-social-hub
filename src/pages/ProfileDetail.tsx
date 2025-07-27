import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MessageSquare, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommentsSection } from "@/components/CommentsSection";
import { VotingSection } from "@/components/VotingSection";
import { VoteModal } from "@/components/VoteModal";
import { useState } from "react";

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
  image: string;
  phenotype: string;
  hairColor: string;
  hairTexture: string;
  skin: string;
  region: string;
  nasalIndex: string;
  height: string;
  cephalicIndex: string;
  eyeFolds: string;
  likes: number;
  comments: number;
  votes: Vote[];
}

// Mock data - in a real app this would come from your database
const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Sofia Martinez",
    age: 24,
    location: "São Paulo, Brasil",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    phenotype: "Mediterrâneo",
    hairColor: "Castanho escuro",
    hairTexture: "Ondulado",
    skin: "Morena clara",
    region: "América do Sul",
    nasalIndex: "Mesorrino",
    height: "1.68m",
    cephalicIndex: "Mesocéfalo",
    eyeFolds: "Ausente",
    likes: 42,
    comments: 18,
    votes: [
      { classification: "Mediterrâneo", count: 35, percentage: 58.3 },
      { classification: "Latino", count: 15, percentage: 25.0 },
      { classification: "Ibérico", count: 10, percentage: 16.7 }
    ]
  },
  // Add more profiles as needed
];

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [showVoting, setShowVoting] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Para Supabase integration

  const profile = mockProfiles.find(p => p.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-phindex-dark/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Perfil não encontrado</h1>
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - igual à página principal */}
          <div className="w-full lg:w-72 order-2 lg:order-1">
            <Card className="bg-card border-border/50 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-phindex-dark">REGION</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "África", "Ásia", "Europa", "América do Norte",
                      "América do Sul", "Oceania"
                    ].map((region) => (
                      <Button
                        key={region}
                        variant="outline"
                        size="sm"
                        className="text-xs py-2 px-3 h-auto"
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>
                
                 <div>
                   <h3 className="text-lg font-semibold mb-4 text-phindex-dark">CATEGORIES</h3>
                   <div className="space-y-3">
                     {[
                       { icon: "🎭", name: "Pop Culture" },
                       { icon: "🎵", name: "Music and Entertainment" },
                       { icon: "🎨", name: "Arts" },
                       { icon: "🤔", name: "Philosophy" },
                       { icon: "🧪", name: "Sciences" },
                       { icon: "⚽", name: "Sports" },
                       { icon: "💼", name: "Business" },
                       { icon: "🏛️", name: "Politics" }
                     ].map((category) => (
                       <button
                         key={category.name}
                         className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors"
                       >
                         <span className="text-lg">{category.icon}</span>
                         <span className="text-sm">{category.name}</span>
                       </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Mobile Stacked Style */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="space-y-6">
              {/* Profile Image and Basic Info */}
              <Card className="bg-gradient-card border-phindex-teal/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <img 
                      src={profile.image} 
                      alt={profile.name}
                      className="w-full max-w-sm mx-auto rounded-lg mb-4"
                    />
                    <h1 className="text-2xl font-bold text-phindex-teal mb-2">
                      {profile.name}
                    </h1>
                    <p className="text-muted-foreground mb-4">
                      {profile.age} anos • {profile.location}
                    </p>
                    
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{profile.likes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span>{profile.comments}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>{profile.votes.reduce((sum, vote) => sum + vote.count, 0)}</span>
                      </div>
                    </div>

                     <div className="space-y-2">
                       {isLoggedIn ? (
                         <Button 
                           onClick={() => setShowVoteModal(true)}
                           className="w-full"
                           variant="default"
                         >
                           <Users className="mr-2 h-4 w-4" />
                           Vote
                         </Button>
                       ) : (
                         <Button 
                           disabled
                           className="w-full"
                           variant="outline"
                         >
                           <Users className="mr-2 h-4 w-4" />
                           Login para Votar
                         </Button>
                       )}
                       <Button 
                         onClick={() => setShowComments(!showComments)}
                         className="w-full"
                         variant="outline"
                       >
                         <MessageSquare className="mr-2 h-4 w-4" />
                         Comentários
                       </Button>
                     </div>
                  </div>
                </CardContent>
              </Card>

               {/* Phenotypic Classification */}
               <Card className="bg-gradient-card border-phindex-teal/20">
                 <CardHeader>
                   <CardTitle className="text-phindex-teal">Classificação Fenotípica</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {profile.votes.map((vote, index) => (
                       <div key={index} className="space-y-2">
                         <div className="flex items-center justify-between">
                           <Badge variant="secondary" className="text-sm">
                             {vote.classification}
                           </Badge>
                           <span className="text-sm font-medium">{vote.percentage}%</span>
                         </div>
                         <Progress value={vote.percentage} className="h-2" />
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>

               {/* Physical Characteristics */}
               <Card className="bg-gradient-card border-phindex-teal/20">
                 <CardHeader>
                   <CardTitle className="text-phindex-teal">Características Físicas</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     <div className="grid grid-cols-1 gap-3">
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Fenótipo</h4>
                         <p className="text-foreground">{profile.phenotype}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Cor do Cabelo</h4>
                         <p className="text-foreground">{profile.hairColor}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Textura do Cabelo</h4>
                         <p className="text-foreground">{profile.hairTexture}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Pele</h4>
                         <p className="text-foreground">{profile.skin}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Região</h4>
                         <p className="text-foreground">{profile.region}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Índice Nasal</h4>
                         <p className="text-foreground">{profile.nasalIndex}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Altura</h4>
                         <p className="text-foreground">{profile.height}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Índice Cefálico</h4>
                         <p className="text-foreground">{profile.cephalicIndex}</p>
                       </div>
                       <div className="p-3 bg-muted/30 rounded-lg">
                         <h4 className="font-semibold text-sm text-muted-foreground mb-1">Dobras Oculares</h4>
                         <p className="text-foreground">{profile.eyeFolds}</p>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        {showVoting && (
          <div className="mt-8">
            <VotingSection 
              profileId={profile.id}
              votes={profile.votes}
              hasUserVoted={false}
              onVote={(profileId, classification) => {
                console.log(`Voted for: ${classification}`);
                setShowVoting(false);
              }}
            />
          </div>
        )}

        {/* Comments Section - Fixed at bottom */}
        <div className="mt-8">
          <div className="max-w-4xl mx-auto">
            <CommentsSection 
              profileId={profile.id}
              comments={[]}
              onAddComment={(comment) => console.log('New comment:', comment)}
              onLikeComment={(commentId) => console.log('Liked comment:', commentId)}
            />
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      <VoteModal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        onSubmit={(votes) => {
          console.log('Submitted votes:', votes);
          // Aqui você processará os votos quando integrar com Supabase
        }}
      />

      <Footer />
    </div>
  );
}