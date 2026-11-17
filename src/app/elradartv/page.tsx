import type { Metadata } from 'next';
import Image from 'next/image';

import { PlayerLaunchButton } from '@/components/player/player-launch-button';
import { RadarVector } from '@/components/radar-vector';
import { SectionHeading } from '@/components/section-heading';
import {
  clipTracks,
  ctaBlocks,
  deibisProfile,
  liveTrack,
  radarProgramming,
  siteUrl,
  socialLinks,
  watchLiveUrl,
} from '@/content/site';
import { buildBroadcastSchema, buildOrganizationSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'El Radar TV | En Vivo',
  description:
    'El Radar TV y Radio en vivo: escucha la señal, abre la transmisión de video y sigue clips y programación.',
  alternates: {
    canonical: `${siteUrl}/elradartv`,
  },
};

export default function ElRadarTvPage() {
  return (
    <>
      <section className="hero shell hero--compact hero--portrait">
        <div className="hero__content">
          <span className="hero__eyebrow">Medio en vivo</span>
          <h1>El Radar TV</h1>
          <p className="hero__subhead">Dinámico, en tiempo real y pensado para acceso inmediato.</p>
          <p>
            La experiencia de medio lidera con audio en vivo, entrada a TV, superficie de clips y
            espacio para programación, entrevistas y comunidad.
          </p>
          <div className="hero__actions">
            <PlayerLaunchButton track={liveTrack} />
            <a className="button button--secondary" href={watchLiveUrl} rel="noreferrer" target="_blank">
              Ver TV En Vivo
            </a>
          </div>
        </div>
        <div className="hero__visual hero__visual--stack">
          <RadarVector className="hero__radar hero__radar--media" />
          <Image
            alt="Deibis Romero — El Radar TV"
            height={750}
            priority
            src={deibisProfile.image}
            width={600}
          />
        </div>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow="Programación"
          title="El motor de contenido necesita estructura, no solo enlaces."
          description="Tarjetas reutilizables listas para mapear a un CMS cuando la publicación se active."
        />
        <div className="three-up">
          {radarProgramming.map((item) => (
            <article key={item.title} className="card card--accent-soft">
              <p className="kicker">Formato</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell content-block two-column">
        <div>
          <SectionHeading
            eyebrow="Reproductor"
            title="La reproducción global se mantiene entre páginas"
            description="La señal de radio usa el stream MP3 público; el video HLS queda como acción directa de ver en vivo."
          />
          <div className="stack">
            <article className="card">
              <p className="kicker">Audio en vivo</p>
              <h3>{liveTrack.title}</h3>
              <p>{liveTrack.subtitle}</p>
              <PlayerLaunchButton track={liveTrack} variant="secondary" />
            </article>
            <article className="card">
              <p className="kicker">TV en vivo</p>
              <h3>Señal de video</h3>
              <p>Abre la transmisión HLS de El Radar TV en un toque.</p>
              <a
                className="button button--secondary"
                href={ctaBlocks.stream.href}
                rel="noreferrer"
                target="_blank"
              >
                {ctaBlocks.stream.label}
              </a>
            </article>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Clips"
            title="Galería honesta mientras se exportan demos propios"
            description="Sin fingir archivos que aún no existen: enlaces a galerías y canal oficiales."
          />
          <div className="stack">
            {clipTracks.map((track) => (
              <article key={track.id} className="card">
                <p className="kicker">Clip</p>
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
            <p className="kicker">Comunidad</p>
            <h3>Sigue la señal en redes mientras crece la capa social del portal.</h3>
            <p>
              Instagram, TikTok, YouTube y el resto de canales oficiales concentran clips, lives y
              anuncios del día a día.
            </p>
          </div>
          <div className="social-strip social-strip--compact">
            {socialLinks.map((item) => (
              <a key={item.href} href={item.href} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([buildOrganizationSchema(), buildBroadcastSchema()]),
        }}
        type="application/ld+json"
      />
    </>
  );
}
