import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (votes: Record<string, string>) => void;
  existingVotes?: Record<string, string>;
}

const specificPhenotypeOptions = {
  "Northern America": [
    "Eskimid",
    "Margid", 
    "Pacificid",
    "Silvid"
  ],
  "Central America": [
    "Centralid"
  ],
  "Southern America": [
    "Amazonid",
    "Andid",
    "Lagid",
    "Patagonid"
  ],
  "North Africa": [
    "Mediterranid",
    "Orientalid"
  ],
  "East Africa": [
    "Ethiopid",
    "Nilotid",
    "Sudanid"
  ],
  "Sub-Saharan Africa": [
    "Bambutid",
    "Bantuid",
    "Congoid",
    "Khoid",
    "Sanid"
  ],
  "Central Asia": [
    "Tungid",
    "Turanid"
  ],
  "Southern Asia": [
    "Indid",
    "Indo Melanin",
    "Veddid"
  ],
  "East Asia": [
    "Ainuid",
    "Sibirid",
    "Sinid"
  ],
  "Southeastern Asia": [
    "Negritid",
    "South Mongoloid"
  ],
  "Eastern Europe": [
    "Dinarid",
    "East Europid",
    "Turanid"
  ],
  "Southern Europe": [
    "Mediterranid"
  ],
  "Central Europe": [
    "Alpinid"
  ],
  "Northern Europe": [
    "Lappid",
    "Nordid"
  ],
  "Anatolia": [
    "Alpinid",
    "Armenoid",
    "Mediterranid",
    "Turanid"
  ],
  "Levant": [
    "Armenoid",
    "Mediterranid"
  ],
  "Arabian Peninsula": [
    "Orientalid",
    "Veddid"
  ],
  "Persian Plateau": [
    "Orientalid"
  ],
  "Australia and New Zealand": [
    "Australid"
  ],
  "Melanesia": [
    "Melanesid"
  ],
  "Polynesia": [
    "Polynesid"
  ]
};

const geographicOptions = {
  "Europe": [
    "Eastern Europe",
    "Central Europe", 
    "Southern Europe",
    "Northern Europe"
  ],
  "Africa": [
    "North Africa",
    "East Africa",
    "Sub-Saharan Africa"
  ],
  "Middle East": [
    "Levant",
    "Anatolia", 
    "Arabian Peninsula",
    "Persian Plateau"
  ],
  "Asia": [
    "Central Asia",
    "Eastern Asia",
    "Southern Asia",
    "Southeastern Asia"
  ],
  "Americas": [
    "Northern America",
    "Central America",
    "Southern América"
  ],
  "Oceania": [
    "Australia and New Zealand",
    "Melanesia",
    "Polynesia"
  ]
};

const characteristics = [
  {
    category: "Skin Color",
    options: ["Pale", "Fair", "Light brown", "Medium brown", "Dark brown", "Black"]
  },
  {
    category: "Hair Color",
    options: ["Blonde", "Red", "Brown", "Black"]
  },
  {
    category: "Hair Texture", 
    options: ["Straight (Fine/Thin)", "Straight (Medium)", "Straight (Coarse)", "Wavy (Fine/Thin)", "Wavy (Medium)", "Wavy (Coarse)", "Curly (Loose)", "Curly (Tight)", "Kinky (Soft)", "Kinky (Wiry)"]
  },
  {
    category: "Head Type",
    options: ["Hyperdolichocephalic", "Dolichocephalic", "Mesocephalic", "Brachycephalic", "Hyperbrachycephalic"]
  },
  {
    category: "Body Type",
    options: ["Ectomorph", "Mesomorph", "Endomorph"]
  },
  {
    category: "Nasal Breadth",
    options: ["Hyperleptorrhine (very narrow)", "Leptorrhine (narrow)", "Mesorrhine (medium-wide)", "Platyrrhine (wide)", "Hyperplatyrrhine (very wide)"]
  },
  {
    category: "Facial Breadth",
    options: ["Leptoprosop", "Mesoprosop", "Euryprosop"]
  },
  {
    category: "Jaw Type",
    options: ["Orthognathous", "Prognathous"]
  },
  {
    category: "Eye Color",
    options: ["Pale-blue iris", "Light-blue iris", "Sky-blue iris", "Blue iris", "Dark-blue iris", "Blue-gray iris", "Light-gray iris", "Dark-gray iris", "Blue-gray iris with yellow/brown spots", "Gray-green iris with yellow/brown spots", "Green iris", "Green iris with yellow/brown spots", "Amber iris", "Hazel iris", "Light-brown iris", "Medium-brown iris", "Dark-brown iris", "Mahogany iris", "Black-brown iris", "Black iris"]
  },
  {
    category: "Head Breadth",
    options: ["Small-headed", "Large-headed"]
  }
];

export const VoteModal = ({ isOpen, onClose, onSubmit, existingVotes = {} }: VoteModalProps) => {
  const [votes, setVotes] = useState<Record<string, string>>(existingVotes);

  useEffect(() => {
    setVotes(existingVotes);
  }, [existingVotes]);

  const handleVoteChange = (category: string, value: string) => {
    setVotes(prev => {
      const newVotes = { ...prev, [category]: value };
      
      // Se mudou um primário, limpa os secundários e terciários correspondentes
      if (category === "Primary Geographic") {
        delete newVotes["Secondary Geographic"];
        delete newVotes["Tertiary Geographic"];
      } else if (category === "Primary Phenotype") {
        delete newVotes["Secondary Phenotype"];
        delete newVotes["Tertiary Phenotype"];
      } else if (category === "Secondary Geographic") {
        delete newVotes["Tertiary Geographic"];
      } else if (category === "Secondary Phenotype") {
        delete newVotes["Tertiary Phenotype"];
      }
      
      return newVotes;
    });
  };

  const handleSubmit = () => {
    onSubmit(votes);
    setVotes({});
    onClose();
  };

  // Função para obter todas as opções geográficas
  const getAllGeographicOptions = () => {
    const allOptions: string[] = [];
    Object.entries(geographicOptions).forEach(([region, subregions]) => {
      allOptions.push(...subregions);
    });
    // Remove duplicates using Set
    return [...new Set(allOptions)];
  };

  // Função para filtrar opções disponíveis
  const getAvailableGeographicOptions = (level: 'secondary' | 'tertiary') => {
    const selectedPrimary = votes["Primary Geographic"];
    const selectedSecondary = votes["Secondary Geographic"];
    const allOptions = getAllGeographicOptions();
    
    return allOptions.filter(option => {
      if (level === 'secondary') {
        return option !== selectedPrimary;
      } else { // tertiary
        return option !== selectedPrimary && option !== selectedSecondary;
      }
    });
  };

  // Função para obter todas as opções de fenótipo
  const getAllPhenotypeOptions = () => {
    const allOptions: string[] = [];
    Object.entries(specificPhenotypeOptions).forEach(([region, phenotypes]) => {
      allOptions.push(...phenotypes);
    });
    // Remove duplicates using Set
    return [...new Set(allOptions)];
  };

  const getAvailablePhenotypeOptions = (level: 'secondary' | 'tertiary') => {
    const selectedPrimary = votes["Primary Phenotype"];
    const selectedSecondary = votes["Secondary Phenotype"];
    const allOptions = getAllPhenotypeOptions();
    
    return allOptions.filter(option => {
      if (level === 'secondary') {
        return option !== selectedPrimary;
      } else { // tertiary
        return option !== selectedPrimary && option !== selectedSecondary;
      }
    });
  };

  const isComplete = votes["Primary Geographic"] !== undefined && votes["Primary Phenotype"] !== undefined;

  // Sets to ensure phenotype options are not duplicated across regions in each dropdown
  const seenPhenotypesPrimary = new Set<string>();
  const seenPhenotypesSecondary = new Set<string>();
  const seenPhenotypesTertiary = new Set<string>();

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
                      {Object.entries(geographicOptions).map(([region, subregions]) => (
                        <div key={region}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                            {region}
                          </div>
                          {subregions.map((subregion) => (
                            <SelectItem 
                              key={subregion} 
                              value={subregion}
                              className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                            >
                              {subregion}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Geographic - only show if primary is selected */}
                {votes["Primary Geographic"] && (
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
                        {Object.entries(geographicOptions).map(([region, subregions]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                            {subregions
                              .filter(subregion => getAvailableGeographicOptions('secondary').includes(subregion))
                              .map((subregion) => (
                                <SelectItem 
                                  key={subregion} 
                                  value={subregion}
                                  className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                                >
                                  {subregion}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Tertiary Geographic - only show if secondary is selected */}
                {votes["Secondary Geographic"] && (
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
                        {Object.entries(geographicOptions).map(([region, subregions]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                            {subregions
                              .filter(subregion => getAvailableGeographicOptions('tertiary').includes(subregion))
                              .map((subregion) => (
                                <SelectItem 
                                  key={subregion} 
                                  value={subregion}
                                  className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                                >
                                  {subregion}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
                      {Object.entries(specificPhenotypeOptions).map(([region, phenotypes]) => (
                        <div key={region}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                            {region}
                          </div>
                          {phenotypes
                            .filter((phenotype) => {
                              if (seenPhenotypesPrimary.has(phenotype)) return false;
                              seenPhenotypesPrimary.add(phenotype);
                              return true;
                            })
                            .map((phenotype) => (
                            <SelectItem 
                              key={phenotype} 
                              value={phenotype}
                              className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                            >
                              {phenotype}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Phenotype - only show if primary is selected */}
                {votes["Primary Phenotype"] && (
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
                        {Object.entries(specificPhenotypeOptions).map(([region, phenotypes]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                             {phenotypes
                               .filter((phenotype) => getAvailablePhenotypeOptions('secondary').includes(phenotype))
                               .filter((phenotype) => {
                                 if (seenPhenotypesSecondary.has(phenotype)) return false;
                                 seenPhenotypesSecondary.add(phenotype);
                                 return true;
                               })
                              .map((phenotype) => (
                                <SelectItem 
                                  key={phenotype} 
                                  value={phenotype}
                                  className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                                >
                                  {phenotype}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Tertiary Phenotype - only show if secondary is selected */}
                {votes["Secondary Phenotype"] && (
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
                        {Object.entries(specificPhenotypeOptions).map(([region, phenotypes]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                             {phenotypes
                               .filter((phenotype) => getAvailablePhenotypeOptions('tertiary').includes(phenotype))
                               .filter((phenotype) => {
                                 if (seenPhenotypesTertiary.has(phenotype)) return false;
                                 seenPhenotypesTertiary.add(phenotype);
                                 return true;
                               })
                              .map((phenotype) => (
                                <SelectItem 
                                  key={phenotype} 
                                  value={phenotype}
                                  className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                                >
                                  {phenotype}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
                            className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black"
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