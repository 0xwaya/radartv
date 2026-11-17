import type { Metadata } from 'next';

import { SectionHeading } from '@/components/section-heading';
import { deibisProfile, siteUrl, socialLinks } from '@/content/site';

export const metadata: Metadata = {
  title: 'EPK | Deibis Romero',
  description:
    'Kit de prensa digital de Deibis Romero: posicionamiento, trayectoria, contacto y canales oficiales.',
  alternates: {
    canonical: `${siteUrl}/epk`,
  },
};

export default function EpkPage() {
  return (
    <section className="shell epk-page">
      <SectionHeading
        eyebrow="Kit de prensa digital"
        title="Material listo para compartir con productoras, marcas y medios."
        description="Esta página concentra la ficha de Deibis Romero y el camino de contacto mientras se prepara el paquete descargable."
      />
      <div className="two-column">
        <article className="card card--feature">
          <p className="kicker">Posicionamiento</p>
          <h2>{deibisProfile.name}</h2>
          <p>{deibisProfile.role}</p>
          <p>{deibisProfile.intro}</p>
          <p>
            <strong>Base:</strong> {deibisProfile.location}
          </p>
        </article>
        <article className="card">
          <p className="kicker">Incluye</p>
          <ul className="feature-list">
            <li>Biografía y hitos de trayectoria</li>
            <li>Servicios de locución, conducción y colaboraciones</li>
            <li>Acceso a señal en vivo y demos de voz</li>
            <li>Contacto comercial y redes oficiales</li>
          </ul>
          <a
            className="button button--primary"
            href={`mailto:${deibisProfile.email}?subject=Solicitud%20EPK`}
          >
            Solicitar paquete EPK
          </a>
        </article>
      </div>
      <div className="social-strip card" style={{ marginTop: '1.5rem' }}>
        {socialLinks.map((item) => (
          <a key={item.href} href={item.href} rel="noreferrer" target="_blank">
            {item.label}
          </a>
        ))}
        <a href={`mailto:${deibisProfile.email}`}>{deibisProfile.email}</a>
      </div>
    </section>
  );
}
