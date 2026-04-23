"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import LeadFormModal from './LeadFormModal';
import { Button } from '../components/ui/button';

const locations = [
  {
    city: 'Toshkent',
    phone: '+99850 711 00 64',
    mapUrl: `https://www.google.com/maps/place/40%C2%B031'56.8%22N+70%C2%B057'06.5%22E/@40.532446,70.951813,1743m/data=!3m1!1e3!4m4!3m3!8m2!3d40.532446!4d70.951813?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`
    // mapUrl: 'https://www.google.com/maps/place/41%C2%B011\'58.1%22N+69%C2%B014\'16.2%22E/@41.199473,69.2017921,13z/data=!4m4!3m3!8m2!3d41.199473!4d69.237841?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    city: 'Qo\'qon',
    phone: '+998 77 221 84 84',
    mapUrl: `https://www.google.com/maps/place/40%C2%B031'56.8%22N+70%C2%B057'06.5%22E/@40.532446,70.951813,1743m/data=!3m1!1e3!4m4!3m3!8m2!3d40.532446!4d70.951813?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`
    // mapUrl: 'https://www.google.com/maps/place/40%C2%B033\'26.8%22N+70%C2%B056\'18.0%22E/@40.557456,70.938343,16z/data=!4m4!3m3!8m2!3d40.557456!4d70.938343?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    city: 'Buxoro',
    phone: '+998 91 403 20 70',
    mapUrl: `https://www.google.com/maps/place/39%C2%B045'12.0%22N+64%C2%B027'51.5%22E/@39.753323,64.464296,1763m/data=!3m1!1e3!4m4!3m3!8m2!3d39.753323!4d64.464296?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`
    // mapUrl: 'https://www.google.com/maps/place/39%C2%B045\'12.0%22N+64%C2%B027\'51.5%22E/@39.7756249,64.42537,12.58z/data=!4m4!3m3!8m2!3d39.753323!4d64.464296?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    city: `Buxoro ecobozor filiali`,
    phone: `+998 91 403 20 70`,
    mapUrl: `https://www.google.com/maps/place/39%C2%B043'22.0%22N+64%C2%B029'36.2%22E/@39.722786,64.493387,1764m/data=!3m1!1e3!4m4!3m3!8m2!3d39.722786!4d64.493387?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`
  }
];

const ContactSection = () => {
  const { t, lang } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <section id="contact" className="relative py-20 lg:py-28 bg-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-gold/15 blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4 text-foreground relative z-10">
            {t('contact.title')}
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-14 relative z-10">
            {lang === 'uz'
              ? 'Filiallarimizga qo\'ng\'iroq qiling yoki xaritada manzilni oching. Menejerlarimiz sizga mos variantni tez topib beradi.'
              : 'Свяжитесь с ближайшим филиалом или откройте локацию на карте. Наши менеджеры быстро подберут нужный вариант.'}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {locations.map((location, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 mb-4">
                  {lang === 'uz' ? 'Filial' : 'Филиал'}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4 min-h-[56px]">{location.city}</h3>

                <a
                  href={`tel:${location.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-base font-medium text-foreground hover:text-gold transition-colors mb-4"
                >
                  <Phone className="w-5 h-5 text-gold shrink-0" />
                  <span>
                    {location.phone}
                  </span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${location.phone.replace(/\s/g, '')}`}
                    className="flex-1 inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {lang === 'uz' ? 'Qo\'ng\'iroq' : 'Позвонить'}
                  </a>
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <MapPin className="w-4 h-4" />
                    {lang === 'uz' ? 'Xarita' : 'Карта'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 relative z-10">
            <Button variant="gold" size="lg" onClick={() => setLeadOpen(true)}>
              {t('nav.leaveRequest')}
            </Button>
          </div>
        </div>
      </section>
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
};

export default ContactSection;
