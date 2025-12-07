'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageTransition } from '@/app/components/PageTransition';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type Status = 'verifying' | 'success' | 'failed' | 'canceled';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const activateSubscription = async () => {
      if (!user || !plan) {
        // Wait a bit for user to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (!user) {
          setStatus('failed');
          setErrorMessage('Je bent niet ingelogd.');
          return;
        }
      }

      try {
        const response = await fetch('/api/mollie/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user!.id, plan }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.status === 'canceled' || data.status === 'expired' || data.status === 'failed') {
            setStatus('canceled');
            setErrorMessage('De betaling is geannuleerd of mislukt.');
          } else if (data.status === 'open' || data.status === 'pending') {
            setStatus('failed');
            setErrorMessage('De betaling is nog niet voltooid.');
          } else {
            setStatus('failed');
            setErrorMessage(data.error || 'Er ging iets mis.');
          }
          return;
        }

        setStatus('success');
      } catch (err) {
        console.error('Error activating subscription:', err);
        setStatus('failed');
        setErrorMessage('Er ging iets mis bij het activeren.');
      }
    };

    const timer = setTimeout(activateSubscription, 1500);
    return () => clearTimeout(timer);
  }, [user, plan]);

  const planName = plan === 'pro' ? 'Pro' : plan === 'ultra' ? 'Ultra' : 'Premium';

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-16 h-16 text-[#FF7A00] mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Betaling verifiëren...</h1>
              <p className="text-white/50">Even geduld alsjeblieft.</p>
            </>
          )}

          {status === 'canceled' && (
            <>
              <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Betaling geannuleerd</h1>
              <p className="text-white/50 mb-6">{errorMessage}</p>
              <Link
                href="/pricing"
                className="block w-full py-3 rounded-lg btn-gradient font-medium hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
              >
                Probeer opnieuw
              </Link>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Er ging iets mis</h1>
              <p className="text-white/50 mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="block w-full py-3 rounded-lg btn-gradient font-medium hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
                >
                  Terug naar prijzen
                </Link>
                <Link
                  href="/contact"
                  className="block w-full py-3 rounded-lg bg-white/10 font-medium hover:bg-white/20 transition-all"
                >
                  Contact opnemen
                </Link>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Betaling geslaagd!</h1>
              <p className="text-white/50 mb-6">
                Welkom bij WoningSpotters {planName}! Je abonnement is nu actief.
              </p>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block w-full py-3 rounded-lg btn-gradient font-medium hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
                >
                  Start met zoeken
                </Link>
                <Link
                  href="/pricing"
                  className="block w-full py-3 rounded-lg bg-white/10 font-medium hover:bg-white/20 transition-all"
                >
                  Bekijk je abonnement
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
            <Loader2 className="w-16 h-16 text-[#FF7A00] mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Laden...</h1>
          </div>
        </div>
      </PageTransition>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
