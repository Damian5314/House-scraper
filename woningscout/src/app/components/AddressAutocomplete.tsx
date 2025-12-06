'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

interface AddressSuggestion {
  place_id: number;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: string, city: string) => void;
  placeholder?: string;
}

export function AddressAutocomplete({ onSelect, placeholder = "Typ een adres of stad..." }: AddressAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from Nominatim API
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&` +
          `format=json&` +
          `addressdetails=1&` +
          `countrycodes=nl&` +
          `limit=5`,
          {
            headers: {
              'Accept-Language': 'nl',
            },
          }
        );
        const data: AddressSuggestion[] = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const extractCity = (address: AddressSuggestion['address']): string => {
    return address.city || address.town || address.village || address.municipality || 'Nederland';
  };

  const formatDisplayAddress = (suggestion: AddressSuggestion): string => {
    const parts: string[] = [];
    const addr = suggestion.address;

    if (addr.road) {
      let street = addr.road;
      if (addr.house_number) {
        street += ` ${addr.house_number}`;
      }
      parts.push(street);
    }

    if (addr.postcode) {
      parts.push(addr.postcode);
    }

    const city = extractCity(addr);
    if (city) {
      parts.push(city);
    }

    return parts.join(', ') || suggestion.display_name;
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    const city = extractCity(suggestion.address);
    const displayAddress = formatDisplayAddress(suggestion);

    setQuery(displayAddress);
    setSelectedAddress(displayAddress);
    setShowSuggestions(false);
    onSelect(displayAddress, city);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedAddress(null);
    setSuggestions([]);
    onSelect('', '');
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedAddress(null);
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/40 focus:border-[#e94560] focus:outline-none transition-colors"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 animate-spin" />
        )}
        {!isLoading && selectedAddress && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-3 h-3 text-white/70" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#1a1a2e]/98 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          {suggestions.map((suggestion) => {
            const city = extractCity(suggestion.address);
            const addr = suggestion.address;

            return (
              <button
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion)}
                className="w-full px-3 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-2 border-b border-white/5 last:border-0"
              >
                <MapPin className="w-4 h-4 text-[#e94560] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {addr.road ? `${addr.road}${addr.house_number ? ` ${addr.house_number}` : ''}` : city}
                  </div>
                  <div className="text-white/40 text-xs truncate">
                    {addr.postcode && `${addr.postcode}, `}{city}
                  </div>
                </div>
                <div className="px-1.5 py-0.5 bg-[#e94560]/20 rounded text-[10px] text-[#e94560] font-medium flex-shrink-0">
                  {city}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
