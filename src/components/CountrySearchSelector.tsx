import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const COUNTRY_OPTIONS = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", 
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", 
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", 
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", 
  "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", 
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", 
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", 
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", 
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", 
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", 
  "Sweden", "Switzerland", "Syria", "Taiwan*", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", 
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

interface CountrySearchSelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const CountrySearchSelector: React.FC<CountrySearchSelectorProps> = ({
  selectedCountry,
  onCountryChange,
  placeholder = "Search and select country",
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(COUNTRY_OPTIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = COUNTRY_OPTIONS.filter(country =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: string) => {
    console.log('Country selected:', country);
    onCountryChange(country);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onCountryChange('');
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && filteredCountries.length > 0) {
      e.preventDefault();
      if (!selectedCountry && filteredCountries.length === 1) {
        handleCountrySelect(filteredCountries[0]);
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Hidden input for HTML5 validation */}
      <input
        type="text"
        value={selectedCountry}
        onChange={() => {}} // Controlled by the component
        required={required}
        style={{ display: 'none' }}
        tabIndex={-1}
      />
      
      <div className="relative">
        <Input
          type="text"
          placeholder={selectedCountry || placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pr-8"
        />
        {selectedCountry && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {selectedCountry && (
        <div className="mt-2">
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            {selectedCountry}
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

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto z-50 bg-popover border shadow-md">
          <div className="p-2">
            {filteredCountries.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-2">
                No countries found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};