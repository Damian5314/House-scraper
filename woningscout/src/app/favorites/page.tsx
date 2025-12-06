'use client';

import { PageTransition } from '../components/PageTransition';
import { Heart, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          {/* Empty state */}
          <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-white/30" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Geen favorieten</h1>

          <p className="text-white/50 mb-8">
            Je hebt nog geen woningen opgeslagen. Zoek woningen en klik op het hartje om ze hier te bewaren.
          </p>

          {/* Feature preview */}
          <div className="glass rounded-xl p-6 mb-6 text-left">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Home className="w-4 h-4 text-[#e94560]" />
              Binnenkort beschikbaar
            </h3>
            <ul className="text-sm text-white/50 space-y-2">
              <li>Sla je favoriete woningen op</li>
              <li>Vergelijk woningen naast elkaar</li>
              <li>Ontvang alerts bij prijswijzigingen</li>
              <li>Deel je favorieten met anderen</li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 btn-gradient rounded-xl font-medium hover:shadow-lg hover:shadow-[#e94560]/30 transition-shadow"
          >
            Start met zoeken <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
