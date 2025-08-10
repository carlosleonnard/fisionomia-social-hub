import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  parent_comment_id?: string | null;
  user_id: string;
  user: {
    name: string;
    email: string;
  };
  userVotes?: { [key: string]: string };
  isLiked?: boolean;
  replies?: Comment[];
}

export const useComments = (profileId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          likes_count,
          user_id,
          parent_comment_id,
          profiles!comments_user_id_fkey (
            name,
            email
          )
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (commentsData) {
        // Check which comments the current user has liked
        let userLikes: string[] = [];
        if (user) {
          const { data: likesData } = await supabase
            .from('comment_likes')
            .select('comment_id')
            .eq('user_id', user.id);
          
          userLikes = likesData?.map(like => like.comment_id) || [];
        }

        // Get user votes for this profile to show next to names
        const { data: userVotesData } = await supabase
          .from('votes')
          .select('user_id, classification, characteristic_type')
          .eq('profile_id', profileId);

        const userVotesMap = new Map();
        userVotesData?.forEach(vote => {
          if (!userVotesMap.has(vote.user_id)) {
            userVotesMap.set(vote.user_id, {});
          }
          userVotesMap.get(vote.user_id)[vote.characteristic_type] = vote.classification;
        });

        const formattedComments: Comment[] = commentsData
          .filter(comment => !comment.parent_comment_id) // Only get top-level comments
          .map(comment => ({
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            likes_count: comment.likes_count,
            parent_comment_id: comment.parent_comment_id,
            user_id: comment.user_id,
            user: {
              name: (comment.profiles as any)?.name || 'Usuário',
              email: (comment.profiles as any)?.email || ''
            },
            userVotes: userVotesMap.get(comment.user_id) || {},
            isLiked: userLikes.includes(comment.id),
            replies: commentsData
              .filter(reply => reply.parent_comment_id === comment.id)
              .map(reply => ({
                id: reply.id,
                content: reply.content,
                created_at: reply.created_at,
                likes_count: reply.likes_count,
                parent_comment_id: reply.parent_comment_id,
                user_id: reply.user_id,
                user: {
                  name: (reply.profiles as any)?.name || 'Usuário',
                  email: (reply.profiles as any)?.email || ''
                },
                userVotes: userVotesMap.get(reply.user_id) || {},
                isLiked: userLikes.includes(reply.id)
              }))
          }));

        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, parentCommentId?: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comentar",
        variant: "destructive",
      });
      return false;
    }

    if (!content.trim()) return false;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          profile_id: profileId,
          content: content.trim(),
          parent_comment_id: parentCommentId || null
        });

      if (error) throw error;

      await fetchComments(); // Refresh comments

      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi publicado com sucesso",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao comentar",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const likeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para curtir",
        variant: "destructive",
      });
      return;
    }

    try {
      const comment = comments.find(c => c.id === commentId) || 
                     comments.find(c => c.replies?.find(r => r.id === commentId))?.replies?.find(r => r.id === commentId);
      if (!comment) return;

      if (comment.isLiked) {
        // Unlike the comment
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('comment_id', commentId);

        if (error) throw error;

        // Update likes count
        await supabase
          .from('comments')
          .update({ likes_count: Math.max(0, comment.likes_count - 1) })
          .eq('id', commentId);
      } else {
        // Like the comment
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            user_id: user.id,
            comment_id: commentId
          });

        if (error) throw error;

        // Update likes count
        await supabase
          .from('comments')
          .update({ likes_count: comment.likes_count + 1 })
          .eq('id', commentId);

        // Create notification for comment owner
        const { data: commentData } = await supabase
          .from('comments')
          .select('user_id')
          .eq('id', commentId)
          .single();

        if (commentData && commentData.user_id !== user.id) {
          await supabase.rpc('create_notification', {
            target_user_id: commentData.user_id,
            notification_type: 'like',
            notification_message: `${user.user_metadata?.name || user.email} curtiu seu comentário`,
            target_profile_id: profileId,
            target_comment_id: commentId
          });
        }
      }

      await fetchComments(); // Refresh comments
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para excluir",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchComments(); // Refresh comments

      toast({
        title: "Comentário excluído!",
        description: "Seu comentário foi removido com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [profileId, user]);

  return {
    comments,
    loading,
    addComment,
    likeComment,
    deleteComment
  };
};