"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { Phone, MapPin, Clock, Instagram, Send } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  const { t, lang } = useLanguage();

  const quickLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.products'), path: '/products' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/#contact' },
  ];

  const phones = [
    { city: 'Toshkent', phone: '+998 50 711 00 64' },
    { city: lang === 'uz' ? "Qo'qon" : 'Коканд', phone: '+998 77 221 84 84' },
    { city: 'Buxoro', phone: '+998 91 403 20 70' },
  ];

  return (
    <footer className="bg-[hsl(155_20%_8%)] border-t border-white/8">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden">
                <Image src={logo} alt="Musa Doors logo" fill className="object-contain" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Musa <span className="text-gradient-gold">Doors</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline') as string}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/mdf_temir_eshiklari_dveri_akfa/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/40 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/mdf_temir_eshiklari_dveri_akfa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/40 transition-all"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gold mb-6">
              {t('footer.quickLinks') as string}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label as string}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gold mb-6">
              {t('footer.contactInfo') as string}
            </h4>
            <ul className="space-y-4">
              {phones.map((p, i) => (
                <li key={i}>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">{p.city}</p>
                  <a
                    href={`tel:${p.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                    {p.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Work hours & locations */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gold mb-6">
              {t('footer.workHours') as string}
            </h4>
            <div className="flex items-start gap-2 mb-5">
              <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <p className="text-sm text-white/55 leading-relaxed">
                {t('footer.workHoursValue') as string}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <p className="text-sm text-white/55 leading-relaxed">
                {lang === 'uz'
                  ? 'Toshkent, Qo\'qon, Buxoro'
                  : 'Ташкент, Коканд, Бухара'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Musa Doors. {t('footer.rights') as string}
          </p>
          <div className="flex items-center gap-1">
            <div className="gold-divider w-8 h-[2px]" />
            <span className="text-[10px] text-gold/60 font-medium tracking-widest uppercase px-2">
              Premium
            </span>
            <div className="gold-divider w-8 h-[2px]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
