import type { Metadata } from 'next';
import Image from 'next/image';

import { PlayerLaunchButton } from '@/components/player/player-launch-button';
import { SectionHeading } from '@/components/section-heading';
import {
  appLinks,
  bioTimeline,
  clipTracks,
  ctaBlocks,
  deibisProfile,
  liveTrack,
  serviceCards,
  siteUrl,
  socialLinks,
} from '@/content/site';
import { externalAnchorProps } from '@/lib/external-href';
import { buildPersonSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Deibis Romero | Locutor y Presentador',
  description:
    'Perfil oficial de Deibis Romero en Chile: biografía, servicios de locución, señal en vivo y kit de prensa.',
  alternates: {
    canonical: `${siteUrl}/deibisromero`,
  },
};

export default function DeibisRomeroPage() {
  return (
    <>
      <section className="hero shell hero--compact hero--portrait">
        <div className="hero__content">
          <span className="hero__eyebrow">Perfil profesional</span>
          <h1>{deibisProfile.name}</h1>
          <p className="hero__subhead">{deibisProfile.role}</p>
          <p>{deibisProfile.intro}</p>
          <div className="hero__actions">
            <a className="button button--primary" href={ctaBlocks.booking.href}>
              {ctaBlocks.booking.label}
            </a>
            <a className="button button--secondary" href={ctaBlocks.epk.href}>
              {ctaBlocks.epk.label}
            </a>
          </div>
          <div className="stat-row">
            {deibisProfile.stats.map((item) => (
              <div key={item.label} className="stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__visual">
          <Image
            alt={deibisProfile.name}
            height={750}
            priority
            src={deibisProfile.image}
            width={600}
          />
        </div>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow="Identidad en vivo"
          title="La marca personal se respalda con la señal al aire."
          description="Escucha El Radar Radio desde esta misma página para conectar el perfil profesional con la experiencia real de audiencia."
        />
        <div className="cta-panel card card--feature">
          <div>
            <p className="kicker">Ahora al aire</p>
            <h3>{liveTrack.title}</h3>
            <p>{liveTrack.subtitle}</p>
          </div>
          <PlayerLaunchButton track={liveTrack} />
        </div>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow="Servicios"
          title="De la consulta al booking, con claridad."
          description="Ofertas pensadas para productoras, marcas y medios que buscan voz, conducción o colaboración."
        />
        <div className="three-up">
          {serviceCards.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell content-block two-column">
        <div>
          <SectionHeading
            eyebrow="Biografía"
            title="Una trayectoria que construye autoridad"
            description="Resumen a partir de deibisromero.com/quien-soy, organizado en hitos fáciles de escanear."
          />
          <div className="timeline">
            {bioTimeline.map((item) => (
              <article key={item.year} className="timeline__item">
                <span>{item.year}</span>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Muestras de voz"
            title="Acceso a demos mientras se publica la librería propia"
            description="Las galerías actuales no exponen archivos descargables directos; aquí quedan los caminos oficiales a sonidos y clips."
          />
          <div className="stack">
            {clipTracks.map((track) => (
              <article key={track.id} className="card">
                <p className="kicker">Muestra</p>
                <h3>{track.title}</h3>
                <p>{track.subtitle}</p>
                <PlayerLaunchButton track={track} variant="secondary" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell content-block">
        <div className="cta-panel card card--feature">
          <div>
            <p className="kicker">Kit de prensa</p>
            <h3>{ctaBlocks.epk.title}</h3>
            <p>{ctaBlocks.epk.body}</p>
          </div>
          <a className="button button--primary" href={ctaBlocks.epk.href}>
            {ctaBlocks.epk.label}
          </a>
        </div>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow="Presencia"
          title="Redes y aplicaciones oficiales"
          description="Canales activos para contenido, lives y la app de radio."
        />
        <div className="social-strip card">
          {socialLinks.map((item) => (
            <a key={item.href} {...externalAnchorProps(item.href)}>
              {item.label}
            </a>
          ))}
          {appLinks.map((item) => (
            <a key={item.href} href={item.href} rel="noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
          <a href={`mailto:${deibisProfile.email}`}>{deibisProfile.email}</a>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonSchema()) }}
        type="application/ld+json"
      />
    </>
  );
}
