import Image from 'next/image';
import Link from 'next/link';

import { instagramHighlights, instagramProfileUrl } from '@/content/site';
import { instagramBridgePath } from '@/lib/external-href';

type InstagramCuratedProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** When true, CTAs open Instagram directly (for the bridge page itself). */
  directProfileCta?: boolean;
};

export function InstagramCurated({
  eyebrow = 'Instagram',
  title = 'Desde @deibisromero',
  description = 'Selección editorial del feed: estudio, terreno, Biobío y bastidores. El contenido vive aquí; Instagram es el canal del día a día.',
  directProfileCta = false,
}: InstagramCuratedProps) {
  const ctaClass = 'button button--secondary';
  const linkClass = 'text-link';

  return (
    <section className="shell content-block ig-curated">
      <div className="ig-curated__header">
        <div>
          <p className="section-heading__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {directProfileCta ? (
          <a
            className={ctaClass}
            href={instagramProfileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Abrir perfil en Instagram
          </a>
        ) : (
          <Link className={ctaClass} href={instagramBridgePath}>
            Abrir @deibisromero
          </Link>
        )}
      </div>

      <div className="ig-curated__grid">
        {instagramHighlights.map((item, index) => (
          <article
            key={item.id}
            className={`ig-tile${index === 0 ? ' ig-tile--feature' : ''}`}
          >
            <div className="ig-tile__media">
              <Image
                alt={item.title}
                className="ig-tile__image"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                src={item.image}
              />
              <span className="ig-tile__shade" />
              <span className="ig-tile__tag">{item.tag}</span>
            </div>
            <div className="ig-tile__copy">
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
              {directProfileCta ? (
                <a
                  className={linkClass}
                  href={instagramProfileUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Abrir en Instagram
                </a>
              ) : (
                <Link className={linkClass} href={instagramBridgePath}>
                  Ver perfil
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
