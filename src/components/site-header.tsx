"use client";

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function withLang(href: string, lang: 'es' | 'en') {
  return lang === 'en' ? `${href}?lang=en` : href;
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCurrentLang(params.get('lang') === 'en' ? 'en' : 'es');
  }, []);

  const nextLang: 'es' | 'en' = currentLang === 'es' ? 'en' : 'es';

  const navItems = [
    { href: '/', label: currentLang === 'es' ? 'Inicio' : 'Home' },
    { href: '/elradartv', label: currentLang === 'es' ? 'En Vivo' : 'Live' },
    { href: '/deibisromero', label: currentLang === 'es' ? 'Perfil' : 'Profile' },
    { href: '/epk', label: 'EPK' },
  ];

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="site-header__brand" href={withLang('/', currentLang)}>
          <span className="site-header__brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="21" className="brand-mark__ring" />
              <circle cx="24" cy="24" r="13" className="brand-mark__ring" />
              <path className="brand-mark__sweep" d="M24 24 L24 4 A20 20 0 0 1 41 14 Z" />
              <circle cx="31" cy="17" r="2" className="brand-mark__blip" />
              <circle cx="24" cy="24" r="2.4" className="brand-mark__blip" />
            </svg>
          </span>
          <span className="site-header__brand-text">
            <strong>El Radar TV</strong>
            <small>Portal Oficial</small>
          </span>
        </Link>
        <Link className="lang-toggle" href={withLang(pathname || '/', nextLang)} title={currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}>
          <span className="flag flag--cl" aria-hidden="true" title="Español" />
          <span className="flag flag--us" aria-hidden="true" title="English" />
        </Link>
        <button
          aria-label={currentLang === 'es' ? 'Abrir menu' : 'Open menu'}
          className="site-header__menu-button"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <nav className={`site-header__nav ${isOpen ? 'site-header__nav--open' : ''}`} aria-label="Navegacion principal">
          {navItems.map((item) => (
            <Link key={item.href} href={withLang(item.href, currentLang)} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
