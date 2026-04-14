import { useLanguage } from '../contexts/LanguageContext';
import { Award, Users, Package } from 'lucide-react';

const AboutSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Award, label: t('about.experience') },
    { icon: Users, label: t('about.clients') },
    { icon: Package, label: t('about.products') },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-8">
          {t('about.title')}
        </h2>
        <p className="text-center text-lg max-w-2xl mx-auto mb-16 opacity-80 leading-relaxed">
          {t('about.description')}
        </p>
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
                <s.icon className="w-8 h-8 text-foreground" />
              </div>
              <p className="text-lg font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
