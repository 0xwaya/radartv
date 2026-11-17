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

export const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/deibisromero',
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

export const instagramProfileUrl = 'https://www.instagram.com/deibisromero';

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

export const liveTrack: Track = {
  id: 'deibis-live-radio',
  title: 'El Radar Radio En Vivo',
  subtitle: 'Música 24/7, actualidad e identidad en vivo de Deibis Romero',
  url: 'https://acp2.lorini.net:27050/stream',
  kind: 'live',
  externalUrl: 'https://player.lorini.net/drtv',
};

export const watchLiveUrl = 'https://video.ipstream.cl:3459/hybrid/play.m3u8';

export const clipTracks: Track[] = [
  {
    id: 'voice-reel',
    title: 'Demo de voz',
    subtitle: 'Galería pública de sonidos mientras se publican archivos directos.',
    kind: 'clip',
    externalUrl: 'https://deibisromero.com/sonidos.html',
  },
  {
    id: 'station-id',
    title: 'IDs de estación',
    subtitle: 'Identidad sonora y presentaciones disponibles en la galería actual.',
    kind: 'clip',
    externalUrl: 'https://elradartv.cl/sonidos.html',
  },
  {
    id: 'youtube-clips',
    title: 'Clips destacados',
    subtitle: 'Selección del canal de YouTube mientras se exporta la librería propia.',
    kind: 'clip',
    externalUrl: 'https://www.youtube.com/@deibisromerolocutor',
  },
];

export const brandSummary = {
  headline: 'Marca personal y medio en vivo en una sola experiencia clara.',
  body: 'Este portal prioriza En Vivo TV y Radio para audiencia en Chile, con acceso directo a contacto y contenido social sin fricción.',
};

export const deibisProfile = {
  name: 'Deibis Romero',
  role: 'Locutor, presentador, productor y fundador',
  image: '/images/deibis-portrait.jpg',
  /** Atmosphere crop for the home hero (studio still). */
  heroImage: '/images/deibis-hero.jpg',
  email: 'producciones@deibisromero.com',
  location: 'Concepción, Chile',
  intro:
    'Comunicador con trayectoria en radio, televisión y producción digital. Hoy transmite desde Concepción con El Radar TV y Radio, enfocado en señal en vivo, voz profesional y colaboraciones de marca.',
  stats: [
    { label: 'Enfoque', value: 'Radio + TV + Voz' },
    { label: 'Base actual', value: 'Concepción, Chile' },
    { label: 'Canal principal', value: 'En vivo + WhatsApp' },
  ],
};

export const bioTimeline = [
  {
    year: 'Inicios',
    text: 'Nace el 27 de agosto de 1984. Se inicia en la Emisora Comunitaria Senderos de Antímano 88.5 FM como locutor y productor, y colabora en Reto TV por Venezolana de Televisión.',
  },
  {
    year: '2008-2014',
    text: 'Docente integral, actor con Ícaro Producciones, apoyo técnico en Tuyera 107.7 FM y productor-locutor en Vacilón 106.3 FM con reporte de tránsito. Obtiene certificado de locutor (50.482) en la Universidad Bolivariana de Venezuela.',
  },
  {
    year: '2017-2020',
    text: 'Diagnóstico de autismo de alto funcionamiento lo motiva a apoyar a FundAspie y UNICEF Venezuela. Reportero de tránsito en La Máquina del Aire (Vepaco FM) y creador de “Lo Que Usted No Sabía” en redes y Pacífica 90.7 FM.',
  },
  {
    year: '2021-2022',
    text: 'Lleva El Radar a Radio Chévere en Chile, se radica en Concepción y colabora con Radio Vive Tu Puerto, RDO Televisión y TV8. Lanza su radio online y apps en Play Store / WikiPlay.',
  },
  {
    year: 'Hoy',
    text: 'Opera señal 24/7 de música e información, cápsulas informativas, locución comercial y presencia multiplataforma alrededor de El Radar TV y Deibis Romero.',
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
    text: 'Experiencia radial continua con flujo musical, personalidad y cercanía directa con la audiencia.',
  },
  {
    title: 'Formato entrevista',
    text: 'Espacio para conversaciones con artistas, cobertura cultural y relatos locales.',
  },
  {
    title: 'Publicación de clips',
    text: 'Contenido corto reutilizable para reels, actualizaciones del sitio y distribución en canales.',
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
