'use client';

import { PageTransition } from '../../components/PageTransition';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribeConfirmedPage() {
  return (
    <PageTransition>
      <div className="px-4 py-16 min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#2B7CB3]/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#5BA3D0]" />
          </div>

          <h1 className="text-2xl font-bold mb-3">Uitgeschreven</h1>

          <p className="text-white/60 mb-8">
            Je bent succesvol uitgeschreven van de WoningSpotters nieuwsbrief.
            Je ontvangt geen e-mails meer van ons.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 btn-gradient rounded-xl font-medium hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
            >
              Terug naar home <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-white/40 text-sm">
              Per ongeluk uitgeschreven?{' '}
              <Link href="/nieuws" className="text-[#5BA3D0] hover:underline">
                Meld je opnieuw aan
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
