"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import LeadFormModal from './LeadFormModal';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, ShieldCheck, Truck, Phone, X } from 'lucide-react';
import heroImage from '../assets/door-hero.jpg';
import heroImage2 from '../assets/image.png';

const branches = [
  { city: 'Toshkent', cityRu: 'Ташкент', phone: '+998 71 200 00 64', tel: '+998712000064' },
  { city: "Qo'qon", cityRu: 'Коканд', phone: '+998 73 200 00 64', tel: '+998732000064' },
  { city: 'Buxoro', cityRu: 'Бухара', phone: '+998 65 200 00 64', tel: '+998652000064' },
];

const sliderImages = [heroImage, heroImage2];

const HeroSection = () => {
  const { t, lang } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);
  const [showBranches, setShowBranches] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const BranchPanel = ({ dark = false }: { dark?: boolean }) => (
    <div className={`rounded-2xl overflow-hidden border ${dark ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-100'} shadow-xl`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b ${dark ? 'border-white/10' : 'border-gray-100'}`}>
        <p className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-white/60' : 'text-gray-400'}`}>
          {lang === 'uz' ? 'Filial tanlang' : 'Выберите филиал'}
        </p>
        <button onClick={() => setShowBranches(false)}>
          <X className={`w-4 h-4 ${dark ? 'text-white/40 hover:text-white' : 'text-gray-300 hover:text-gray-600'} transition-colors`} />
        </button>
      </div>
      {branches.map((b, i) => (
        <a
          key={i}
          href={`tel:${b.tel}`}
          className={`flex items-center justify-between px-4 py-3.5 transition-colors group ${
            dark
              ? 'hover:bg-white/5 border-b border-white/5 last:border-0'
              : 'hover:bg-amber-50 border-b border-gray-50 last:border-0'
          }`}
        >
          <div>
            <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-800'}`}>
              {lang === 'uz' ? b.city : b.cityRu}
            </p>
            <p className={`text-xs mt-0.5 ${dark ? 'text-white/50' : 'text-gray-400'}`}>{b.phone}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center group-hover:bg-amber-500 transition-colors shrink-0">
            <Phone className="w-3.5 h-3.5 text-[#2a2a2a]" />
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <>
      {/* ========== MOBILE ========== */}
      <section className="md:hidden relative bg-white pt-28 overflow-hidden">
        <div className="flex items-start" style={{ minHeight: '520px' }}>

          {/* Chap: Matn */}
          <div className="flex-1 px-5 pt-4 pb-10 z-10 relative bg-white">
            <p className="text-gray-400 uppercase tracking-widest text-[10px] font-semibold mb-2">
              {lang === 'uz' ? 'Premium sifatdagi' : 'Премиум качество'}
            </p>
            <h1 className="text-gray-900 font-black uppercase leading-none mb-6" style={{ fontSize: '38px' }}>
              {lang === 'uz' ? 'TEMIR VA' : 'МЕТАЛЛ И'}<br />
              {lang === 'uz' ? 'MDF ESHIKLAR' : 'МДФ ДВЕРИ'}
            </h1>

            <div className="flex flex-col gap-4 mb-8">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-3">
                  <badge.icon className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-gray-600 text-sm">{badge.label}</p>
                </div>
              ))}
            </div>

            {!showBranches ? (
              <button
                onClick={() => setShowBranches(true)}
                className="w-full py-4 rounded-2xl bg-amber-400 text-[#2a2a2a] font-black text-xs uppercase tracking-wider hover:bg-amber-500 transition-colors"
              >
                {lang === 'uz' ? 'BEPUL KONSULTATSIYA OLISH' : 'ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ'}
              </button>
            ) : (
              <BranchPanel dark={false} />
            )}
          </div>

          {/* O'ng: Slider rasm */}
          <div className="relative shrink-0 overflow-hidden" style={{ width: '46%', height: '520px' }}>
            {sliderImages.map((img, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: currentSlide === i ? 1 : 0 }}
              >
                <Image
                  src={img}
                  alt={`Door ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover object-center"
                />
              </div>
            ))}
            <div
              className="absolute inset-0 z-10"
              style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 30%)' }}
            />
            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
              {sliderImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: currentSlide === i ? '16px' : '6px',
                    height: '6px',
                    background: currentSlide === i ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== DESKTOP ========== */}
      <section className="hidden md:flex relative min-h-screen items-center pt-40 lg:pt-44 overflow-hidden">

        {/* Desktop slider */}
        <div className="absolute inset-0">
          {sliderImages.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: currentSlide === i ? 1 : 0 }}
            >
              <Image
                src={img}
                alt={`Door ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover object-center"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(17,24,39,0.82)] via-[rgba(17,24,39,0.60)] to-[rgba(17,24,39,0.15)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,24,39,0.45)] via-transparent to-transparent" />
        </div>

        {/* Desktop dots */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: currentSlide === i ? '24px' : '8px',
                height: '8px',
                background: currentSlide === i ? '#f59e0b' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl xl:max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-500/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="font-bold leading-[1.1] tracking-tight mb-6 text-white">
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {lang === 'uz' ? 'Uyingiz —' : 'Ваш дом —'}
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mt-1">
                {lang === 'uz' ? 'sizning qasringiz' : 'ваша крепость'}
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/75 max-w-xl leading-relaxed mb-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-bold">
                  <badge.icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {badge.label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/products">
                <button className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/30">
                  {t('hero.viewCatalog')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <button
                onClick={() => setShowBranches(!showBranches)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                {lang === 'uz' ? 'Bepul konsultatsiya' : 'Бесплатная консультация'}
              </button>
            </div>

            {showBranches && (
              <div className="mb-8 max-w-sm">
                <BranchPanel dark={true} />
              </div>
            )}

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

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
};

export default HeroSection;