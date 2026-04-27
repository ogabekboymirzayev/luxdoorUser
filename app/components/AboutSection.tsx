"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Award, Users, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import milaminImg from '../assets/milamin-601.jpg';

const AboutSection = () => {
  const { t, lang } = useLanguage();

  const stats = [
    { icon: Award, value: '10+', label: lang === 'uz' ? 'yil tajriba' : 'лет опыта' },
    { icon: Users, value: '5000+', label: lang === 'uz' ? 'xursand mijoz' : 'клиентов' },
    { icon: Package, value: '200+', label: lang === 'uz' ? 'mahsulot modeli' : 'моделей' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
              <Image
                src={milaminImg}
                alt="Musa Doors showroom"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark))/60] to-transparent" />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-6 -right-4 lg:-right-10 bg-card border border-border rounded-2xl p-6 shadow-xl max-w-[200px]">
              <p className="text-4xl font-display font-bold text-gradient-gold">2009</p>
              <p className="text-sm text-muted-foreground mt-1">
                {lang === 'uz' ? 'yildan buyon bozorda' : 'год основания'}
              </p>
            </div>

            {/* Gold accent */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full gradient-gold opacity-15 blur-xl" />
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <span className="section-label mb-4 block">{t('about.subtitle') as string}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
                {t('about.title') as string}
              </h2>
              <div className="gold-divider mt-5" />
            </div>

            <p className="text-muted-foreground leading-relaxed text-base">
              {t('about.description') as string}
            </p>

            <p className="text-muted-foreground leading-relaxed text-base">
              {t('about.storyText') as string}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-border">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl font-display font-bold text-gradient-gold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-gold transition-colors"
            >
              {t('about.learnMore') as string}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
