import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (votes: Record<string, string>) => void;
  existingVotes?: Record<string, string>;
  profileId: string;
  profileImages?: {
    frontImage: string;
    profileImage?: string;
    profileName: string;
    ancestry?: string;
  };
}

// Structure: { Division: { MainGroup: [subgroups] } }
// If MainGroup is null, it's just a standalone phenotype
type PhenotypeStructure = { 
  [division: string]: { 
    [mainGroup: string]: string[] | null 
  } 
};

const specificPhenotypeOptions: PhenotypeStructure = {
  "Capoid": {
    "Strandlooper": null,
    "Khoid": null,
    "Sandawe": null,
    "Sanid": [
      "Kalaharid",
      "Karroid"
    ]
  },
  "Negroid": {
    "Katangid": null,
    "Hadza": null,
    "Bantuid": [
      "North Bantuid",
      "Central Bantuid",
      "Chopi-Tswana",
      "South Bantuid",
      "Fengu-Pondo",
      "Xhosaid",
      "Malagasid"
    ],
    "Bambutid": [
      "East Bambutid",
      "West Bambutid",
      "Twa-Cwa"
    ],
    "Congolid": [
      "Mountain Dama",
      "Congolesid",
      "Mundu Mangbeto",
      "West Congolesid",
      "Guineo Camerunian",
      "Guinesid",
      "Sudano Guinesid",
      "Equatorial Sudanid",
      "Casamance"
    ],
    "Sudanid": [
      "East Sudanid",
      "Bobo",
      "Senegalid",
      "Middle Nile",
      "Fezzanid",
      "Shari"
    ],
    "Nilotid": [
      "Pre Nilotid",
      "Dinkaid",
      "Shillukid",
      "South Nilotid",
      "Nilo Hamitic"
    ]
  },
  "Caucasoid": {
    "Ethiopid": [
      "Proto Ethiopid",
      "Omotic",
      "East Ethiopid",
      "North Ethiopid",
      "South Ethiopid",
      "Maasai",
      "Central Ethiopid",
      "Saharan Ethiopid",
      "West Ethiopid",
      "Danakil",
      "Moorish",
      "Siwa"
    ],
    "Orientalid": [
      "Arabid",
      "Iranid",
      "Libyid",
      "Targid",
      "Egyptid",
      "Transcaspian",
      "Yemenid",
      "Assyroid",
      "Indo Iranid"
    ],
    "Indid": [
      "Gracile Indid",
      "Mountain Indid",
      "Sinhalesid",
      "Keralid",
      "North Indid",
      "Toda",
      "Indo Brachid",
      "Central Brachid",
      "East Brachid",
      "Indo Nordic",
      "Tibetid",
      "Malabarese"
    ],
    "Indo Melanid": [
      "Karnatid",
      "Kolid"
    ],
    "Mediterranid": [
      "Paleo Sardinian",
      "Canarid",
      "Berberid",
      "Eurafricanid",
      "Proto Iranid",
      "Trans Mediterranid",
      "Gracile Mediterranid",
      "Pontid",
      "North Pontid",
      "Paleo Atlantid",
      "North Atlantid"
    ],
    "Nordid": [
      "Proto Nordid",
      "Aisto Nordid",
      "Hallstatt",
      "Anglo-Saxon",
      "Trønder",
      "Dalofaelid",
      "Fenno Nordid",
      "Borreby"
    ],
    "East Europid": [
      "Tavastid",
      "Savolaxid",
      "Neo Danubian",
      "Pre Slavic",
      "Volgid",
      "Ladogan"
    ],
    "Lappid": [
      "Scando Lappid",
      "North Lappid"
    ],
    "Alpinid": [
      "West Alpinid",
      "Strandid",
      "East Alpinid",
      "Gorid",
      "African Alpinoid",
      "Baskid"
    ],
    "Dinarid": [
      "Norid",
      "Litorid",
      "Mtebid",
      "Carpathid"
    ],
    "Armenoid": [
      "Armenid",
      "Anatolid"
    ],
    "Turanid": [
      "East Pamirid",
      "Central Pamirid",
      "Plains Pamirid",
      "Andronovo-Turanid",
      "Alföld"
    ]
  },
  "Australoid": {
    "Veddid": [
      "Malid",
      "Vedda",
      "North Gondid",
      "South Gondid",
      "Toalid",
      "Senoid",
      "Arabian Veddoid",
      "Khmerid"
    ],
    "Negritid": [
      "North Andamanid",
      "South Andamanid",
      "Aetid",
      "Semangid",
      "Jahai Semangid"
    ],
    "Australid": [
      "Barrinean",
      "North Australid",
      "Desert Australid",
      "South Australid",
      "Tasmanid"
    ],
    "Melanesid": [
      "Paleo Melanesid",
      "Insular Melanesid",
      "Neo Melanesid",
      "Mountain Melanesid",
      "Tapirid",
      "Bukaid",
      "Brachio Melanesid",
      "Fijid"
    ]
  },
  "Mongoloid": {
    "Polynesid": [
      "South Polynesid",
      "Nesiotid",
      "Micronesid",
      "Robust Polynesid"
    ],
    "Ainuid": [
      "Aoshima",
      "Chikuzen",
      "Ishikawa"
    ],
    "South Mongolid": [
      "Palaungid",
      "South Palaungid",
      "East Palaungid",
      "Proto Malayid",
      "Dayakid",
      "Kachinid",
      "Shanid",
      "East Shanid",
      "Deutero Malayid",
      "Satsuma"
    ],
    "Sinid": [
      "Huanghoid",
      "Manchu-Korean",
      "Changkiangid",
      "Chukiangid",
      "Tonkinesid",
      "Annamid",
      "Kham",
      "Choshiu",
      "Yakonin"
    ],
    "Tungid": [
      "Gobid",
      "Baykal",
      "Amur-Sakhalin",
      "Katanga",
      "Mountain Aralid",
      "Aralid"
    ],
    "Sibirid": [
      "Uralid",
      "Yenisey",
      "Samoyedic",
      "Chukchid"
    ],
    "Eskimid": [
      "Inuid",
      "Bering Sea"
    ],
    "Pacificid": [
      "Pacifid",
      "California Pacifid",
      "Athabaskid",
      "Arizonid"
    ],
    "Silvid": [
      "Planid",
      "Appalacid"
    ],
    "Margid": [
      "Mexicid",
      "Sonorid",
      "Californid"
    ],
    "Centralid": [
      "Isthmid",
      "Maya",
      "Pueblid"
    ],
    "Amazonid": [
      "North Amazonid",
      "South Amazonid",
      "West Amazonid",
      "Chocó-Motilon"
    ],
    "Lagid": [
      "Lagoa Santa",
      "South Fuegid",
      "Huarpid",
      "Botocudo"
    ],
    "Patagonid": [
      "Bororo",
      "Pampid"
    ],
    "Andid": [
      "North Andid",
      "Central Andid",
      "South Andid"
    ]
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

export const VoteModal = ({ isOpen, onClose, onSubmit, existingVotes = {}, profileId, profileImages }: VoteModalProps) => {
  const storageKey = `pendingVotes_${profileId}`;
  const [votes, setVotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    
    let saved: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) saved = JSON.parse(raw);
      } catch {}
    }
    
    // ALWAYS start with existingVotes from backend (user's previous votes)
    // Then merge with any in-progress edits from localStorage
    setVotes({ ...existingVotes, ...saved });
  }, [existingVotes, isOpen, storageKey]);

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

  // Função para obter todas as opções de fenótipo (main groups + subgroups)
  const getAllPhenotypeOptions = () => {
    const allOptions: string[] = [];
    Object.values(specificPhenotypeOptions).forEach(divisionGroups => {
      Object.entries(divisionGroups).forEach(([mainGroup, subgroups]) => {
        allOptions.push(mainGroup); // Add the main group
        if (subgroups) {
          allOptions.push(...subgroups); // Add subgroups if they exist
        }
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
            {/* Profile Images */}
            {profileImages && (
              <Card className="p-4 bg-card border-border shadow-card">
                <div className="max-w-md mx-auto">
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="text-center">
                          <img 
                            src={profileImages.frontImage} 
                            alt={`${profileImages.profileName} - front`}
                            className="w-full h-80 object-cover rounded-lg mx-auto"
                          />
                          <p className="text-xs text-muted-foreground mt-2">Front</p>
                        </div>
                      </CarouselItem>
                      {profileImages.profileImage && (
                        <CarouselItem>
                          <div className="text-center">
                            <img 
                              src={profileImages.profileImage} 
                              alt={`${profileImages.profileName} - profile`}
                              className="w-full h-80 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-xs text-muted-foreground mt-2">Profile</p>
                          </div>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                    {profileImages.profileImage && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                  
                  {/* Known Ancestry */}
                  {profileImages.ancestry && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg text-left">
                      <h4 className="text-sm font-semibold text-phindex-teal mb-2">Known Ancestry</h4>
                      <p className="text-sm text-foreground leading-relaxed">
                        {profileImages.ancestry}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
            
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
                      <SelectContent className="bg-background border-border/50 z-50 max-h-[400px]">
                        {Object.entries(specificPhenotypeOptions).map(([division, divisionGroups]) => (
                          <div key={division}>
                            <div className="px-2 py-1.5 text-sm font-bold text-primary bg-muted/70">
                              {division}
                            </div>
                            {Object.entries(divisionGroups).map(([mainGroup, subgroups]) => (
                              <div key={`${division}-${mainGroup}`}>
                                {/* Main group (bold, selectable) */}
                                <SelectItem
                                  value={mainGroup}
                                  className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-4 font-semibold"
                                >
                                  {mainGroup}
                                </SelectItem>
                                {/* Subgroups (indented) */}
                                {subgroups && subgroups.map((subgroup) => (
                                  <SelectItem
                                    key={`${division}-${mainGroup}-${subgroup}`}
                                    value={subgroup}
                                    className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-8"
                                  >
                                    {subgroup}
                                  </SelectItem>
                                ))}
                              </div>
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
                    <p className="text-xs text-muted-foreground mb-2">Select a secondary phenotype, if applicable</p>
                    <Select
                      value={votes["Secondary Phenotype"] || ""}
                      onValueChange={(value) => handleVoteChange("Secondary Phenotype", value)}
                    >
                      <SelectTrigger className="w-full bg-background border-border/50 focus:ring-2 focus:ring-phindex-teal/20">
                        <SelectValue placeholder="Select Secondary Phenotype" />
                      </SelectTrigger>
                        <SelectContent className="bg-background border-border/50 z-50 max-h-[400px]">
                          {(() => {
                            const allowed = getAvailablePhenotypeOptions('secondary');
                            return Object.entries(specificPhenotypeOptions).map(([division, divisionGroups]) => {
                              // Check if this division has any allowed options
                              const hasAllowedOptions = Object.entries(divisionGroups).some(([mainGroup, subgroups]) => {
                                if (allowed.includes(mainGroup)) return true;
                                if (subgroups && subgroups.some(sg => allowed.includes(sg))) return true;
                                return false;
                              });
                              
                              if (!hasAllowedOptions) return null;
                              
                              return (
                                <div key={division}>
                                  <div className="px-2 py-1.5 text-sm font-bold text-primary bg-muted/70">
                                    {division}
                                  </div>
                                  {Object.entries(divisionGroups).map(([mainGroup, subgroups]) => {
                                    const mainAllowed = allowed.includes(mainGroup);
                                    const allowedSubgroups = subgroups ? subgroups.filter(sg => allowed.includes(sg)) : [];
                                    
                                    if (!mainAllowed && allowedSubgroups.length === 0) return null;
                                    
                                    return (
                                      <div key={`${division}-${mainGroup}`}>
                                        {mainAllowed && (
                                          <SelectItem
                                            value={mainGroup}
                                            className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-4 font-semibold"
                                          >
                                            {mainGroup}
                                          </SelectItem>
                                        )}
                                        {allowedSubgroups.map((subgroup) => (
                                          <SelectItem
                                            key={`${division}-${mainGroup}-${subgroup}`}
                                            value={subgroup}
                                            className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-8"
                                          >
                                            {subgroup}
                                          </SelectItem>
                                        ))}
                                      </div>
                                    );
                                  })}
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
                      <SelectContent className="bg-background border-border/50 z-50 max-h-[400px]">
                         {(() => {
                            const allowed = getAvailablePhenotypeOptions('tertiary');
                            return Object.entries(specificPhenotypeOptions).map(([division, divisionGroups]) => {
                              // Check if this division has any allowed options
                              const hasAllowedOptions = Object.entries(divisionGroups).some(([mainGroup, subgroups]) => {
                                if (allowed.includes(mainGroup)) return true;
                                if (subgroups && subgroups.some(sg => allowed.includes(sg))) return true;
                                return false;
                              });
                              
                              if (!hasAllowedOptions) return null;
                              
                              return (
                                <div key={division}>
                                  <div className="px-2 py-1.5 text-sm font-bold text-primary bg-muted/70">
                                    {division}
                                  </div>
                                  {Object.entries(divisionGroups).map(([mainGroup, subgroups]) => {
                                    const mainAllowed = allowed.includes(mainGroup);
                                    const allowedSubgroups = subgroups ? subgroups.filter(sg => allowed.includes(sg)) : [];
                                    
                                    if (!mainAllowed && allowedSubgroups.length === 0) return null;
                                    
                                    return (
                                      <div key={`${division}-${mainGroup}`}>
                                        {mainAllowed && (
                                          <SelectItem
                                            value={mainGroup}
                                            className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-4 font-semibold"
                                          >
                                            {mainGroup}
                                          </SelectItem>
                                        )}
                                        {allowedSubgroups.map((subgroup) => (
                                          <SelectItem
                                            key={`${division}-${mainGroup}-${subgroup}`}
                                            value={subgroup}
                                            className="hover:bg-muted focus:bg-muted text-black data-[highlighted]:text-black pl-8"
                                          >
                                            {subgroup}
                                          </SelectItem>
                                        ))}
                                      </div>
                                    );
                                  })}
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
