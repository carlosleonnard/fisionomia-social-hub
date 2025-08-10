import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  };

  const handleCategoryClick = (category: string) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
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
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    return location.pathname === `/category/${categorySlug}`;
  };

  return (
    <div className="w-80 hidden lg:block fixed left-0 top-16 h-screen z-40">
      <div className="bg-card border-r border-border/50 h-full overflow-y-auto pt-6 px-6">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-phindex-dark">PHENOTYPE REGION</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Africa", "Asia", "Europe", "Americas",
                "Middle East", "Oceania"
              ].map((region) => (
                <Button
                  key={region}
                  variant={isRegionActive(region) ? "default" : "outline"}
                  size="sm"
                  className="text-sm py-3 px-4 h-auto whitespace-nowrap overflow-hidden text-ellipsis"
                  onClick={() => handleRegionClick(region)}
                  title={region}
                >
                  <span className="hidden xl:inline">{region}</span>
                  <span className="xl:hidden">
                    {region === "Middle East" ? "M.E" : 
                     region}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-phindex-dark">CATEGORIES</h3>
            <div className="space-y-4">
              {/* Community Section */}
              <button
                className={`flex items-center gap-4 w-full text-left p-3 rounded-lg transition-colors ${
                  isCategoryActive("Community") 
                    ? "bg-phindex-teal/10 text-phindex-teal border border-phindex-teal/20" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleCategoryClick("Community")}
              >
                <Users className="h-5 w-5" style={{ color: 'hsl(var(--category-primary))' }} />
                <span className="text-base">Community</span>
              </button>
              
              {/* Separator */}
              <div className="border-t border-border/30 my-4"></div>
              
              {/* Other Categories */}
              {[
                { icon: "🎭", name: "Pop Culture" },
                { icon: "🎵", name: "Music and Entertainment" },
                { icon: "🎨", name: "Arts" },
                { icon: "🤔", name: "Philosophy" },
                { icon: "🧪", name: "Sciences" },
                { icon: "⚽", name: "Sports" },
                { icon: "💼", name: "Business" },
                { icon: "🏛️", name: "Politics" }
               ].map((category) => (
                <button
                  key={category.name}
                  className={`flex items-center gap-4 w-full text-left p-3 rounded-lg transition-colors ${
                    isCategoryActive(category.name) 
                      ? "bg-phindex-teal/10 text-phindex-teal border border-phindex-teal/20" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <span className="text-xl" style={{ color: 'hsl(var(--category-primary))' }}>{category.icon}</span>
                  <span className="text-base">{category.name}</span>
                </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};