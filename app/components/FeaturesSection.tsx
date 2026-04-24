"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Truck, Wrench, BadgeDollarSign } from 'lucide-react';

const FeaturesSection = () => {
  const { t, lang } = useLanguage();

  const features = [
    {
      icon: Shield,
      num: '01',
      titleKey: 'features.quality.title',
      descKey: 'features.quality.desc',
    },
    {
      icon: Truck,
      num: '02',
      titleKey: 'features.delivery.title',
      descKey: 'features.delivery.desc',
    },
    {
      icon: Wrench,
      num: '03',
      titleKey: 'features.installation.title',
      descKey: 'features.installation.desc',
    },
    {
      icon: BadgeDollarSign,
      num: '04',
      titleKey: 'features.pricing.title',
      descKey: 'features.pricing.desc',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-dark-section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-gold/40 to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="section-label mb-4 block justify-center">
            <span className="gold-divider inline-block mr-3 align-middle" />
            {lang === 'uz' ? 'Afzalliklar' : 'Преимущества'}
            <span className="gold-divider inline-block ml-3 align-middle" />
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t('features.title') as string}
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-base leading-relaxed">
            {t('features.subtitle') as string}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 hover:border-gold/25 transition-all duration-500 overflow-hidden"
            >
              {/* Number */}
              <span className="absolute top-6 right-6 text-5xl font-display font-bold text-white/5 group-hover:text-gold/10 transition-colors duration-500 leading-none select-none">
                {f.num}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 mb-6 rounded-xl gradient-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-6 h-6 text-[hsl(var(--dark))]" />
              </div>

              {/* Text */}
              <h3 className="text-base font-semibold mb-3 text-white leading-snug">
                {t(f.titleKey) as string}
              </h3>
              <p className="text-sm text-white/55 leading-relaxed">
                {t(f.descKey) as string}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
