import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Vote {
  classification: string;
  count: number;
  percentage: number;
}

interface VotingSectionProps {
  profileId: string;
  votes: Vote[];
  onVote: (profileId: string, classification: string) => void;
  hasUserVoted: boolean;
}

export const VotingSection = ({ profileId, votes, onVote, hasUserVoted }: VotingSectionProps) => {
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null);

  const classifications = [
    "Mediterrâneo", "Nórdico", "Atlântida", "Alpino",
    "Dinárico", "Báltico", "Armenóide", "Iranid"
  ];

  const totalVotes = votes.reduce((sum, vote) => sum + vote.count, 0);

  const handleVote = (classification: string) => {
    if (!hasUserVoted) {
      setSelectedClassification(classification);
      onVote(profileId, classification);
    }
  };

  const getVoteData = (classification: string) => {
    return votes.find(v => v.classification === classification) || { count: 0, percentage: 0 };
  };

  return (
    <Card className="bg-card border-border/50 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-phindex-dark">Classificação Fenotípica</h3>
          <Badge variant="secondary" className="text-xs">
            {totalVotes} votos
          </Badge>
        </div>

        {/* Resultados das votações */}
        {totalVotes > 0 && (
          <div className="space-y-3">
            {votes
              .filter(vote => vote.count > 0)
              .sort((a, b) => b.percentage - a.percentage)
              .slice(0, 3)
              .map((vote) => (
              <div key={vote.classification} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-phindex-dark">{vote.classification}</span>
                  <span className="text-muted-foreground">{vote.percentage}%</span>
                </div>
                <Progress 
                  value={vote.percentage} 
                  className="h-2 bg-muted/30"
                />
              </div>
            ))}
          </div>
        )}

        {/* Botões de votação */}
        {!hasUserVoted && (
          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground mb-3">Vote no fenótipo que você identifica:</p>
            <div className="grid grid-cols-2 gap-2">
              {classifications.map((classification) => {
                const voteData = getVoteData(classification);
                return (
                  <Button
                    key={classification}
                    variant={selectedClassification === classification ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-8 hover:bg-phindex-teal hover:text-white transition-colors"
                    onClick={() => handleVote(classification)}
                  >
                    {classification}
                    {voteData.count > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs bg-white/20">
                        {voteData.count}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {hasUserVoted && (
          <div className="border-t pt-3">
            <p className="text-xs text-center text-muted-foreground">
              Obrigado pelo seu voto! 🗳️
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};