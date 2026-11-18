'use client';

import Hls from 'hls.js';
import { AlertCircle, ExternalLink, Pause, Play, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { usePlayer } from '@/components/player/player-provider';
import { deibisProfile, stationLiveHlsUrl } from '@/content/site';
import { requestLiveTvPlay } from '@/lib/live-media-events';

type LiveTvPlayerProps = {
  title?: string;
  className?: string;
};

type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * Station live TV — ipstream HLS (the feed that worked before tvstream).
 * Not Minuto en la Noticia (that is the separate tvstream embed).
 * Click-to-play; stopTv() tears down HLS so radio/Minuto can take over cleanly.
 */
export function LiveTvPlayer({
  title = 'Señal de la estación',
  className = '',
}: LiveTvPlayerProps) {
  const { isTvActive, startTv, stopTv } = usePlayer();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const hardStopVideo = useCallback(() => {
    const video = videoRef.current;
    destroyHls();
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    setStatus('idle');
    setErrorMessage(null);
  }, [destroyHls]);

  const attachStream = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    void reloadToken;

    destroyHls();
    setStatus('loading');
    setErrorMessage(null);

    const canPlayNative = video.canPlayType('application/vnd.apple.mpegurl');

    if (canPlayNative) {
      video.src = stationLiveHlsUrl;
      void video.play().catch(() => {
        setStatus('error');
        setErrorMessage('No se pudo iniciar la señal de la estación.');
      });
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(stationLiveHlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => {
          setStatus('error');
          setErrorMessage('No se pudo iniciar la señal de la estación.');
        });
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        setStatus('error');
        setErrorMessage(
          'No se pudo cargar la señal de la estación. Prueba de nuevo o ábrela en el enlace externo.',
        );
        destroyHls();
      });
      return;
    }

    setStatus('error');
    setErrorMessage('Este navegador no soporta reproducción HLS integrada.');
  }, [destroyHls, reloadToken]);

  useEffect(() => {
    if (!isTvActive) {
      hardStopVideo();
      return;
    }

    attachStream();
    return () => {
      destroyHls();
    };
  }, [attachStream, destroyHls, hardStopVideo, isTvActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const onPlaying = () => setStatus('playing');
    const onPause = () => {
      if (!video.ended) {
        setStatus((current) => (current === 'error' || current === 'idle' ? current : 'paused'));
      }
    };
    const onWaiting = () => setStatus('loading');
    const onError = () => {
      if (!isTvActive) {
        return;
      }
      setStatus('error');
      setErrorMessage('La señal de la estación no está disponible en este momento.');
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('error', onError);
    };
  }, [isTvActive]);

  const togglePlayback = async () => {
    if (!isTvActive) {
      startTv();
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (status === 'error') {
      setReloadToken((value) => value + 1);
      return;
    }

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch {
      setStatus('error');
      setErrorMessage('No se pudo iniciar el video. Revisa tu conexión o permite la reproducción.');
    }
  };

  const retry = () => {
    if (!isTvActive) {
      startTv();
      return;
    }
    setReloadToken((value) => value + 1);
  };

  const isPlaying = status === 'playing';

  return (
    <div className={`live-tv ${className}`.trim()} id="tv-en-vivo">
      <div className="live-tv__frame">
        <video
          ref={videoRef}
          className="live-tv__video"
          controls={false}
          playsInline
          poster={deibisProfile.image}
          preload="none"
        />
        <div className="live-tv__overlay">
          <div className="live-tv__badge">
            <span className="live-pulse" aria-hidden="true" />
            <span>Estación en vivo</span>
          </div>
          <div className="live-tv__controls">
            <button
              aria-label={isPlaying ? 'Pausar TV de la estación' : 'Reproducir TV de la estación'}
              className="live-tv__play"
              onClick={() => void togglePlayback()}
              type="button"
            >
              {status === 'error' ? (
                <RefreshCw size={18} />
              ) : isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} />
              )}
              {status === 'error' ? 'Reintentar' : isPlaying ? 'Pausar' : 'Ver en vivo'}
            </button>
            {isTvActive ? (
              <button className="live-tv__external" onClick={stopTv} type="button">
                Detener
              </button>
            ) : (
              <a
                className="live-tv__external"
                href={stationLiveHlsUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink size={15} />
                Abrir fuente
              </a>
            )}
          </div>
        </div>
        {status === 'loading' ? <div className="live-tv__loading">Conectando señal…</div> : null}
      </div>
      <div className="live-tv__meta">
        <div>
          <p className="kicker">TV · Estación</p>
          <h3>{title}</h3>
        </div>
        {errorMessage ? (
          <p className="live-tv__error" role="alert">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
            <button className="text-link" onClick={retry} type="button">
              Reintentar
            </button>
          </p>
        ) : (
          <p>
            Señal de video de la estación (HLS ipstream). Distinta de la radio y de Minuto en la
            Noticia.
          </p>
        )}
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
