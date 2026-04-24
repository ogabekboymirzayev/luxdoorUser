"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import LeadFormModal from './LeadFormModal';

const locations = [
  {
    city: 'Toshkent',
    phone: '+998 50 711 00 64',
    mapUrl: `https://www.google.com/maps/place/40%C2%B031'56.8%22N+70%C2%B057'06.5%22E/@40.532446,70.951813,1743m/data=!3m1!1e3!4m4!3m3!8m2!3d40.532446!4d70.951813?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`,
  },
  {
    city: "Qo'qon",
    phone: '+998 77 221 84 84',
    mapUrl: `https://www.google.com/maps/place/40%C2%B031'56.8%22N+70%C2%B057'06.5%22E/@40.532446,70.951813,1743m/data=!3m1!1e3!4m4!3m3!8m2!3d40.532446!4d70.951813?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`,
  },
  {
    city: 'Buxoro',
    phone: '+998 91 403 20 70',
    mapUrl: `https://www.google.com/maps/place/39%C2%B045'12.0%22N+64%C2%B027'51.5%22E/@39.753323,64.464296,1763m/data=!3m1!1e3!4m4!3m3!8m2!3d39.753323!4d64.464296?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`,
  },
  {
    city: `Buxoro Ecobozor`,
    phone: `+998 91 403 20 70`,
    mapUrl: `https://www.google.com/maps/place/39%C2%B043'22.0%22N+64%C2%B029'36.2%22E/@39.722786,64.493387,1764m/data=!3m1!1e3!4m4!3m3!8m2!3d39.722786!4d64.493387?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`,
  },
];

const ContactSection = () => {
  const { t, lang } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <section id="contact" className="py-24 lg:py-32 bg-dark-section relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gold/40 to-transparent" />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/6 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold/4 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="section-label mb-4 block">
              <span className="gold-divider inline-block mr-3 align-middle" />
              {lang === 'uz' ? 'Filiallar' : 'Филиалы'}
              <span className="gold-divider inline-block ml-3 align-middle" />
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {t('contact.title') as string}
            </h2>
            <p className="text-white/55 max-w-lg mx-auto text-sm leading-relaxed">
              {t('contact.subtitle') as string}
            </p>
          </div>

          {/* Location cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {locations.map((location, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-white/8 bg-white/4 hover:bg-white/7 hover:border-gold/25 p-6 transition-all duration-400 overflow-hidden"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Branch badge */}
                <span className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase text-gold bg-gold/10 border border-gold/20 rounded-full px-2.5 py-1 mb-5">
                  {t('contact.branch') as string}
                </span>

                {/* City name */}
                <h3 className="text-lg font-semibold text-white mb-5 min-h-[52px] leading-snug">
                  {location.city}
                </h3>

                {/* Phone */}
                <a
                  href={`tel:${location.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 mb-6 group/phone"
                >
                  <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-white/80 group-hover/phone:text-white transition-colors leading-snug">
                    {location.phone}
                  </span>
                </a>

                {/* Work hours */}
                <div className="flex items-center gap-2 mb-6 text-white/40 text-xs">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'uz' ? 'Dush-Shan: 9:00–19:00' : 'Пн-Сб: 9:00–19:00'}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${location.phone.replace(/\s/g, '')}`}
                    className="flex-1 inline-flex items-center justify-center rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-xs font-semibold py-2.5 transition-all"
                  >
                    {t('contact.callBtn') as string}
                  </a>
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl gradient-gold text-[hsl(var(--dark))] text-xs font-semibold py-2.5 hover:opacity-90 transition-opacity"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {t('contact.mapBtn') as string}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="relative rounded-3xl border border-gold/20 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-10 lg:p-14 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  {t('contact.ctaTitle') as string}
                </h3>
                <p className="text-white/60 max-w-md leading-relaxed text-sm">
                  {t('contact.ctaDesc') as string}
                </p>
              </div>
              <button
                onClick={() => setLeadOpen(true)}
                className="group shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-gold text-[hsl(var(--dark))] font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-gold/20 whitespace-nowrap"
              >
                {t('nav.leaveRequest') as string}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
};

export default ContactSection;
