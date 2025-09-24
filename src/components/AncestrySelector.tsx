import { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const ANCESTRY_OPTIONS = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentinean", "Armenian", "Australian",
  "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian",
  "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe",
  "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese",
  "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djibouti",
  "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian",
  "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek",
  "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "I-Kiribati",
  "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican",
  "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese",
  "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivan",
  "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian",
  "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Ni-Vanuatu", "Nicaraguan",
  "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Panamanian", "Papua New Guinean",
  "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran",
  "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean",
  "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer",
  "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan",
  "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese",
  "Welsh", "Yemenite", "Zambian", "Zimbabwean"
];

interface AncestrySelectorProps {
  selectedAncestries: string[];
  onAncestriesChange: (ancestries: string[]) => void;
  placeholder?: string;
  maxAncestries?: number;
  required?: boolean;
}

export const AncestrySelector = ({ 
  selectedAncestries, 
  onAncestriesChange, 
  placeholder = "Search and select ancestries",
  maxAncestries = 5,
  required = false
}: AncestrySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredAncestries, setFilteredAncestries] = useState(ANCESTRY_OPTIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = ANCESTRY_OPTIONS.filter(ancestry =>
      ancestry.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedAncestries.includes(ancestry)
    );
    setFilteredAncestries(filtered);
  }, [searchTerm, selectedAncestries]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAncestrySelect = (ancestry: string) => {
    if (selectedAncestries.length < maxAncestries && !selectedAncestries.includes(ancestry)) {
      onAncestriesChange([...selectedAncestries, ancestry]);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleAncestryRemove = (ancestryToRemove: string) => {
    onAncestriesChange(selectedAncestries.filter(ancestry => ancestry !== ancestryToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && filteredAncestries.length === 1) {
      e.preventDefault();
      handleAncestrySelect(filteredAncestries[0]);
    } else if (e.key === 'Backspace' && searchTerm === '' && selectedAncestries.length > 0) {
      handleAncestryRemove(selectedAncestries[selectedAncestries.length - 1]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={selectedAncestries.length > 0 ? "Add more ancestries..." : placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required={required && selectedAncestries.length === 0}
          className="pr-8"
          disabled={selectedAncestries.length >= maxAncestries}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {selectedAncestries.length > 0 && (
        <div className="mt-2">
          <ScrollArea className="max-h-24 w-full">
            <div className="flex flex-wrap gap-1 pr-2">
              {selectedAncestries.map((ancestry) => (
                <Badge key={ancestry} variant="secondary" className="mr-1 mb-1">
                  {ancestry}
                  <button
                    type="button"
                    onClick={() => handleAncestryRemove(ancestry)}
                    className="ml-1 hover:bg-muted rounded-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {selectedAncestries.length >= maxAncestries && (
        <p className="text-xs text-muted-foreground mt-1">
          Maximum {maxAncestries} ancestries selected
        </p>
      )}

      {isOpen && selectedAncestries.length < maxAncestries && (
        <Card className="absolute z-50 w-full mt-1 p-2 bg-background border border-border shadow-lg">
          <ScrollArea className="max-h-32">
            {filteredAncestries.length > 0 ? (
              <div className="space-y-1">
                {filteredAncestries.map((ancestry) => (
                  <div
                    key={ancestry}
                    className="px-2 py-1 text-sm cursor-pointer rounded hover:bg-muted"
                    onClick={() => handleAncestrySelect(ancestry)}
                  >
                    {ancestry}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                No ancestries found
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};