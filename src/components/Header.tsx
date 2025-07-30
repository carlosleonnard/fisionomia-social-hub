import { Search, User, Bell, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import phindexLogo from "@/assets/phindex-logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img 
              src={phindexLogo} 
              alt="Phindex Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-phindex-teal">PHINDEX</h1>
              <p className="text-xs text-muted-foreground -mt-1">Phenotype Database</p>
            </div>
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
          <Button variant="default" className="bg-phindex-teal hover:bg-phindex-teal/90">
            <Plus className="mr-2 h-4 w-4" />
            Classify Now!
          </Button>
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