import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProfiles } from "@/hooks/use-user-profiles";
import { useAuth } from "@/hooks/use-auth";
import { AuthPrompt } from "./AuthPrompt";
import { Calendar, User } from "lucide-react";

export const UserProfilesList = () => {
  const { user } = useAuth();
  const { profiles, profilesLoading } = useUserProfiles();

  if (profilesLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-gradient-card border-border/50 animate-pulse">
            <CardContent className="p-2 md:p-4">
              <div className="w-full h-32 md:h-48 bg-muted rounded-lg mb-2 md:mb-4"></div>
              <div className="h-3 md:h-4 bg-muted rounded mb-1 md:mb-2"></div>
              <div className="h-2 md:h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!user) {
    return <AuthPrompt />;
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No profiles found</h3>
        <p className="text-muted-foreground">Be the first to create a profile!</p>
      </div>
    );
  }

  return (
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Community Profiles</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {profiles.length} profile{profiles.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            to={`/user-profile/${profile.slug}`}
            className="group block"
          >
            <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg">
              <CardContent className="p-2 md:p-4">
                <div className="relative overflow-hidden rounded-lg mb-2 md:mb-4">
                   <img
                     src={profile.front_image_url}
                     alt={profile.name}
                     className="profile-image-thumbnail rounded-lg transition-transform duration-300 group-hover:scale-105"
                   />
                  <div className="absolute top-1 md:top-2 right-1 md:right-2">
                    <Badge variant={profile.is_anonymous ? "secondary" : "default"} className="text-xs">
                      {profile.is_anonymous ? "Anon" : "Famous"}
                    </Badge>
                  </div>
                </div>

                 <div className="space-y-1 md:space-y-2">
                   <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                     <span className="text-sm md:text-lg">🏳️</span>
                     <span className="text-xs md:text-sm font-medium text-muted-foreground truncate">{profile.country}</span>
                   </div>
                   
                   <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors text-sm md:text-base">
                     {profile.name}
                   </h3>
                   
                   <div className="flex items-center justify-between text-xs text-muted-foreground">
                     <span className="flex items-center gap-1 truncate">
                       <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary/20 flex-shrink-0"></span>
                       <span className="truncate">{profile.ancestry}</span>
                     </span>
                     <span className="flex-shrink-0">{profile.height}m</span>
                   </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs truncate">
                      {profile.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-2 w-2 md:h-3 md:w-3" />
                      <span className="hidden md:inline">{new Date(profile.created_at).toLocaleDateString('en-US')}</span>
                      <span className="md:hidden">{new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};