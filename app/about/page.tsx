"use client";

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeadFormModal from '../components/LeadFormModal';
import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';
import {
  ShieldCheck,
  BadgeDollarSign,
  Clock,
  Wrench,
  Leaf,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
} from 'lucide-react';
import milamin502 from '../assets/milamin-502.jpg';
import milamin601 from '../assets/milamin-601.jpg';
import milamin602 from '../assets/milamin-602.jpg';

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);

  const values = [
    {
      icon: ShieldCheck,
      num: '01',
      titleKey: 'aboutPage.value1Title',
      descKey: 'aboutPage.value1Desc',
    },
    {
      icon: BadgeDollarSign,
      num: '02',
      titleKey: 'aboutPage.value2Title',
      descKey: 'aboutPage.value2Desc',
    },
    {
      icon: Award,
      num: '03',
      titleKey: 'aboutPage.value3Title',
      descKey: 'aboutPage.value3Desc',
    },
    {
      icon: Clock,
      num: '04',
      titleKey: 'aboutPage.value4Title',
      descKey: 'aboutPage.value4Desc',
    },
    {
      icon: Leaf,
      num: '05',
      titleKey: 'aboutPage.value5Title',
      descKey: 'aboutPage.value5Desc',
    },
    {
      icon: Wrench,
      num: '06',
      titleKey: 'aboutPage.value6Title',
      descKey: 'aboutPage.value6Desc',
    },
  ];

  const steps = [
    { num: '01', titleKey: 'aboutPage.step1Title', descKey: 'aboutPage.step1Desc' },
    { num: '02', titleKey: 'aboutPage.step2Title', descKey: 'aboutPage.step2Desc' },
    { num: '03', titleKey: 'aboutPage.step3Title', descKey: 'aboutPage.step3Desc' },
    { num: '04', titleKey: 'aboutPage.step4Title', descKey: 'aboutPage.step4Desc' },
  ];

  const testimonials = [
    {
      nameKey: 'aboutPage.t1Name',
      cityKey: 'aboutPage.t1City',
      textKey: 'aboutPage.t1Text',
      stars: 5,
    },
    {
      nameKey: 'aboutPage.t2Name',
      cityKey: 'aboutPage.t2City',
      textKey: 'aboutPage.t2Text',
      stars: 5,
    },
    {
      nameKey: 'aboutPage.t3Name',
      cityKey: 'aboutPage.t3City',
      textKey: 'aboutPage.t3Text',
      stars: 5,
    },
  ];

  const stats = [
    { value: '10+', label: lang === 'uz' ? 'yil bozorda' : 'лет на рынке' },
    { value: '5000+', label: lang === 'uz' ? 'xursand mijoz' : 'довольных клиентов' },
    { value: '200+', label: lang === 'uz' ? 'mahsulot modeli' : 'моделей' },
    { value: '3', label: lang === 'uz' ? 'shahar bo\'ylab filial' : 'города с филиалами' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-[72px]">

        {/* ── HERO BANNER ─────────────────────────────── */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={milamin602}
              alt="Musa Doors showroom"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--dark))/95] via-[hsl(var(--dark))/80] to-[hsl(var(--dark))/50]" />
          </div>
          <div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold border border-gold/30 bg-gold/10 rounded-full px-4 py-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {t('aboutPage.heroBadge') as string}
              </span>
              <h1 className="font-display font-bold text-white leading-[1.1] mb-6">
                <span className="block text-5xl md:text-6xl lg:text-7xl">
                  {lang === 'uz' ? 'Eshikdan ortidagi' : 'Доверие'}
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl text-gradient-gold mt-2">
                  {lang === 'uz' ? 'ishonch' : 'за каждой дверью'}
                </span>
              </h1>
              <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed">
                {t('aboutPage.heroSubtitle') as string}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* ── STATS BAR ────────────────────────────────── */}
        <section className="py-14 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-border">
              {stats.map((stat, i) => (
                <div key={i} className="text-center px-4">
                  <p className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR STORY ────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-cream overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
              <div>
                <span className="section-label mb-4 block">
                  {t('aboutPage.storyTitle') as string}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-6">
                  {lang === 'uz' ? '2014-yildan buyon' : 'С 2014 года'}
                  <br />
                  <span className="text-gradient-gold">
                    {lang === 'uz' ? 'ishonch quraymiz' : 'строим доверие'}
                  </span>
                </h2>
                <div className="gold-divider mb-8" />
                <div className="space-y-5">
                  <p className="text-muted-foreground leading-relaxed">
                    {t('aboutPage.storyP1') as string}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('aboutPage.storyP2') as string}
                  </p>
                  <p className="text-base font-medium text-foreground leading-relaxed border-l-2 border-gold pl-4 italic">
                    {t('aboutPage.storyP3') as string}
                  </p>
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  {[
                    lang === 'uz' ? 'Sertifikatlangan' : 'Сертифицировано',
                    lang === 'uz' ? '5 yil kafolat' : 'Гарантия 5 лет',
                    lang === 'uz' ? 'Bepul o\'rnatish maslahati' : 'Бесплатный монтаж',
                  ].map((badge, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-card border border-border rounded-full px-3 py-1.5"
                    >
                      <CheckCircle className="w-3 h-3 text-gold" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Images collage */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-xl">
                      <Image
                        src={milamin502}
                        alt="Musa Doors product"
                        width={400}
                        height={533}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-10">
                    <div className="rounded-2xl overflow-hidden aspect-square shadow-xl">
                      <Image
                        src={milamin601}
                        alt="Musa Doors showroom"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-2xl bg-dark-section p-6 text-center">
                      <p className="text-4xl font-display font-bold text-gradient-gold">47</p>
                      <p className="text-xs text-white/50 mt-1">
                        {lang === 'uz' ? 'sifat nazorati bosqichi' : 'этапов контроля'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ────────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-dark-section relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="section-label mb-4 block">
                <span className="gold-divider inline-block mr-3 align-middle" />
                {t('aboutPage.valuesTitle') as string}
                <span className="gold-divider inline-block ml-3 align-middle" />
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 hover:border-gold/25 p-8 transition-all duration-400 overflow-hidden"
                >
                  <span className="absolute top-6 right-6 text-5xl font-display font-bold text-white/4 group-hover:text-gold/8 transition-colors select-none leading-none">
                    {v.num}
                  </span>
                  <div className="w-12 h-12 mb-6 rounded-xl gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <v.icon className="w-6 h-6 text-[hsl(var(--dark))]" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-3">
                    {t(v.titleKey) as string}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    {t(v.descKey) as string}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ───────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="section-label mb-4 block">{lang === 'uz' ? 'Jarayon' : 'Процесс'}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                {t('aboutPage.processTitle') as string}
              </h2>
              <div className="gold-divider mx-auto mt-5" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connector line */}
              <div className="absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

              {steps.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  {/* Number circle */}
                  <div className="relative w-20 h-20 rounded-full gradient-gold flex items-center justify-center mb-6 shadow-lg shadow-gold/20 group-hover:scale-105 transition-transform duration-300 z-10">
                    <span className="text-xl font-display font-bold text-[hsl(var(--dark))]">
                      {step.num}
                    </span>
                  </div>
                  {/* Connector arrow for desktop */}
                  {i < 3 && (
                    <div className="absolute top-10 left-[calc(50%+40px)] hidden lg:flex items-center z-0">
                      <ArrowRight className="w-5 h-5 text-gold/40" />
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    {t(step.titleKey) as string}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(step.descKey) as string}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-cream relative overflow-hidden">
          <div className="absolute left-0 top-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="section-label mb-4 block">
                {lang === 'uz' ? 'Sharhlar' : 'Отзывы'}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {t('aboutPage.testimonialsTitle') as string}
              </h2>
              <div className="gold-divider mx-auto mt-5" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testi, i) => (
                <div
                  key={i}
                  className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-gold/20 transition-all duration-400"
                >
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-gold/30 mb-5" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(testi.stars)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8 italic">
                    {t(testi.textKey) as string}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-6 border-t border-border">
                    <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-[hsl(var(--dark))] font-bold text-sm">
                      {(t(testi.nameKey) as string).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t(testi.nameKey) as string}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(testi.cityKey) as string}
                      </p>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-dark-section relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-gold/40 to-transparent" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="section-label mb-6 block justify-center">
              <span className="gold-divider inline-block mr-3 align-middle" />
              {lang === 'uz' ? 'Bugun boshlang' : 'Начните сегодня'}
              <span className="gold-divider inline-block ml-3 align-middle" />
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {t('aboutPage.ctaTitle') as string}
            </h2>
            <p className="text-white/55 max-w-lg mx-auto mb-10 text-base leading-relaxed">
              {t('aboutPage.ctaSubtitle') as string}
            </p>
            <button
              onClick={() => setLeadOpen(true)}
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl gradient-gold text-[hsl(var(--dark))] font-bold text-base hover:opacity-90 transition-opacity shadow-2xl shadow-gold/25"
            >
              {t('aboutPage.ctaBtn') as string}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-white/30 text-xs font-medium">
              {[
                lang === 'uz' ? '✓ Bepul konsultatsiya' : '✓ Бесплатная консультация',
                lang === 'uz' ? '✓ 15 daqiqada javob' : '✓ Ответ за 15 минут',
                lang === 'uz' ? '✓ Hech qanday majburiyat yo\'q' : '✓ Без обязательств',
              ].map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
}
