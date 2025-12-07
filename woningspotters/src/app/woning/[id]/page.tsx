'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageTransition } from '../../components/PageTransition';
import { Woning } from '@/types';
import {
  ArrowLeft,
  MapPin,
  Maximize,
  BedDouble,
  Zap,
  ExternalLink,
  Calendar,
  Home,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function WoningDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [woning, setWoning] = useState<Woning | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Haal de woning data op uit sessionStorage
    const storedWoning = sessionStorage.getItem(`woning_${params.id}`);
    if (storedWoning) {
      setWoning(JSON.parse(storedWoning));
    }
  }, [params.id]);

  const handleBack = () => {
    // Ga altijd terug naar de homepage waar de zoekresultaten uit sessionStorage worden geladen
    router.push('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getEnergyLabelColor = (label?: string) => {
    if (!label) return 'bg-gray-500';
    const l = label.toUpperCase();
    if (l.startsWith('A')) return 'bg-green-500';
    if (l === 'B') return 'bg-lime-500';
    if (l === 'C') return 'bg-yellow-500';
    if (l === 'D') return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Combineer hoofdfoto met extra fotos
  const allImages = woning ? [woning.foto, ...(woning.fotos || [])] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!woning) {
    return (
      <PageTransition>
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Terug naar woningen</span>
            </button>
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-white/50">Woning niet gevonden</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Terug knop */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Terug naar woningen</span>
          </button>

          {/* Afbeelding sectie */}
          <div className="glass rounded-2xl overflow-hidden mb-6">
            <div className="relative h-64 md:h-96">
              <img
                src={allImages[currentImageIndex] || woning.foto}
                alt={woning.titel}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
                }}
              />

              {/* Navigatie pijlen als er meerdere afbeeldingen zijn */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Afbeelding indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImageIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-sm font-semibold">
                  {woning.type}
                </span>
                {woning.energielabel && (
                  <span
                    className={`px-3 py-1.5 backdrop-blur-md rounded-lg text-sm font-semibold flex items-center gap-1 ${getEnergyLabelColor(
                      woning.energielabel
                    )}`}
                  >
                    <Zap className="w-4 h-4" />
                    {woning.energielabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Woning info */}
          <div className="glass rounded-2xl p-6 mb-6">
            {/* Prijs en titel */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-[#FF7A00]">
                {formatPrice(woning.prijs)}
              </span>
              <h1 className="text-2xl font-bold mt-2">{woning.titel}</h1>
            </div>

            {/* Adres */}
            <div className="flex items-center gap-2 text-white/70 mb-6">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>
                {woning.adres}
                {woning.postcode && `, ${woning.postcode}`}
                {woning.plaats && ` ${woning.plaats}`}
              </span>
            </div>

            {/* Kenmerken */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {woning.kamers > 0 && (
                <div className="glass rounded-xl p-4 text-center">
                  <BedDouble className="w-6 h-6 mx-auto mb-2 text-[#5BA3D0]" />
                  <p className="text-lg font-semibold">{woning.kamers}</p>
                  <p className="text-sm text-white/50">Kamers</p>
                </div>
              )}
              {woning.oppervlakte > 0 && (
                <div className="glass rounded-xl p-4 text-center">
                  <Maximize className="w-6 h-6 mx-auto mb-2 text-[#5BA3D0]" />
                  <p className="text-lg font-semibold">{woning.oppervlakte}m²</p>
                  <p className="text-sm text-white/50">Oppervlakte</p>
                </div>
              )}
              {woning.bouwjaar && (
                <div className="glass rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-[#5BA3D0]" />
                  <p className="text-lg font-semibold">{woning.bouwjaar}</p>
                  <p className="text-sm text-white/50">Bouwjaar</p>
                </div>
              )}
              <div className="glass rounded-xl p-4 text-center">
                <Home className="w-6 h-6 mx-auto mb-2 text-[#5BA3D0]" />
                <p className="text-lg font-semibold">{woning.type}</p>
                <p className="text-sm text-white/50">Type</p>
              </div>
            </div>

            {/* Beschrijving */}
            {woning.beschrijving && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Beschrijving</h2>
                <p className="text-white/70 leading-relaxed">{woning.beschrijving}</p>
              </div>
            )}

            {/* Makelaar */}
            {woning.makelaar && (
              <div className="border-t border-white/10 pt-4 mb-6">
                <p className="text-sm text-white/50">Aangeboden door</p>
                <p className="font-medium">{woning.makelaar}</p>
              </div>
            )}

            {/* Ga naar site knop */}
            <a
              href={woning.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 btn-gradient rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              Bekijk op website
            </a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
