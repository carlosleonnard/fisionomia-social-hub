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
    <div className="w-72 hidden lg:block">
      <Card className="bg-card border-border/50 p-6 sticky top-24">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-phindex-dark">REGION</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Africa", "Asia", "Europe", "North America",
                "South America", "Oceania"
              ].map((region) => (
                <Button
                  key={region}
                  variant={isRegionActive(region) ? "default" : "outline"}
                  size="sm"
                  className="text-xs py-2 px-3 h-auto"
                  onClick={() => handleRegionClick(region)}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-phindex-dark">CATEGORIES</h3>
            <div className="space-y-3">
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
                  className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg" style={{ color: 'hsl(var(--category-primary))' }}>{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};