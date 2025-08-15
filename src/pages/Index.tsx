import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfilesList } from "@/components/UserProfilesList";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/use-user-profiles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch all profiles from database
  const { data: allProfiles = [], isLoading } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    },
  });

  // Filter profiles by selected category
  const filteredProfiles = selectedCategory 
    ? allProfiles.filter(profile => profile.category === selectedCategory)
    : allProfiles;

  // Get unique categories from profiles
  const categories = [...new Set(allProfiles.map(profile => profile.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-foreground">Carregando perfis...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-phindex-dark/20 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="lg:ml-80 pt-20">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div>
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Filtrar por Categoria</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("")}
                  >
                    Todas as Categorias
                    <Badge variant="secondary" className="ml-2">
                      {allProfiles.length}
                    </Badge>
                  </Button>
                  {categories.map((category) => {
                    const categoryCount = allProfiles.filter(p => p.category === category).length;
                    return (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        <Badge variant="secondary" className="ml-2">
                          {categoryCount}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Profiles Grid */}
            <UserProfilesList profiles={filteredProfiles} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
