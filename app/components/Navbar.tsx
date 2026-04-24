"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Menu, X, Globe, Moon, Sun, Phone } from 'lucide-react';
import { useTheme } from 'next-themes';
import LeadFormModal from './LeadFormModal';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.products'), path: '/products' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/#contact' },
  ];

  const handleNav = (path: string) => {
    setMobileOpen(false);
    if (path.startsWith('/#')) {
      const id = path.slice(2);
      if (pathname !== '/') {
        router.push(path);
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path.startsWith('/#')) return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/98 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-background/90 backdrop-blur-md border-b border-border/50'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden">
              <Image src={logo} alt="Musa Doors logo" fill className="object-contain" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Musa <span className="text-gradient-gold">Doors</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) =>
              link.path.startsWith('/#') ? (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-foreground bg-muted font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="tel:+998507110064"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>+998 50 711 00 64</span>
            </a>
            <button
              onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg border border-border hover:border-gold/30"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button
              onClick={() => setLeadOpen(true)}
              className="gradient-gold text-foreground font-semibold text-sm px-5 h-9 rounded-lg border-0 hover:opacity-90 transition-opacity shadow-sm"
            >
              {t('nav.leaveRequest')}
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
              className="text-xs font-semibold px-2 py-1 rounded-md border border-border text-muted-foreground"
            >
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-1">
            {links.map((link) =>
              link.path.startsWith('/#') ? (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-muted transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'text-foreground bg-muted font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-2 space-y-2">
              <a
                href="tel:+998507110064"
                className="flex items-center gap-2 w-full text-sm font-medium text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" />
                +998 50 711 00 64
              </a>
              <button
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileOpen(false); }}
                className="flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2.5 px-3 rounded-lg hover:bg-muted transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <Button
                className="w-full gradient-gold text-foreground font-semibold border-0 hover:opacity-90"
                onClick={() => { setMobileOpen(false); setLeadOpen(true); }}
              >
                {t('nav.leaveRequest')}
              </Button>
            </div>
          </div>
        )}
      </nav>
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
};

export default Navbar;
