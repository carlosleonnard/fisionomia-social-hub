import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Vote {
  classification: string;
  count: number;
  percentage: number;
}

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  phenotypes: string[];
  likes: number;
  comments: number;
  votes: Vote[];
  hasUserVoted: boolean;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onVote: (id: string, classification: string) => void;
  country: string;
}

export const ProfileCard = ({ 
  id, 
  name, 
  age, 
  location, 
  imageUrl, 
  phenotypes, 
  likes, 
  comments,
  votes,
  hasUserVoted,
  onLike,
  onComment,
  onVote,
  country 
}: ProfileCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  // Mapeamento de códigos de países para emojis de bandeiras
  const countryFlags: Record<string, string> = {
    "US": "🇺🇸", "BR": "🇧🇷", "IN": "🇮🇳", "IL": "🇮🇱", "ES": "🇪🇸", 
    "NG": "🇳🇬", "FR": "🇫🇷", "DE": "🇩🇪", "IT": "🇮🇹", "JP": "🇯🇵",
    "CN": "🇨🇳", "KR": "🇰🇷", "MX": "🇲🇽", "CA": "🇨🇦", "AU": "🇦🇺",
    "GB": "🇬🇧", "RU": "🇷🇺", "AR": "🇦🇷", "EG": "🇪🇬", "ZA": "🇿🇦"
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(id);
  };

  const topVote = votes.length > 0 ? votes.reduce((prev, current) => 
    prev.percentage > current.percentage ? prev : current
  ) : null;

  return (
    <Card className="bg-card border-border/50 hover:shadow-card transition-all duration-300 overflow-hidden group">
      <div className="relative cursor-pointer" onClick={() => navigate(`/profile/${id}`)}>
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 border-2 border-primary"
          />
          <div className="absolute top-2 left-2 text-lg">
            {countryFlags[country] || "🌎"}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="p-3 space-y-3">
        {/* Nome e informações básicas */}
        <div className="text-center">
          <h3 className="font-semibold text-phindex-dark text-sm">Profile {id}</h3>
          <p className="text-xs text-muted-foreground">{name}, {age}</p>
          {topVote && (
            <Badge variant="secondary" className="text-xs mt-1 bg-phindex-teal/10 text-phindex-teal">
              {topVote.classification} {topVote.percentage}%
            </Badge>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 text-xs h-7 ${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
            {likes + (isLiked ? 1 : 0)}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs h-7 text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onComment(id);
            }}
          >
            <MessageCircle className="h-3 w-3" />
            {comments}
          </Button>
        </div>
      </div>
    </Card>
  );
};