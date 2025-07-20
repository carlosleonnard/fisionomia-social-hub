import { useState } from "react";
import { Heart, MessageCircle, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  phenotypes: string[];
  likes: number;
  comments: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onClassify: (id: string, classification: string) => void;
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
  onLike,
  onComment,
  onClassify 
}: ProfileCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showClassifications, setShowClassifications] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(id);
  };

  const classifications = [
    "Mediterrâneo", "Nórdico", "Atlântida", "Alpino",
    "Dinárico", "Báltico", "Armenóide", "Iranid"
  ];

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{name}, {age}</h3>
          <p className="text-sm opacity-90">{location}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
          onClick={() => setShowClassifications(!showClassifications)}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Fenótipos atuais */}
        <div className="flex flex-wrap gap-2">
          {phenotypes.map((phenotype, index) => (
            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {phenotype}
            </Badge>
          ))}
        </div>

        {/* Classificações disponíveis */}
        {showClassifications && (
          <div className="animate-slide-up">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Classificar como:</h4>
            <div className="grid grid-cols-2 gap-2">
              {classifications.map((classification) => (
                <Button
                  key={classification}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onClassify(id, classification)}
                >
                  {classification}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {likes + (isLiked ? 1 : 0)}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onComment(id)}
            >
              <MessageCircle className="h-4 w-4" />
              {comments}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 border-green-500/20 hover:bg-green-500/10"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-500/20 hover:bg-red-500/10"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};