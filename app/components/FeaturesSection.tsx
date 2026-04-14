import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Truck, Wrench, BadgeDollarSign } from 'lucide-react';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, titleKey: 'features.quality.title', descKey: 'features.quality.desc' },
    { icon: Truck, titleKey: 'features.delivery.title', descKey: 'features.delivery.desc' },
    { icon: Wrench, titleKey: 'features.installation.title', descKey: 'features.installation.desc' },
    { icon: BadgeDollarSign, titleKey: 'features.pricing.title', descKey: 'features.pricing.desc' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-foreground">
          {t('features.title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-xl border border-border bg-card hover:shadow-lg hover:border-gold/30 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center">
                <f.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">{t(f.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
