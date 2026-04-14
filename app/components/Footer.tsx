import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-border bg-card">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-xl font-bold">
          Lux <span className="text-gradient-gold">Doors</span>
        </span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Lux Doors. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
