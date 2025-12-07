import type { Metadata } from 'next';
import Script from "next/script";
import { gtmScript, consentDefaultScript, GTM_ID } from "./gtm";
import './globals.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TransitionProvider } from './components/TransitionProvider';
import { AuthProvider } from '@/context/AuthContext';
import FloatingLines from './components/FloatingLines';
import CookieConsent from './components/CookieConsent';

export const metadata: Metadata = {
  title: 'WoningSpotters - Vind jouw droomwoning',
  description: 'Doorzoek alle Nederlandse woningsites in één keer. Vind je droomwoning op Funda, Pararius en meer. Slim, snel en overzichtelijk.',
  keywords: ['woning', 'huis', 'kopen', 'huren', 'funda', 'nederland', 'vastgoed', 'makelaars'],
  authors: [{ name: 'WoningSpotters' }],
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/Logo.png', type: 'image/png' }
    ],
    apple: '/Logo.png',
  },
  openGraph: {
    title: 'WoningSpotters - Vind jouw droomwoning',
    description: 'Doorzoek alle Nederlandse woningsites in één keer.',
    type: 'website',
    images: [{ url: '/Logo.png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="layout-bg">
      <head>
        {/* 1. Consent Mode defaults - MUST load BEFORE GTM */}
        <Script
          id="consent-default-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: consentDefaultScript }}
        />
        {/* 2. Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: gtmScript }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen layout-body-bg">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

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

          {/* Cookie Consent Banner */}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
