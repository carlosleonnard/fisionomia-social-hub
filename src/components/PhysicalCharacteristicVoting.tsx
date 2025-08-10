import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Vote } from "lucide-react";

interface PhysicalVote {
  option: string;
  count: number;
  percentage: number;
}

interface PhysicalCharacteristic {
  name: string;
  votes: PhysicalVote[];
}

interface PhysicalCharacteristicVotingProps {
  characteristic: PhysicalCharacteristic;
  userVote?: string;
  onVote: (classification: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const characteristicOptions: { [key: string]: string[] } = {
  'Hair Color': ['Black', 'Dark Brown', 'Brown', 'Light Brown', 'Blonde', 'Red', 'Gray', 'White'],
  'Hair Texture': ['Liso', 'Ondulado', 'Cacheado', 'Crespo'],
  'Eye Color': ['Brown', 'Hazel', 'Green', 'Blue', 'Gray', 'Amber'],
  'Skin Tone': ['Very Light', 'Light', 'Light Brown', 'Medium Brown', 'Dark Brown', 'Very Dark', 'Olive'],
  'Nasal Breadth': ['Estreito', 'Médio', 'Largo'],
  'Facial Breadth': ['Estreito', 'Médio', 'Largo'],
  'Body Type': ['Ectomorfo', 'Mesomorfo', 'Endomorfo'],
  'Jaw Type': ['Angular', 'Quadrado', 'Arredondado'],
  'Head Breadth': ['Estreito', 'Médio', 'Largo'],
  'Face Shape': ['Round', 'Oval', 'Square', 'Heart', 'Diamond', 'Oblong']
};

export const PhysicalCharacteristicVoting = ({ 
  characteristic, 
  userVote, 
  onVote, 
  isAuthenticated 
}: PhysicalCharacteristicVotingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleVote = async () => {
    if (selectedOption) {
      const success = await onVote(selectedOption);
      if (success) {
        setIsOpen(false);
        setSelectedOption('');
      }
    }
  };

  const options = characteristicOptions[characteristic.name] || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-phindex-teal">{characteristic.name}</h4>
        {isAuthenticated && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant={userVote ? "outline" : "default"}
                className="h-8 px-3"
              >
                <Vote className="h-3 w-3 mr-1" />
                {userVote ? 'Alterar' : 'Votar'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{characteristic.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {userVote && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Voto atual: <span className="font-medium text-phindex-teal">{userVote}</span>
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedOption === option ? "default" : "outline"}
                      onClick={() => setSelectedOption(option)}
                      className="h-auto py-2 px-3"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={handleVote} 
                  disabled={!selectedOption}
                  className="w-full"
                >
                  {userVote ? 'Alterar Voto' : 'Confirmar Voto'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="space-y-2">
        {characteristic.votes.length > 0 ? (
          characteristic.votes.map((vote, voteIndex) => (
            <div key={voteIndex} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">{vote.option}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{vote.percentage.toFixed(1)}%</span>
                  <span className="text-xs text-muted-foreground">({vote.count})</span>
                </div>
              </div>
              <Progress value={vote.percentage} className="h-2" />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum voto ainda</p>
        )}
      </div>
    </div>
  );
};