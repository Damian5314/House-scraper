'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CompactSearchForm } from './components/CompactSearchForm';
import { WoningCard, WoningCardSkeleton } from './components/WoningCard';
import { PageTransition } from './components/PageTransition';
import { SearchFilters, Woning, SearchResponse } from '@/types';
import { RefreshCw, AlertCircle, Home, ArrowLeft, MapPin } from 'lucide-react';

const SEARCH_RESULTS_KEY = 'woningspotters_search_results';
const SEARCH_FILTERS_KEY = 'woningspotters_search_filters';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Woning[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedFilters, setSearchedFilters] = useState<SearchFilters | null>(null);

  // Herstel zoekresultaten uit sessionStorage bij laden
  useEffect(() => {
    const storedResults = sessionStorage.getItem(SEARCH_RESULTS_KEY);
    const storedFilters = sessionStorage.getItem(SEARCH_FILTERS_KEY);

    if (storedResults && storedFilters) {
      setResults(JSON.parse(storedResults));
      setSearchedFilters(JSON.parse(storedFilters));
    }
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    setSearchedFilters(filters);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      const data: SearchResponse = await response.json();

      if (data.success && data.data) {
        setResults(data.data);
        // Sla resultaten op in sessionStorage voor terug-navigatie
        sessionStorage.setItem(SEARCH_RESULTS_KEY, JSON.stringify(data.data));
        sessionStorage.setItem(SEARCH_FILTERS_KEY, JSON.stringify(filters));
      } else {
        setError(data.error || 'Er is een fout opgetreden bij het zoeken');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Kon geen verbinding maken met de server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSearchedFilters(null);
    setError(null);
    // Verwijder opgeslagen resultaten uit sessionStorage
    sessionStorage.removeItem(SEARCH_RESULTS_KEY);
    sessionStorage.removeItem(SEARCH_FILTERS_KEY);
  };

  // Search view - centered on screen, no scroll
  if (!results && !isLoading && !error) {
    return (
      <PageTransition>
      <div className="min-h-[70vh] flex flex-col justify-start pt-[12vh] md:pt-[15vh] px-4 pb-16">
        <div className="max-w-3xl mx-auto w-full">
          {/* Logo & Title */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center">
                <Image src="/logo.svg" alt="WoningSpotters Logo" width={64} height={64} priority />
              </div>
              <span className="text-2xl md:text-3xl font-bold tracking-tight">WoningSpotters</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-3">
              Vind jouw droomwoning
            </h1>
            <p className="text-white/50 text-base md:text-lg">
              Zoek direct in duizenden woningen door heel Nederland
            </p>
          </div>

          {/* Search form */}
          <CompactSearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>
      </PageTransition>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <PageTransition>
      <div className="min-h-[60vh] flex flex-col px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <button
              type="button"
              onClick={handleReset}
              aria-label="Terug naar zoeken"
              className="p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">Woningen zoeken...</h2>
              <p className="text-white/50 text-sm md:text-base flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {searchedFilters?.locatie}
              </p>
            </div>
          </div>

          {/* Loading spinner */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 relative">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-[#FF7A00] rounded-full animate-spin" />
              </div>
              <p className="text-white/60 text-base md:text-lg">Even geduld...</p>
            </div>
          </div>
        </div>
      </div>
      </PageTransition>
    );
  }

  // Error state
  if (error) {
    return (
      <PageTransition>
      <div className="min-h-[60vh] flex items-center justify-center px-4 md:px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-3">Er ging iets mis</h3>
          <p className="text-white/50 mb-6 text-base md:text-lg">{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 btn-gradient rounded-xl font-medium inline-flex items-center gap-2 text-base"
          >
            <RefreshCw className="w-5 h-5" />
            Opnieuw proberen
          </button>
        </div>
      </div>
      </PageTransition>
    );
  }

  // Results view
  return (
    <PageTransition>
    <div className="pb-16 flex flex-col px-4 md:px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5 md:mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={handleReset}
              aria-label="Terug naar zoeken"
              className="p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                <span className="text-[#FF7A00]">{results?.length || 0}</span> woningen
              </h2>
              {searchedFilters && (
                <p className="text-white/50 text-sm md:text-base flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {searchedFilters.locatie} - {searchedFilters.type}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 text-sm md:text-base font-medium bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 md:w-5 md:h-5" /> Nieuw zoeken
          </button>
        </div>

        {/* Results grid */}
        {results && results.length > 0 ? (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {results.map((woning, index) => (
                <WoningCard key={woning.id} woning={woning} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center glass rounded-2xl p-8 md:p-10">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <Home className="w-8 h-8 md:w-10 md:h-10 text-white/40" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Geen woningen gevonden</h3>
              <p className="text-white/50 text-base md:text-lg mb-5">
                Probeer een andere locatie of pas je filters aan
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-3 btn-gradient rounded-xl font-medium inline-flex items-center gap-2 text-base"
              >
                <RefreshCw className="w-5 h-5" />
                Nieuw zoeken
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}
