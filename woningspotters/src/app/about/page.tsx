'use client';

import { PageTransition } from '../components/PageTransition';
import { Users, Target, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Target,
    title: 'Slim zoeken',
    description: 'Doorzoek alle Nederlandse woningsites in één keer. Bespaar tijd en vind sneller je droomwoning.',
  },
  {
    icon: Zap,
    title: 'Real-time updates',
    description: 'Ontvang direct meldingen wanneer er nieuwe woningen beschikbaar komen die aan jouw criteria voldoen.',
  },
  {
    icon: Shield,
    title: 'Betrouwbaar',
    description: 'Alle woningen worden geverifieerd en we werken alleen met erkende makelaars en platforms.',
  },
  {
    icon: Users,
    title: 'Voor iedereen',
    description: 'Of je nu koopt of huurt, starter of doorstromer bent - WoningSpotters helpt je op weg.',
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Over WoningSpotters
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Wij maken het zoeken naar je droomwoning eenvoudig, snel en overzichtelijk.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass rounded-xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 btn-gradient rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Mission */}
          <div className="glass rounded-xl p-8 text-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Onze missie</h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-6">
              De Nederlandse woningmarkt is complex en onoverzichtelijk. Wij geloven dat iedereen
              toegang moet hebben tot alle beschikbare woningen, zonder eindeloos te hoeven zoeken
              op verschillende websites. WoningSpotters brengt alles samen op één plek.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 btn-gradient rounded-xl font-medium hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-shadow"
            >
              Start met zoeken <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF7A00]">1000+</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Woningen</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF7A00]">50+</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Steden</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#FF7A00]">24/7</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Updates</div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
