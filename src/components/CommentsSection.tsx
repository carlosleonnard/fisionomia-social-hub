import { useState } from "react";
import { Send, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  parent_comment_id?: string | null;
  user: {
    name: string;
    email: string;
  };
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentsSectionProps {
  profileId: string;
  comments: Comment[];
  onAddComment: (content: string, parentCommentId?: string) => Promise<boolean>;
  onLikeComment: (commentId: string) => void;
}

export const CommentsSection = ({ 
  profileId, 
  comments, 
  onAddComment, 
  onLikeComment 
 }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "top">("recent");

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "top") {
      return b.likes_count - a.likes_count;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleSubmitReply = async (e: React.FormEvent, parentCommentId: string) => {
    e.preventDefault();
    if (replyContent.trim()) {
      const success = await onAddComment(replyContent.trim(), parentCommentId);
      if (success) {
        setReplyContent("");
        setReplyingTo(null);
      }
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const success = await onAddComment(newComment.trim());
      if (success) {
        setNewComment("");
      }
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Comentários ({comments.length})</h3>
        <Select value={sortBy} onValueChange={(value: "recent" | "top") => setSortBy(value)}>
          <SelectTrigger className="w-[140px] bg-muted/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur border-border/50">
            <SelectItem value="recent">Recentes</SelectItem>
            <SelectItem value="top">Mais curtidos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Formulário para novo comentário */}
      <form onSubmit={handleSubmitComment} className="flex gap-3">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-muted/50 border-border/50 focus:border-primary/50"
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-gradient-primary hover:shadow-button transition-all duration-300"
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Lista de comentários */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Main comment */}
            <div className="flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur border-border/50">
                      <DropdownMenuItem className="cursor-pointer">
                        Reportar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive">
                        Bloquear usuário
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm mt-1">{comment.content}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 gap-1 text-xs ${
                      comment.isLiked ? 'text-red-500' : 'text-muted-foreground'
                    } hover:text-red-500 transition-colors`}
                    onClick={() => onLikeComment(comment.id)}
                  >
                    <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                    {comment.likes_count}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    Responder
                  </Button>
                </div>

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3 flex gap-2">
                    <Input
                      placeholder="Escreva uma resposta..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="bg-muted/50 border-border/50 focus:border-primary/50 text-sm"
                      autoFocus
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      className="bg-gradient-primary hover:shadow-button transition-all duration-300"
                      disabled={!replyContent.trim()}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3 p-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{reply.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs">{reply.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <p className="text-xs mt-1">{reply.content}</p>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-5 px-1 gap-1 text-xs ${
                            reply.isLiked ? 'text-red-500' : 'text-muted-foreground'
                          } hover:text-red-500 transition-colors`}
                          onClick={() => onLikeComment(reply.id)}
                        >
                          <Heart className={`h-2 w-2 ${reply.isLiked ? 'fill-current' : ''}`} />
                          {reply.likes_count}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        )}
      </div>
    </Card>
  );
};