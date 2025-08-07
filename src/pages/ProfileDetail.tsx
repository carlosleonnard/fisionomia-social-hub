import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MessageSquare, Vote, BarChart, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { CommentsSection } from "@/components/CommentsSection";

import { VoteModal } from "@/components/VoteModal";
import { useState } from "react";

interface Vote {
  classification: string;
  count: number;
  percentage: number;
  category: 'primary' | 'secondary' | 'tertiary';
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
  category: string;
}

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
    category: "Pop Culture",
    likes: 42,
    comments: 18,
    votes: [
      { classification: "Mediterranean", count: 35, percentage: 58.3, category: 'primary' },
      { classification: "Latino", count: 15, percentage: 25.0, category: 'primary' },
      { classification: "Iberian", count: 10, percentage: 16.7, category: 'secondary' },
      { classification: "Alpine", count: 8, percentage: 13.3, category: 'secondary' },
      { classification: "Nordic", count: 5, percentage: 8.3, category: 'tertiary' },
      { classification: "Dinaric", count: 3, percentage: 5.0, category: 'tertiary' }
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
            {/* Profile Images and Basic Info - Full width */}
            <Card className="bg-gradient-card border-phindex-teal/20 mb-6">
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
                  
                  {/* Category Badge */}
                  <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    <Badge 
                      variant="secondary" 
                      className="bg-phindex-teal/10 text-phindex-teal hover:bg-phindex-teal/20 cursor-pointer transition-colors"
                      onClick={() => navigate(`/category/${profile.category.toLowerCase().replace(' ', '-')}`)}
                    >
                      {profile.category}
                    </Badge>
                    
                    {/* Phenotype Badges */}
                    {(() => {
                      const primaryPhenotype = profile.votes
                        .filter(vote => vote.category === 'primary')
                        .sort((a, b) => b.percentage - a.percentage)[0];
                      
                      const secondaryPhenotype = profile.votes
                        .filter(vote => vote.category === 'secondary')
                        .sort((a, b) => b.percentage - a.percentage)[0];
                      
                      return (
                        <>
                          {primaryPhenotype && (
                            <Badge 
                              variant="default" 
                              className="bg-primary text-primary-foreground"
                            >
                              1º {primaryPhenotype.classification}
                            </Badge>
                          )}
                          {secondaryPhenotype && (
                            <Badge 
                              variant="outline" 
                              className="bg-secondary/20 text-secondary-foreground border-secondary"
                            >
                              2º {secondaryPhenotype.classification}
                            </Badge>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  
                  <p className="text-muted-foreground mb-2">
                    {profile.age} anos • {profile.gender} • {profile.height}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.location}</span>
                  </div>
                  
                  {/* Ancestry Description */}
                  <div className="mb-6 p-3 bg-gradient-to-br from-border/20 to-border/10 border border-border/40 rounded-xl shadow-sm">
                    <div className="p-4 bg-muted/30 rounded-lg text-left">
                      <h3 className="text-sm font-semibold text-phindex-teal mb-2">Ancestralidade Conhecida</h3>
                      <p className="text-sm text-foreground leading-relaxed">
                        {profile.description}
                      </p>
                    </div>
                  </div>

                  {/* Created By Information */}
                  <p className="text-xs text-muted-foreground text-center mb-6 -mt-2">
                    Criado por <span className="font-medium text-phindex-teal">Admin User</span> em 4 de agosto de 2025
                  </p>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:text-phindex-teal"
                      onClick={() => {
                        const votingSection = document.querySelector('[data-voting-section]');
                        if (votingSection) {
                          votingSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
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
                        onClick={() => setShowVoteModal(true)}
                        className="w-full"
                        variant="outline"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Vote
                      </Button>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Two-column layout for classifications - Each 50% width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* General Phenotype Classification */}
              <Card className="bg-gradient-card border-phindex-teal/20">
                <CardHeader>
                  <CardTitle className="text-phindex-teal">General Phenotype Classification</CardTitle>
                </CardHeader>
                <CardContent className="h-52 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Primary Geographic Region */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-phindex-teal mb-3">Primary Geographic Classification</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-sm bg-phindex-teal/10 text-phindex-teal">
                              Sul Europa
                            </Badge>
                            <span className="text-sm font-medium">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-sm bg-phindex-teal/10 text-phindex-teal">
                              América do Sul
                            </Badge>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Secondary Geographic Region */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-phindex-teal mb-3">Secondary Geographic Classification</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-sm">
                              Norte Europa
                            </Badge>
                            <span className="text-sm font-medium">8%</span>
                          </div>
                          <Progress value={8} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-sm">
                              Oriente Médio
                            </Badge>
                            <span className="text-sm font-medium">2%</span>
                          </div>
                          <Progress value={2} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Tertiary Geographic Region */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-phindex-teal mb-3">Tertiary Geographic Classification</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-sm">
                              Ásia Central
                            </Badge>
                            <span className="text-sm font-medium">2%</span>
                          </div>
                          <Progress value={2} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phenotypic Classification */}
              <Card className="bg-gradient-card border-phindex-teal/20">
                <CardHeader>
                  <CardTitle className="text-phindex-teal">Phenotypic Classification</CardTitle>
                </CardHeader>
                <CardContent className="h-52 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Primary Phenotypes */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-phindex-teal mb-3">Primary</h4>
                      <div className="space-y-3">
                        {profile.votes.filter(vote => vote.category === 'primary').map((vote, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="default" className="bg-primary text-primary-foreground text-sm">
                                {vote.classification}
                              </Badge>
                              <span className="text-sm font-medium">{vote.percentage}%</span>
                            </div>
                            <Progress value={vote.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Phenotypes */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-phindex-teal mb-3">Secondary</h4>
                      <div className="space-y-3">
                        {profile.votes.filter(vote => vote.category === 'secondary').map((vote, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-sm">
                                {vote.classification}
                              </Badge>
                              <span className="text-sm font-medium">{vote.percentage}%</span>
                            </div>
                            <Progress value={vote.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tertiary Phenotypes */}
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-phindex-teal mb-3">Tertiary</h4>
                      <div className="space-y-3">
                        {profile.votes.filter(vote => vote.category === 'tertiary').map((vote, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="bg-muted text-muted-foreground text-sm">
                                {vote.classification}
                              </Badge>
                              <span className="text-sm font-medium">{vote.percentage}%</span>
                            </div>
                            <Progress value={vote.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Physical Characteristics - Full width */}
            <Card className="bg-gradient-card border-phindex-teal/20 mb-6">
              <CardHeader>
                <CardTitle className="text-phindex-teal">Physical Characteristics</CardTitle>
              </CardHeader>
              <CardContent className="h-96 overflow-y-auto">
                <div className="grid gap-6">
                  {profile.physicalCharacteristics.map((characteristic, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-semibold text-phindex-teal">{characteristic.name}</h4>
                      <div className="space-y-2">
                        {characteristic.votes.map((vote, voteIndex) => (
                          <div key={voteIndex} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{vote.option}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{vote.percentage}%</span>
                                <span className="text-xs text-muted-foreground">({vote.count})</span>
                              </div>
                            </div>
                            <Progress value={vote.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <div data-comments-section>
              <CommentsSection 
                profileId={profile.id}
                onAddComment={(profileId, content) => {
                  console.log("Adding comment:", profileId, content);
                }}
                onLikeComment={(commentId) => {
                  console.log("Liking comment:", commentId);
                }}
                comments={[
                  {
                    id: "1",
                    user: {
                      name: "Carlos Silva",
                      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    },
                    content: "Claramente mediterrâneo, com fortes influências ibéricas. As características faciais e a estrutura óssea são muito típicas dessa região.",
                    timestamp: "2024-01-15T10:30:00Z",
                    likes: 12,
                    isLiked: false,
                    userVotes: { primary: "Mediterrâneo", secondary: "Ibérico" }
                  },
                  {
                    id: "2",
                    user: {
                      name: "Ana Rodriguez",
                      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                    },
                    content: "Concordo com a classificação mediterrânea. A pigmentação da pele e a estrutura do cabelo são característicos dessa ancestralidade.",
                    timestamp: "2024-01-15T09:15:00Z",
                    likes: 8,
                    isLiked: true,
                    userVotes: { primary: "Ibérico", secondary: "Mediterrâneo", tertiary: "Ameríndio" }
                  },
                  {
                    id: "3",
                    user: {
                      name: "Pedro Costa",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                    },
                    content: "Interessante ver como as características indígenas se misturam com as europeias no Brasil.",
                    timestamp: "2024-01-15T08:20:00Z",
                    likes: 8,
                    isLiked: false,
                    userVotes: { primary: "Ameríndio" }
                  },
                  {
                    id: "4",
                    user: {
                      name: "Maria Santos",
                      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face"
                    },
                    content: "A estrutura nasal e a forma dos olhos sugerem uma mistura interessante de ancestralidades.",
                    timestamp: "2024-01-15T07:45:00Z",
                    likes: 6,
                    isLiked: false,
                    userVotes: { primary: "Mediterrâneo", secondary: "Alpino" }
                  }
                ]}
              />
            </div>

            {/* Vote Modal */}
            {showVoteModal && (
              <VoteModal
                isOpen={showVoteModal}
                onClose={() => setShowVoteModal(false)}
                onSubmit={(votes) => {
                  console.log("Submitting votes:", votes);
                  setShowVoteModal(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
