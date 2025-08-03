import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (votes: Record<string, string>) => void;
}

const characteristics = [
  {
    category: "Phenotype",
    options: ["Mediterrâneo", "Nórdico", "Atlântida", "Alpino", "Dinárico", "Báltico", "Armenóide", "Iranid"]
  },
  {
    category: "Hair Color",
    options: ["Loiro", "Castanho", "Ruivo", "Preto", "Grisalho"]
  },
  {
    category: "Hair Texture", 
    options: ["Liso", "Ondulado", "Cacheado", "Crespo"]
  },
  {
    category: "Skin",
    options: ["Muito Clara", "Clara", "Morena Clara", "Morena", "Morena Escura", "Escura"]
  },
  {
    category: "Region",
    options: ["Europa", "Ásia", "África", "América do Norte", "América do Sul", "Oceania"]
  },
  {
    category: "Nasal Breadth",
    options: ["Estreito", "Médio", "Largo"]
  },
  {
    category: "Facial Breadth",
    options: ["Estreito", "Médio", "Largo"]
  },
  {
    category: "Prognatismo",
    options: ["Ausente", "Leve", "Moderado", "Acentuado"]
  },
  {
    category: "Body Type",
    options: ["Ectomorfo", "Mesomorfo", "Endomorfo"]
  },
  {
    category: "Jaw Type",
    options: ["Quadrado", "Arredondado", "Pontiagudo", "Angular"]
  },
  {
    category: "Head Breadth",
    options: ["Estreito", "Médio", "Largo"]
  },
  {
    category: "Nasal Index",
    options: ["Leptorrino", "Mesorrino", "Platirrino"]
  },
  {
    category: "Cephalic Index",
    options: ["Dolicocéfalo", "Mesocéfalo", "Braquicéfalo"]
  },
  {
    category: "Eye Folds",
    options: ["Presente", "Ausente", "Parcial"]
  }
];

export const VoteModal = ({ isOpen, onClose, onSubmit }: VoteModalProps) => {
  const [votes, setVotes] = useState<Record<string, string>>({});

  const handleVoteChange = (category: string, value: string) => {
    setVotes(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    onSubmit(votes);
    setVotes({});
    onClose();
  };

  const isComplete = Object.keys(votes).length === characteristics.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vote nas Características Físicas</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characteristics.map((characteristic) => (
            <Card key={characteristic.category} className="p-4">
              <h3 className="font-semibold mb-3 text-phindex-dark">{characteristic.category}</h3>
              <RadioGroup
                value={votes[characteristic.category] || ""}
                onValueChange={(value) => handleVoteChange(characteristic.category, value)}
              >
                {characteristic.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${characteristic.category}-${option}`} />
                    <Label htmlFor={`${characteristic.category}-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete}
            className="bg-phindex-teal hover:bg-phindex-teal/90"
          >
            Confirmar Voto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};