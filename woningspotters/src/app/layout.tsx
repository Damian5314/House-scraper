import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TransitionProvider } from './components/TransitionProvider';
import { AuthProvider } from '@/context/AuthContext';
import FloatingLines from './components/FloatingLines';

export const metadata: Metadata = {
  title: 'WoningSpotters - Vind jouw droomwoning',
  description: 'Doorzoek alle Nederlandse woningsites in één keer. Vind je droomwoning op Funda, Pararius en meer. Slim, snel en overzichtelijk.',
  keywords: ['woning', 'huis', 'kopen', 'huren', 'funda', 'nederland', 'vastgoed', 'makelaars'],
  authors: [{ name: 'WoningSpotters' }],
  openGraph: {
    title: 'WoningSpotters - Vind jouw droomwoning',
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
    <html lang="nl" style={{ background: '#1a1a2e' }}>
      <body className="antialiased flex flex-col min-h-screen" style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <AuthProvider>
          {/* Animated background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <FloatingLines />
          </div>

          {/* Fixed Navbar */}
          <Navbar />

          {/* Main content */}
          <main className="relative z-10 pt-14 flex-1">
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </main>

          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
