import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePhysicalVoting } from "@/hooks/use-physical-voting";
import { useAuth } from "@/hooks/use-auth";

interface PhysicalCharacteristicVotingFormProps {
  profileId: string;
}

// Definições das opções para cada característica física
const PHYSICAL_CHARACTERISTICS = {
  "Skin Tone": ["pale", "fair", "light brown", "medium brown", "dark brown", "black"],
  "Hair Color": ["blonde", "red", "brown", "black"],
  "Hair Texture": [
    "Straight (Fine/Thin)", "Straight (Medium)", "Straight (Coarse)",
    "Wavy (Fine/Thin)", "Wavy (Medium)", "Wavy (Coarse)",
    "Curly (Loose)", "Curly (Tight)", "Kinky (Soft)", "Kinky (Wiry)"
  ],
  "Head Breadth": [
    "hyperdolichocephalic", "dolichocephalic", "mesocephalic", 
    "brachycephalic", "hyperbrachycephalic"
  ],
  "Body Type": ["ectomorph", "mesomorph", "endomorph"],
  "Nasal Breadth": [
    "hyperleptorrhine (very narrow)", "leptorrhine (narrow)", 
    "mesorrhine (medium-wide)", "platyrrhine (wide)", "hyperplatyrrhine (very wide)"
  ],
  "Facial Breadth": ["leptoprosop", "mesoprosop", "euryprosop"],
  "Jaw Type": ["orthognathous", "prognathous"],
  "Eye Color": [
    "pale-blue iris", "light-blue iris", "sky-blue iris", "blue iris", "dark-blue iris",
    "blue-gray iris", "light-gray iris", "dark-gray iris", "blue-gray iris with yellow/brown spots",
    "gray-green iris with yellow/brown spots", "green iris", "green iris with yellow/brown spots",
    "amber iris", "hazel iris", "light-brown iris", "medium-brown iris", "dark-brown iris",
    "mahogany iris", "black-brown iris", "black iris"
  ],
  "Face Shape": ["small-headed", "large-headed"]
};

export const PhysicalCharacteristicVotingForm = ({ profileId }: PhysicalCharacteristicVotingFormProps) => {
  const { user } = useAuth();
  const { userVotes, castVote, loading } = usePhysicalVoting(profileId);
  const { toast } = useToast();
  const [tempVotes, setTempVotes] = useState<{ [key: string]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);

  const handleVoteChange = (characteristic: string, value: string) => {
    setTempVotes(prev => ({ ...prev, [characteristic]: value }));
    setHasChanges(true);
  };

  const handleSubmitVotes = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar",
        variant: "destructive",
      });
      return;
    }

    let successCount = 0;
    const totalVotes = Object.keys(tempVotes).length;

    for (const [characteristic, classification] of Object.entries(tempVotes)) {
      const success = await castVote(characteristic, classification);
      if (success) successCount++;
    }

    if (successCount === totalVotes) {
      toast({
        title: "Votos salvos!",
        description: `${successCount} características foram votadas com sucesso.`,
      });
      setTempVotes({});
      setHasChanges(false);
    } else {
      toast({
        title: "Erro parcial",
        description: `${successCount} de ${totalVotes} votos foram salvos.`,
        variant: "destructive",
      });
    }
  };

  const getCurrentValue = (characteristic: string) => {
    return tempVotes[characteristic] || userVotes[characteristic] || "";
  };

  if (!user) {
    return (
      <Card className="p-4">
        <p className="text-center text-muted-foreground">
          Faça login para votar nas características físicas
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-phindex-teal">
          Características Físicas
        </h3>
        <Badge variant="outline" className="text-xs">
          Vote em cada característica
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(PHYSICAL_CHARACTERISTICS).map(([characteristic, options]) => (
          <div key={characteristic} className="space-y-2">
            <label className="text-sm font-medium text-phindex-dark">
              {characteristic}
            </label>
            <Select
              value={getCurrentValue(characteristic)}
              onValueChange={(value) => handleVoteChange(characteristic, value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Selecionar ${characteristic.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="border-t pt-4">
          <Button 
            onClick={handleSubmitVotes}
            disabled={loading || Object.keys(tempVotes).length === 0}
            className="w-full bg-phindex-teal hover:bg-phindex-teal/90"
          >
            {loading ? "Salvando..." : "Salvar Votos"}
          </Button>
        </div>
      )}

      {!hasChanges && Object.keys(userVotes).length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm text-center text-muted-foreground">
            Você já votou neste perfil. Selecione novas opções para alterar seus votos.
          </p>
        </div>
      )}
    </Card>
  );
};