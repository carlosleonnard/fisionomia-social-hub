import { Progress } from "@/components/ui/progress";

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
}

export const PhysicalCharacteristicVoting = ({ 
  characteristic
}: PhysicalCharacteristicVotingProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-phindex-teal">{characteristic.name}</h4>
      
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
          <p className="text-sm text-muted-foreground">No votes yet</p>
        )}
      </div>
    </div>
  );
};