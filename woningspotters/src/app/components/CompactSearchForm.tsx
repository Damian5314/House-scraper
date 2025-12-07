'use client';

import { useState } from 'react';
import { SearchFilters, WoningTypeOption } from '@/types';
import {
  Search,
  Loader2,
  Home,
  Key,
  Building2,
  Hotel,
  Castle,
  Warehouse,
  Sparkles,
  Sofa,
  ChevronDown
} from 'lucide-react';
import { AddressAutocomplete } from './AddressAutocomplete';

interface CompactSearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
}

const woningTypes: WoningTypeOption[] = [
  { id: 'appartement', label: 'Appartement', icon: Building2 },
  { id: 'rijtjeshuis', label: 'Rijtjeshuis', icon: Hotel },
  { id: 'vrijstaand', label: 'Vrijstaand', icon: Castle },
  { id: 'twee-onder-een-kap', label: '2-onder-1-kap', icon: Warehouse },
  { id: 'penthouse', label: 'Penthouse', icon: Sparkles },
  { id: 'studio', label: 'Studio', icon: Sofa },
];

const minPriceOptionsKoop = [
  { value: '', label: 'Min prijs' },
  { value: '100000', label: '€100.000' },
  { value: '150000', label: '€150.000' },
  { value: '200000', label: '€200.000' },
  { value: '250000', label: '€250.000' },
  { value: '300000', label: '€300.000' },
  { value: '400000', label: '€400.000' },
  { value: '500000', label: '€500.000' },
  { value: '750000', label: '€750.000' },
  { value: '1000000', label: '€1.000.000' },
];

const maxPriceOptionsKoop = [
  { value: '', label: 'Max prijs' },
  { value: '200000', label: '€200.000' },
  { value: '300000', label: '€300.000' },
  { value: '400000', label: '€400.000' },
  { value: '500000', label: '€500.000' },
  { value: '600000', label: '€600.000' },
  { value: '750000', label: '€750.000' },
  { value: '1000000', label: '€1.000.000' },
  { value: '1500000', label: '€1.500.000' },
  { value: '2000000', label: '€2.000.000+' },
];

const minPriceOptionsHuur = [
  { value: '', label: 'Min prijs' },
  { value: '500', label: '€500' },
  { value: '750', label: '€750' },
  { value: '1000', label: '€1.000' },
  { value: '1250', label: '€1.250' },
  { value: '1500', label: '€1.500' },
  { value: '2000', label: '€2.000' },
  { value: '2500', label: '€2.500' },
];

const maxPriceOptionsHuur = [
  { value: '', label: 'Max prijs' },
  { value: '1000', label: '€1.000' },
  { value: '1250', label: '€1.250' },
  { value: '1500', label: '€1.500' },
  { value: '1750', label: '€1.750' },
  { value: '2000', label: '€2.000' },
  { value: '2500', label: '€2.500' },
  { value: '3000', label: '€3.000' },
  { value: '5000', label: '€5.000+' },
];

const kamerOptions = [
  { value: '', label: 'Kamers' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
];

export function CompactSearchForm({ onSearch, isLoading }: CompactSearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    locatie: '',
    type: 'koop',
    minPrijs: '',
    maxPrijs: '',
    kamers: '',
    woningType: '',
  });
  const [selectedCity, setSelectedCity] = useState('');

  const handleAddressSelect = (address: string, city: string) => {
    setSelectedCity(city);
    setFilters({ ...filters, locatie: city });
  };

  const handleSubmit = () => {
    if (filters.locatie || selectedCity) {
      onSearch({ ...filters, locatie: filters.locatie || selectedCity });
    }
  };

  const handleTypeChange = (type: 'koop' | 'huur') => {
    setFilters({ ...filters, type, minPrijs: '', maxPrijs: '' });
  };

  const canSearch = filters.locatie.trim() !== '' || selectedCity !== '';
  const minPriceOptions = filters.type === 'koop' ? minPriceOptionsKoop : minPriceOptionsHuur;
  const maxPriceOptions = filters.type === 'koop' ? maxPriceOptionsKoop : maxPriceOptionsHuur;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass rounded-2xl p-5 md:p-8">
        {/* Location input */}
        <div className="mb-5 md:mb-6">
          <AddressAutocomplete
            onSelect={handleAddressSelect}
            placeholder="Zoek op stad of adres..."
          />
          {selectedCity && (
            <div className="mt-2 text-sm text-white/60">
              Zoeken in <span className="text-[#FF7A00] font-medium">{selectedCity}</span>
            </div>
          )}
        </div>

        {/* Koop / Huur toggle */}
        <div className="flex gap-3 mb-5 md:mb-6">
          <button
            onClick={() => handleTypeChange('koop')}
            className={`flex-1 py-3 md:py-4 rounded-xl font-medium text-base md:text-lg flex items-center justify-center gap-2.5 transition-all ${
              filters.type === 'koop'
                ? 'btn-gradient'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Home className="w-5 h-5 md:w-6 md:h-6" /> Koop
          </button>
          <button
            onClick={() => handleTypeChange('huur')}
            className={`flex-1 py-3 md:py-4 rounded-xl font-medium text-base md:text-lg flex items-center justify-center gap-2.5 transition-all ${
              filters.type === 'huur'
                ? 'btn-gradient'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Key className="w-5 h-5 md:w-6 md:h-6" /> Huur
          </button>
        </div>

        {/* Filters row: Price + Rooms */}
        <div className="grid grid-cols-3 gap-3 mb-5 md:mb-6">
          <div className="relative">
            <select
              value={filters.minPrijs}
              onChange={(e) => setFilters({ ...filters, minPrijs: e.target.value })}
              aria-label="Minimum prijs"
              className="w-full px-4 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm md:text-base focus:border-[#2B7CB3] focus:outline-none appearance-none cursor-pointer pr-10 hover:bg-white/10 transition-colors"
            >
              {minPriceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.maxPrijs}
              onChange={(e) => setFilters({ ...filters, maxPrijs: e.target.value })}
              aria-label="Maximum prijs"
              className="w-full px-4 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm md:text-base focus:border-[#2B7CB3] focus:outline-none appearance-none cursor-pointer pr-10 hover:bg-white/10 transition-colors"
            >
              {maxPriceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.kamers}
              onChange={(e) => setFilters({ ...filters, kamers: e.target.value })}
              aria-label="Aantal kamers"
              className="w-full px-4 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm md:text-base focus:border-[#2B7CB3] focus:outline-none appearance-none cursor-pointer pr-10 hover:bg-white/10 transition-colors"
            >
              {kamerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Property types */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 mb-5 md:mb-6">
          {woningTypes.map((wt) => {
            const IconComponent = wt.icon;
            return (
              <button
                key={wt.id}
                onClick={() =>
                  setFilters({
                    ...filters,
                    woningType: filters.woningType === wt.id ? '' : wt.id,
                  })
                }
                className={`py-3 md:py-4 px-2 text-xs md:text-sm font-medium rounded-xl flex flex-col items-center gap-1.5 md:gap-2 transition-all ${
                  filters.woningType === wt.id
                    ? 'btn-gradient'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                <span className="truncate w-full text-center leading-tight">{wt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search button */}
        <button
          onClick={handleSubmit}
          disabled={!canSearch || isLoading}
          className={`w-full py-4 md:py-5 font-semibold text-base md:text-lg rounded-xl flex items-center justify-center gap-2.5 transition-all ${
            canSearch && !isLoading
              ? 'btn-gradient shadow-lg shadow-[#FF7A00]/25 hover:shadow-[#FF7A00]/40'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> Zoeken...
            </>
          ) : (
            <>
              <Search className="w-6 h-6" /> Zoek woningen
            </>
          )}
        </button>
      </div>
    </div>
  );
}
