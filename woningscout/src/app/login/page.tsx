'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Home } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.push('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          // Account created, switch to login tab
          setSuccess('Account aangemaakt! Log nu in met je gegevens.');
          setPassword(''); // Clear password for security
          setIsLogin(true); // Switch to login tab
        }
      }
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center shadow-lg shadow-[#e94560]/30">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">WoningScout</span>
          </Link>

          {/* Card */}
          <div className="glass rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              {isLogin ? 'Welkom terug' : 'Account aanmaken'}
            </h1>
            <p className="text-white/50 text-center text-sm mb-6">
              {isLogin
                ? 'Log in om je favorieten te bekijken'
                : 'Maak een gratis account aan'}
            </p>

            {/* Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  isLogin ? 'bg-[#e94560] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Inloggen
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  !isLogin ? 'bg-[#e94560] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                Registreren
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@voorbeeld.nl"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Wachtwoord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 btn-gradient rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Inloggen' : 'Account aanmaken'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-white/40 text-xs mt-6">
            Door in te loggen ga je akkoord met onze voorwaarden
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
