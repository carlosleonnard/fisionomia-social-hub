import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ANCESTRY_OPTIONS = [
  'Celtic', 'Germanic', 'Mediterranean', 'Slavic', 'Balkan', 'Baltic', 'Ashkenazi Jew',
  'Arabs', 'Persians', 'Turk', 'Kurds', 'Armenians', 'Assyrians', 'Berbers', 'Sephardic Jew',
  'Bantu', 'Yoruba', 'Igbu', 'Zulu', 'Nubian', 'Ethiopian', 'Pygmies', 'Tuareg',
  'Hindus', 'Sikhs', 'Punjabis', 'Bengalis', 'Gujaratis', 'Tamils', 'Nepalese',
  'Chinese', 'Koreans', 'Japanese', 'Mongols', 'Manchus', 'Vietnamese', 'Filipinos',
  'Indonesians', 'Malays', 'Tatars', 'Afghans', 'Native Americans', 'Inuit',
  'Mestizos', 'Afro-Caribbeans', 'Aboriginals', 'Maori', 'Polynesians', 'Melanesians', 'Gypsies'
];

interface CountrySelectorProps {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
  placeholder?: string;
  maxCountries?: number;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountries,
  onCountriesChange,
  placeholder = "Digite para buscar ancestralidade...",
  maxCountries = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = ANCESTRY_OPTIONS.filter(country =>
        country.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedCountries.includes(country)
      );
      setFilteredCountries(filtered);
      setIsOpen(true);
    } else {
      setFilteredCountries([]);
      setIsOpen(false);
    }
  }, [searchTerm, selectedCountries]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: string) => {
    if (selectedCountries.length < maxCountries && !selectedCountries.includes(country)) {
      onCountriesChange([...selectedCountries, country]);
      setSearchTerm('');
      setIsOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleCountryRemove = (countryToRemove: string) => {
    onCountriesChange(selectedCountries.filter(country => country !== countryToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && filteredCountries.length > 0) {
      e.preventDefault();
      handleCountrySelect(filteredCountries[0]);
    } else if (e.key === 'Backspace' && searchTerm === '' && selectedCountries.length > 0) {
      handleCountryRemove(selectedCountries[selectedCountries.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchTerm && filteredCountries.length > 0) {
                setIsOpen(true);
              }
            }}
            className="pl-10 pr-4"
          />
        </div>

        {isOpen && filteredCountries.length > 0 && (
          <Card 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 border border-border bg-background shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="p-1">
              {filteredCountries.slice(0, 10).map((country) => (
                <button
                  key={country}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors text-sm"
                  onClick={() => handleCountrySelect(country)}
                  type="button"
                >
                  {country}
                </button>
              ))}
              {filteredCountries.length > 10 && (
                <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                  +{filteredCountries.length - 10} mais opções...
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCountries.map((country) => (
            <Badge key={country} variant="secondary" className="flex items-center gap-1 py-1 px-2">
              <span className="text-xs">{country}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 hover:bg-transparent"
                onClick={() => handleCountryRemove(country)}
              >
                <X className="h-3 w-3 hover:text-destructive" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {selectedCountries.length >= maxCountries && (
        <p className="text-xs text-muted-foreground">
          Máximo de {maxCountries} opções selecionadas.
        </p>
      )}
    </div>
  );
};