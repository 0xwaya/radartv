"use client";

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/elradartv', label: 'En Vivo' },
  { href: '/deibisromero', label: 'Perfil' },
  { href: '/epk', label: 'EPK' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="site-header__brand" href="/">
          <span className="site-header__brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="21" className="brand-mark__ring" />
              <circle cx="24" cy="24" r="13" className="brand-mark__ring" />
              <path className="brand-mark__sweep" d="M24 24 L24 4 A20 20 0 0 1 41 14 Z" />
              <circle cx="31" cy="17" r="2" className="brand-mark__blip" />
              <circle cx="24" cy="24" r="2.4" className="brand-mark__blip" />
            </svg>
          </span>
          <span>El Radar TV</span>
          <small>Portal Oficial</small>
        </Link>
        <button
          aria-label="Abrir menu"
          className="site-header__menu-button"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <nav className={`site-header__nav ${isOpen ? 'site-header__nav--open' : ''}`} aria-label="Navegacion principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
