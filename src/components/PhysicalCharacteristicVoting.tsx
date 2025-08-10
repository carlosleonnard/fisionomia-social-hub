import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Vote } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface CharacteristicVote {
  option: string;
  count: number;
  percentage: number;
}

interface PhysicalCharacteristic {
  name: string;
  votes: CharacteristicVote[];
  userVote?: string;
}

interface PhysicalCharacteristicVotingProps {
  characteristic: PhysicalCharacteristic;
  options: string[];
  onVote: (characteristicName: string, option: string) => Promise<boolean>;
  onChangeVote: (characteristicName: string, option: string) => Promise<boolean>;
}

export const PhysicalCharacteristicVoting = ({ 
  characteristic, 
  options, 
  onVote, 
  onChangeVote 
}: PhysicalCharacteristicVotingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleVote = async (option: string) => {
    const success = characteristic.userVote 
      ? await onChangeVote(characteristic.name, option)
      : await onVote(characteristic.name, option);
    
    if (success) {
      setIsOpen(false);
    }
  };

  const hasUserVoted = !!characteristic.userVote;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-phindex-teal">{characteristic.name}</h4>
        
        {user && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant={hasUserVoted ? "outline" : "default"}
                size="sm"
                className="flex items-center gap-1"
              >
                {hasUserVoted ? (
                  <>
                    <Edit className="h-3 w-3" />
                    Editar
                  </>
                ) : (
                  <>
                    <Vote className="h-3 w-3" />
                    Votar
                  </>
                )}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-phindex-teal">
                  {hasUserVoted ? `Editar voto em ${characteristic.name}` : `Votar em ${characteristic.name}`}
                </DialogTitle>
              </DialogHeader>
              
              {hasUserVoted && (
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Voto atual: <span className="font-medium text-phindex-teal">{characteristic.userVote}</span>
                  </p>
                </div>
              )}
              
              <div className="grid gap-2">
                {options.map((option) => (
                  <Button
                    key={option}
                    variant={characteristic.userVote === option ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleVote(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {hasUserVoted && (
        <div className="text-xs text-muted-foreground mb-2">
          Seu voto: <span className="font-medium text-phindex-teal">{characteristic.userVote}</span>
        </div>
      )}

      <div className="space-y-2">
        {characteristic.votes.filter(vote => vote.count > 0).map((vote, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">{vote.option}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{vote.percentage.toFixed(1)}%</span>
                <span className="text-xs text-muted-foreground">({vote.count})</span>
              </div>
            </div>
            <Progress value={vote.percentage} className="h-2" />
          </div>
        ))}
        
        {characteristic.votes.filter(vote => vote.count > 0).length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum voto ainda</p>
        )}
      </div>
    </div>
  );
};