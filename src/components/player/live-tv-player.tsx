'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

import { usePlayer } from '@/components/player/player-provider';
import { deibisProfile, watchLiveEmbedSrc, watchLiveHlsUrl } from '@/content/site';
import { requestLiveTvPlay } from '@/lib/live-media-events';

type LiveTvPlayerProps = {
  title?: string;
  className?: string;
};

/**
 * Click-to-play official tvstream embed.
 * Idle = poster only (no iframe, nothing playing in background).
 * Active = mount iframe with autoplay after an explicit user gesture.
 * Radio start calls stopTv() which unmounts this iframe and kills the stream.
 */
export function LiveTvPlayer({
  title = 'El Radar TV En Vivo',
  className = '',
}: LiveTvPlayerProps) {
  const { isTvActive, startTv } = usePlayer();

  return (
    <div className={`live-tv ${className}`.trim()} id="tv-en-vivo">
      <div className="live-tv__frame live-tv__frame--embed">
        {isTvActive ? (
          <iframe
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="live-tv__iframe"
            referrerPolicy="origin"
            scrolling="no"
            src={watchLiveEmbedSrc(true)}
            title={title}
          />
        ) : (
          <>
            <Image
              alt=""
              className="live-tv__poster"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              src={deibisProfile.image}
            />
            <div className="live-tv__idle">
              <div className="live-tv__badge">
                <span className="live-pulse" aria-hidden="true" />
                <span>En vivo</span>
              </div>
              <button
                aria-label="Reproducir TV en vivo"
                className="live-tv__play"
                onClick={() => startTv()}
                type="button"
              >
                <Play size={18} />
                Ver en vivo
              </button>
            </div>
          </>
        )}
      </div>
      <div className="live-tv__meta">
        <div>
          <p className="kicker">TV</p>
          <h3>{title}</h3>
        </div>
        <p>
          {isTvActive
            ? 'Reproduciendo señal oficial (tvstream.cl). '
            : 'Toca Ver en vivo o el botón del hero para iniciar. '}
          <a className="text-link" href={watchLiveHlsUrl} rel="noreferrer" target="_blank">
            HLS directo
          </a>
          {' · '}
          <a
            className="text-link"
            href={watchLiveEmbedSrc(true)}
            rel="noreferrer"
            target="_blank"
          >
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
