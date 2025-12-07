'use client';

import { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Loader2,
  ChevronDown,
  MessageCircle,
  HelpCircle,
  FileQuestion,
  Clock,
  Shield,
  CreditCard
} from 'lucide-react';

const faqItems = [
  {
    question: 'Hoe werkt WoningSpotters?',
    answer: 'WoningSpotters doorzoekt automatisch alle grote Nederlandse woningsites zoals Funda, Pararius en meer. Je voert één keer je zoekcriteria in en wij tonen je alle beschikbare woningen die aan je wensen voldoen.'
  },
  {
    question: 'Is WoningSpotters gratis te gebruiken?',
    answer: 'Ja! Je kunt gratis zoeken met basis functionaliteit. Voor extra features zoals onbeperkt zoeken, instant alerts en favorieten opslaan kun je upgraden naar Pro.'
  },
  {
    question: 'Hoe vaak worden de woningen bijgewerkt?',
    answer: 'Onze database wordt meerdere keren per dag bijgewerkt. Pro gebruikers ontvangen instant alerts zodra er nieuwe woningen worden toegevoegd.'
  },
  {
    question: 'Kan ik mijn zoekopdracht opslaan?',
    answer: 'Met een gratis account kun je tot 3 zoekopdrachten opslaan. Pro gebruikers kunnen onbeperkt zoekopdrachten en favorieten opslaan.'
  },
  {
    question: 'Hoe kan ik mijn abonnement opzeggen?',
    answer: 'Je kunt je abonnement op elk moment opzeggen via je accountinstellingen. Je behoudt toegang tot Pro features tot het einde van je factureringsperiode.'
  },
  {
    question: 'Werkt WoningSpotters ook voor huurwoningen?',
    answer: 'Ja! Je kunt zoeken naar zowel koopwoningen als huurwoningen. Gebruik de filter om te schakelen tussen koop en huur.'
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    onderwerp: '',
    bericht: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuleer verzending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ naam: '', email: '', onderwerp: '', bericht: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <PageTransition>
      <div className="px-4 py-8 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
              Contact & Hulp
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Vind antwoorden op veelgestelde vragen of neem direct contact met ons op.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            <a href="#faq" className="glass rounded-xl p-4 hover:bg-white/10 transition-colors text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-[#2B7CB3]/20 rounded-lg flex items-center justify-center group-hover:bg-[#2B7CB3]/30 transition-colors">
                <HelpCircle className="w-5 h-5 text-[#5BA3D0]" />
              </div>
              <span className="text-sm font-medium">FAQ</span>
            </a>
            <a href="#contact-form" className="glass rounded-xl p-4 hover:bg-white/10 transition-colors text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-[#FF7A00]/20 rounded-lg flex items-center justify-center group-hover:bg-[#FF7A00]/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <span className="text-sm font-medium">Vraag stellen</span>
            </a>
            <a href="#contact-form" className="glass rounded-xl p-4 hover:bg-white/10 transition-colors text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-[#2B7CB3]/20 rounded-lg flex items-center justify-center group-hover:bg-[#2B7CB3]/30 transition-colors">
                <FileQuestion className="w-5 h-5 text-[#5BA3D0]" />
              </div>
              <span className="text-sm font-medium">Bug melden</span>
            </a>
            <a href="#contact-info" className="glass rounded-xl p-4 hover:bg-white/10 transition-colors text-center group">
              <div className="w-10 h-10 mx-auto mb-2 bg-[#FF7A00]/20 rounded-lg flex items-center justify-center group-hover:bg-[#FF7A00]/30 transition-colors">
                <Mail className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <span className="text-sm font-medium">Contact info</span>
            </a>
          </div>

          {/* FAQ Section */}
          <section id="faq" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 btn-gradient rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Veelgestelde vragen</h2>
                <p className="text-white/50 text-sm">Vind snel antwoord op je vraag</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="glass rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium pr-4">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-white/50 flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-4 text-white/60 text-sm border-t border-white/5 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Support Info Cards */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#2B7CB3]/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#5BA3D0]" />
                  </div>
                  <h3 className="font-medium">Reactietijd</h3>
                </div>
                <p className="text-white/50 text-sm">
                  We reageren binnen 24 uur op werkdagen. Pro gebruikers krijgen prioriteit.
                </p>
              </div>

              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#FF7A00]/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#FF7A00]" />
                  </div>
                  <h3 className="font-medium">Privacy</h3>
                </div>
                <p className="text-white/50 text-sm">
                  Je gegevens zijn veilig bij ons. We delen nooit persoonlijke informatie met derden.
                </p>
              </div>

              <div className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#2B7CB3]/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#5BA3D0]" />
                  </div>
                  <h3 className="font-medium">Betalingen</h3>
                </div>
                <p className="text-white/50 text-sm">
                  Vragen over facturering? Mail naar billing@woningspotters.nl voor snelle hulp.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form & Info */}
          <section id="contact-form" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact info */}
            <div id="contact-info" className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Contactgegevens</h3>

              <div className="glass rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 btn-gradient rounded-lg flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-medium mb-1">Email</h4>
                <p className="text-white/50 text-sm">info@woningspotters.nl</p>
                <p className="text-white/50 text-sm">support@woningspotters.nl</p>
              </div>

              <div className="glass rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 btn-gradient rounded-lg flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-medium mb-1">Telefoon</h4>
                <p className="text-white/50 text-sm">+31 20 123 4567</p>
                <p className="text-white/40 text-xs mt-1">Ma-Vr: 9:00 - 17:00</p>
              </div>

              <div className="glass rounded-xl p-5 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 btn-gradient rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-medium mb-1">Adres</h4>
                <p className="text-white/50 text-sm">Herengracht 100</p>
                <p className="text-white/50 text-sm">1015 BS Amsterdam</p>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-4">Stuur ons een bericht</h3>

              <div className="glass rounded-xl p-6">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Bericht verzonden!</h3>
                    <p className="text-white/50 mb-6">
                      Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-5 py-2.5 btn-gradient rounded-lg font-medium text-sm"
                    >
                      Nieuw bericht versturen
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          Naam *
                        </label>
                        <input
                          type="text"
                          name="naam"
                          value={formData.naam}
                          onChange={handleChange}
                          required
                          placeholder="Je naam"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-[#2B7CB3] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="naam@voorbeeld.nl"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-[#2B7CB3] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">
                        Onderwerp *
                      </label>
                      <select
                        name="onderwerp"
                        value={formData.onderwerp}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[#2B7CB3] focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#1a1a2e]">Selecteer een onderwerp</option>
                        <option value="vraag" className="bg-[#1a1a2e]">Algemene vraag</option>
                        <option value="feedback" className="bg-[#1a1a2e]">Feedback geven</option>
                        <option value="bug" className="bg-[#1a1a2e]">Bug of probleem melden</option>
                        <option value="account" className="bg-[#1a1a2e]">Account & abonnement</option>
                        <option value="samenwerking" className="bg-[#1a1a2e]">Samenwerking / Zakelijk</option>
                        <option value="anders" className="bg-[#1a1a2e]">Anders</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1.5">
                        Bericht *
                      </label>
                      <textarea
                        name="bericht"
                        value={formData.bericht}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Beschrijf je vraag of opmerking zo duidelijk mogelijk..."
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-[#2B7CB3] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 btn-gradient rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verzenden...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Verstuur bericht
                        </>
                      )}
                    </button>

                    <p className="text-white/40 text-xs text-center">
                      * Verplichte velden. We reageren meestal binnen 24 uur.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
