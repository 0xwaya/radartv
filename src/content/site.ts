export type Track = {
  id: string;
  title: string;
  subtitle: string;
  url?: string;
  kind: 'live' | 'clip';
  externalUrl?: string;
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://radartv.vercel.app';

const configuredWhatsAppNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '56991248558'
).replace(/\D/g, '');

export const youtubeStreamsUrl = 'https://www.youtube.com/@deibisromerolocutor/streams';

export const whatsappContact = {
  number: configuredWhatsAppNumber,
  message: 'Hola Deibis, te escribo desde el portal para consultar por una colaboración.',
};

export const whatsappLink = configuredWhatsAppNumber
  ? `https://wa.me/${configuredWhatsAppNumber}?text=${encodeURIComponent(whatsappContact.message)}`
  : `mailto:producciones@deibisromero.com?subject=${encodeURIComponent('Contacto desde portal')}`;

/** Canonical web profile (trailing slash). Avoids app-scheme redirects that Opera rejects as “invalid address”. */
export const instagramProfileUrl = 'https://www.instagram.com/deibisromero/';

/** Station / medio Instagram referenced alongside El Radar TV. */
export const elRadarInstagramUrl = 'https://www.instagram.com/elradar_oficial/';

/** Twitch channel for El Radar TV (renamed from deibisromero → elradartv). */
export const twitchChannelUrl = 'https://www.twitch.tv/elradartv';

/** Legacy sites that still host radio/TV players and profile pages. */
export const officialSites = [
  {
    label: 'deibisromero.com',
    href: 'https://www.deibisromero.com/',
  },
  {
    label: 'elradartv.cl',
    href: 'https://elradartv.cl/',
  },
];

export const socialLinks = [
  {
    label: 'Instagram',
    href: instagramProfileUrl,
  },
  {
    label: 'Instagram El Radar',
    href: elRadarInstagramUrl,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@deibisromerolocutor',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/deibis.romero.3',
  },
  {
    label: 'X',
    href: 'https://x.com/deibisromero',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@deibisromerolocutor',
  },
  {
    label: 'Twitch',
    href: twitchChannelUrl,
  },
];

export const appLinks = [
  {
    label: 'App Deibis Romero',
    href: 'https://play.google.com/store/apps/details?id=deibisromero.lorini',
  },
  {
    label: 'WikiPlay',
    href: 'https://play.google.com/store/apps/details?id=app.wikiplayapp',
  },
];

/** Curated highlights aligned with @deibisromero themes (IG is login-walled; visuals cached locally). */
export const instagramHighlights = [
  {
    id: 'entrevista',
    tag: 'Entrevista',
    title: 'Estudio abierto',
    caption: 'Deibis al aire en Noticias al Día: micrófono, invitados y el ritmo del set de El Radar.',
    image: '/images/curated/OtQoAX_udno.jpg',
    href: instagramProfileUrl,
  },
  {
    id: 'noticias',
    tag: 'Actualidad',
    title: 'Cobertura en terreno',
    caption: 'Señal en vivo desde el lugar de los hechos — el pulso diario que también vive en el feed.',
    image: '/images/curated/P-azZUZCTrk.jpg',
    href: instagramProfileUrl,
  },
  {
    id: 'territorio',
    tag: 'Chile',
    title: 'Historias del Biobío',
    caption: 'Mercados, territorio y reportajes locales desde Concepción y alrededores.',
    image: '/images/curated/Kh1x9NT2Ln0.jpg',
    href: instagramProfileUrl,
  },
  {
    id: 'behind',
    tag: 'Bastidores',
    title: 'Fuera de micrófono',
    caption: 'Comunidad y vida cotidiana — lo que Instagram muestra antes que el portal.',
    image: '/images/curated/ims3HTrkG3k.jpg',
    href: instagramProfileUrl,
  },
];

/**
 * Three distinct live signals — do not cross-wire these:
 * 1) Radio audio  → liveTrack / radioStreamUrl (ipstream MP3)
 * 2) Station TV   → stationLiveHlsUrl (ipstream HLS — previous working player)
 * 3) Minuto news  → minutoEmbed* (tvstream.cl iframe Deibis sent)
 */

/** 1) El Radar Radio — single audio stream URL (canonical on deibisromero.com). */
export const radioStreamUrl =
  process.env.NEXT_PUBLIC_RADIO_STREAM_URL?.trim() ||
  'https://stream.ipstream.cl/8008/stream';

export const liveTrack: Track = {
  id: 'deibis-live-radio',
  title: 'El Radar Radio En Vivo',
  subtitle: 'Señal de radio 24/7 (audio) — stream.ipstream.cl/8008',
  url: radioStreamUrl,
  kind: 'live',
  externalUrl: radioStreamUrl,
};

/** 2) Señal de la estación — live TV HLS that was working before the tvstream swap. */
export const stationLiveHlsUrl =
  process.env.NEXT_PUBLIC_STATION_HLS_URL?.trim() ||
  'https://video.ipstream.cl:3459/hybrid/play.m3u8';

/** Primary station TV URL (HLS). Alias kept for older imports. */
export const watchLiveUrl = stationLiveHlsUrl;

/** 3) Minuto en la Noticia — news bulletin embed from Deibis (tvstream VideoPlayer). */
export const minutoEmbedBaseUrl =
  process.env.NEXT_PUBLIC_MINUTO_EMBED_URL?.trim()?.replace(/[?&]autoplay=1/, '') ||
  process.env.NEXT_PUBLIC_TV_EMBED_URL?.trim()?.replace(/[?&]autoplay=1/, '') ||
  'https://panel.tvstream.cl:2020/VideoPlayer/xzfsepkbtx';

export function minutoEmbedSrc(autoplay: boolean) {
  try {
    const url = new URL(minutoEmbedBaseUrl);
    if (autoplay) {
      url.searchParams.set('autoplay', '1');
    } else {
      url.searchParams.delete('autoplay');
    }
    return url.toString();
  } catch {
    return autoplay ? `${minutoEmbedBaseUrl}?autoplay=1` : minutoEmbedBaseUrl;
  }
}

/** @deprecated Use minutoEmbedSrc — this was mislabeled as station TV. */
export const watchLiveEmbedSrc = minutoEmbedSrc;
/** @deprecated Use minutoEmbedSrc(true) */
export const watchLiveEmbedUrl = minutoEmbedSrc(true);
/** @deprecated Minuto is an iframe embed; station TV uses stationLiveHlsUrl. */
export const watchLiveHlsUrl = stationLiveHlsUrl;

/**
 * Voice / demo clips surfaced on deibisromero.com/sonidos.html (YouTube Gallery).
 * Only keep videos that still resolve via oEmbed.
 */
export const clipTracks: Track[] = [
  {
    id: 'voice-opticas',
    title: 'Ópticas Mírate Más',
    subtitle: 'Locución comercial — muestra desde la galería Sonidos.',
    kind: 'clip',
    externalUrl: 'https://www.youtube.com/watch?v=7S7oiKhMpec',
  },
  {
    id: 'voice-baruch',
    title: 'Estilos y Belleza Baruch',
    subtitle: 'Locución comercial en la voz de Deibis Romero.',
    kind: 'clip',
    externalUrl: 'https://www.youtube.com/watch?v=DOsyuAZQTgk',
  },
  {
    id: 'voice-titopal',
    title: 'Ofertas en Titopal',
    subtitle: 'Spot comercial — muestra de la galería Sonidos.',
    kind: 'clip',
    externalUrl: 'https://www.youtube.com/watch?v=7fHxsefw6sA',
  },
  {
    id: 'voice-rdo-noticias',
    title: 'RDO Noticias',
    subtitle: 'Presentación informativa con Deibis Romero.',
    kind: 'clip',
    externalUrl: 'https://www.youtube.com/watch?v=oGDJtm673ts',
  },
  {
    id: 'voice-rdo-tv',
    title: 'RDO Televisión — Noticias',
    subtitle: 'Conducción en noticias para RDO Televisión.',
    kind: 'clip',
    externalUrl: 'https://www.youtube.com/watch?v=6iQvNUQ-UiY',
  },
  {
    id: 'sonidos-gallery',
    title: 'Galería Sonidos',
    subtitle: 'Todas las muestras publicadas en deibisromero.com/sonidos.',
    kind: 'clip',
    externalUrl: 'https://www.deibisromero.com/sonidos.html',
  },
];

export const brandSummary = {
  headline: 'Marca personal y medio en vivo en una sola experiencia clara.',
  body: 'Este portal prioriza En Vivo TV y Radio para audiencia en Chile, con acceso directo a contacto y contenido social sin fricción.',
};

export const deibisProfile = {
  name: 'Deibis Romero',
  role: 'Locutor y Presentador',
  image: '/images/deibis-portrait.jpg',
  /** Atmosphere crop for the home hero (studio still). */
  heroImage: '/images/deibis-hero.jpg',
  email: 'producciones@deibisromero.com',
  location: 'Concepción, Chile',
  intro:
    'Locutor venezolano con trayectoria en radio, televisión y producción digital. Desde Concepción opera El Radar TV y Radio (señal 24/7), colabora con Radio Energía 95.7 / 101.9 FM y ofrece voz profesional para marcas y medios.',
  stats: [
    { label: 'Enfoque', value: 'Radio + TV + Voz' },
    { label: 'Base actual', value: 'Concepción, Chile' },
    { label: 'Canal principal', value: 'En vivo + WhatsApp' },
  ],
};

/** Idle posters — distinct stills so station TV and Minuto never share the same thumb. */
export const stationLivePoster = '/images/curated/OtQoAX_udno.jpg';
export const minutoNewsPoster = '/images/curated/P-azZUZCTrk.jpg';

export const bioTimeline = [
  {
    year: 'Inicios',
    text: 'Nace el 27 de agosto de 1984. Se inicia en la Emisora Comunitaria Senderos de Antímano 88.5 FM como locutor y productor de micros, publicidad y noticias, y colabora en Reto TV por Venezolana de Televisión (canal 8).',
  },
  {
    year: '2008-2014',
    text: 'Docente integral en el Instituto Náutico Luz Bolivariana, actor con Ícaro Producciones (Show de Ronald McDonald’s), apoyo técnico en Tuyera 107.7 FM y productor-locutor en Vacilón 106.3 FM con Howard Ramos. Certificado de locutor 50.482 en la Universidad Bolivariana de Venezuela.',
  },
  {
    year: '2017-2020',
    text: 'Diagnóstico de autismo de alto funcionamiento lo motiva a apoyar a FundAspie y UNICEF Venezuela. Reportero de tránsito en La Máquina del Aire (Vepaco FM), programa El Radar en los Valles del Tuy, y creador de “Lo Que Usted No Sabía” en redes y Pacífica 90.7 FM.',
  },
  {
    year: '2021-2022',
    text: 'Lleva El Radar a Radio Chévere en Chile, se radica en Concepción y colabora con Radio Vive Tu Puerto, RDO Televisión y TV8. Lanza su radio online en deibisromero.com y apps en Play Store / WikiPlay.',
  },
  {
    year: 'Hoy',
    text: 'Opera El Radar Radio/TV 24/7 (música e información), transmite también en Twitch (@elradartv), colabora con Radio Energía 95.7 / 101.9 FM, produce cápsulas informativas y ofrece locución comercial multiplataforma.',
  },
];

export const serviceCards = [
  {
    title: 'Voz y presentación',
    text: 'Locución comercial, imaging de estación, conducción en vivo y entrega hablada para eventos y socios de marca.',
  },
  {
    title: 'Colaboraciones en vivo',
    text: 'Entrevistas, segmentos destacados, apariciones invitadas y cobertura en radio y formatos digitales.',
  },
  {
    title: 'Alianzas de marca',
    text: 'Campañas e integraciones patrocinadas alrededor de una identidad al aire confiable y cercana a la comunidad.',
  },
];

export const radarProgramming = [
  {
    title: 'Señal en vivo',
    text: 'Radio 24/7 en stream.ipstream.cl/8008 y TV en elradartv.cl / este portal, con acceso inmediato desde móvil.',
  },
  {
    title: 'FM y alianzas',
    text: 'Colaboraciones al aire con Radio Energía 95.7 / 101.9 FM y presencia en directorios como Emisora.cl.',
  },
  {
    title: 'Clips y Twitch',
    text: 'Muestras de voz en YouTube/Sonidos, lives en Twitch (@elradartv) y distribución corta en Instagram y TikTok.',
  },
];

export const ctaBlocks = {
  booking: {
    title: 'Reserva a Deibis para locución, conducción o colaboraciones',
    body: 'Canal directo para consultas comerciales, eventos y alianzas.',
    href: 'mailto:producciones@deibisromero.com?subject=Consulta%20Comercial',
    label: 'Enviar consulta',
  },
  epk: {
    title: 'Abrir experiencia EPK digital',
    body: 'Presentación de prensa y activos de marca en formato simple para compartir rápido.',
    href: '/epk',
    label: 'Ver EPK',
  },
  stream: {
    title: 'Acceso en vivo como prioridad del portal',
    body: 'TV y radio en un toque, especialmente para tráfico móvil en Chile.',
    href: '#tv-en-vivo',
    label: 'Ver TV En Vivo',
  },
};
