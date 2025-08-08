import { Search, User, Bell, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { AddProfileModal } from "./AddProfileModal";

export const Header = () => {
  const handleAddProfile = (profile: any) => {
    console.log('Novo perfil adicionado:', profile);
    // Aqui você pode adicionar a lógica para salvar o perfil
  };
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="px-4 h-16 flex items-center justify-between lg:ml-80">
        <div className="flex items-center gap-6 lg:hidden">
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

        <div className="flex-1 max-w-2xl mx-8">
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
          <Button variant="default" className="bg-phindex-dark hover:bg-phindex-teal transition-all duration-300 rounded-full px-6">
            <User className="mr-2 h-4 w-4" />
            Login Google
          </Button>
        </div>
      </div>
    </header>
  );
};