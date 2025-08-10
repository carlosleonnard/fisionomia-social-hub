import { Search, User, Bell, Plus, HelpCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { AddProfileModal } from "./AddProfileModal";
import { LoginModal } from "./LoginModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  
  const handleAddProfile = (profile: any) => {
    console.log('Novo perfil adicionado:', profile);
    // Aqui você pode adicionar a lógica para salvar o perfil
  };

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:w-80 lg:justify-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="cursor-pointer">
              <img 
                src="/lovable-uploads/39fe11bc-0ec1-4dad-8877-0789763891df.png" 
                alt="Phindex Logo" 
                className="h-12 object-contain"
              />
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8 lg:mr-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Look for famous people, characters, athletes..." 
              className="pl-12 h-12 bg-muted/30 border-border/30 focus:border-primary/50 rounded-full text-base"
            />
            <Button 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:shadow-button rounded-full"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AddProfileModal onAddProfile={handleAddProfile} />
          <Button variant="outline" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted/50">
            <Bell className="h-5 w-5" />
          </Button>
          
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                      alt={user.user_metadata?.name || user.email || "User"} 
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {(user.user_metadata?.name || user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                        alt={user.user_metadata?.name || user.email || "User"} 
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {(user.user_metadata?.name || user.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.user_metadata?.name || "Usuário"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-9 px-3 text-sm"
                    size="sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-9 px-3 text-sm text-destructive hover:text-destructive"
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button 
              variant="default" 
              className="bg-phindex-dark hover:bg-phindex-teal transition-all duration-300 rounded-full px-6"
              onClick={() => setIsLoginModalOpen(true)}
              disabled={loading}
            >
              <User className="mr-2 h-4 w-4" />
              Login Google
            </Button>
          )}
        </div>
      </div>
      
      <LoginModal 
        open={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen} 
      />
    </header>
  );
};