import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Vote } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRegionProfiles } from "@/hooks/use-region-profiles";

const RegionPage = () => {
  const { region } = useParams<{ region: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const regionNames: Record<string, string> = {
    "africa": "Africa",
    "asia": "Asia", 
    "europe": "Europe",
    "americas": "Americas",
    "middle-east": "Middle East",
    "oceania": "Oceania"
  };

  // Get current region data
  const regionKey = region?.toLowerCase() || "";
  const regionDisplayName = regionNames[regionKey] || region;
  
  // Use the new hook to fetch profiles for this region
  const { data: profiles = [], isLoading } = useRegionProfiles(regionDisplayName);

  // Mapping of country codes to 3-letter codes
  const countryCodes: Record<string, string> = {
    "US": "USA", "BR": "BRA", "IN": "IND", "IL": "ISR", "ES": "ESP", 
    "NG": "NGA", "FR": "FRA", "DE": "DEU", "IT": "ITA", "JP": "JPN",
    "CN": "CHN", "KR": "KOR", "MX": "MEX", "CA": "CAN", "AU": "AUS",
    "GB": "GBR", "RU": "RUS", "AR": "ARG", "EG": "EGY", "ZA": "ZAF"
  };

  if (!regionKey || !regionNames[regionKey]) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-phindex-dark mb-4">Region not found</h1>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
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
                Back
              </Button>
              
              {/* Region Header */}
              <Card className="bg-gradient-card border-phindex-teal/20 mb-8">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-phindex-teal/10 text-phindex-teal text-lg px-4 py-2">
                      {regionDisplayName}
                    </Badge>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Vote className="h-4 w-4" />
                      <span>{profiles.length} profiles</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Region: {regionDisplayName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore phenotypic diversity from {regionDisplayName} based on General Phenotype Classification.
                  </p>
                </CardContent>
              </Card>

              {/* Profiles Grid */}
              {isLoading ? (
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
              ) : profiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((profile) => (
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
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                            <Vote className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium">{profile.vote_count || 0}</span>
                          </div>
                          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                            <span className="text-xs font-medium">{countryCodes[profile.country] || profile.country}</span>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-1">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{profile.ancestry}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Height: {profile.height}m</span>
                            <span>{profile.gender}</span>
                          </div>
                          <div className="mt-2">
                            <Badge variant={profile.is_anonymous ? "secondary" : "default"} className="text-xs">
                              {profile.is_anonymous ? "Anonymous" : "Celebrity"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-card border-phindex-teal/20">
                  <CardContent className="text-center py-12">
                    <Vote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No profiles found
                    </h3>
                    <p className="text-muted-foreground">
                      No profiles found for {regionDisplayName} region yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegionPage;