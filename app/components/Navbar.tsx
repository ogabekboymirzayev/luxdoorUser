"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import LeadFormModal from './LeadFormModal';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const links = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.products'), path: '/products' },
    { label: t('nav.about'), path: '/#about' },
    { label: t('nav.contact'), path: '/#contact' },
  ];

  const scrollToSection = (path: string) => {
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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground">
            <Image src={logo} alt="Musa Doors logo" className="h-9 w-9 object-contain" />
            <span>
              Musa <span className="text-gradient-gold">Doors</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) =>
              link.path.startsWith('/#') ? (
                <button
                  key={link.path}
                  onClick={() => scrollToSection(link.path)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border"
            >
              <Globe className="w-4 h-4" />
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="gold" onClick={() => setLeadOpen(true)}>
              {t('nav.leaveRequest')}
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
              className="text-sm font-medium px-2 py-1 rounded border border-border text-muted-foreground"
            >
              {lang === 'uz' ? 'RU' : 'UZ'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-3">
            {links.map((link) =>
              link.path.startsWith('/#') ? (
                <button
                  key={link.path}
                  onClick={() => scrollToSection(link.path)}
                  className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </Link>
              )
            )}
            <button
              onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileOpen(false); }}
              className="flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Button variant="gold" className="w-full" onClick={() => { setMobileOpen(false); setLeadOpen(true); }}>
              {t('nav.leaveRequest')}
            </Button>
          </div>
        )}
      </nav>
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
};

export default Navbar;
