'use client';

import { Play } from 'lucide-react';

import { watchLiveEmbedUrl, watchLiveHlsUrl } from '@/content/site';
import { requestLiveTvPlay } from '@/lib/live-media-events';

type LiveTvPlayerProps = {
  title?: string;
  className?: string;
};

/**
 * Official tvstream embed. Keep the iframe stable — remounting/pausing it from
 * radio events was causing glitchy reloads while a live signal is on air.
 */
export function LiveTvPlayer({
  title = 'El Radar TV En Vivo',
  className = '',
}: LiveTvPlayerProps) {
  return (
    <div className={`live-tv ${className}`.trim()} id="tv-en-vivo">
      <div className="live-tv__frame live-tv__frame--embed">
        <iframe
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="live-tv__iframe"
          referrerPolicy="origin"
          scrolling="no"
          src={watchLiveEmbedUrl}
          title={title}
        />
        <div className="live-tv__chrome" aria-hidden="true">
          <span className="live-tv__badge">
            <span className="live-pulse" aria-hidden="true" />
            En vivo
          </span>
        </div>
      </div>
      <div className="live-tv__meta">
        <div>
          <p className="kicker">TV</p>
          <h3>{title}</h3>
        </div>
        <p>
          Señal oficial en vivo vía tvstream.cl.{' '}
          <a className="text-link" href={watchLiveHlsUrl} rel="noreferrer" target="_blank">
            HLS directo
          </a>
          {' · '}
          <a className="text-link" href={watchLiveEmbedUrl} rel="noreferrer" target="_blank">
            Abrir fuente
          </a>
        </p>
      </div>
    </div>
  );
}

export function WatchLiveButton({
  label = 'Ver TV En Vivo',
  variant = 'secondary',
}: {
  label?: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button
      className={`button button--${variant}`}
      onClick={() => requestLiveTvPlay()}
      type="button"
    >
      <Play size={16} />
      {label}
    </button>
  );
}
