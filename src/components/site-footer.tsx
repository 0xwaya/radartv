import Image from 'next/image';
import Link from 'next/link';

import { appLinks, deibisProfile, officialSites, socialLinks, whatsappLink } from '@/content/site';
import { externalAnchorProps, instagramBridgePath } from '@/lib/external-href';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell site-footer__shell">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <p className="site-footer__mark">El Radar TV</p>
            <p className="site-footer__desc">
              Portal oficial de Deibis Romero en Chile: TV y radio en vivo, perfil profesional y
              contacto directo. Sincronizado con deibisromero.com y elradartv.cl.
            </p>
            <Link className="site-footer__ig" href={instagramBridgePath}>
              @deibisromero
            </Link>
          </div>

          <div className="site-footer__columns">
            <div>
              <p className="site-footer__title">Explorar</p>
              <nav className="site-footer__links" aria-label="Navegación">
                <Link href="/">Inicio</Link>
                <Link href="/elradartv">En Vivo</Link>
                <Link href="/deibisromero">Perfil</Link>
                <Link href="/epk">EPK</Link>
                <Link href="/elradartv#tv-en-vivo">TV integrada</Link>
              </nav>
            </div>

            <div>
              <p className="site-footer__title">Contacto</p>
              <nav className="site-footer__links" aria-label="Contacto">
                <a href={whatsappLink} rel="noopener noreferrer" target="_blank">
                  WhatsApp
                </a>
                <a href={`mailto:${deibisProfile.email}`}>{deibisProfile.email}</a>
                <span className="site-footer__muted">{deibisProfile.location}</span>
              </nav>
            </div>

            <div>
              <p className="site-footer__title">Redes</p>
              <nav className="site-footer__links" aria-label="Redes sociales">
                {socialLinks.map((item) => (
                  <a key={item.href} {...externalAnchorProps(item.href)}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <p className="site-footer__title">Sitios y apps</p>
              <nav className="site-footer__links" aria-label="Sitios y aplicaciones">
                {officialSites.map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ))}
                {appLinks.map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="site-footer__bar">
          <p className="site-footer__legal">
            © {year} El Radar TV · Deibis Romero. Todos los derechos reservados.
          </p>
          <a
            className="wayalabs-sig"
            href="https://wayalabs.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Diseñado por WayaLabs"
          >
            <span className="wayalabs-sig__label">Diseñado por</span>
            <span className="wayalabs-sig__brand">
              <Image
                alt=""
                className="wayalabs-sig__mark"
                height={28}
                src="/images/wayalabs-mark-nav.png"
                width={44}
              />
              <span className="wayalabs-sig__name">WayaLabs</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
