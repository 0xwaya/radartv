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

- El audio en vivo usa el stream MP3 público de Lorini.
- La TV HLS aún se abre como acción externa; el player embebido es fase B.
- Los demos de voz siguen enlazando a las galerías legacy hasta exportar archivos propios.
