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
import { useAuth } from "@/hooks/use-auth";
import { useVoting } from "@/hooks/use-voting";
import { useComments } from "@/hooks/use-comments";
import { usePhysicalVoting } from "@/hooks/use-physical-voting";
import { useGeographicVoting } from "@/hooks/use-geographic-voting";
import { useGeographicVoteCounts } from "@/hooks/use-geographic-vote-counts";
import { PhysicalCharacteristicVoting } from "@/components/PhysicalCharacteristicVoting";

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
  location?: string; // Made optional for privacy - only shown to profile owner
  description?: string; // Made optional for privacy - only shown to profile owner
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
  
  const { user } = useAuth();
  const { votes: realVotes, castVote, changeVote, hasUserVoted, userVote } = useVoting(id || '');
  const { comments: realComments, addComment, likeComment, deleteComment } = useComments(id || '');
  const { characteristics: physicalCharacteristics, userVotes: physicalUserVotes, castVote: castPhysicalVote } = usePhysicalVoting(id || '');
  const { userGeographicVotes, castGeographicVote, refetchVotes: refetchGeographicVotes } = useGeographicVoting(id || '');
  const { geographicVotes, phenotypeVotes, refetchVoteCounts } = useGeographicVoteCounts(id || '');

  const profile = mockProfiles.find(p => p.id === id);
  
  // Check if current user is the profile owner (for future database integration)
  // For now, using mock logic - in real app this would check against profiles_data.user_id
  const isProfileOwner = user && profile && user.id === `user_${profile.id}`;
  
  // Filter sensitive data for non-owners
  const sanitizedProfile = profile ? {
    ...profile,
    location: isProfileOwner ? profile.location : undefined,
    description: isProfileOwner ? profile.description : undefined
  } : null;

  if (!sanitizedProfile) {
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

        <div className="lg:ml-80 pt-20">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div>
            {/* Profile Images and Basic Info - Full width */}
            <Card className="bg-gradient-card border-phindex-teal/20 mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Duas fotos lado a lado */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <img 
                        src={sanitizedProfile.frontImage} 
                        alt={`${sanitizedProfile.name} - frente`}
                        className="w-full max-w-xs mx-auto rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Frente</p>
                    </div>
                    <div className="text-center">
                      <img 
                        src={sanitizedProfile.sideImage} 
                        alt={`${sanitizedProfile.name} - lado`}
                        className="w-full max-w-xs mx-auto rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Perfil</p>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-phindex-teal mb-2">
                    {sanitizedProfile.name}
                  </h1>
                  
                  {/* Pop Culture Badge */}
                  <div className="flex justify-center mb-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-phindex-teal/10 text-phindex-teal hover:bg-phindex-teal/20 cursor-pointer transition-colors"
                      onClick={() => navigate(`/category/${sanitizedProfile.category.toLowerCase().replace(' ', '-')}`)}
                    >
                      {sanitizedProfile.category}
                    </Badge>
                  </div>
                  
                  {/* General Phenotypes - Real Data */}
                  <div className="flex justify-center gap-2 mb-3 flex-wrap">
                    {realVotes.slice(0, 3).map((vote, index) => (
                      <Badge 
                        key={vote.classification}
                        variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}
                        className={
                          index === 0 ? "bg-phindex-teal text-white font-medium shadow-md" :
                          index === 1 ? "bg-phindex-teal/60 text-white font-medium" :
                          "bg-phindex-teal/30 text-phindex-teal border-phindex-teal/40 font-medium"
                        }
                      >
                        {index + 1}º {vote.classification} ({vote.percentage.toFixed(1)}%)
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Phenotype Badges - Real Data */}
                  <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {realVotes.slice(0, 3).map((vote, index) => (
                      <Badge 
                        key={vote.classification}
                        variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}
                        className={
                          index === 0 ? "bg-phindex-teal text-white font-medium shadow-md" :
                          index === 1 ? "bg-phindex-teal/60 text-white font-medium" :
                          "bg-phindex-teal/30 text-phindex-teal border-phindex-teal/40 font-medium"
                        }
                      >
                        {index + 1}º {vote.classification}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-2">
                    {sanitizedProfile.age} anos • {sanitizedProfile.gender} • {sanitizedProfile.height}
                  </p>
                  
                  {/* Location - Only show to profile owner */}
                  {sanitizedProfile.location && (
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{sanitizedProfile.location}</span>
                    </div>
                  )}
                  
                  {/* Ancestry Description - Only show to profile owner */}
                  {sanitizedProfile.description && (
                    <div className="mb-6 p-3 bg-gradient-to-br from-border/20 to-border/10 border border-border/40 rounded-xl shadow-sm">
                      <div className="p-4 bg-muted/30 rounded-lg text-left">
                        <h3 className="text-sm font-semibold text-phindex-teal mb-2">Ancestralidade Conhecida</h3>
                        <p className="text-sm text-foreground leading-relaxed">
                          {sanitizedProfile.description}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Privacy notice for non-owners */}
                  {!isProfileOwner && (
                    <div className="mb-6 p-3 bg-muted/20 border border-border/40 rounded-xl">
                      <p className="text-xs text-muted-foreground text-center">
                        Algumas informações pessoais estão ocultas por motivos de privacidade
                      </p>
                    </div>
                  )}

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
                      <span>{realVotes.reduce((sum, vote) => sum + vote.count, 0)} votos</span>
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
                      <span>{realComments.length} comentários</span>
                    </div>
                  </div>

                   <div className="space-y-2">
                     {user ? (
                       hasUserVoted ? (
                          <div className="space-y-2">
                           <Button 
                             onClick={() => setShowVoteModal(true)}
                             className="w-full"
                             variant="outline"
                           >
                             <Users className="mr-2 h-4 w-4" />
                             Alterar voto
                           </Button>
                         </div>
                       ) : (
                         <Button 
                           onClick={() => setShowVoteModal(true)}
                           className="w-full"
                           variant="default"
                         >
                           <Users className="mr-2 h-4 w-4" />
                           Votar
                         </Button>
                       )
                     ) : (
                      <Button 
                        onClick={() => setShowVoteModal(true)}
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Login para votar
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
                     {/* Primary Geographic Classification */}
                     <div className="bg-muted/30 p-3 rounded-lg">
                       <h4 className="text-sm font-semibold text-phindex-teal mb-3">Primary</h4>
                       {geographicVotes['Primary Geographic']?.length > 0 ? (
                         <div className="space-y-2">
                           {geographicVotes['Primary Geographic'].slice(0, 3).map((vote, index) => (
                             <div key={vote.classification} className="space-y-1">
                               <div className="flex items-center justify-between">
                                 <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                                   {vote.classification}
                                 </Badge>
                                 <span className="text-xs">{vote.percentage.toFixed(1)}% ({vote.count})</span>
                               </div>
                               <Progress value={vote.percentage} className="h-1" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-xs text-muted-foreground">Nenhum voto ainda</p>
                       )}
                     </div>

                     {/* Secondary Geographic Classification */}
                     <div className="bg-muted/30 p-3 rounded-lg">
                       <h4 className="text-sm font-semibold text-phindex-teal mb-3">Secondary</h4>
                       {geographicVotes['Secondary Geographic']?.length > 0 ? (
                         <div className="space-y-2">
                           {geographicVotes['Secondary Geographic'].slice(0, 3).map((vote, index) => (
                             <div key={vote.classification} className="space-y-1">
                               <div className="flex items-center justify-between">
                                 <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                                   {vote.classification}
                                 </Badge>
                                 <span className="text-xs">{vote.percentage.toFixed(1)}% ({vote.count})</span>
                               </div>
                               <Progress value={vote.percentage} className="h-1" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-xs text-muted-foreground">Nenhum voto ainda</p>
                       )}
                     </div>

                     {/* Tertiary Geographic Classification */}
                     <div className="bg-muted/30 p-3 rounded-lg">
                       <h4 className="text-sm font-semibold text-phindex-teal mb-3">Tertiary</h4>
                       {geographicVotes['Tertiary Geographic']?.length > 0 ? (
                         <div className="space-y-2">
                           {geographicVotes['Tertiary Geographic'].slice(0, 3).map((vote, index) => (
                             <div key={vote.classification} className="space-y-1">
                               <div className="flex items-center justify-between">
                                 <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                                   {vote.classification}
                                 </Badge>
                                 <span className="text-xs">{vote.percentage.toFixed(1)}% ({vote.count})</span>
                               </div>
                               <Progress value={vote.percentage} className="h-1" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-xs text-muted-foreground">Nenhum voto ainda</p>
                       )}
                     </div>
                   </div>
                 </CardContent>
              </Card>

              {/* Specific Phenotype Classification */}
              <Card className="bg-gradient-card border-phindex-teal/20">
                <CardHeader>
                  <CardTitle className="text-phindex-teal">Specific Phenotype Classification</CardTitle>
                </CardHeader>
                 <CardContent className="h-52 overflow-y-auto">
                   <div className="space-y-4">
                     {/* Primary Phenotype Classification */}
                     <div className="bg-muted/30 p-3 rounded-lg">
                       <h4 className="text-sm font-semibold text-phindex-teal mb-3">Primary</h4>
                       {phenotypeVotes['Primary Phenotype']?.length > 0 ? (
                         <div className="space-y-2">
                           {phenotypeVotes['Primary Phenotype'].slice(0, 3).map((vote, index) => (
                             <div key={vote.classification} className="space-y-1">
                               <div className="flex items-center justify-between">
                                 <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                                   {vote.classification}
                                 </Badge>
                                 <span className="text-xs">{vote.percentage.toFixed(1)}% ({vote.count})</span>
                               </div>
                               <Progress value={vote.percentage} className="h-1" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-xs text-muted-foreground">Nenhum voto ainda</p>
                       )}
                     </div>

                     {/* Secondary Phenotype Classification */}
                     <div className="bg-muted/30 p-3 rounded-lg">
                       <h4 className="text-sm font-semibold text-phindex-teal mb-3">Secondary</h4>
                       {phenotypeVotes['Secondary Phenotype']?.length > 0 ? (
                         <div className="space-y-2">
                           {phenotypeVotes['Secondary Phenotype'].slice(0, 3).map((vote, index) => (
                             <div key={vote.classification} className="space-y-1">
                               <div className="flex items-center justify-between">
                                 <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                                   {vote.classification}
                                 </Badge>
                                 <span className="text-xs">{vote.percentage.toFixed(1)}% ({vote.count})</span>
                               </div>
                               <Progress value={vote.percentage} className="h-1" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-xs text-muted-foreground">Nenhum voto ainda</p>
                       )}
                     </div>

                     {/* Tertiary Phenotype Classification */}
                     <div className="bg-muted/30 p-3 rounded-lg">
                       <h4 className="text-sm font-semibold text-phindex-teal mb-3">Tertiary</h4>
                       {phenotypeVotes['Tertiary Phenotype']?.length > 0 ? (
                         <div className="space-y-2">
                           {phenotypeVotes['Tertiary Phenotype'].slice(0, 3).map((vote, index) => (
                             <div key={vote.classification} className="space-y-1">
                               <div className="flex items-center justify-between">
                                 <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                                   {vote.classification}
                                 </Badge>
                                 <span className="text-xs">{vote.percentage.toFixed(1)}% ({vote.count})</span>
                               </div>
                               <Progress value={vote.percentage} className="h-1" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-xs text-muted-foreground">Nenhum voto ainda</p>
                       )}
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
                  {physicalCharacteristics.map((characteristic, index) => (
                    <PhysicalCharacteristicVoting
                      key={index}
                      characteristic={characteristic}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <div data-comments-section>
              <CommentsSection 
                profileId={sanitizedProfile.id}
                onAddComment={addComment}
                onLikeComment={likeComment}
                onDeleteComment={deleteComment}
                currentUserId={user?.id}
                comments={realComments}
              />
            </div>

            {/* Vote Modal */}
            {showVoteModal && user && (
              <VoteModal
                isOpen={showVoteModal}
                onClose={() => setShowVoteModal(false)}
                existingVotes={{
                  "Primary Phenotype": userVote || "",
                  ...physicalUserVotes,
                  ...userGeographicVotes
                }}
                 onSubmit={async (votes) => {
                   // Cast geographic and phenotype classification votes
                   const geographicCharacteristics = [
                     'Primary Geographic', 'Secondary Geographic', 'Tertiary Geographic',
                     'Primary Phenotype', 'Secondary Phenotype', 'Tertiary Phenotype'
                   ];
                   
                   let mainVoteSuccess = true;
                   for (const characteristic of geographicCharacteristics) {
                     if (votes[characteristic]) {
                       const success = await castGeographicVote(characteristic, votes[characteristic]);
                       if (characteristic === 'Primary Phenotype') {
                         mainVoteSuccess = success;
                       }
                     }
                   }
                  
                  // Cast physical characteristics votes
                  const physicalCharacteristics = [
                    'Hair Color', 'Hair Texture', 'Eye Color', 'Skin Tone',
                    'Nasal Breadth', 'Facial Breadth', 'Body Type', 'Jaw Type',
                    'Head Breadth', 'Face Shape'
                  ];
                  
                  for (const characteristic of physicalCharacteristics) {
                    if (votes[characteristic]) {
                      await castPhysicalVote(characteristic, votes[characteristic]);
                    }
                  }
                  
                   // Refresh geographic votes to update any charts
                   await refetchGeographicVotes();
                   await refetchVoteCounts();
                   
                   if (mainVoteSuccess) {
                     setShowVoteModal(false);
                     // Refresh the page to show updated results
                     window.location.reload();
                   }
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
