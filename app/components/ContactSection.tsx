"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import LeadFormModal from './LeadFormModal';
import { Button } from '../components/ui/button';

const locations = [
  {
    city: 'Qo\'qon',
    phone: '+998 97 221 84 84',
    mapUrl: `https://www.google.com/maps/place/40%C2%B031'56.8%22N+70%C2%B057'06.5%22E/@40.532446,70.951813,1743m/data=!3m1!1e3!4m4!3m3!8m2!3d40.532446!4d70.951813?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`
    // mapUrl: 'https://www.google.com/maps/place/40%C2%B033\'26.8%22N+70%C2%B056\'18.0%22E/@40.557456,70.938343,16z/data=!4m4!3m3!8m2!3d40.557456!4d70.938343?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    city: 'Toshkent',
    phone: '+998 90 711 00 64',
    mapUrl: `https://www.google.com/maps/place/40%C2%B031'56.8%22N+70%C2%B057'06.5%22E/@40.532446,70.951813,1743m/data=!3m1!1e3!4m4!3m3!8m2!3d40.532446!4d70.951813?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D`
    // mapUrl: 'https://www.google.com/maps/place/41%C2%B011\'58.1%22N+69%C2%B014\'16.2%22E/@41.199473,69.2017921,13z/data=!4m4!3m3!8m2!3d41.199473!4d69.237841?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D',
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
  const { t } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <section id="contact" className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-foreground">
            {t('contact.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locations.map((location, index) => (
              <div key={index} className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{location.city}</h3>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 text-gold" />
                  <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="text-lg font-medium text-foreground hover:text-gold transition-colors">
                    {location.phone}
                  </a>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="w-5 h-5 text-gold" />
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-muted-foreground hover:text-gold transition-colors"
                  >
                    Joylashuv
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
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
