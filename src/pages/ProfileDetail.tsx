import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MessageSquare, Vote, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { CommentsSection } from "@/components/CommentsSection";
import { VotingSection } from "@/components/VotingSection";
import { VoteModal } from "@/components/VoteModal";
import { useState } from "react";

interface Vote {
  classification: string;
  count: number;
  percentage: number;
}

interface CharacteristicVote {
  option: string;
  count: number;
  percentage: number;
}

interface PhysicalCharacteristic {
  name: string;
  votes: CharacteristicVote[];
}

interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: string;
  location: string;
  description: string;
  frontImage: string;
  sideImage: string;
  phenotype: string;
  hairColor: string;
  hairTexture: string;
  skin: string;
  region: string;
  nasalIndex: string;
  cephalicIndex: string;
  eyeFolds: string;
  likes: number;
  comments: number;
  votes: Vote[];
  physicalCharacteristics: PhysicalCharacteristic[];
}

// Mock data - in a real app this would come from your database
const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Sofia Martinez",
    age: 24,
    gender: "Feminino",
    height: "1.68m",
    location: "São Paulo, Brazil",
    description: "Minha família é de origem espanhola e italiana, com algumas influências indígenas brasileiras. Meus avós paternos vieram da Galícia, Espanha, e meus avós maternos do norte da Itália.",
    frontImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    sideImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    phenotype: "Mediterranean",
    hairColor: "Dark Brown",
    hairTexture: "Wavy",
    skin: "Light Brown",
    region: "South America",
    nasalIndex: "Mesorrhine",
    cephalicIndex: "Mesocephalic",
    eyeFolds: "Absent",
    likes: 42,
    comments: 18,
    votes: [
      { classification: "Mediterranean", count: 35, percentage: 58.3 },
      { classification: "Latino", count: 15, percentage: 25.0 },
      { classification: "Iberian", count: 10, percentage: 16.7 }
    ],
    physicalCharacteristics: [
      {
        name: "Hair Color",
        votes: [
          { option: "Black", count: 45, percentage: 60 },
          { option: "Dark Brown", count: 25, percentage: 33 },
          { option: "Brown", count: 5, percentage: 7 }
        ]
      },
      {
        name: "Hair Texture",
        votes: [
          { option: "Ondulado", count: 50, percentage: 67 },
          { option: "Liso", count: 20, percentage: 27 },
          { option: "Cacheado", count: 5, percentage: 6 }
        ]
      },
      {
        name: "Eye Color",
        votes: [
          { option: "Brown", count: 50, percentage: 67 },
          { option: "Hazel", count: 20, percentage: 27 },
          { option: "Green", count: 5, percentage: 6 }
        ]
      },
      {
        name: "Skin Tone",
        votes: [
          { option: "Light Brown", count: 40, percentage: 53 },
          { option: "Medium Brown", count: 25, percentage: 34 },
          { option: "Olive", count: 10, percentage: 13 }
        ]
      },
      {
        name: "Nasal Breadth",
        votes: [
          { option: "Médio", count: 45, percentage: 60 },
          { option: "Estreito", count: 20, percentage: 27 },
          { option: "Largo", count: 10, percentage: 13 }
        ]
      },
      {
        name: "Facial Breadth",
        votes: [
          { option: "Médio", count: 40, percentage: 53 },
          { option: "Largo", count: 25, percentage: 34 },
          { option: "Estreito", count: 10, percentage: 13 }
        ]
      },
      {
        name: "Body Type",
        votes: [
          { option: "Mesomorfo", count: 45, percentage: 60 },
          { option: "Ectomorfo", count: 20, percentage: 27 },
          { option: "Endomorfo", count: 10, percentage: 13 }
        ]
      },
      {
        name: "Jaw Type",
        votes: [
          { option: "Angular", count: 40, percentage: 53 },
          { option: "Quadrado", count: 25, percentage: 34 },
          { option: "Arredondado", count: 10, percentage: 13 }
        ]
      },
      {
        name: "Head Breadth",
        votes: [
          { option: "Médio", count: 50, percentage: 67 },
          { option: "Largo", count: 15, percentage: 20 },
          { option: "Estreito", count: 10, percentage: 13 }
        ]
      },
      {
        name: "Face Shape",
        votes: [
          { option: "Oval", count: 35, percentage: 47 },
          { option: "Round", count: 20, percentage: 27 },
          { option: "Square", count: 20, percentage: 26 }
        ]
      }
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
            <h1 className="text-2xl font-bold text-foreground mb-4">Profile not found</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
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
          Back
        </Button>

        <div className="flex gap-8">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Profile Images and Basic Info */}
                <Card className="bg-gradient-card border-phindex-teal/20">
                  <CardContent className="p-6">
                    <div className="text-center">
                      {/* Duas fotos lado a lado */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <img 
                            src={profile.frontImage} 
                            alt={`${profile.name} - frente`}
                            className="w-full max-w-xs mx-auto rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground mt-2">Frente</p>
                        </div>
                        <div className="text-center">
                          <img 
                            src={profile.sideImage} 
                            alt={`${profile.name} - lado`}
                            className="w-full max-w-xs mx-auto rounded-lg"
                          />
                          <p className="text-xs text-muted-foreground mt-2">Perfil</p>
                        </div>
                      </div>
                      <h1 className="text-2xl font-bold text-phindex-teal mb-2">
                        {profile.name}
                      </h1>
                      <p className="text-muted-foreground mb-4">
                        {profile.age} anos • {profile.gender} • {profile.height} • {profile.location}
                      </p>
                      
                      {/* Ancestry Description */}
                      <div className="mb-6 p-4 bg-muted/30 rounded-lg text-left">
                        <h3 className="text-sm font-semibold text-phindex-teal mb-2">Ancestralidade Conhecida</h3>
                        <p className="text-sm text-foreground leading-relaxed">
                          {profile.description}
                        </p>
                      </div>
                      
                      <div className="flex justify-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Vote className="h-4 w-4 text-phindex-teal" />
                          <span>{profile.likes} votos</span>
                        </div>
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:text-phindex-teal"
                          onClick={() => {
                            const commentsSection = document.querySelector('[data-comments-section]');
                            if (commentsSection) {
                              commentsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <span>{profile.comments}</span>
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
                             Login to Vote
                           </Button>
                         )}
                       </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phenotypic Classification */}
                <Card className="bg-gradient-card border-phindex-teal/20">
                  <CardHeader>
                    <CardTitle className="text-phindex-teal">Phenotypic Classification</CardTitle>
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

              </div>

              {/* Right Column - Physical Characteristics with Bar Charts */}
              <div className="space-y-6">
                <Card className="bg-gradient-card border-phindex-teal/20">
                  <CardHeader>
                    <CardTitle className="text-phindex-teal flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      Physical Characteristics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {profile.physicalCharacteristics.map((characteristic, index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold text-sm text-phindex-teal mb-3">
                            {characteristic.name}
                          </h4>
                          <div className="space-y-2">
                            {characteristic.votes.map((vote, voteIndex) => (
                              <div key={voteIndex} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-foreground">{vote.option}</span>
                                  <span className="text-muted-foreground">
                                    {vote.count} votes ({vote.percentage}%)
                                  </span>
                                </div>
                                <Progress value={vote.percentage} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Comments Section - Fixed below the grid */}
            <div className="mt-8" data-comments-section>
              <CommentsSection 
                profileId={profile.id}
                comments={[]}
                onAddComment={(comment) => console.log('New comment:', comment)}
                onLikeComment={(commentId) => console.log('Liked comment:', commentId)}
              />
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