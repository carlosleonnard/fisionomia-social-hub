import { Search, User, Bell, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container px-4 h-16 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="bg-phindex-teal hover:bg-phindex-teal/90 px-4 py-2 h-9">
              <Plus className="mr-1 h-4 w-4" />
              Classify Now!
            </Button>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/39fe11bc-0ec1-4dad-8877-0789763891df.png" 
            alt="Phindex Logo" 
            className="h-12 object-contain"
          />
        </div>

        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hover:bg-muted/50">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="default" className="bg-phindex-dark hover:bg-phindex-teal transition-all duration-300 rounded-full px-6">
              <User className="mr-2 h-4 w-4" />
              Login Google
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};