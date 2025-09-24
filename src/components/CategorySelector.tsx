import { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORY_OPTIONS = [
  "Pop Culture",
  "Music and Entertainment", 
  "Arts",
  "Philosophy",
  "Sciences",
  "Sports",
  "Business",
  "Politics"
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  isAnonymous?: boolean;
}

export const CategorySelector = ({ 
  selectedCategory, 
  onCategoryChange, 
  placeholder = "Search and select category",
  required = false,
  disabled = false,
  isAnonymous = false
}: CategorySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(CATEGORY_OPTIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableOptions = isAnonymous ? ["User Profiles"] : CATEGORY_OPTIONS;

  useEffect(() => {
    const filtered = availableOptions.filter(category =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, isAnonymous]);

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

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onCategoryChange("");
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && filteredCategories.length === 1) {
      e.preventDefault();
      handleCategorySelect(filteredCategories[0]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={selectedCategory || placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required={required}
          disabled={disabled}
          className="pr-8"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {selectedCategory && !disabled ? (
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

      {selectedCategory && (
        <div className="mt-2">
          <Badge variant="secondary" className="mr-1">
            {selectedCategory}
            {!disabled && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="ml-1 hover:bg-muted rounded-sm"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        </div>
      )}

      {isOpen && !disabled && (
        <Card className="absolute z-50 w-full mt-1 p-2 bg-background border border-border shadow-lg">
          <ScrollArea className="max-h-32">
            {filteredCategories.length > 0 ? (
              <div className="space-y-1">
                {filteredCategories.map((category) => (
                  <div
                    key={category}
                    className="px-2 py-1 text-sm cursor-pointer rounded hover:bg-muted"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-2 py-1 text-sm text-muted-foreground">
                No categories found
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};