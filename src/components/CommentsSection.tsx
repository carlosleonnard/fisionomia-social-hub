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
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  userVote?: string; // Fenótipo que o usuário votou
}

interface CommentsSectionProps {
  profileId: string;
  comments: Comment[];
  onAddComment: (profileId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const CommentsSection = ({ 
  profileId, 
  comments, 
  onAddComment, 
  onLikeComment 
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "top">("recent");

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "top") {
      return b.likes - a.likes;
    }
    // Para recent, assumindo que o timestamp é uma string de data
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(profileId, newComment.trim());
      setNewComment("");
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
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
          <AvatarFallback>EU</AvatarFallback>
        </Avatar>
        
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
          <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.avatar} />
              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  {comment.userVote && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Votou em:</span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {comment.userVote}
                      </span>
                    </div>
                  )}
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
                  {comment.likes}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Responder
                </Button>
              </div>
            </div>
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