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

const specificPhenotypeOptions = ["Mediterrâneo", "Nórdico", "Alpino", "Dinárico", "Báltico", "Armenóide", "Iranid"];

const geographicOptions = ["Sul Europa", "Norte Europa", "América do Sul", "Oriente Médio", "Ásia Central", "África", "Oceania"];

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

  const isComplete = votes["Primary Geographic"] !== undefined && votes["Primary Phenotype"] !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-gradient-modal border-modal-accent/20 shadow-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-modal-accent">Vote nas Características Físicas</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 pr-2">
            {/* General Phenotype Classification Card */}
            <Card className="p-4 bg-card border-border shadow-card">
              <div className="space-y-4">
                <h3 className="font-semibold text-phindex-teal text-lg">General Phenotype Classification</h3>
                
                {/* Primary Geographic */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Primary Geographic
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Selecione a região geográfica que melhor representa a ancestralidade primária</p>
                  <Select
                    value={votes["Primary Geographic"] || ""}
                    onValueChange={(value) => handleVoteChange("Primary Geographic", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Selecione Primary Geographic" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 z-50">
                      {geographicOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-muted focus:bg-muted text-foreground"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Geographic */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Secondary Geographic
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Selecione uma região geográfica secundária, se aplicável</p>
                  <Select
                    value={votes["Secondary Geographic"] || ""}
                    onValueChange={(value) => handleVoteChange("Secondary Geographic", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Selecione Secondary Geographic" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 z-50">
                      {geographicOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-muted focus:bg-muted text-foreground"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tertiary Geographic */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Tertiary Geographic
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Selecione uma região geográfica terciária, se aplicável</p>
                  <Select
                    value={votes["Tertiary Geographic"] || ""}
                    onValueChange={(value) => handleVoteChange("Tertiary Geographic", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Selecione Tertiary Geographic" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 z-50">
                      {geographicOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-muted focus:bg-muted text-foreground"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Specific Phenotype Classification Card */}
            <Card className="p-4 bg-card border-border shadow-card">
              <div className="space-y-4">
                <h3 className="font-semibold text-phindex-teal text-lg">Specific Phenotype Classification</h3>
                
                {/* Primary Phenotype */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Primary Phenotype
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Selecione o fenótipo específico que melhor representa as características físicas</p>
                  <Select
                    value={votes["Primary Phenotype"] || ""}
                    onValueChange={(value) => handleVoteChange("Primary Phenotype", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Selecione Primary Phenotype" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 z-50">
                      {specificPhenotypeOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-muted focus:bg-muted text-foreground"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Phenotype */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Secondary Phenotype
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Selecione um fenótipo secundário, se aplicável</p>
                  <Select
                    value={votes["Secondary Phenotype"] || ""}
                    onValueChange={(value) => handleVoteChange("Secondary Phenotype", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Selecione Secondary Phenotype" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 z-50">
                      {specificPhenotypeOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-muted focus:bg-muted text-foreground"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tertiary Phenotype */}
                <div className="space-y-3">
                  <Label className="font-semibold text-foreground">
                    Tertiary Phenotype
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Selecione um fenótipo terciário, se aplicável</p>
                  <Select
                    value={votes["Tertiary Phenotype"] || ""}
                    onValueChange={(value) => handleVoteChange("Tertiary Phenotype", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Selecione Tertiary Phenotype" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 z-50">
                      {specificPhenotypeOptions.map((option) => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          className="hover:bg-muted focus:bg-muted text-foreground"
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
                <Card key={characteristic.category} className="p-4 bg-card border-border shadow-card">
                  <div className="space-y-3">
                    <Label className="font-semibold text-foreground">
                      {characteristic.category}
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">Avalie esta característica física específica</p>
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
                            className="hover:bg-muted focus:bg-muted text-foreground"
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
            className="bg-phindex-teal hover:bg-phindex-teal/90"
          >
            Confirmar Voto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};