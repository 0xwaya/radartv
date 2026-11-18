import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { GlobalPlayer } from '@/components/player/global-player';
import { PlayerProvider } from '@/components/player/player-provider';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { WhatsAppWidget } from '@/components/whatsapp-widget';
import { siteUrl } from '@/content/site';

import './globals.css';

/** Self-hosted to avoid flaky Google Fonts fetches failing Vercel builds. */
const display = localFont({
  src: '../fonts/cormorant-garamond.woff2',
  variable: '--font-display',
  weight: '500 700',
  display: 'swap',
});

const body = localFont({
  src: '../fonts/space-grotesk.woff2',
  variable: '--font-body',
  weight: '400 700',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'El Radar TV | Portal Oficial',
  description:
    'Portal oficial de Deibis Romero en Chile: TV y radio en vivo, perfil profesional y contacto rápido.',
  openGraph: {
    title: 'El Radar TV | Portal Oficial',
    description:
      'Portal oficial de Deibis Romero en Chile: TV y radio en vivo, perfil profesional y contacto rápido.',
    url: siteUrl,
    siteName: 'El Radar TV',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/og-radar.png',
        width: 1200,
        height: 630,
        alt: 'El Radar TV - Portal Oficial',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Radar TV | Portal Oficial',
    description:
      'Portal oficial de Deibis Romero en Chile: TV y radio en vivo, perfil profesional y contacto rápido.',
    images: ['/og-radar.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${display.variable} ${body.variable}`} lang="es">
      <body>
        <PlayerProvider>
          <div className="page-frame">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <WhatsAppWidget />
            <GlobalPlayer />
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}
