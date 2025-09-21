import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface UserMenuPopoverProps {
  user: any;
}

interface UserProfile {
  nickname: string;
  avatar_url: string;
}

export const UserMenuPopover = ({ user }: UserMenuPopoverProps) => {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('nickname, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={profile?.avatar_url || undefined} 
              alt={profile?.nickname || "User"} 
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {profile?.nickname?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={profile?.avatar_url || undefined} 
                alt={profile?.nickname || "User"} 
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {profile?.nickname?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.nickname || "Usuário"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-2 space-y-1">
          <Link to="/settings">
            <Button variant="ghost" size="sm" className="w-full justify-start h-8 px-2">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};