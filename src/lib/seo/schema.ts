import { deibisProfile, siteUrl, socialLinks } from '@/content/site';

const sameAs = [
  ...socialLinks.map((item) => item.href),
  'https://elradartv.cl',
  'https://deibisromero.com',
];

export function buildPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: deibisProfile.name,
    jobTitle: deibisProfile.role,
    email: deibisProfile.email,
    image: `${siteUrl}${deibisProfile.image}`,
    url: `${siteUrl}/deibisromero`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Concepción',
      addressCountry: 'CL',
    },
    sameAs,
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'El Radar TV',
    url: `${siteUrl}/elradartv`,
    logo: `${siteUrl}/images/logo.webp`,
    sameAs,
  };
}

export function buildBroadcastSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BroadcastEvent',
    name: 'El Radar Radio En Vivo',
    isLiveBroadcast: true,
    startDate: new Date().toISOString(),
    url: `${siteUrl}/elradartv`,
    publishedOn: {
      '@type': 'BroadcastService',
      name: 'El Radar Radio',
    },
  };
}
