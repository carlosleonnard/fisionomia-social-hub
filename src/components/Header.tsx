import { Search, User, Bell, Plus, HelpCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { AddProfileModal } from "./AddProfileModal";
import { LoginModal } from "./LoginModal";
import { NotificationBell } from "./NotificationBell";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  

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
                src="/phindex-uploads/39fe11bc-0ec1-4dad-8877-0789763891df.png" 
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
          <AddProfileModal />
          <Button variant="outline" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <NotificationBell />
          
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
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
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