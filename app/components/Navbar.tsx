"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Menu, X, Globe, Moon, Sun, Phone, Clock } from 'lucide-react';
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
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Mobile menu ochiq bo'lsa scroll blokla
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
      {/* Top Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[60] border-b transition-colors duration-300 ${
          isDark
            ? 'bg-slate-950 text-slate-100 border-slate-800'
            : 'bg-gray-900 text-white border-gray-800'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 h-12 flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-6 md:gap-10">
            <a
              href="tel:+998507110064"
              className={`flex items-center gap-2 transition-colors font-medium ${
                isDark ? 'hover:text-amber-300' : 'hover:text-amber-400'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>+998 50 711 00 64</span>
            </a>
            <div className={`hidden sm:flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
              <Clock className="w-4 h-4" />
              <span>{lang === 'uz' ? 'Dush-Shan: 9:00-19:00' : 'Пн-Сб: 9:00-19:00'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors font-medium ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'uz' ? 'РУ' : 'УЗ'}
            </button>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-1.5 rounded transition-colors ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-800'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed top-12 left-0 right-0 z-[55] transition-all duration-300 border-b-2 ${
          isDark
            ? 'bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-xl'
            : 'bg-white border-gray-100 text-gray-900'
        } ${scrolled ? 'shadow-md' : ''}`}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden">
              <Image src={logo} alt="Musa Doors logo" fill className="object-contain" />
            </div>
            <span className={`font-bold text-lg md:text-xl tracking-tight ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
              Musa <span className="text-amber-600">Doors</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {links.map((link) =>
              link.path.startsWith('/#') ? (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg relative group ${
                    isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-amber-500 w-0 group-hover:w-6 transition-all duration-300 rounded-t-full" />
                </button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all relative group ${
                    isActive(link.path)
                      ? 'text-amber-600'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-amber-500 transition-all duration-300 rounded-t-full ${isActive(link.path) ? 'w-6' : 'w-0 group-hover:w-6'}`} />
                </Link>
              )
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={() => setLeadOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-6 h-10 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md text-sm border-0"
            >
              {lang === 'uz' ? 'Bepul konsultatsiya' : 'Бесплатная консультация'}
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
              }`}
            >
              {mobileOpen ? (
                <X className={`w-6 h-6 ${isDark ? 'text-slate-100' : 'text-gray-900'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isDark ? 'text-slate-100' : 'text-gray-900'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu — to'liq ekran overlay */}
        {mobileOpen && (
          <div
            className={`lg:hidden fixed left-0 right-0 bottom-0 z-[54] overflow-y-auto px-4 py-6 space-y-1 shadow-2xl ${
              isDark ? 'bg-slate-950' : 'bg-white'
            }`}
            style={{ top: '112px' }}
          >
            {links.map((link) =>
              link.path.startsWith('/#') ? (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`block w-full text-left text-base font-semibold py-4 px-4 rounded-xl transition-colors ${
                    isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-amber-50'
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-base font-semibold py-4 px-4 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'text-amber-600 bg-amber-50'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            <div className="pt-4 border-t border-gray-100">
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 h-14 text-base rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 border-0"
                onClick={() => { setMobileOpen(false); setLeadOpen(true); }}
              >
                {lang === 'uz' ? 'Bepul konsultatsiya' : 'Бесплатная консультация'}
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