import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const COUNTRIES = [
  'Afeganistão', 'África do Sul', 'Albânia', 'Alemanha', 'Andorra', 'Angola', 'Antígua e Barbuda',
  'Arábia Saudita', 'Argélia', 'Argentina', 'Armênia', 'Austrália', 'Áustria', 'Azerbaijão',
  'Bahamas', 'Bahrein', 'Bangladesh', 'Barbados', 'Bélgica', 'Belize', 'Benin', 'Bielorrússia',
  'Bolívia', 'Bósnia e Herzegovina', 'Botsuana', 'Brasil', 'Brunei', 'Bulgária', 'Burkina Faso',
  'Burundi', 'Butão', 'Cabo Verde', 'Camarões', 'Camboja', 'Canadá', 'Catar', 'Cazaquistão',
  'Chade', 'Chile', 'China', 'Chipre', 'Colômbia', 'Comores', 'Congo', 'Coreia do Norte',
  'Coreia do Sul', 'Costa do Marfim', 'Costa Rica', 'Croácia', 'Cuba', 'Dinamarca', 'Djibuti',
  'Dominica', 'Egito', 'El Salvador', 'Emirados Árabes Unidos', 'Equador', 'Eritreia',
  'Eslováquia', 'Eslovênia', 'Espanha', 'Estados Unidos', 'Estônia', 'Eswatini', 'Etiópia',
  'Fiji', 'Filipinas', 'Finlândia', 'França', 'Gabão', 'Gâmbia', 'Gana', 'Geórgia',
  'Granada', 'Grécia', 'Guatemala', 'Guiana', 'Guiné', 'Guiné-Bissau', 'Guiné Equatorial',
  'Haiti', 'Honduras', 'Hungria', 'Iêmen', 'Ilhas Marshall', 'Ilhas Salomão', 'Índia',
  'Indonésia', 'Irã', 'Iraque', 'Irlanda', 'Islândia', 'Israel', 'Itália', 'Jamaica',
  'Japão', 'Jordânia', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letônia', 'Líbano',
  'Libéria', 'Líbia', 'Liechtenstein', 'Lituânia', 'Luxemburgo', 'Macedônia do Norte',
  'Madagascar', 'Malásia', 'Malawi', 'Maldivas', 'Mali', 'Malta', 'Marrocos', 'Maurício',
  'Mauritânia', 'México', 'Mianmar', 'Micronésia', 'Moçambique', 'Moldávia', 'Mônaco',
  'Mongólia', 'Montenegro', 'Namíbia', 'Nauru', 'Nepal', 'Nicarágua', 'Níger', 'Nigéria',
  'Noruega', 'Nova Zelândia', 'Omã', 'Países Baixos', 'Palau', 'Panamá', 'Papua-Nova Guiné',
  'Paquistão', 'Paraguai', 'Peru', 'Polônia', 'Portugal', 'Quênia', 'Quirguistão',
  'Reino Unido', 'República Centro-Africana', 'República Checa', 'República Democrática do Congo',
  'República Dominicana', 'Romênia', 'Ruanda', 'Rússia', 'Samoa', 'San Marino',
  'Santa Lúcia', 'São Cristóvão e Névis', 'São Tomé e Príncipe', 'São Vicente e Granadinas',
  'Seicheles', 'Senegal', 'Serra Leoa', 'Sérvia', 'Singapura', 'Síria', 'Somália',
  'Sri Lanka', 'Suazilândia', 'Sudão', 'Sudão do Sul', 'Suécia', 'Suíça', 'Suriname',
  'Tailândia', 'Tajiquistão', 'Tanzânia', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad e Tobago',
  'Tunísia', 'Turcomenistão', 'Turquia', 'Tuvalu', 'Ucrânia', 'Uganda', 'Uruguai',
  'Uzbequistão', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnã', 'Zâmbia', 'Zimbábue'
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
  placeholder = "Digite para buscar países...",
  maxCountries = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      const filtered = COUNTRIES.filter(country =>
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
                  +{filteredCountries.length - 10} mais países...
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
          Máximo de {maxCountries} países selecionados.
        </p>
      )}
    </div>
  );
};