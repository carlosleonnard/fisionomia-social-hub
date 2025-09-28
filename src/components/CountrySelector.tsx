import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ANCESTRY_OPTIONS = [
  'Celtic', 'Mediterranean', 'Slavic', 'Balkan', 'Baltic', 'Ashkenazi Jew',
  'Arabs', 'Persians', 'Turk', 'Kurds', 'Armenian', 'Assyrians', 'Berbers', 'Sephardic Jew',
  'Bantu', 'Yoruba', 'Igbu', 'Zulu', 'Nubian', 'Ethiopian', 'Pygmies', 'Tuareg',
  'Hindus', 'Sikhs', 'Punjabis', 'Bengalis', 'Gujaratis', 'Tamils', 'Nepalese',
  'Chinese', 'Korean', 'Japanese', 'Mongol', 'Manchus', 'Vietnamese', 'Filipino',
  'Indonesian', 'Malays', 'Tatars', 'Afghans', 'Native Americans', 'Inuit',
  'Mestizos', 'Afro-Caribbeans', 'Aboriginals', 'Maori', 'Polynesians', 'Melanesians', 'Gypsies','Scottish',
  'Welsh',
  'Hawaiian',
  'African-American',
  'North African',
  'West African',
  'East African',
  'Sub-Saharan African',
  'Scandinavian',
  'Southeast Asian',
  'East Asian',
  'Siberian', 'Basque', 'Galician', 'Catalonian', 'Occitan',

  // --- Lista expandida de países/gentílicos ---
  'Albanian', 'Algerian', 'Andorran', 'Angolan', 'Antiguan or Barbudan', 'Argentine', 
  'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi',
  'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian',
  'Bosnian', 'Botswanan', 'Brazilian', 'Bruneian', 'Bulgarian', 'Burkinabé', 'Burundian',
  'Cape Verdean', 'Cambodian', 'Cameroonian', 'Canadian', 'Central African', 'Chadian',
  'Chilean', 'Colombian', 'Comorian', 'Congolese', 'Costa Rican', 'Ivorian', 'Croatian',
  'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Ecuadorian',
  'Egyptian', 'Salvadoran', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Swazi',
  'Ethiopian', 'Fijian', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German',
  'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinean', 'Bissau-Guinean', 'Guyanese',
  'Haitian', 'Honduran', 'Hungarian', 'Icelander', 'Indian', 'Iranian',
  'Iraqi', 'Irish', 'Israeli', 'Italian', 'Jamaican', 'Jordanian', 'Kazakh',
  'Kenyan', 'I-Kiribati', 'Kuwaiti', 'Kyrgyz', 'Laotian',
  'Latvian', 'Lebanese', 'Basotho', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian',
  'Luxembourger', 'Malagasy', 'Malawian', 'Maldivian', 'Malian', 'Maltese',
  'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan',
  'Monegasque', 'Montenegrin', 'Moroccan', 'Mozambican', 'Burmese',
  'Namibian', 'Nauruan', 'Nepali', 'Dutch', 'New Zealander', 'Nicaraguan', 'Nigerien',
  'Nigerian', 'Macedonian', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian',
  'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari',
  'Romanian', 'Russian', 'Rwandan', 'Kittitian', 'Saint Lucian', 'Vincentian',
  'Samoan', 'Sammarinese', 'Sao Tomean', 'Saudi', 'Senegalese', 'Serbian', 'Seychellois',
  'Sierra Leonean', 'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander', 'Somali',
  'South African', 'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese',
  'Swedish', 'Swiss', 'Syrian', 'Tajik', 'Tanzanian', 'Thai', 'Timorese', 'Togolese',
  'Tongan', 'Trinidadian', 'Tunisian', 'Turkmen', 'Tuvaluan', 'Ugandan',
  'Ukrainian', 'Emirati', 'British', 'American', 'Uruguayan', 'Uzbek', 'Ni-Vanuatu', 'Venezuelan', 'Yemeni', 'Zambian', 'Zimbabwean',
  'Palestinian', 'Taiwanese',

  // --- Étnicos adicionais ---
  'Han Chinese', 'Pashtuns', 'Turks', 'Hausa', 'Xhosa', 'Oromo', 'Amhara',
  'Ashanti', 'Javanese', 'Thai', 'Kinh', 'Sindhi', 'Baloch', 'Quechua', 'Aymara',
  'Maya', 'Romani', 'Mizrahi Jews', 'Ethiopian Jews',
  'Yemenite Jews', 'Karaite Jews', 'Maronites', 'Copts', 'Chaldeans',
  'Sunnis', 'Shias', 'Alawites', 'Druze', 'Ibadis', 'Ahmadis', 'Jains', 'Parsis',
  'Yazidis', 'Samaritans', 'Shintoists', 'Baháʼís', 'Rastafarians', 'Amazonian groups',
  'Andean groups',

  // --- Grupos novos adicionados ---
  // Europa
  'Bretons', 'Gaels',
  'Northern Italians', 'Southern Italians', 'Sardinians', 'Corsicans',
  'Anglo-Saxons', 'Normans', 'Frisians',
  'Rusyns', 'Sorbs', 'Kashubians',
  'Sami', 'Basques', 'Gagauz', 'Circassians', 'Chechens', 'Ingush',
  'Karaim', 'Krymchaks',

  // África
  'Beja', 'Mozabite',
  'Fulani', 'Mandinka', 'Wolof', 'Dogon', 'Akan', 'Ewe', 'Fon',
  'Kongo', 'Luba', 'Mongo',
  'Swahili', 'Tigrinya', 'Afar',
  'Khoisan', 'San', 'Khoikhoi', 'Herero', 'Tswana', 'Shona', 'Venda',

  // Oriente Médio / Ásia Ocidental
  'Bedouins', 'Turkmen', 'Azeris', 'Mandeans', 'Sabians',
  'Lurs', 'Gilaks', 'Mazandarani',

  // Ásia Central
  'Karakalpak', 'Uyghurs', 'Hazara',

  // Sul da Ásia
  'Rajputs', 'Marathas', 'Adivasi', 'Dalits',
  'Sinhalese', 'Veddas',
  'Sherpas', 'Newars', 'Gurkhas',

  // Sudeste Asiático
  'Lao', 'Shan',
  'Karen', 'Rohingya', 'Chin', 'Kachin',
  'Visayans', 'Tagalogs', 'Igorot', 'Moro',
  'Balinese', 'Dayak', 'Bugis', 'Toraja', 'Papuan peoples',
  'Montagnards', 'Hmong', 'Tay', 'Nung',

  // Leste Asiático
  'Zhuang', 'Tibetans', 'Hani', 'Yi', 'Dai', 'Hui',
  'Jeju islanders',
  'Ainu', 'Ryukyuan',

  // Oceania
  'Marquesan', 'Tahitian', 'Rapa Nui',
  'Kanak', 'Tolai', 'Motu',
  'Yolngu', 'Noongar', 'Arrernte', 'Torres Strait Islanders',

  // Américas
  'Cherokee', 'Sioux', 'Lakota', 'Apache', 'Navajo', 'Hopi', 'Cree', 'Métis',
  'Nahua', 'Mixtec', 'Zapotec', 'Totonac',
  'Mapuche', 'Chachapoya',
  'Taíno', 'Carib', 'Arawak', 'Garifuna',
  'Yanomami', 'Kayapó', 'Tikuna', 'Munduruku', 'Guarani', 'Tupinambá'
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