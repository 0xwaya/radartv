'use client';

import { ExternalLink, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { usePlayer } from '@/components/player/player-provider';
import { watchLiveEmbedUrl, watchLiveHlsUrl } from '@/content/site';
import {
  LIVE_RADIO_PLAY_EVENT,
  LIVE_TV_PAUSE_EVENT,
  LIVE_TV_PLAY_EVENT,
  requestLiveTvPlay,
} from '@/lib/live-media-events';

type LiveTvPlayerProps = {
  title?: string;
  className?: string;
};

function withAutoplay(url: string, autoplay: boolean) {
  try {
    const next = new URL(url);
    if (autoplay) {
      next.searchParams.set('autoplay', '1');
    } else {
      next.searchParams.delete('autoplay');
    }
    return next.toString();
  } catch {
    return url;
  }
}

export function LiveTvPlayer({
  title = 'El Radar TV En Vivo',
  className = '',
}: LiveTvPlayerProps) {
  const { stop: stopRadio } = usePlayer();
  const [autoplay, setAutoplay] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const embedSrc = useMemo(
    () => withAutoplay(watchLiveEmbedUrl, autoplay),
    [autoplay],
  );

  useEffect(() => {
    const onPlayRequest = () => {
      stopRadio();
      setAutoplay(true);
      // Remount iframe so tvstream honors autoplay after a user gesture.
      setReloadKey((value) => value + 1);
    };

    const onPauseRequest = () => {
      setAutoplay(false);
      setReloadKey((value) => value + 1);
    };

    window.addEventListener(LIVE_TV_PLAY_EVENT, onPlayRequest);
    window.addEventListener(LIVE_TV_PAUSE_EVENT, onPauseRequest);
    window.addEventListener(LIVE_RADIO_PLAY_EVENT, onPauseRequest);

    return () => {
      window.removeEventListener(LIVE_TV_PLAY_EVENT, onPlayRequest);
      window.removeEventListener(LIVE_TV_PAUSE_EVENT, onPauseRequest);
      window.removeEventListener(LIVE_RADIO_PLAY_EVENT, onPauseRequest);
    };
  }, [stopRadio]);

  return (
    <div className={`live-tv ${className}`.trim()} id="tv-en-vivo">
      <div className="live-tv__frame live-tv__frame--embed">
        <iframe
          key={reloadKey}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="live-tv__iframe"
          referrerPolicy="origin"
          scrolling="no"
          src={embedSrc}
          title={title}
        />
        {!autoplay ? (
          <div className="live-tv__overlay">
            <div className="live-tv__badge">
              <span className="live-pulse" aria-hidden="true" />
              <span>En vivo</span>
            </div>
            <div className="live-tv__controls">
              <button
                aria-label="Reproducir TV en vivo"
                className="live-tv__play"
                onClick={() => requestLiveTvPlay()}
                type="button"
              >
                <Play size={18} />
                Ver en vivo
              </button>
              <a
                className="live-tv__external"
                href={watchLiveEmbedUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink size={15} />
                Abrir fuente
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <div className="live-tv__meta">
        <div>
          <p className="kicker">TV</p>
          <h3>{title}</h3>
        </div>
        <p>
          Señal oficial vía tvstream.cl
          {autoplay ? '. ' : '. Toca Ver en vivo para iniciar. '}
          <a className="text-link" href={watchLiveHlsUrl} rel="noreferrer" target="_blank">
            HLS directo
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
