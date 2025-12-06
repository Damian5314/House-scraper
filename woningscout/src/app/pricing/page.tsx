'use client';

import { PageTransition } from '../components/PageTransition';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Gratis',
    price: '€0',
    period: '/maand',
    description: 'Voor starters',
    icon: Zap,
    features: [
      '10 zoekopdrachten per dag',
      'Basis filters',
      'Email alerts (1x per dag)',
      'Advertenties',
    ],
    cta: 'Gratis starten',
    href: '/login',
    popular: false,
  },
  {
    name: 'Pro',
    price: '€9',
    period: '/maand',
    description: 'Voor actieve zoekers',
    icon: Crown,
    features: [
      'Onbeperkt zoeken',
      'Alle filters',
      'Instant alerts',
      'Geen advertenties',
      'Favorieten opslaan',
      'Prijshistorie bekijken',
    ],
    cta: 'Start Pro',
    href: '/login',
    popular: true,
  },
  {
    name: 'Business',
    price: '€29',
    period: '/maand',
    description: 'Voor professionals',
    icon: Rocket,
    features: [
      'Alles van Pro',
      'API toegang',
      'Team accounts (5 users)',
      'Export naar Excel/CSV',
      'Priority support',
      'Custom integraties',
    ],
    cta: 'Contact opnemen',
    href: '/about',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              Kies jouw plan
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Van gratis tot premium - er is altijd een plan dat bij je past
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative glass rounded-2xl p-6 flex flex-col ${
                    plan.popular
                      ? 'ring-2 ring-[#e94560] bg-white/10'
                      : ''
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#e94560] rounded-full text-xs font-medium">
                      Meest gekozen
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    plan.popular ? 'btn-gradient' : 'bg-white/10'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Name & Price */}
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-white/50 text-sm mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-white/50 text-sm">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-[#e94560] mt-0.5 flex-shrink-0" />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.href}
                    className={`w-full py-2.5 rounded-lg font-medium text-center text-sm transition-all ${
                      plan.popular
                        ? 'btn-gradient hover:shadow-lg hover:shadow-[#e94560]/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* FAQ hint */}
          <div className="mt-10 text-center">
            <p className="text-white/40 text-sm">
              Vragen over prijzen?{' '}
              <Link href="/about" className="text-[#e94560] hover:underline">
                Neem contact op
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
