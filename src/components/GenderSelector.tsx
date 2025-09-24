import { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Other"
];

interface GenderSelectorProps {
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const GenderSelector = ({ 
  selectedGender, 
  onGenderChange, 
  placeholder = "Search and select gender",
  required = false
}: GenderSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredGenders, setFilteredGenders] = useState(GENDER_OPTIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = GENDER_OPTIONS.filter(gender =>
      gender.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGenders(filtered);
  }, [searchTerm]);

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

  const handleGenderSelect = (gender: string) => {
    onGenderChange(gender);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onGenderChange("");
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && filteredGenders.length === 1) {
      e.preventDefault();
      handleGenderSelect(filteredGenders[0]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={selectedGender || placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required={required}
          className="pr-8"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {selectedGender ? (
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 hover:bg-muted rounded-sm"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {selectedGender && (
        <div className="mt-2">
          <Badge variant="secondary" className="mr-1">
            {selectedGender}
            <button
              type="button"
              onClick={handleClearSelection}
              className="ml-1 hover:bg-muted rounded-sm"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 p-2 bg-background border border-border shadow-lg">
          <ScrollArea className="max-h-32">
            {filteredGenders.length > 0 ? (
              <div className="space-y-1">
                {filteredGenders.map((gender) => (
                  <div
                    key={gender}
                    className="px-2 py-1 text-sm cursor-pointer rounded hover:bg-muted"
                    onClick={() => handleGenderSelect(gender)}
                  >
                    {gender}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                No genders found
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};