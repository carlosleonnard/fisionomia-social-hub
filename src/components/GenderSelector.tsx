import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const handleGenderSelect = (gender: string) => {
    onGenderChange(gender);
  };

  const handleClearSelection = () => {
    onGenderChange("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <select
          value={selectedGender}
          onChange={(e) => handleGenderSelect(e.target.value)}
          required={required}
          className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {GENDER_OPTIONS.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        {selectedGender && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {selectedGender && (
        <div className="mt-2">
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            {selectedGender}
            <button
              type="button"
              onClick={handleClearSelection}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
};