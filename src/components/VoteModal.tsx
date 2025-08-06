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

const phenotypeOptions = ["Mediterrâneo", "Nórdico", "Alpino", "Dinárico", "Báltico", "Armenóide", "Iranid"];

const characteristics = [
  {
    category: "Hair Color",
    options: ["Black", "Dark Brown", "Brown"]
  },
  {
    category: "Hair Texture", 
    options: ["Ondulado", "Liso", "Cacheado"]
  },
  {
    category: "Eye Color",
    options: ["Brown", "Hazel", "Green"]
  },
  {
    category: "Skin Tone",
    options: ["Light Brown", "Medium Brown", "Olive"]
  },
  {
    category: "Nasal Breadth",
    options: ["Médio", "Estreito", "Largo"]
  },
  {
    category: "Facial Breadth",
    options: ["Médio", "Largo", "Estreito"]
  },
  {
    category: "Body Type",
    options: ["Mesomorfo", "Ectomorfo", "Endomorfo"]
  },
  {
    category: "Jaw Type",
    options: ["Angular", "Quadrado", "Arredondado"]
  },
  {
    category: "Head Breadth",
    options: ["Médio", "Largo", "Estreito"]
  },
  {
    category: "Face Shape",
    options: ["Oval", "Round", "Square"]
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

  const isComplete = votes["Primary Phenotype"] !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-gradient-modal border-modal-accent/20 shadow-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-modal-accent">Vote nas Características Físicas</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 pr-2">
            {/* Phenotype Card */}
            <Card className="p-4 bg-modal-card border-modal-accent/30 shadow-card">
              <div className="space-y-4">
                <h3 className="font-semibold text-modal-accent text-lg">Phenotypes</h3>
                
                {/* Primary Phenotype */}
                <div className="space-y-3">
                  <Label className="font-semibold text-modal-text">
                    Primary Phenotype
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select
                    value={votes["Primary Phenotype"] || ""}
                    onValueChange={(value) => handleVoteChange("Primary Phenotype", value)}
                  >
                    <SelectTrigger className="w-full bg-modal-background border-modal-accent/40 focus:ring-2 focus:ring-modal-accent/50 text-modal-text">
                      <SelectValue placeholder="Selecione Primary Phenotype" className="text-modal-text" />
                    </SelectTrigger>
                    <SelectContent className="bg-modal-background border-modal-accent/40 z-50">
                      {phenotypeOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-modal-hover focus:bg-modal-hover text-modal-text hover:text-modal-text focus:text-modal-text"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Phenotype */}
                <div className="space-y-3">
                  <Label className="font-semibold text-modal-text">
                    Secondary Phenotype
                  </Label>
                  <Select
                    value={votes["Secondary Phenotype"] || ""}
                    onValueChange={(value) => handleVoteChange("Secondary Phenotype", value)}
                  >
                    <SelectTrigger className="w-full bg-modal-background border-modal-accent/40 focus:ring-2 focus:ring-modal-accent/50 text-modal-text">
                      <SelectValue placeholder="Selecione Secondary Phenotype" className="text-modal-text" />
                    </SelectTrigger>
                    <SelectContent className="bg-modal-background border-modal-accent/40 z-50">
                      {phenotypeOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-modal-hover focus:bg-modal-hover text-modal-text hover:text-modal-text focus:text-modal-text"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tertiary Phenotype */}
                <div className="space-y-3">
                  <Label className="font-semibold text-modal-text">
                    Tertiary Phenotype
                  </Label>
                  <Select
                    value={votes["Tertiary Phenotype"] || ""}
                    onValueChange={(value) => handleVoteChange("Tertiary Phenotype", value)}
                  >
                    <SelectTrigger className="w-full bg-modal-background border-modal-accent/40 focus:ring-2 focus:ring-modal-accent/50 text-modal-text">
                      <SelectValue placeholder="Selecione Tertiary Phenotype" className="text-modal-text" />
                    </SelectTrigger>
                    <SelectContent className="bg-modal-background border-modal-accent/40 z-50">
                      {phenotypeOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-modal-hover focus:bg-modal-hover text-modal-text hover:text-modal-text focus:text-modal-text"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Other characteristics in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characteristics.map((characteristic) => (
                <Card key={characteristic.category} className="p-4 bg-modal-card border-modal-accent/30 shadow-card">
                  <div className="space-y-3">
                    <Label className="font-semibold text-modal-text">
                      {characteristic.category}
                    </Label>
                    <Select
                      value={votes[characteristic.category] || ""}
                      onValueChange={(value) => handleVoteChange(characteristic.category, value)}
                    >
                      <SelectTrigger className="w-full bg-modal-background border-modal-accent/40 focus:ring-2 focus:ring-modal-accent/50 text-modal-text">
                        <SelectValue placeholder={`Selecione ${characteristic.category}`} className="text-modal-text" />
                      </SelectTrigger>
                      <SelectContent className="bg-modal-background border-modal-accent/40 z-50">
                        {characteristic.options.map((option) => (
                          <SelectItem 
                            key={option} 
                            value={option}
                            className="hover:bg-modal-hover focus:bg-modal-hover text-modal-text hover:text-modal-text focus:text-modal-text"
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
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete}
            className="bg-modal-accent hover:bg-modal-accent/90 text-white shadow-button"
          >
            Confirmar Voto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};