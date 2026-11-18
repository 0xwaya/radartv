import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { InstagramCurated } from '@/components/instagram-curated';
import {
  elRadarInstagramUrl,
  instagramHighlights,
  instagramProfileUrl,
  siteUrl,
} from '@/content/site';

export const metadata: Metadata = {
  title: 'Instagram | El Radar TV',
  description:
    'Puente a los perfiles oficiales de Instagram (@deibisromero y @elradar_oficial). Abre Instagram desde aquí si el navegador bloquea el acceso directo.',
  alternates: {
    canonical: `${siteUrl}/go/instagram`,
  },
  robots: { index: false, follow: true },
};

type GoInstagramPageProps = {
  searchParams?: Promise<{
    profile?: string;
  }>;
};

const profiles = {
  deibisromero: {
    handle: '@deibisromero',
    href: instagramProfileUrl,
    blurb:
      'Perfil personal de Deibis Romero: clips, bastidores y el día a día de la señal.',
  },
  elradar_oficial: {
    handle: '@elradar_oficial',
    href: elRadarInstagramUrl,
    blurb: 'Cuenta del medio El Radar TV: emisión, comunidad y novedades de la estación.',
  },
} as const;

type ProfileKey = keyof typeof profiles;

export default async function GoInstagramPage({ searchParams }: GoInstagramPageProps) {
  const resolved = (await searchParams) ?? {};
  const requested = resolved.profile?.toLowerCase();
  const activeKey: ProfileKey =
    requested && requested in profiles ? (requested as ProfileKey) : 'deibisromero';
  const active = profiles[activeKey];

  return (
    <main className="go-instagram">
      <section className="shell go-instagram__hero reveal">
        <p className="section-heading__eyebrow">Instagram</p>
        <h1>{active.handle}</h1>
        <p>
          {active.blurb} Si tu navegador muestra “dirección no válida” al abrir la app de
          Instagram, quédate en la web: usa el botón de abajo o revisa la selección curada en este
          portal.
        </p>
        <div className="hero-actions">
          <a
            className="button button--primary"
            href={active.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            Abrir {active.handle} en Instagram
          </a>
          <Link className="button button--secondary" href="/">
            Volver al inicio
          </Link>
        </div>
        <div className="hero-actions" style={{ marginTop: '0.75rem' }}>
          {(Object.keys(profiles) as ProfileKey[])
            .filter((key) => key !== activeKey)
            .map((key) => (
              <Link
                key={key}
                className="button button--secondary"
                href={`/go/instagram?profile=${key}`}
              >
                Ir a {profiles[key].handle}
              </Link>
            ))}
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
