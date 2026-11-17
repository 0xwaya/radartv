import Image from 'next/image';
import Link from 'next/link';

import { InstagramCurated } from '@/components/instagram-curated';
import { LiveTvPlayer, WatchLiveButton } from '@/components/player/live-tv-player';
import { PlayerLaunchButton } from '@/components/player/player-launch-button';
import { RadarVector } from '@/components/radar-vector';
import { SectionHeading } from '@/components/section-heading';
import {
  brandSummary,
  deibisProfile,
  liveTrack,
  socialLinks,
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
    brand: 'El Radar TV',
    liveBadge: lang === 'es' ? 'En vivo' : 'Live',
    heroEyebrow: lang === 'es' ? 'Portal oficial · Chile' : 'Official portal · Chile',
    heroTitle: lang === 'es' ? 'TV y Radio en vivo, sin rodeos.' : 'Live TV and Radio, no friction.',
    heroBody:
      lang === 'es'
        ? brandSummary.body
        : 'This portal prioritizes live TV and Radio for Chilean audiences with direct access to contact and social channels.',
    profileBtn: lang === 'es' ? 'Perfil de Deibis' : 'Deibis Profile',
    mediaBtn: 'El Radar TV',
    radioLabel: lang === 'es' ? 'Radio 24/7' : 'Radio 24/7',
    radioCardDesc:
      lang === 'es'
        ? 'Señal principal con el reproductor integrado.'
        : 'Main feed with the integrated player.',
    tvCardDesc:
      lang === 'es' ? 'Transmisión de video en un toque.' : 'Video stream in one tap.',
    watchTv: lang === 'es' ? 'Ver TV En Vivo' : 'Watch Live TV',
    contactCardTitle: lang === 'es' ? 'Habla con Deibis' : 'Talk to Deibis',
    contactCardDesc:
      lang === 'es'
        ? 'Colaboraciones, entrevistas o contrataciones.'
        : 'Collaborations, interviews, or bookings.',
    openWhatsapp: lang === 'es' ? 'Abrir WhatsApp' : 'Open WhatsApp',
    contactSectionTitle:
      lang === 'es' ? '¿Quieres hablar con Deibis ahora?' : 'Want to talk to Deibis right now?',
    contactSectionDesc:
      lang === 'es'
        ? 'WhatsApp directo para colaboraciones, eventos y contrataciones.'
        : 'Direct WhatsApp for collaborations, events, and bookings.',
    streamsEyebrow: lang === 'es' ? 'Emisiones' : 'Broadcasts',
    streamsTitle:
      lang === 'es' ? 'Últimas transmisiones destacadas' : 'Latest featured streams',
    streamsDesc:
      lang === 'es'
        ? 'Directos y emisiones del canal oficial de Deibis en YouTube.'
        : 'Latest broadcasts from Deibis’ official YouTube channel.',
    openStream: lang === 'es' ? 'Abrir stream' : 'Open Stream',
    openStreamsGallery:
      lang === 'es' ? 'Ver todos los streams' : 'View full stream gallery',
    socialEyebrow: lang === 'es' ? 'Redes' : 'Social',
    socialTitle:
      lang === 'es' ? 'Sigue la señal' : 'Follow the signal',
    socialDesc:
      lang === 'es'
        ? 'Canales oficiales para contenido, clips y anuncios.'
        : 'Official channels for content, clips, and updates.',
    explore: lang === 'es' ? 'Explorar' : 'Explore',
  };

  const schemas = [buildPersonSchema(), buildOrganizationSchema()];
  const topStreams = await getTopStreams(6);

  return (
    <>
      <section className="hero-stage">
        <div className="hero-stage__atmosphere" aria-hidden="true">
          <RadarVector className="hero-stage__radar" />
          <div className="hero-stage__portrait">
            <Image
              alt=""
              className="hero-stage__portrait-img"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
              src={deibisProfile.heroImage}
            />
          </div>
        </div>

        <div className="shell hero-stage__content reveal">
          <div className="hero-stage__live">
            <span className="live-pulse" aria-hidden="true" />
            <span>{t.liveBadge}</span>
          </div>
          <p className="hero-stage__brand">{t.brand}</p>
          <p className="hero-stage__eyebrow">{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-stage__lede">{t.heroBody}</p>
          <div className="hero__actions">
            <PlayerLaunchButton track={liveTrack} />
            <WatchLiveButton />
          </div>
          <div className="hero-stage__links">
            <Link href={`/deibisromero${langSuffix}`}>{t.profileBtn}</Link>
            <Link href={`/elradartv${langSuffix}`}>{t.mediaBtn}</Link>
          </div>
        </div>
      </section>

      <section className="shell action-rail reveal" aria-label={t.explore}>
        <article className="action-rail__item">
          <span className="pill">Radio</span>
          <h2>{t.radioLabel}</h2>
          <p>{t.radioCardDesc}</p>
          <PlayerLaunchButton track={liveTrack} variant="secondary" />
        </article>
        <article className="action-rail__item action-rail__item--accent">
          <span className="pill">TV</span>
          <h2>El Radar TV</h2>
          <p>{t.tvCardDesc}</p>
          <WatchLiveButton label={t.watchTv} />
        </article>
        <article className="action-rail__item">
          <span className="pill">Contacto</span>
          <h2>{t.contactCardTitle}</h2>
          <p>{t.contactCardDesc}</p>
          <a className="button button--secondary" href={whatsappLink} rel="noreferrer" target="_blank">
            {t.openWhatsapp}
          </a>
        </article>
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow="TV"
          title={lang === 'es' ? 'Mira la señal en el portal' : 'Watch the feed in the portal'}
          description={
            lang === 'es'
              ? 'Reproductor HLS integrado con respaldo externo si la señal falla.'
              : 'Embedded HLS player with an external fallback if the feed fails.'
          }
        />
        <LiveTvPlayer />
      </section>

      <section className="shell content-block">
        <SectionHeading
          eyebrow={t.streamsEyebrow}
          title={t.streamsTitle}
          description={t.streamsDesc}
        />
        <div className="streams-grid">
          {topStreams.map((stream) => (
            <article key={stream.id} className="stream-tile">
              <a
                aria-label={`${t.openStream}: ${stream.title}`}
                className="stream-tile__media"
                href={stream.url}
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  alt={stream.title}
                  className="stream-tile__image"
                  height={270}
                  src={stream.thumbnail}
                  width={480}
                />
                <span className="stream-tile__shade" />
              </a>
              <div className="stream-tile__meta">
                <p className="kicker">YouTube</p>
                <h3>{stream.title}</h3>
                <a className="text-link" href={stream.url} rel="noreferrer" target="_blank">
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

      <InstagramCurated
        description={
          lang === 'es'
            ? 'Selección editorial de temas del universo @deibisromero: actualidad, entrevistas, territorio y bastidores. Instagram exige login para embeds en vivo; aquí va curado y listo para abrir el feed.'
            : 'Editorial selection from the @deibisromero universe: news, interviews, local stories, and behind the scenes. Open Instagram for the live feed.'
        }
        title={lang === 'es' ? 'Curado desde @deibisromero' : 'Curated from @deibisromero'}
      />

      <section className="shell content-block content-block--finale">
        <div className="finale-panel">
          <div>
            <p className="kicker">{t.socialEyebrow}</p>
            <h2>{t.contactSectionTitle}</h2>
            <p>{t.contactSectionDesc}</p>
            <a className="button button--primary" href={whatsappLink} rel="noreferrer" target="_blank">
              {t.openWhatsapp}
            </a>
          </div>
          <div>
            <p className="kicker">{t.socialTitle}</p>
            <p className="finale-panel__hint">{t.socialDesc}</p>
            <div className="social-strip social-strip--bare">
              {socialLinks.map((item) => (
                <a key={item.href} href={item.href} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        type="application/ld+json"
      />
    </>
  );
}
