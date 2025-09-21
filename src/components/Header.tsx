/**
 * COMPONENTE DE CABEÇALHO PRINCIPAL (Header.tsx)
 * 
 * Este componente renderiza a barra de navegação fixa no topo da aplicação.
 * Inclui logo, barra de busca, botões de ação e menu de usuário.
 * É exibido em todas as páginas da aplicação.
 */

// Ícones do Lucide React (biblioteca de ícones SVG otimizada)
import { Search, User, Bell, Plus, HelpCircle, Settings, LogOut } from "lucide-react";
// Componentes de UI reutilizáveis do sistema de design
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Link do React Router para navegação sem reload da página
import { Link } from "react-router-dom";
// Modais específicos da aplicação
import { AddProfileModal } from "./AddProfileModal";    // Modal para criar novos perfis
import { LoginModal } from "./LoginModal";              // Modal de autenticação
import { NotificationBell } from "./NotificationBell";  // Componente de notificações
import { UserMenuPopover } from "./UserMenuPopover";        // Menu do usuário com nickname
// Componentes de avatar para imagem do usuário
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Popover para menu dropdown do usuário
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// Hook do React para estado local e efeitos
import { useState, useEffect, useRef } from "react";
// Hook customizado para gerenciamento de autenticação
import { useAuth } from "@/hooks/use-auth";
// Hook para gerenciamento de perfis de usuário
import { useUserProfiles } from "@/hooks/use-user-profiles";
// Link para navegação entre páginas
import { useNavigate } from "react-router-dom";

/**
 * COMPONENTE HEADER
 * 
 * Renderiza a barra de navegação principal com:
 * - Logo clicável que leva à página inicial
 * - Barra de busca global
 * - Botões de ação (adicionar perfil, ajuda, notificações)
 * - Menu de usuário ou botão de login
 */
export const Header = () => {
  // Estado local para controlar abertura/fechamento do modal de login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Estados para funcionalidade de busca
  const [searchTerm, setSearchTerm] = useState("");        // Termo digitado pelo usuário
  const [searchResults, setSearchResults] = useState<any[]>([]); // Resultados da busca
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Controla se o dropdown está aberto
  const searchRef = useRef<HTMLDivElement>(null);          // Referência para detectar cliques fora
  
  // Hooks para navegação e dados
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { profiles } = useUserProfiles();
  
  /**
   * FUNÇÃO DE BUSCA
   * 
   * Filtra os perfis baseado no termo de busca digitado pelo usuário.
   * Busca por nome do perfil (case insensitive).
   */
  const handleSearch = (term: string) => {
    if (!term.trim() || !profiles) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    
    // Filtra perfis que contenham o termo de busca no nome
    const filtered = profiles.filter(profile => 
      profile.name.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5); // Limita a 5 resultados
    
    setSearchResults(filtered);
    setIsSearchOpen(filtered.length > 0);
  };
  
  /**
   * EFEITO PARA BUSCA COM DEBOUNCE
   * 
   * Implementa um delay na busca para evitar muitas consultas while typing.
   * Executa a busca 300ms após o usuário parar de digitar.
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, profiles]);
  
  /**
   * EFEITO PARA DETECTAR CLIQUES FORA DO DROPDOWN
   * 
   * Fecha o dropdown de sugestões quando o usuário clica fora dele.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  /**
   * FUNÇÃO PARA NAVEGAR PARA PERFIL
   * 
   * Redireciona o usuário para a página de detalhes do perfil selecionado.
   * Usa o slug do perfil para navegar para a rota /user-profile/.
   */
  const handleProfileSelect = (profile: any) => {
    setSearchTerm("");
    setIsSearchOpen(false);
    navigate(`/user-profile/${profile.slug}`);
  };
  
  /**
   * FUNÇÃO DE LOGOUT
   * 
   * Executa o processo de logout do usuário através do Supabase.
   * Limpa a sessão e redireciona para estado não autenticado.
   */
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
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Look for famous people, characters, athletes..." 
              className="pl-12 h-12 bg-muted/30 border-border/30 focus:border-primary/50 rounded-full text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setIsSearchOpen(searchResults.length > 0)}
            />
            <Button 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:shadow-button rounded-full"
              onClick={() => searchTerm && handleSearch(searchTerm)}
            >
              Search
            </Button>
            
            {/* DROPDOWN DE SUGESTÕES DE BUSCA */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((profile, index) => (
                  <div
                    key={profile.id}
                    className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0 flex items-center gap-3"
                    onClick={() => handleProfileSelect(profile)}
                  >
                    {/* Imagem do perfil */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={profile.front_image_url} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    {/* Informações do perfil */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {profile.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {profile.category} • {profile.country}
                      </p>
                    </div>
                    
                    {/* Indicador se é perfil anônimo */}
                    {profile.is_anonymous && (
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Anônimo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AddProfileModal />
          <Button variant="outline" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <NotificationBell />
          
          {user ? (
            <UserMenuPopover user={user} />
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