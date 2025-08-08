import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleRegionClick = (region: string) => {
    const regionSlug = region.toLowerCase().replace(/\s+/g, '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ã', 'a').replace('õ', 'o').replace('ç', 'c');
    navigate(`/region/${regionSlug}`);
  };
  const handleCategoryClick = (category: string) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };
  const isRegionActive = (region: string) => {
    const regionSlug = region.toLowerCase().replace(/\s+/g, '-').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ã', 'a').replace('õ', 'o').replace('ç', 'c');
    return location.pathname === `/region/${regionSlug}`;
  };
  const isCategoryActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    return location.pathname === `/category/${categorySlug}`;
  };
  return <div className="w-80 hidden lg:block">
      <Card className="bg-card border-border/50 p-6 sticky top-24 h-fit">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-phindex-dark">PHENOTYPE REGION

          </h3>
            <div className="grid grid-cols-2 gap-3">
              {["Africa", "Asia", "Europe", "North America", "South America", "Oceania"].map(region => <Button key={region} variant={isRegionActive(region) ? "default" : "outline"} size="sm" className="text-sm py-3 px-4 h-auto whitespace-nowrap overflow-hidden text-ellipsis" onClick={() => handleRegionClick(region)} title={region}>
                  <span className="hidden xl:inline">{region}</span>
                  <span className="xl:hidden">
                    {region === "North America" ? "N.A" : region === "South America" ? "S.A" : region}
                  </span>
                </Button>)}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-phindex-dark">BIRTHPLACE</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { flag: "🇧🇷", country: "Brazil" },
                { flag: "🇺🇸", country: "USA" },
                { flag: "🇫🇷", country: "France" },
                { flag: "🇩🇪", country: "Germany" },
                { flag: "🇮🇹", country: "Italy" },
                { flag: "🇪🇸", country: "Spain" },
                { flag: "🇬🇧", country: "UK" },
                { flag: "🇨🇦", country: "Canada" },
                { flag: "🇦🇺", country: "Australia" }
              ].map(country => (
                <Button
                  key={country.country}
                  variant="outline"
                  size="sm"
                  className="text-lg py-2 px-2 h-auto aspect-square flex items-center justify-center"
                  title={country.country}
                >
                  {country.flag}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-phindex-dark">CATEGORIES</h3>
            <div className="space-y-4">
              {/* Community Section */}
              <button className={`flex items-center gap-4 w-full text-left p-3 rounded-lg transition-colors ${isCategoryActive("Community") ? "bg-phindex-teal/10 text-phindex-teal border border-phindex-teal/20" : "hover:bg-muted/50"}`} onClick={() => handleCategoryClick("Community")}>
                <Users className="h-5 w-5" style={{
                color: 'hsl(var(--category-primary))'
              }} />
                <span className="text-base">Community</span>
              </button>
              
              {/* Separator */}
              <div className="border-t border-border/30 my-4"></div>
              
              {/* Other Categories */}
              {[{
              icon: "🎭",
              name: "Pop Culture"
            }, {
              icon: "🎵",
              name: "Music and Entertainment"
            }, {
              icon: "🎨",
              name: "Arts"
            }, {
              icon: "🤔",
              name: "Philosophy"
            }, {
              icon: "🧪",
              name: "Sciences"
            }, {
              icon: "⚽",
              name: "Sports"
            }, {
              icon: "💼",
              name: "Business"
            }, {
              icon: "🏛️",
              name: "Politics"
            }].map(category => <button key={category.name} className={`flex items-center gap-4 w-full text-left p-3 rounded-lg transition-colors ${isCategoryActive(category.name) ? "bg-phindex-teal/10 text-phindex-teal border border-phindex-teal/20" : "hover:bg-muted/50"}`} onClick={() => handleCategoryClick(category.name)}>
                  <span className="text-xl" style={{
                color: 'hsl(var(--category-primary))'
              }}>{category.icon}</span>
                  <span className="text-base">{category.name}</span>
                </button>)}
            </div>
          </div>
        </div>
      </Card>
    </div>;
};