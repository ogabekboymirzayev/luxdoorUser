import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-border bg-card">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="Musa Doors logo" className="h-8 w-8 object-contain" />
          <span className="font-display text-xl font-bold">
            Musa <span className="text-gradient-gold">Doors</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Musa Doors. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
