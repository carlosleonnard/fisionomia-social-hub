import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AddProfileModal } from "./AddProfileModal";
import { useAuth } from "@/hooks/use-auth";
import { 
  Menu,
  Users, 
  Film, 
  Music, 
  Palette, 
  Brain, 
  Microscope, 
  Trophy, 
  Briefcase, 
  Building,
  GitBranch,
  HelpCircle,
  LogOut,
  Mail,
  Plus
} from "lucide-react";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleRegionClick = (region: string) => {
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
    setIsOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    const categoryMapping: Record<string, string> = {
      "Community": "community",
      "Pop Culture": "pop-culture",
      "Music and Entertainment": "music-and-entertainment",
      "Arts": "arts",
      "Philosophy": "philosophy",
      "Sciences": "sciences",
      "Sports": "sports",
      "Business": "business",
      "Politics": "politics"
    };
    const categorySlug = categoryMapping[category] || category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
    setIsOpen(false);
  };

  const isRegionActive = (region: string) => {
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
    
    return location.pathname === `/region/${regionSlug}`;
  };

  const isCategoryActive = (category: string) => {
    const categoryMapping: Record<string, string> = {
      "Community": "community",
      "Pop Culture": "pop-culture",
      "Music and Entertainment": "music-and-entertainment",
      "Arts": "arts",
      "Philosophy": "philosophy",
      "Sciences": "sciences",
      "Sports": "sports",
      "Business": "business",
      "Politics": "politics"
    };
    const categorySlug = categoryMapping[category] || category.toLowerCase().replace(/\s+/g, '-');
    return location.pathname === `/category/${categorySlug}`;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <img 
                  src="/phindex-uploads/39fe11bc-0ec1-4dad-8877-0789763891df.png" 
                  alt="Phindex Logo" 
                  className="h-8 object-contain"
                />
                <span className="font-semibold text-lg">Phindex</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Add Profile Button */}
              <div className="flex justify-center">
                <AddProfileModal />
              </div>

              <Separator />

              {/* Phenotype Regions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-phindex-dark px-2">PHENOTYPE REGION</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Africa", "Asia", "Europe", "Americas",
                    "Middle East", "Oceania"
                  ].map((region) => (
                    <Button
                      key={region}
                      variant={isRegionActive(region) ? "default" : "outline"}
                      size="sm"
                      className="text-sm py-2 px-3 h-auto"
                      onClick={() => handleRegionClick(region)}
                    >
                      {region === "Middle East" ? "M.E" : region}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-phindex-dark px-2">CATEGORIES</h3>
                <div className="space-y-2">
                  {/* Community Section */}
                  <button
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors ${
                      isCategoryActive("Community") 
                        ? "bg-phindex-teal/10 text-phindex-teal border border-phindex-teal/20" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleCategoryClick("Community")}
                  >
                    <Users className="h-4 w-4" style={{ color: 'hsl(var(--category-primary))' }} />
                    <span className="text-sm">Community</span>
                  </button>
                  
                  {/* Other Categories */}
                  {[
                    { Icon: Film, name: "Pop Culture" },
                    { Icon: Music, name: "Music and Entertainment" },
                    { Icon: Palette, name: "Arts" },
                    { Icon: Brain, name: "Philosophy" },
                    { Icon: Microscope, name: "Sciences" },
                    { Icon: Trophy, name: "Sports" },
                    { Icon: Briefcase, name: "Business" },
                    { Icon: Building, name: "Politics" }
                   ].map((category) => {
                    const isActive = isCategoryActive(category.name);
                    return (
                      <button
                        key={category.name}
                        className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-phindex-teal/10 text-phindex-teal border border-phindex-teal/20" 
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <category.Icon 
                          className="h-4 w-4" 
                          color="#007a75" 
                        />
                        <span className="text-sm">{category.name}</span>
                      </button>
                    );
                   })}
                </div>
              </div>
              
              <Separator />

              {/* More Info Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-phindex-dark px-2">MORE INFO</h3>
                <div className="space-y-2">
                  <button
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors hover:bg-muted/50"
                    onClick={() => handleNavigation('/phenotype-flow')}
                  >
                    <GitBranch className="h-4 w-4" color="#007a75" />
                    <span className="text-sm">Phenotype Flow</span>
                  </button>
                  
                  <button
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors hover:bg-muted/50"
                    onClick={() => handleNavigation('/contact')}
                  >
                    <Mail className="h-4 w-4" color="#007a75" />
                    <span className="text-sm">Contact</span>
                  </button>
                  
                  <button
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors hover:bg-muted/50"
                    onClick={() => handleNavigation('/faq')}
                  >
                    <HelpCircle className="h-4 w-4" color="#007a75" />
                    <span className="text-sm">FAQ</span>
                  </button>
                  
                  <button
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors hover:bg-destructive/10 text-destructive hover:text-destructive"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
