"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import LeadFormModal from './LeadFormModal';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, ShieldCheck, Truck } from 'lucide-react';
import heroImage from '../assets/door-hero.jpg';

const HeroSection = () => {
  const { t, lang } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);

  const stats = [
    { value: t('hero.stat1'), label: t('hero.stat1Label') },
    { value: t('hero.stat2'), label: t('hero.stat2Label') },
    { value: t('hero.stat3'), label: t('hero.stat3Label') },
  ];

  const trustBadges = [
    { icon: ShieldCheck, label: lang === 'uz' ? '5 yil kafolat' : '5 лет гарантии' },
    { icon: Truck, label: lang === 'uz' ? 'Bepul yetkazish' : 'Бесплатная доставка' },
    { icon: Star, label: lang === 'uz' ? '4.9 reyting' : 'Рейтинг 4.9' },
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-32 md:pt-40 lg:pt-44 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Premium Door"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(17,24,39,0.95)] via-[rgba(17,24,39,0.85)] to-[rgba(17,24,39,0.4)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,24,39,0.7)] via-transparent to-transparent" />
        </div>

        {/* Decorative gold orb */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl xl:max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-500/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
                {t('hero.badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-bold leading-[1.1] tracking-tight mb-6 text-white">
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {lang === 'uz' ? 'Uyingiz —' : 'Ваш дом —'}
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mt-1">
                {lang === 'uz' ? 'sizning qasringiz' : 'ваша крепость'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-white/75 max-w-xl leading-relaxed mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-bold"
                >
                  <badge.icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {badge.label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/products">
                <button className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/30">
                  {t('hero.viewCatalog')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <button
                onClick={() => setLeadOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
              >
                {t('hero.leaveRequest')}
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/15">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/60 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
};

export default HeroSection;
