'use client';

import { Woning } from '@/types';
import { MapPin, Maximize, BedDouble, ExternalLink, Zap } from 'lucide-react';

interface WoningCardProps {
  woning: Woning;
  index?: number;
}

export function WoningCard({ woning, index = 0 }: WoningCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getEnergyLabelColor = (label?: string) => {
    if (!label) return 'bg-gray-500/80';
    const l = label.toUpperCase();
    if (l.startsWith('A')) return 'bg-green-500/80';
    if (l === 'B') return 'bg-lime-500/80';
    if (l === 'C') return 'bg-yellow-500/80';
    if (l === 'D') return 'bg-orange-500/80';
    return 'bg-red-500/80';
  };

  return (
    <a
      href={woning.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-strong rounded-2xl overflow-hidden card-hover block animate-fade-in opacity-0 group shadow-xl border-2 border-white/20"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={woning.foto}
          alt={woning.titel}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-xs font-semibold">
            {woning.type}
          </span>
          {woning.energielabel && (
            <span
              className={`px-3 py-1.5 backdrop-blur-md rounded-lg text-xs font-semibold flex items-center gap-1 ${getEnergyLabelColor(
                woning.energielabel
              )}`}
            >
              <Zap className="w-3 h-3" />
              {woning.energielabel}
            </span>
          )}
        </div>

        {/* External link icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Price overlay on image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl font-bold text-white drop-shadow-lg">
            {formatPrice(woning.prijs)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-gradient-to-b from-white/5 to-transparent">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1 group-hover:text-[#FF7A00] transition-colors text-white">
          {woning.titel}
        </h3>

        <div className="flex items-center gap-1.5 text-white/60 text-sm mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {woning.adres}
            {woning.postcode && `, ${woning.postcode}`}
            {woning.plaats && ` ${woning.plaats}`}
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm text-white/70">
            {woning.kamers > 0 && (
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" />
                <span>{woning.kamers} kamers</span>
              </div>
            )}
            {woning.oppervlakte > 0 && (
              <div className="flex items-center gap-1.5">
                <Maximize className="w-4 h-4" />
                <span>{woning.oppervlakte}m²</span>
              </div>
            )}
          </div>
        </div>

        {/* Makelaar */}
        {woning.makelaar && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <span className="text-xs text-white/50 line-clamp-1">{woning.makelaar}</span>
          </div>
        )}
      </div>
    </a>
  );
}

export function WoningCardSkeleton() {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
      <div className="h-48 skeleton" />
      <div className="p-5 space-y-3 bg-gradient-to-b from-white/5 to-transparent">
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 w-24 skeleton rounded" />
          <div className="h-4 w-16 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}
