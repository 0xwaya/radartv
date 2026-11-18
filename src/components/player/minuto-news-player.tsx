'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

import { usePlayer } from '@/components/player/player-provider';
import { minutoEmbedSrc, minutoNewsPoster } from '@/content/site';
import { requestMinutoPlay } from '@/lib/live-media-events';

type MinutoNewsPlayerProps = {
  title?: string;
  className?: string;
};

/**
 * Minuto en la Noticia — news bulletin via the tvstream embed Deibis sent.
 * Not the station HLS feed and not radio.
 */
export function MinutoNewsPlayer({
  title = 'Minuto en la Noticia',
  className = '',
}: MinutoNewsPlayerProps) {
  const { isMinutoActive, startMinuto, stopMinuto } = usePlayer();

  return (
    <div className={`live-tv ${className}`.trim()} id="minuto-noticia">
      <div className="live-tv__frame live-tv__frame--embed">
        {isMinutoActive ? (
          <iframe
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="live-tv__iframe"
            referrerPolicy="origin"
            scrolling="no"
            src={minutoEmbedSrc(true)}
            title={title}
          />
        ) : (
          <>
            <Image
              alt=""
              className="live-tv__poster"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              src={minutoNewsPoster}
            />
            <div className="live-tv__idle">
              <div className="live-tv__badge">
                <span className="live-pulse" aria-hidden="true" />
                <span>Programa</span>
              </div>
              <button
                aria-label="Reproducir Minuto en la Noticia"
                className="live-tv__play"
                onClick={() => startMinuto()}
                type="button"
              >
                <Play size={18} />
                Ver Minuto
              </button>
            </div>
          </>
        )}
      </div>
      <div className="live-tv__meta">
        <div>
          <p className="kicker">Noticias · Minuto</p>
          <h3>{title}</h3>
        </div>
        <p>
          {isMinutoActive
            ? 'Boletín informativo vía tvstream.cl (embed de Deibis). '
            : 'Toca Ver Minuto para montar el embed. '}
          {isMinutoActive ? (
            <button className="text-link" onClick={stopMinuto} type="button">
              Detener
            </button>
          ) : (
            <a className="text-link" href={minutoEmbedSrc(true)} rel="noreferrer" target="_blank">
              Abrir fuente
            </a>
          )}
        </p>
      </div>
    </div>
  );
}

export function WatchMinutoButton({
  label = 'Ver Minuto',
  variant = 'secondary',
}: {
  label?: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button
      className={`button button--${variant}`}
      onClick={() => requestMinutoPlay()}
      type="button"
    >
      <Play size={16} />
      {label}
    </button>
  );
}
