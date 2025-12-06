import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from './components/Navbar';
import { TransitionProvider } from './components/TransitionProvider';
import { AuthProvider } from '@/context/AuthContext';
import FloatingLines from './components/FloatingLines';

export const metadata: Metadata = {
  title: 'WoningScout - Vind jouw droomwoning',
  description: 'Doorzoek alle Nederlandse woningsites in één keer. Vind je droomwoning op Funda, Pararius en meer. Slim, snel en overzichtelijk.',
  keywords: ['woning', 'huis', 'kopen', 'huren', 'funda', 'nederland', 'vastgoed', 'makelaars'],
  authors: [{ name: 'WoningScout' }],
  openGraph: {
    title: 'WoningScout - Vind jouw droomwoning',
    description: 'Doorzoek alle Nederlandse woningsites in één keer.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <AuthProvider>
          {/* Animated background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <FloatingLines />
          </div>

          {/* Fixed Navbar - blijft staan tijdens page transitions */}
          <Navbar />

          {/* Main content met page transitions */}
          <main className="relative z-10 pt-14 overflow-x-hidden">
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
