'use client';

import Image from 'next/image';
import { Home } from 'lucide-react';

export function Header() {
  return (
    <header className="text-center mb-12 md:mb-16">
      <div className="inline-flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center">
          <Image src="/logo.svg" alt="WoningSpotters Logo" width={48} height={48} priority />
        </div>
        <span className="text-2xl font-bold tracking-tight">WoningSpotters</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text tracking-tight">
        Vind jouw droomwoning
      </h1>
      <p className="text-lg text-white/60 max-w-lg mx-auto">
        Doorzoek alle woningsites in één keer. Slim, snel en overzichtelijk.
      </p>
    </header>
  );
}
