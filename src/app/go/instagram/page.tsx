import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { InstagramCurated } from '@/components/instagram-curated';
import { instagramHighlights, instagramProfileUrl, siteUrl } from '@/content/site';

export const metadata: Metadata = {
  title: 'Instagram | @deibisromero',
  description: 'Perfil y selección curada de @deibisromero. Abre Instagram desde aquí si el navegador bloquea el acceso directo.',
  alternates: {
    canonical: `${siteUrl}/go/instagram`,
  },
  robots: { index: false, follow: true },
};

export default function GoInstagramPage() {
  return (
    <main className="go-instagram">
      <section className="shell go-instagram__hero reveal">
        <p className="section-heading__eyebrow">Instagram</p>
        <h1>@deibisromero</h1>
        <p>
          Si tu navegador muestra “dirección no válida” al abrir la app de Instagram, quédate en la
          web: usa el botón de abajo o revisa la selección curada en este portal.
        </p>
        <div className="hero-actions">
          <a
            className="button button--primary"
            href={instagramProfileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Abrir perfil en Instagram
          </a>
          <Link className="button button--secondary" href="/">
            Volver al inicio
          </Link>
        </div>
        <div className="go-instagram__strip">
          {instagramHighlights.slice(0, 3).map((item) => (
            <figure key={item.id} className="go-instagram__shot">
              <Image
                alt={item.title}
                className="go-instagram__shot-img"
                height={220}
                src={item.image}
                width={320}
              />
              <figcaption>{item.tag}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <InstagramCurated
        description="Misma selección editorial del portal. Todo se ve aquí; Instagram es opcional para el feed en vivo."
        directProfileCta
        title="Curado en el portal"
      />
    </main>
  );
}
