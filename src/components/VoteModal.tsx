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
  profileId: string;
}

const specificPhenotypeOptions = {
  "Northern America": {
    "Eskimid": ["Inuid", "Bering Sea"],
    "Margid": ["Mexicid", "Sonorid", "Californid"],
    "Pacificid": ["Pacifid", "California Pacifid", "Athabaskid", "Arizonid"],
    "Silvid": ["Planid", "Appalacid"]
  },
  "Central America": {
    "Centralid": ["Isthmid", "Maya", "Pueblid"]
  },
  "Southern America": {
    "Amazonid": ["North Amazonid", "South Amazonid", "West Amazonid", "Chocó-Motilon"],
    "Andid": ["North Andid", "Central Andid", "South Andid"],
    "Lagid": ["Lagoa Santa", "South Fuegid", "Huarpid", "Botocudo"],
    "Patagonid": ["Patagonid", "Bororo", "Pampid"]
  },
  "North Africa": {
    "Mediterranid": ["Paleo Sardinian", "Canarid", "Berberid", "Eurafricanid", "Proto Iranid", "Trans Mediterranid", "Gracile Mediterranid", "Pontid", "North Pontid", "Paleo Atlantid", "North Atlantid", "Fezzanid", "Moorish", "Siwa", "Targid", "Egyptid", "Litorid"],
    "Orientalid": ["Arabid", "Iranid", "Libyid", "Targid", "Egyptid", "Transcaspian", "Yemenid", "Middle Nile", "Proto Iranid", "Indo Iranid"]
  },
  "East Africa": {
    "Ethiopid": ["Proto Ethiopid", "Omotic", "East Ethiopid", "North Ethiopid", "South Ethiopid", "Maasai", "Central Ethiopid", "Saharan Ethiopid", "West Ethiopid", "Danakil", "Moorish", "Siwa", "Nilo Hamitic"],
    "Nilotid": ["Pre Nilotid", "Dinkaid", "Shillukid", "South Nilotid", "Nilo Hamitic", "Shari"],
    "Sudanid": ["Sudanid", "East Sudanid", "Bobo", "Senegalid", "Middle Nile", "Fezzanid", "Shari", "Sudano Guinesid", "Equatorial Sudanid", "Casamance"]
  },
  "Sub-Saharan Africa": {
    "Bambutid": ["East Bambutid", "West Bambutid", "Twa-Cwa"],
    "Bantuid": ["North Bantuid", "Central Bantuid", "Chopi-Tswana", "South Bantuid", "Fengu-Pondo", "Xhosaid", "Malagasid"],
    "Congoid": ["Mountain Dama", "Congolesid", "Mundu Mangbeto", "West Congolesid", "Guineo Camerunian", "Guinesid", "Sudano Guinesid", "Equatorial Sudanid", "Casamance"],
    "Khoid": ["Khoid", "Sandawe"],
    "Sanid": ["Kalaharid", "Karroid"]
  },
  "Central Asia": {
    "Tungid": ["Gobid", "Baykal", "Amur-Sakhalin", "Katanga", "Mountain Aralid", "Aralid"],
    "Turanid": ["East Pamirid", "Central Pamirid", "Plains Pamirid", "Andronovo-Turanid", "Alföld", "Transcaspian", "Indo Iranid", "Indo Brachid", "Central Brachid", "Mountain Aralid", "Aralid"]
  },
  "Southern Asia": {
    "Indid": ["Gracile Indid", "Mountain Indid", "Sinhalesid", "Keralid", "North Indid", "Toda", "Indo Brachid", "Central Brachid", "East Brachid", "Indo Nordic", "Tibetid", "Malabarese", "Indo Iranid"],
    "Indo Melanin": ["Karnatid", "Kolid"],
    "Veddid": ["Malid", "Vedda", "North Gondid", "South Gondid", "Toalid", "Senoid", "Arabian Veddoid", "Khmerid", "Yemenid", "Malabarese"]
  },
  "East Asia": {
    "Ainuid": ["Aoshima", "Chikuzen", "Ishikawa"],
    "Sibirid": ["Uralid", "Yenisey", "Samoyedic", "Chukchid", "Volgid", "Ladogan"],
    "Sinid": ["Huanghoid", "Manchu-Korean", "Changkiangid", "Chukiangid", "Tonkinesid", "Annamid", "Kham", "Choshiu", "Yakonin", "Tibetid"]
  },
  "Southeastern Asia": {
    "Negritid": ["North Andamanid", "South Andamanid", "Aetid", "Semangid", "Jahai Semangid"],
    "South Mongoloid": ["Palaungid", "South Palaungid", "East Palaungid", "Proto Malayid", "Dayakid", "Kachinid", "Shanid", "East Shanid", "Deutero Malayid", "Satsuma", "Chikuzen", "Ishikawa", "Annamid", "Khmerid", "East Brachid"]
  },
  "Eastern Europe": {
    "Dinarid": ["Dinarid", "Norid", "Litorid", "Mtebid", "Carpathid"],
    "East Europid": ["Tavastid", "Savolaxid", "Neo Danubian", "Pre Slavic", "Volgid", "Ladogan", "North Pontid", "Fenno Nordid", "Borreby", "Carpathid"],
    "Turanid": ["East Pamirid", "Central Pamirid", "Plains Pamirid", "Andronovo-Turanid", "Alföld", "Transcaspian", "Indo Iranid", "Indo Brachid", "Central Brachid", "Mountain Aralid", "Aralid"]
  },
  "Southern Europe": {
    "Mediterranid": ["Paleo Sardinian", "Canarid", "Berberid", "Eurafricanid", "Proto Iranid", "Trans Mediterranid", "Gracile Mediterranid", "Pontid", "North Pontid", "Paleo Atlantid", "North Atlantid", "Fezzanid", "Moorish", "Siwa", "Targid", "Egyptid", "Litorid", "Baskid"]
  },
  "Central Europe": {
    "Alpinid": ["West Alpinid", "Strandid", "East Alpinid", "Gorid", "African Alpinoid", "Central Brachid", "Mtebid", "Borreby", "Baskid"]
  },
  "Northern Europe": {
    "Lappid": ["Scando Lappid", "North Lappid", "Samoyedic"],
    "Nordid": ["Proto Nordid", "Aisto Nordid", "Hallstatt", "Anglo-Saxon", "Trønder", "Dalofaelid", "Fenno Nordid", "Borreby", "Indo Nordic", "North Pontid", "Paleo Atlantid", "North Atlantid", "Canarid"]
  },
  "Anatolia": {
    "Alpinid": ["West Alpinid", "Strandid", "East Alpinid", "Gorid", "African Alpinoid", "Central Brachid", "Mtebid", "Borreby", "Baskid"],
    "Armenoid": ["Armenid", "Anatolid", "Assyroid", "Yemenid", "Litorid", "Mtebid", "Carpathid"],
    "Mediterranid": ["Paleo Sardinian", "Canarid", "Berberid", "Eurafricanid", "Proto Iranid", "Trans Mediterranid", "Gracile Mediterranid", "Pontid", "North Pontid", "Paleo Atlantid", "North Atlantid", "Fezzanid", "Moorish", "Siwa", "Targid", "Egyptid", "Litorid", "Baskid"],
    "Turanid": ["East Pamirid", "Central Pamirid", "Plains Pamirid", "Andronovo-Turanid", "Alföld", "Transcaspian", "Indo Iranid", "Indo Brachid", "Central Brachid", "Mountain Aralid", "Aralid"]
  },
  "Levant": {
    "Armenoid": ["Armenid", "Anatolid", "Assyroid", "Yemenid", "Litorid", "Mtebid", "Carpathid"],
    "Mediterranid": ["Paleo Sardinian", "Canarid", "Berberid", "Eurafricanid", "Proto Iranid", "Trans Mediterranid", "Gracile Mediterranid", "Pontid", "North Pontid", "Paleo Atlantid", "North Atlantid", "Fezzanid", "Moorish", "Siwa", "Targid", "Egyptid", "Litorid", "Baskid"]
  },
  "Arabian Peninsula": {
    "Orientalid": ["Arabid", "Iranid", "Libyid", "Targid", "Egyptid", "Transcaspian", "Yemenid", "Middle Nile", "Proto Iranid", "Indo Iranid"],
    "Veddid": ["Malid", "Vedda", "North Gondid", "South Gondid", "Toalid", "Senoid", "Arabian Veddoid", "Khmerid", "Yemenid", "Malabarese"]
  },
  "Persian Plateau": {
    "Orientalid": ["Arabid", "Iranid", "Libyid", "Targid", "Egyptid", "Transcaspian", "Yemenid", "Middle Nile", "Proto Iranid", "Indo Iranid"]
  },
  "Australia and New Zealand": {
    "Australid": ["Barrinean", "North Australid", "Desert Australid", "South Australid", "Tasmanid", "Paleo Melanesid"]
  },
  "Melanesia": {
    "Melanesid": ["Paleo Melanesid", "Insular Melanesid", "Neo Melanesid", "Mountain Melanesid", "Tapirid", "Bukaid", "Brachio Melanesid", "Fijid"]
  },
  "Polynesia": {
    "Polynesid": ["South Polynesid", "Nesiotid", "Micronesid", "Robust Polynesid", "Fijid"]
  }
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
    "Southern America"
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
    options: ["Pale", "Fair", "Light brown", "Olive Skin", "Medium brown", "Dark brown", "Black"]
  },
  {
    category: "Hair Color",
    options: ["Light Blonde", "Blonde", "Dark Blonde", "Red", "Light Brown", "Brown", "Dark Brown", "Black"]
  },
  {
    category: "Hair Texture", 
    options: ["Straight (Fine/Thin)", "Straight (Medium)", "Straight (Coarse)", "Wavy (Fine/Thin)", "Wavy (Medium)", "Wavy (Coarse)", "Curly (Loose)", "Curly (Tight)", "Kinky (Soft)", "Kinky (Wiry)"]
  },
  {
    category: "Head Type",
    options: ["Hyperdolichocephalic (Very Long)", "Dolichocephalic (Long)", "Mesocephalic (Medium)", "Brachycephalic (Short)", "Hyperbrachycephalic (Very Short)"]
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
    options: ["Leptoprosop (Long)", "Mesoprosop (Medium)", "Euryprosop (Broad)"]
  },
  {
    category: "Jaw Type",
    options: ["Retrognathous (Backward)","Orthognathous (Straight)", "Prognathous (Projecting)"]
  },
  {
    category: "Eye Color",
    options: ["Light-blue", "Blue", "Dark-blue", "Gray", "Green", "Hazel", "Light-brown", "Medium-brown", "Dark-brown", "Black-brown", "Black"]
  },
  {
    category: "Head Breadth",
    options: ["Small-headed","Medium-headed", "Large-headed"]
  }
];

export const VoteModal = ({ isOpen, onClose, onSubmit, existingVotes = {}, profileId }: VoteModalProps) => {
  const storageKey = `pendingVotes_${profileId}`;
  const [votes, setVotes] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return existingVotes;
  });

  useEffect(() => {
    if (!isOpen) return;
    let saved: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) saved = JSON.parse(raw);
      } catch {}
    }
    // Merge saved in-progress selections with any existingVotes from backend
    setVotes({ ...existingVotes, ...saved });
  }, [existingVotes, isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(votes));
    } catch {}
  }, [votes, storageKey]);

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
    try { localStorage.removeItem(storageKey); } catch {}
    setVotes({});
    onClose();
  };

  // Função para obter todas as opções geográficas
  const getAllGeographicOptions = () => {
    const allOptions: string[] = [];
    Object.entries(geographicOptions).forEach(([region, subregions]) => {
      allOptions.push(...subregions);
    });
    return allOptions;
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
    Object.entries(specificPhenotypeOptions).forEach(([region, groups]) => {
      Object.keys(groups).forEach(group => {
        allOptions.push(group);
      });
    });
    return allOptions;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-gradient-modal border-modal-accent/20 shadow-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-modal-accent">Vote on Physical Characteristics</DialogTitle>
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
                  <p className="text-xs text-muted-foreground mb-2">Select the geographic region that best represents the primary ancestry</p>
                  <Select
                    value={votes["Primary Geographic"] || ""}
                    onValueChange={(value) => handleVoteChange("Primary Geographic", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Select Primary Geographic" />
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
                    <p className="text-xs text-muted-foreground mb-2">Select a secondary geographic region, if applicable</p>
                    <Select
                      value={votes["Secondary Geographic"] || ""}
                      onValueChange={(value) => handleVoteChange("Secondary Geographic", value)}
                    >
                      <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                        <SelectValue placeholder="Select Secondary Geographic" />
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
                    <p className="text-xs text-muted-foreground mb-2">Select a tertiary geographic region, if applicable</p>
                    <Select
                      value={votes["Tertiary Geographic"] || ""}
                      onValueChange={(value) => handleVoteChange("Tertiary Geographic", value)}
                    >
                      <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                        <SelectValue placeholder="Select Tertiary Geographic" />
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
                  <p className="text-xs text-muted-foreground mb-2">Select the specific phenotype that best represents the physical characteristics</p>
                  <Select
                    value={votes["Primary Phenotype"] || ""}
                    onValueChange={(value) => handleVoteChange("Primary Phenotype", value)}
                  >
                    <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                      <SelectValue placeholder="Select Primary Phenotype" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 z-50">
                      {(() => {
                        const seen = new Set<string>();
                        return Object.entries(specificPhenotypeOptions).map(([region, groups]) => {
                          const uniqueGroups = Object.keys(groups).filter((g) => {
                            if (seen.has(g)) return false;
                            seen.add(g);
                            return true;
                          });
                          if (uniqueGroups.length === 0) return null;
                          return (
                            <div key={region}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                                {region}
                              </div>
                              {uniqueGroups.map((group) => (
                                <SelectItem
                                  key={group}
                                  value={group}
                                  className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                                >
                                  {group}
                                </SelectItem>
                              ))}
                            </div>
                          );
                        });
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Phenotype - only show if primary is selected */}
                {votes["Primary Phenotype"] && (
                  <div className="space-y-3">
                    <Label className="font-semibold text-foreground">
                      Secondary Phenotype
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">Select a secondary phenotype, if applicable</p>
                    <Select
                      value={votes["Secondary Phenotype"] || ""}
                      onValueChange={(value) => handleVoteChange("Secondary Phenotype", value)}
                    >
                      <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                        <SelectValue placeholder="Select Secondary Phenotype" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border/50 z-50">
                         {(() => {
                            const allowed = getAvailablePhenotypeOptions('secondary');
                            const seen = new Set<string>();
                            return Object.entries(specificPhenotypeOptions).map(([region, groups]) => {
                              const uniqueGroups = Object.keys(groups).filter((g) => {
                                if (!allowed.includes(g) || seen.has(g)) return false;
                                seen.add(g);
                                return true;
                              });
                              if (uniqueGroups.length === 0) return null;
                              return (
                                <div key={region}>
                                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                                    {region}
                                  </div>
                                  {uniqueGroups.map((group) => (
                                    <SelectItem
                                      key={group}
                                      value={group}
                                      className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                                    >
                                      {group}
                                    </SelectItem>
                                  ))}
                                </div>
                              );
                            });
                          })()}
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
                    <p className="text-xs text-muted-foreground mb-2">Select a tertiary phenotype, if applicable</p>
                    <Select
                      value={votes["Tertiary Phenotype"] || ""}
                      onValueChange={(value) => handleVoteChange("Tertiary Phenotype", value)}
                    >
                      <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                        <SelectValue placeholder="Select Tertiary Phenotype" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border/50 z-50">
                         {(() => {
                            const allowed = getAvailablePhenotypeOptions('tertiary');
                            const seen = new Set<string>();
                            return Object.entries(specificPhenotypeOptions).map(([region, groups]) => {
                              const uniqueGroups = Object.keys(groups).filter((g) => {
                                if (!allowed.includes(g) || seen.has(g)) return false;
                                seen.add(g);
                                return true;
                              });
                              if (uniqueGroups.length === 0) return null;
                              return (
                                <div key={region}>
                                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                                    {region}
                                  </div>
                                  {uniqueGroups.map((group) => (
                                    <SelectItem
                                      key={group}
                                      value={group}
                                      className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-6"
                                    >
                                      {group}
                                    </SelectItem>
                                  ))}
                                </div>
                              );
                            });
                          })()}
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
                    <p className="text-xs text-muted-foreground mb-2">Evaluate this specific physical characteristic</p>
                    <Select
                      value={votes[characteristic.category] || ""}
                      onValueChange={(value) => handleVoteChange(characteristic.category, value)}
                    >
                      <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                        <SelectValue placeholder={`Select ${characteristic.category}`} />
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
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete}
            className="bg-phindex-teal hover:bg-phindex-teal/90"
          >
            Confirm Vote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
