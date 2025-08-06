import { useState } from "react";
import { Vote } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileCard } from "@/components/ProfileCard";
import { AddProfileModal } from "@/components/AddProfileModal";
import { CommentsSection } from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-diversity.jpg";

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
  imageUrl: string;
  phenotypes: string[];
  likes: number;
  comments: any[];
  votes: Vote[];
  hasUserVoted: boolean;
  description?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Celebrity profiles (most famous/accessed)
  const [celebrityProfiles] = useState<Profile[]>([
    {
      id: "c1",
      name: "Angelina Jolie",
      age: 48,
      location: "Los Angeles, USA",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Mediterranean", "Alpine"],
      likes: 2847,
      votes: [
        { classification: "Mediterranean", count: 1847, percentage: 65 },
        { classification: "Alpine", count: 1000, percentage: 35 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "c2", 
      name: "Brad Pitt",
      age: 60,
      location: "Oklahoma, USA",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Nordic", "Anglo-Saxon"],
      likes: 3521,
      votes: [
        { classification: "Nordic", count: 2113, percentage: 60 },
        { classification: "Anglo-Saxon", count: 1408, percentage: 40 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "c3",
      name: "Priyanka Chopra",
      age: 41,
      location: "Mumbai, India", 
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Indo-Aryan", "Dravidian"],
      likes: 1876,
      votes: [
        { classification: "Indo-Aryan", count: 1126, percentage: 60 },
        { classification: "Dravidian", count: 750, percentage: 40 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "c4",
      name: "Michael B. Jordan",
      age: 37,
      location: "California, USA",
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Sub-Saharan African"],
      likes: 4203,
      votes: [
        { classification: "Sub-Saharan African", count: 3782, percentage: 90 },
        { classification: "Nilotic", count: 421, percentage: 10 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "c5",
      name: "Gal Gadot",
      age: 38,
      location: "Tel Aviv, Israel",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Mediterranean", "Levantine"],
      likes: 2945,
      votes: [
        { classification: "Mediterranean", count: 1767, percentage: 60 },
        { classification: "Levantine", count: 1178, percentage: 40 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "c6",
      name: "Antonio Banderas",
      age: 63,
      location: "Malaga, Spain",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Iberian", "Mediterranean"],
      likes: 1654,
      votes: [
        { classification: "Iberian", count: 994, percentage: 60 },
        { classification: "Mediterranean", count: 660, percentage: 40 }
      ],
      hasUserVoted: false,
      comments: []
    }
  ]);
  // Regular user profiles
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "1",
      name: "Sofia",
      age: 24,
      location: "São Paulo, Brazil",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Mediterranean", "Dinaric"],
      likes: 47,
      votes: [
        { classification: "Mediterranean", count: 15, percentage: 65 },
        { classification: "Dinaric", count: 8, percentage: 35 }
      ],
      hasUserVoted: false,
      comments: [
        {
          id: "c1",
          user: { name: "Carlos", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
          content: "Definitely Mediterranean features!",
          timestamp: "2h",
          likes: 5,
          isLiked: false
        }
      ]
    },
    {
      id: "2", 
      name: "Gabriel",
      age: 28,
      location: "Rio de Janeiro, Brazil",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Atlantid", "Nordic"],
      likes: 32,
      votes: [
        { classification: "Atlantid", count: 12, percentage: 75 },
        { classification: "Nordic", count: 4, percentage: 25 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "3",
      name: "Ana",
      age: 22,
      location: "Belo Horizonte, Brazil", 
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Alpine"],
      likes: 28,
      votes: [
        { classification: "Alpine", count: 10, percentage: 100 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "4",
      name: "Amara",
      age: 26,
      location: "Lagos, Nigeria",
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Sub-Saharan African"],
      likes: 73,
      votes: [
        { classification: "Sub-Saharan African", count: 67, percentage: 78.8 },
        { classification: "Nigerian", count: 12, percentage: 14.1 },
        { classification: "Bantu", count: 6, percentage: 7.1 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "5",
      name: "Rajesh",
      age: 31,
      location: "Mumbai, India",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Dravidian"],
      likes: 29,
      votes: [
        { classification: "Dravidian", count: 34, percentage: 56.7 },
        { classification: "Indo-Aryan", count: 18, percentage: 30.0 },
        { classification: "Indian", count: 8, percentage: 13.3 }
      ],
      hasUserVoted: false,
      comments: []
    },
    {
      id: "6",
      name: "Isabella",
      age: 25,
      location: "Barcelona, Spain",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      phenotypes: ["Iberian"],
      likes: 51,
      votes: [
        { classification: "Iberian", count: 41, percentage: 60.3 },
        { classification: "Mediterranean", count: 19, percentage: 27.9 },
        { classification: "Catalan", count: 8, percentage: 11.8 }
      ],
      hasUserVoted: false,
      comments: []
    }
  ]);

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPhenotype, setSelectedPhenotype] = useState<string | null>(null);

  // Mapeamento de regiões e seus fenótipos
  const regionPhenotypes: Record<string, string[]> = {
    "Africa": ["Negrillo", "Hottentot", "South African", "Sudanese", "Tropical", "Nilotic"],
    "Asia": ["Dravidian", "Indo-Aryan", "Mongoloid", "Malay", "Sino-Tibetan"],
    "Europe": ["Mediterranean", "Nordic", "Alpine", "Dinaric", "Iberian", "Catalan"],
    "North America": ["Amerindian", "Anglo-Saxon", "Hispanic"],
    "South America": ["Atlantid", "Amerindian", "Mestizo"],
    "Oceania": ["Australoid", "Melanesian", "Polynesian"]
  };

  const handleAddProfile = (newProfileData: {
    name: string;
    age: number;
    location: string;
    imageUrl: string;
    description: string;
  }) => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      ...newProfileData,
      phenotypes: [],
      likes: 0,
      comments: [],
      votes: [],
      hasUserVoted: false
    };
    
    setProfiles(prev => [newProfile, ...prev]);
    toast({
      title: "Profile added!",
      description: `${newProfileData.name} was added successfully.`,
    });
  };

  const handleLike = (profileId: string) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, likes: profile.likes + 1 }
          : profile
      )
    );
  };

  const handleComment = (profileId: string) => {
    setSelectedProfile(profileId);
  };

  const handleClassify = (profileId: string, classification: string) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId
          ? { 
              ...profile, 
              phenotypes: profile.phenotypes.includes(classification) 
                ? profile.phenotypes 
                : [...profile.phenotypes, classification]
            }
          : profile
      )
    );
    
    toast({
      title: "Classification added!",
      description: `Profile classified as ${classification}.`,
    });
  };

  const handleAddComment = (profileId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: { 
        name: "You", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
      },
      content,
      timestamp: "now",
      likes: 0,
      isLiked: false
    };

    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId
          ? { ...profile, comments: [...profile.comments, newComment] }
          : profile
      )
    );
  };

  const handleLikeComment = (commentId: string) => {
    setProfiles(prev => 
      prev.map(profile => ({
        ...profile,
        comments: profile.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1, isLiked: !comment.isLiked }
            : comment
        )
      }))
    );
  };

  // Função para filtrar perfis baseado na região/fenótipo selecionado
  const filteredProfiles = profiles.filter(profile => {
    if (!selectedPhenotype) return true;
    return profile.phenotypes.some(phenotype => 
      phenotype.toLowerCase().includes(selectedPhenotype.toLowerCase()) ||
      selectedPhenotype.toLowerCase().includes(phenotype.toLowerCase())
    );
  });

  const handleRegionClick = (region: string) => {
    // Converter nome da região para URL slug
    const regionSlug = region.toLowerCase()
      .replace(/\s+/g, '-')
      .replace('á', 'a')
      .replace('é', 'e')
      .replace('í', 'i')
      .replace('ó', 'o')
      .replace('ú', 'u')
      .replace('ã', 'a')
      .replace('õ', 'o')
      .replace('ç', 'c');
    
    navigate(`/region/${regionSlug}`);
  };

  const handlePhenotypeClick = (phenotype: string) => {
    setSelectedPhenotype(phenotype);
  };

  const clearFilters = () => {
    setSelectedRegion(null);
    setSelectedPhenotype(null);
  };


  // Mock data for regional profiles (6 rows)
  const regionalProfiles = {
    "Africa": profiles.filter(p => p.phenotypes.some(ph => ["Sub-Saharan African", "Nigerian", "Bantu"].includes(ph))),
    "Asia": profiles.filter(p => p.phenotypes.some(ph => ["Dravidian", "Indo-Aryan", "Indian"].includes(ph))),
    "Europe": profiles.filter(p => p.phenotypes.some(ph => ["Mediterranean", "Alpine", "Iberian", "Catalan"].includes(ph))),
    "North America": profiles.slice(0, 2),
    "South America": profiles.filter(p => p.phenotypes.some(ph => ["Atlantid"].includes(ph))),
    "Oceania": profiles.slice(0, 1)
  };

  const selectedProfileData = profiles.find(p => p.id === selectedProfile);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      <div className="container px-4 max-w-none">
        <div className="flex gap-6 pt-8">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div className="flex-1">
            {/* Popular Celebrities Section */}
            <div className="mb-12">
              <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                      <Vote className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Popular Celebrities</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover and classify the most voted public figures in our phenotyping community
                  </p>
                  
                  <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                    <div className="relative group">
                      <CarouselContent className="ml-0">
                     {celebrityProfiles.map((profile, index) => (
                      <CarouselItem key={profile.id} className="pl-1 basis-1/10">
                        <div className="flex-shrink-0 group/item">
                          <div 
                            className="cursor-pointer"
                            onClick={() => navigate(`/profile/${profile.id}`)}
                          >
                            <div className="flex flex-col items-center p-1 rounded-lg hover:bg-accent/50 transition-colors">
                              <div className="relative mb-1">
                                <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 p-1 cursor-pointer">
                                  <img 
                                    src={profile.imageUrl} 
                                    alt={profile.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                </div>
                             <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                               <Vote className="h-2.5 w-2.5" />
                               <span className="text-xs">{profile.votes.reduce((total, vote) => total + vote.count, 0)}</span>
                             </div>
                              </div>
                              <h3 className="font-medium text-foreground mb-0.5 text-center text-xs">{profile.name}</h3>
                              <p className="text-xs text-muted-foreground text-center">{profile.phenotypes[0]}</p>
                            </div>
                          </div>
                        </div>
                     </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background border-0" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background border-0" />
              </div>
            </Carousel>
                </div>
              </div>
            </div>

            {/* Top User Profiles Section */}
            <div className="mb-12">
              <div className="relative bg-gradient-to-r from-secondary/10 via-accent/10 to-primary/10 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent rounded-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20">
                      <Vote className="h-4 w-4 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Top User Profiles</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse community member profiles and participate in phenotype classification
                  </p>

                  <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                    <div className="relative group">
                      <CarouselContent className="ml-0">
                         {profiles.slice(0, 10).map((profile, index) => (
                          <CarouselItem key={profile.id} className="pl-1 basis-1/10">
                            <div className="flex-shrink-0 group/item">
                              <div 
                                className="cursor-pointer"
                                onClick={() => navigate(`/profile/${profile.id}`)}
                              >
                                <div className="flex flex-col items-center p-1 rounded-lg hover:bg-accent/50 transition-colors">
                                  <div className="relative mb-1">
                                      <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 p-1 cursor-pointer">
                                        <img 
                                          src={profile.imageUrl} 
                                          alt={profile.name}
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      </div>
                                   <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                     <Vote className="h-2.5 w-2.5" />
                                     <span className="text-xs">{profile.votes.reduce((total, vote) => total + vote.count, 0)}</span>
                                   </div>
                                  </div>
                                  <h3 className="font-medium text-foreground mb-0.5 text-center text-xs">{profile.name}</h3>
                                  <p className="text-xs text-muted-foreground text-center">{profile.phenotypes[0] || 'Unknown'}</p>
                                </div>
                              </div>
                            </div>
                         </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background border-0" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background border-0" />
                  </div>
                </Carousel>
                </div>
              </div>
            </div>

            {/* Recent Profiles Section */}
            <div className="mb-12">
              <div className="relative bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent rounded-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20">
                      <Vote className="h-4 w-4 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Recent Profiles</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore the latest profile submissions from our growing community
                  </p>
                  
                  <Carousel className="w-full" opts={{ align: "start", loop: false }}>
                    <div className="relative group">
                      <CarouselContent className="ml-0">
                         {profiles.slice(0, 20).map((profile, index) => (
                          <CarouselItem key={profile.id} className="pl-1 basis-1/10">
                            <div className="flex-shrink-0 group/item">
                              <div 
                                className="cursor-pointer"
                                onClick={() => navigate(`/profile/${profile.id}`)}
                              >
                                <div className="flex flex-col items-center p-1 rounded-lg hover:bg-accent/50 transition-colors">
                                  <div className="relative mb-1">
                                    <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 p-1 cursor-pointer">
                                    <img 
                                      src={profile.imageUrl} 
                                      alt={profile.name}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                    <Vote className="h-2.5 w-2.5" />
                                    <span className="text-xs">{profile.votes.reduce((total, vote) => total + vote.count, 0)}</span>
                                  </div>
                                </div>
                                <h3 className="font-medium text-foreground mb-0.5 text-center text-xs">{profile.name}</h3>
                                <p className="text-xs text-muted-foreground text-center">{profile.phenotypes[0] || 'Unknown'}</p>
                              </div>
                            </div>
                          </div>
                       </CarouselItem>
                     ))}
                   </CarouselContent>
                   <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background border-0" />
                   <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-background border-0" />
                 </div>
               </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
