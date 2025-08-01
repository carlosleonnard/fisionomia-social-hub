import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  return (
    <div className="w-80 hidden lg:block">
      <Card className="bg-card border-border/50 p-6 sticky top-24">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-phindex-dark">REGION</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Africa", "Asia", "Europe", "North America",
                "South America", "Oceania"
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
                    {region === "North America" ? "N.A" : 
                     region === "South America" ? "S.A" : 
                     region}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-phindex-dark">CATEGORIES</h3>
            <div className="space-y-4">
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
                  className="flex items-center gap-4 w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-xl" style={{ color: 'hsl(var(--category-primary))' }}>{category.icon}</span>
                  <span className="text-base">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};