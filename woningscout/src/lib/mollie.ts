import createMollieClient from '@mollie/api-client';

const mollieApiKey = process.env.MOLLIE_API_KEY!;

if (!mollieApiKey) {
  console.warn('MOLLIE_API_KEY is not set');
}

export const mollieClient = createMollieClient({ apiKey: mollieApiKey });

// Plan configuration
export const PLANS = {
  pro: {
    name: 'Pro',
    amount: '9.00',
    currency: 'EUR',
    interval: '1 month',
    description: 'WoningScout Pro - Maandelijks abonnement',
  },
  ultra: {
    name: 'Ultra',
    amount: '29.00',
    currency: 'EUR',
    interval: '1 month',
    description: 'WoningScout Ultra - Maandelijks abonnement',
  },
} as const;

export type PlanType = keyof typeof PLANS;
