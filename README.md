# RadarTV

Portal oficial Next.js que unifica la marca personal de Deibis Romero con El Radar TV / Radio.

## Qué incluye

- Landing en vivo primero (TV + radio + WhatsApp)
- Perfil profesional con biografía, servicios y EPK
- Experiencia El Radar TV con acceso a señal y clips
- Reproductor global de audio con manejo de errores
- SEO base: metadata, structured data, robots y sitemap

## Tech

- Next.js App Router
- TypeScript
- Contenido en `src/content/site.ts`

## Configuración

Copia `.env.example` a `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://radartv.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=569XXXXXXXX
```

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
```

## Notas

- El audio en vivo usa el stream canónico de deibisromero.com (`stream.ipstream.cl/8008/stream`).
- La señal TV de estación usa HLS (`video.ipstream.cl`); Minuto en la Noticia usa el embed tvstream.cl.
- Los demos de voz apuntan a clips publicados en la galería Sonidos (YouTube) de deibisromero.com.
- Redes sincronizadas: Instagram (@deibisromero / @elradar_oficial), Twitch (@elradartv), YouTube, TikTok, Facebook y X.
