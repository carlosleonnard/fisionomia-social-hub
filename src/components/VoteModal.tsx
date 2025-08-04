import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-phindex-teal">Vote nas Características Físicas</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-2">
          {characteristics.map((characteristic) => (
            <Card key={characteristic.category} className="p-4">
              <div className="space-y-3">
                <Label className="font-semibold text-phindex-dark">{characteristic.category}</Label>
                <Select
                  value={votes[characteristic.category] || ""}
                  onValueChange={(value) => handleVoteChange(characteristic.category, value)}
                >
                  <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                    <SelectValue placeholder={`Selecione ${characteristic.category}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/50 z-50">
                    {characteristic.options.map((option) => (
                      <SelectItem 
                        key={option} 
                        value={option}
                        className="hover:bg-muted focus:bg-muted"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          ))}
          </div>
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