"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import LeadFormModal from './LeadFormModal';
import Link from 'next/link';
import Image from 'next/image';
import heroImage from '../assets/door-hero.jpg';

const HeroSection = () => {
  const { t } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-cream" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-foreground">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button variant="hero">{t('hero.viewCatalog')}</Button>
                </Link>
                <Button variant="heroOutline" onClick={() => setLeadOpen(true)}>
                  {t('hero.leaveRequest')}
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImage.src}
                  alt="Premium Door"
                  width={1024}
                  height={1280}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full gradient-gold opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
};

export default HeroSection;
