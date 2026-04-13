import Link from 'next/link';

import { socialLinks } from '@/content/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <p className="site-footer__title">Portal oficial para Chile</p>
          <p className="site-footer__desc">TV y radio en vivo con acceso directo a contacto, colaboraciones y canales sociales.</p>
        </div>
        <div>
          <p className="site-footer__title">Navegación</p>
          <nav className="site-footer__links" aria-label="Navegación">
            <Link href="/">Inicio</Link>
            <Link href="/elradartv">En Vivo</Link>
            <Link href="/deibisromero">Perfil</Link>
            <Link href="/epk">EPK</Link>
          </nav>
        </div>
        <div>
          <p className="site-footer__title">Redes</p>
          <nav className="site-footer__links" aria-label="Redes sociales">
            {socialLinks.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="site-footer__copyright">
        <span>© {new Date().getFullYear()} El Radar TV. Todos los derechos reservados. Built by </span>
        <a
          href="https://wayalabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="wayalabs-pop"
        >
          WayaLabs
        </a>
      </div>
    </footer>
  );
}
