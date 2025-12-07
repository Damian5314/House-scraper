'use client';

import { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { Calendar, Clock, ArrowRight, TrendingUp, Home, Gavel, Building2, Landmark, CheckCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryIcon: React.ElementType;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Hypotheekrente daalt verder: wat betekent dit voor kopers?',
    excerpt: 'De gemiddelde hypotheekrente is deze maand opnieuw gedaald naar 3,8%. Experts verwachten dat deze trend zich voortzet in 2025, wat goed nieuws is voor starters op de woningmarkt.',
    category: 'Hypotheek',
    categoryIcon: Landmark,
    date: '6 dec 2024',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    id: '2',
    title: 'Nieuwe wet: makelaars moeten energielabel tonen bij bezichtiging',
    excerpt: 'Vanaf januari 2025 zijn makelaars verplicht om het energielabel prominent te tonen tijdens bezichtigingen. Dit moet kopers helpen een betere inschatting te maken van energiekosten.',
    category: 'Regelgeving',
    categoryIcon: Gavel,
    date: '5 dec 2024',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
  },
  {
    id: '3',
    title: 'Huizenprijzen stijgen met 5% in laatste kwartaal',
    excerpt: 'Het CBS meldt een stijging van 5% in huizenprijzen vergeleken met vorig jaar. Vooral in de Randstad blijven de prijzen stijgen door aanhoudende krapte op de markt.',
    category: 'Marktanalyse',
    categoryIcon: TrendingUp,
    date: '4 dec 2024',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=500&fit=crop',
  },
  {
    id: '4',
    title: 'Amsterdam bouwt 10.000 nieuwe woningen in 2025',
    excerpt: 'De gemeente Amsterdam heeft plannen aangekondigd voor de bouw van 10.000 nieuwe woningen, waarvan 40% sociale huur. De eerste projecten starten in het voorjaar.',
    category: 'Nieuwbouw',
    categoryIcon: Building2,
    date: '3 dec 2024',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop',
  },
  {
    id: '5',
    title: 'Tips voor het kopen van je eerste woning in 2025',
    excerpt: 'Ben je van plan om in 2025 je eerste woning te kopen? Wij geven je de beste tips om goed voorbereid de woningmarkt op te gaan en je kansen te vergroten.',
    category: 'Tips',
    categoryIcon: Home,
    date: '2 dec 2024',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
  },
  {
    id: '6',
    title: 'NVM: Aantal woningverkopen stijgt met 15%',
    excerpt: 'De Nederlandse Vereniging van Makelaars meldt een stijging van 15% in het aantal woningverkopen. De toegenomen activiteit wordt toegeschreven aan dalende rentes.',
    category: 'Marktanalyse',
    categoryIcon: TrendingUp,
    date: '1 dec 2024',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop',
  },
  {
    id: '7',
    title: 'Verduurzaming: subsidies voor woningisolatie verlengd',
    excerpt: 'De overheid heeft besloten de subsidieregeling voor woningisolatie te verlengen tot 2026. Huiseigenaren kunnen tot €5.000 subsidie aanvragen voor isolatiemaatregelen.',
    category: 'Regelgeving',
    categoryIcon: Gavel,
    date: '30 nov 2024',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
  },
  {
    id: '8',
    title: 'Rotterdam investeert €500 miljoen in betaalbare woningen',
    excerpt: 'De gemeente Rotterdam maakt een grote investering in betaalbare woningen. Het plan omvat renovatie van bestaande woningen en nieuwbouw in verschillende wijken.',
    category: 'Nieuwbouw',
    categoryIcon: Building2,
    date: '28 nov 2024',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop',
  },
];

const categories = [
  { name: 'Alle', value: 'all' },
  { name: 'Marktanalyse', value: 'Marktanalyse' },
  { name: 'Regelgeving', value: 'Regelgeving' },
  { name: 'Nieuwbouw', value: 'Nieuwbouw' },
  { name: 'Hypotheek', value: 'Hypotheek' },
  { name: 'Tips', value: 'Tips' },
];

export default function NieuwsPage() {
  const featuredArticle = newsArticles.find((a) => a.featured);
  const regularArticles = newsArticles.filter((a) => !a.featured);

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Er ging iets mis. Probeer het opnieuw.');
      } else {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="px-4 py-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              Nieuws
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Het laatste nieuws over de woningmarkt, regelgeving en trends
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  cat.value === 'all'
                    ? 'btn-gradient'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-10">
              <div className="glass rounded-2xl overflow-hidden group cursor-pointer hover:bg-white/10 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#FF7A00] rounded-full text-xs font-semibold">
                        Uitgelicht
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1.5 text-[#FF7A00] text-sm font-medium">
                        <featuredArticle.categoryIcon className="w-4 h-4" />
                        {featuredArticle.category}
                      </span>
                      <span className="text-white/30">•</span>
                      <span className="flex items-center gap-1 text-white/50 text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredArticle.date}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-[#FF7A00] transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-white/60 mb-4 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-white/40 text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.readTime} leestijd
                      </span>
                      <span className="flex items-center gap-1 text-[#FF7A00] text-sm font-medium group-hover:gap-2 transition-all">
                        Lees meer <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => {
              const Icon = article.categoryIcon;
              return (
                <article
                  key={article.id}
                  className="glass rounded-xl overflow-hidden group cursor-pointer hover:bg-white/10 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium">
                        <Icon className="w-3.5 h-3.5 text-[#FF7A00]" />
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[#FF7A00] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-white/50 text-sm line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <span className="flex items-center gap-1 text-[#FF7A00] text-sm font-medium group-hover:gap-2 transition-all">
                      Lees meer <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More */}
          <div className="mt-10 text-center">
            <button className="px-6 py-3 glass rounded-xl font-medium hover:bg-white/10 transition-all">
              Meer artikelen laden
            </button>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 glass rounded-2xl p-8 text-center">
            {isSubscribed ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Je bent aangemeld!</h3>
                <p className="text-white/50 mb-4 max-w-md mx-auto">
                  Bedankt voor je aanmelding. Je ontvangt binnenkort het laatste nieuws over de woningmarkt in je inbox.
                </p>
                <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Check je inbox voor een bevestiging</span>
                </div>
                <div className="mt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 btn-gradient rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
                  >
                    Ga naar woningen zoeken <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 mx-auto mb-4 btn-gradient rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Blijf op de hoogte</h3>
                <p className="text-white/50 mb-6 max-w-md mx-auto">
                  Ontvang wekelijks het laatste nieuws over de woningmarkt in je inbox, plus een directe link naar onze site.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Je e-mailadres"
                    required
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-white/40 focus:border-[#2B7CB3] focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 btn-gradient rounded-xl font-medium whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Aanmelden...
                      </>
                    ) : (
                      'Aanmelden'
                    )}
                  </button>
                </form>
                {error && (
                  <p className="mt-3 text-red-400 text-sm">{error}</p>
                )}
                <p className="mt-4 text-white/30 text-xs">
                  Je kunt je op elk moment uitschrijven. We delen je gegevens niet met derden.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
