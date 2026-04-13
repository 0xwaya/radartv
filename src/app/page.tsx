import Image from 'next/image';
import Link from 'next/link';

import { PlayerLaunchButton } from '@/components/player/player-launch-button';
import { RadarVector } from '@/components/radar-vector';
import { SectionHeading } from '@/components/section-heading';
import {
  brandSummary,
  ctaBlocks,
  liveTrack,
  socialLinks,
  watchLiveUrl,
  whatsappLink,
  youtubeStreamsUrl,
} from '@/content/site';
import { buildOrganizationSchema, buildPersonSchema } from '@/lib/seo/schema';
import { getTopStreams } from '@/lib/youtube-streams';

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const lang = resolvedSearchParams.lang === 'en' ? 'en' : 'es';
  const langSuffix = lang === 'en' ? '?lang=en' : '';

  const t = {
    heroEyebrow: lang === 'es' ? 'Portal Oficial · Chile' : 'Official Portal · Chile',
    heroTitle: lang === 'es' ? 'TV y Radio en vivo, sin rodeos.' : 'Live TV and Radio, no friction.',
    heroBody:
      lang === 'es'
        ? brandSummary.body
        : 'This portal prioritizes live TV and Radio for Chilean audiences with direct access to contact and social channels.',
    profileBtn: lang === 'es' ? 'Perfil de Deibis' : 'Deibis Profile',
    mediaBtn: 'El Radar TV',
    heroKicker: lang === 'es' ? 'En vivo primero' : 'Live first',
    heroSub: lang === 'es' ? 'Acceso rapido para escuchar y ver.' : 'Quick access to watch and listen.',
    heroDesc:
      lang === 'es'
        ? 'Interfaz simplificada para priorizar reproduccion en directo y contacto inmediato.'
        : 'Simplified interface focused on live playback and instant contact.',
    radioCardDesc:
      lang === 'es'
        ? 'Escucha la senal principal 24/7 con el reproductor integrado.'
        : 'Listen to the main 24/7 feed with the integrated player.',
    tvCardDesc:
      lang === 'es'
        ? 'Abre la transmision de video en directo en un toque.'
        : 'Open the live video feed in one tap.',
    contactCardTitle: lang === 'es' ? 'Habla con Deibis' : 'Talk to Deibis',
    contactCardDesc:
      lang === 'es'
        ? 'Consulta por WhatsApp para colaboraciones, entrevistas o contrataciones.'
        : 'Reach out by WhatsApp for collaborations, interviews, or bookings.',
    openWhatsapp: lang === 'es' ? 'Abrir WhatsApp' : 'Open WhatsApp',
    contactSectionEyebrow: lang === 'es' ? 'Contacto rapido' : 'Quick Contact',
    contactSectionTitle:
      lang === 'es' ? '¿Quieres hablar con Deibis ahora?' : 'Want to talk to Deibis right now?',
    contactSectionDesc:
      lang === 'es'
        ? 'Escribe por WhatsApp para contacto directo con Deibis y su equipo.'
        : 'Reach out on WhatsApp for direct contact with Deibis and his team.',
    channelRecommended: lang === 'es' ? 'Canal recomendado' : 'Recommended channel',
    whatsappDirect: lang === 'es' ? 'WhatsApp directo' : 'Direct WhatsApp',
    whatsappHint:
      lang === 'es'
        ? 'Canal recomendado para colaboraciones, entrevistas, eventos y contrataciones.'
        : 'Recommended channel for collaborations, interviews, events, and bookings.',
    streamsEyebrow: lang === 'es' ? 'Streams destacados' : 'Top Streams',
    streamsTitle:
      lang === 'es'
        ? 'Panel de transmisiones destacadas'
        : 'Featured streams dashboard',
    streamsDesc:
      lang === 'es'
        ? 'Ultimos directos y emisiones del canal oficial de Deibis en YouTube.'
        : 'Latest broadcasts from Deibis official YouTube channel.',
    openStream: lang === 'es' ? 'Abrir Stream' : 'Open Stream',
    openStreamsGallery:
      lang === 'es' ? 'Ver todos los streams' : 'View full stream gallery',
    socialEyebrow: lang === 'es' ? 'Redes' : 'Social',
    socialTitle:
      lang === 'es'
        ? 'Sigue la señal en plataformas sociales'
        : 'Follow the signal across social platforms',
    socialDesc:
      lang === 'es'
        ? 'Canales oficiales para contenido, clips y anuncios.'
        : 'Official channels for content, clips, and updates.',
  };

  const schemas = [buildPersonSchema(), buildOrganizationSchema()];
  const topStreams = await getTopStreams(6);

  return (
    <>
      <section className="hero shell">
        <div className="hero__content">
          <span className="hero__eyebrow">{t.heroEyebrow}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
          <div className="hero__actions">
            <PlayerLaunchButton track={liveTrack} />
            <a className="button button--secondary" href={watchLiveUrl} rel="noreferrer" target="_blank">
              {ctaBlocks.stream.label}
            </a>
          </div>
          <div className="hero__actions">
            <Link className="button button--secondary" href={`/deibisromero${langSuffix}`}>
              {t.profileBtn}
            </Link>
            <Link className="button button--secondary" href={`/elradartv${langSuffix}`}>
              {t.mediaBtn}
            </Link>
          </div>
        </div>
        <div className="hero__visual card card--feature">
          <div className="hero__visual-copy">
            <p className="kicker">{t.heroKicker}</p>
            <h2>{t.heroSub}</h2>
            <p>{t.heroDesc}</p>
          </div>
          <RadarVector className="hero__radar" />
        </div>
      </section>

      <section className="shell section-grid">
        <article className="card card--brand">
          <span className="pill">RADIO</span>
          <h3>El Radar Radio En Vivo</h3>
          <p>{t.radioCardDesc}</p>
          <PlayerLaunchButton track={liveTrack} variant="secondary" />
        </article>
        <article className="card card--brand card--accent">
          <span className="pill">TV</span>
          <h3>El Radar TV En Vivo</h3>
          <p>{t.tvCardDesc}</p>
          <a className="button button--secondary" href={watchLiveUrl} rel="noreferrer" target="_blank">
            Ver TV En Vivo
          </a>
        </article>
        <article className="card card--brand">
          <span className="pill">CONTACTO</span>
          <h3>{t.contactCardTitle}</h3>
          <p>{t.contactCardDesc}</p>
          <a className="button button--secondary" href={whatsappLink} rel="noreferrer" target="_blank">
            {t.openWhatsapp}
          </a>
        </article>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow={t.contactSectionEyebrow}
          title={t.contactSectionTitle}
          description={t.contactSectionDesc}
        />
        <div className="cta-panel card card--feature">
          <div>
            <p className="kicker">{t.channelRecommended}</p>
            <h3>{t.whatsappDirect}</h3>
            <p>{t.whatsappHint}</p>
          </div>
          <a className="button button--primary" href={whatsappLink} rel="noreferrer" target="_blank">
            {t.openWhatsapp}
          </a>
        </div>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow={t.streamsEyebrow}
          title={t.streamsTitle}
          description={t.streamsDesc}
        />
        <div className="streams-grid">
          {topStreams.map((stream) => (
            <article key={stream.id} className="card stream-card">
              <a
                aria-label={`Abrir stream: ${stream.title}`}
                href={stream.url}
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  alt={stream.title}
                  className="stream-card__image"
                  height={270}
                  src={stream.thumbnail}
                  width={480}
                />
              </a>
              <div className="stream-card__meta">
                <p className="kicker">YouTube Live</p>
                <h3>{stream.title}</h3>
                <a className="button button--secondary" href={stream.url} rel="noreferrer" target="_blank">
                  {t.openStream}
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="hero__actions">
          <a className="button button--secondary" href={youtubeStreamsUrl} rel="noreferrer" target="_blank">
            {t.openStreamsGallery}
          </a>
        </div>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow={t.socialEyebrow}
          title={t.socialTitle}
          description={t.socialDesc}
        />
        <div className="social-strip card">
          {socialLinks.map((item) => (
            <a key={item.href} href={item.href} rel="noreferrer" target="_blank">
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        type="application/ld+json"
      />
    </>
  );
}
