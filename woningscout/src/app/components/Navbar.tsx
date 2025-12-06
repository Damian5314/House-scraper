'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Home, Info, Heart, Search, CreditCard, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/pricing', label: 'Prijzen', icon: CreditCard },
  { href: '/about', label: 'Over ons', icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
  };

  // Get user initials or email initial
  const getUserInitial = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image src="/logo.svg" alt="WoningScout" width={32} height={32} priority />
            </div>
            <span className="font-bold text-base">WoningScout</span>
          </Link>

          {/* Center Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-[#e94560]/20 text-[#e94560]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth */}
          <div className="flex items-center gap-2">
            {/* Favorites link (always visible) */}
            <Link
              href="/favorites"
              className={`p-2 rounded-lg transition-all ${
                pathname === '/favorites'
                  ? 'bg-[#e94560]/20 text-[#e94560]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-4 h-4" />
            </Link>

            {loading ? (
              <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
            ) : user ? (
              /* Logged in - Account dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 btn-gradient rounded-full flex items-center justify-center text-sm font-medium">
                    {getUserInitial()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass rounded-xl border border-white/10 py-2 shadow-xl">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-white/50">Gratis account</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Heart className="w-4 h-4" />
                        Mijn favorieten
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <CreditCard className="w-4 h-4" />
                        Upgrade naar Pro
                      </Link>
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-white/10 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Uitloggen
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in - Login button */
              <Link
                href="/login"
                className="px-4 py-2 btn-gradient rounded-lg text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-[#e94560]/30 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Inloggen</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
