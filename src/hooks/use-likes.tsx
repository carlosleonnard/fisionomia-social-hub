import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useLikes(profileId: string) {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (profileId) {
      fetchLikes();
      if (user) {
        checkUserLike();
      }
    }
  }, [profileId, user]);

  const fetchLikes = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_likes')
        .select('id')
        .eq('profile_id', profileId);

      if (error) throw error;
      setLikes(data?.length || 0);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const checkUserLike = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profile_likes')
        .select('id')
        .eq('profile_id', profileId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHasLiked(!!data);
    } catch (error) {
      console.error('Error checking user like:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error('Faça login para curtir');
      return;
    }

    setLoading(true);

    try {
      if (hasLiked) {
        // Remove like
        const { error } = await supabase
          .from('profile_likes')
          .delete()
          .eq('profile_id', profileId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setLikes(prev => prev - 1);
        setHasLiked(false);
        toast.success('Like removido');
      } else {
        // Add like
        const { error } = await supabase
          .from('profile_likes')
          .insert({
            profile_id: profileId,
            user_id: user.id
          });

        if (error) throw error;
        
        setLikes(prev => prev + 1);
        setHasLiked(true);
        toast.success('Perfil curtido!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Erro ao processar like');
    } finally {
      setLoading(false);
    }
  };

  return {
    likes,
    hasLiked,
    loading,
    toggleLike
  };
}