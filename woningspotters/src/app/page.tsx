'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CompactSearchForm } from './components/CompactSearchForm';
import { WoningCard, WoningCardSkeleton } from './components/WoningCard';
import { PageTransition } from './components/PageTransition';
import { SearchFilters, Woning, SearchResponse } from '@/types';
import { RefreshCw, AlertCircle, Home, ArrowLeft, MapPin } from 'lucide-react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Woning[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedFilters, setSearchedFilters] = useState<SearchFilters | null>(null);

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
  };

  // Search view - centered on screen, no scroll
  if (!results && !isLoading && !error) {
    return (
      <PageTransition>
      <div className="min-h-[70vh] flex flex-col justify-start pt-[15vh] px-4">
        <div className="max-w-2xl mx-auto w-full">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Image src="/logo.svg" alt="WoningSpotters Logo" width={48} height={48} priority />
              </div>
              <span className="text-2xl font-bold tracking-tight">WoningSpotters</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              Vind jouw droomwoning
            </h1>
            <p className="text-white/50 text-sm">
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
      <div className="min-h-[60vh] flex flex-col px-4 py-6">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={handleReset}
              aria-label="Terug naar zoeken"
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold">Woningen zoeken...</h2>
              <p className="text-white/50 text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {searchedFilters?.locatie}
              </p>
            </div>
          </div>

          {/* Loading spinner */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-[#FF7A00] rounded-full animate-spin" />
              </div>
              <p className="text-white/60 text-sm">Even geduld...</p>
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
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Er ging iets mis</h3>
          <p className="text-white/50 mb-5 text-sm">{error}</p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 btn-gradient rounded-lg font-medium inline-flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
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
    <div className="pb-8 flex flex-col px-4 py-4">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              aria-label="Terug naar zoeken"
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold">
                <span className="text-[#FF7A00]">{results?.length || 0}</span> woningen
              </h2>
              {searchedFilters && (
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {searchedFilters.locatie} - {searchedFilters.type}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs font-medium bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Nieuw zoeken
          </button>
        </div>

        {/* Results grid */}
        {results && results.length > 0 ? (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {results.map((woning, index) => (
                <WoningCard key={woning.id} woning={woning} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center glass rounded-xl p-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-white/40" />
              </div>
              <h3 className="font-semibold mb-1">Geen woningen gevonden</h3>
              <p className="text-white/50 text-sm mb-4">
                Probeer een andere locatie of pas je filters aan
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 btn-gradient rounded-lg font-medium inline-flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
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
