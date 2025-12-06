'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & beschrijving */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.svg" alt="WoningSpotters" width={32} height={32} />
              <span className="font-bold text-lg">WoningSpotters</span>
            </Link>
            <p className="text-white/50 text-sm">
              Vind jouw droomwoning in heel Nederland. Alle woningsites op één plek.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigatie</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/50 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white/50 hover:text-white transition-colors">
                  Prijzen
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/50 hover:text-white transition-colors">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact#faq" className="text-white/50 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white transition-colors">
                  Bug melden
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/50">
                <Mail className="w-4 h-4 text-[#FF7A00]" />
                info@woningspotters.nl
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <Phone className="w-4 h-4 text-[#FF7A00]" />
                +31 20 123 4567
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <MapPin className="w-4 h-4 text-[#FF7A00]" />
                Amsterdam, NL
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} WoningSpotters. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-white/40 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/voorwaarden" className="text-white/40 hover:text-white transition-colors">
              Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
