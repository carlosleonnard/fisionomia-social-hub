import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserProfiles, UserProfile } from "@/hooks/use-user-profiles";
import { useAuth } from "@/hooks/use-auth";
import { AuthPrompt } from "./AuthPrompt";
import { Calendar, User } from "lucide-react";

interface UserProfilesListProps {
  profiles?: UserProfile[];
}

export const UserProfilesList = ({ profiles: propProfiles }: UserProfilesListProps) => {
  const { user } = useAuth();
  const { profiles: hookProfiles, profilesLoading } = useUserProfiles();
  
  // Use profiles from props if provided, otherwise use from hook
  const profiles = propProfiles || hookProfiles;

  if (profilesLoading && !propProfiles) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-gradient-card border-border/50 animate-pulse">
            <CardContent className="p-4">
              <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
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
        <h3 className="text-lg font-medium text-foreground mb-2">Nenhum perfil encontrado</h3>
        <p className="text-muted-foreground">Seja o primeiro a criar um perfil!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Perfis da Comunidade</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {profiles.length} perfil{profiles.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            to={`/user-profile/${profile.slug}`}
            className="group block"
          >
            <Card className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg">
              <CardContent className="p-4">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={profile.front_image_url}
                    alt={profile.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={profile.is_anonymous ? "secondary" : "default"} className="text-xs">
                      {profile.is_anonymous ? "Anônimo" : "Famoso"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {profile.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-primary/20"></span>
                      {profile.country}
                    </span>
                    <span>{profile.height}m</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {profile.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(profile.created_at).toLocaleDateString('pt-BR')}
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