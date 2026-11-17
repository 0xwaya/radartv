import Image from 'next/image';

import { instagramHighlights, instagramProfileUrl } from '@/content/site';
import { externalAnchorProps } from '@/lib/external-href';

type InstagramCuratedProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function InstagramCurated({
  eyebrow = 'Instagram',
  title = 'Desde @deibisromero',
  description = 'Selección editorial del feed: estudio, terreno, Biobío y bastidores. Instagram sigue siendo el canal del día a día.',
}: InstagramCuratedProps) {
  const profileLink = externalAnchorProps(instagramProfileUrl);

  return (
    <section className="shell content-block ig-curated">
      <div className="ig-curated__header">
        <div>
          <p className="section-heading__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <a className="button button--secondary" {...profileLink}>
          Seguir en Instagram
        </a>
      </div>

      <div className="ig-curated__grid">
        {instagramHighlights.map((item, index) => (
          <a
            key={item.id}
            className={`ig-tile${index === 0 ? ' ig-tile--feature' : ''}`}
            {...externalAnchorProps(item.href)}
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
              <span className="text-link">Ver en Instagram</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
