'use client';

import Hls from 'hls.js';
import { AlertCircle, ExternalLink, Pause, Play, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { deibisProfile, watchLiveUrl } from '@/content/site';

type LiveTvPlayerProps = {
  title?: string;
  className?: string;
};

type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function LiveTvPlayer({
  title = 'El Radar TV En Vivo',
  className = '',
}: LiveTvPlayerProps) {
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

  const attachStream = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // reloadToken forces a fresh attach when the user retries.
    void reloadToken;

    destroyHls();
    setStatus('loading');
    setErrorMessage(null);

    const canPlayNative = video.canPlayType('application/vnd.apple.mpegurl');

    if (canPlayNative) {
      video.removeAttribute('src');
      video.load();
      video.src = watchLiveUrl;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(watchLiveUrl);
      hls.attachMedia(video);
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
        setErrorMessage('No se pudo cargar la señal de TV. Prueba de nuevo o ábrela en el enlace externo.');
        destroyHls();
      });
      return;
    }

    setStatus('error');
    setErrorMessage('Este navegador no soporta reproducción HLS integrada.');
  }, [destroyHls, reloadToken]);

  useEffect(() => {
    attachStream();
    return () => {
      destroyHls();
    };
  }, [attachStream, destroyHls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const onPlaying = () => setStatus('playing');
    const onPause = () => {
      if (!video.ended) {
        setStatus((current) => (current === 'error' ? current : 'paused'));
      }
    };
    const onWaiting = () => setStatus('loading');
    const onError = () => {
      setStatus('error');
      setErrorMessage('La señal de TV no está disponible en este momento.');
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
  }, []);

  const togglePlayback = async () => {
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
          preload="metadata"
        />
        <div className="live-tv__overlay">
          <div className="live-tv__badge">
            <span className="live-pulse" aria-hidden="true" />
            <span>En vivo</span>
          </div>
          <div className="live-tv__controls">
            <button
              aria-label={isPlaying ? 'Pausar TV en vivo' : 'Reproducir TV en vivo'}
              className="live-tv__play"
              onClick={() => void togglePlayback()}
              type="button"
            >
              {status === 'error' ? <RefreshCw size={18} /> : isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {status === 'error' ? 'Reintentar' : isPlaying ? 'Pausar' : 'Ver en vivo'}
            </button>
            <a
              className="live-tv__external"
              href={watchLiveUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink size={15} />
              Abrir fuente
            </a>
          </div>
        </div>
        {status === 'loading' ? <div className="live-tv__loading">Conectando señal…</div> : null}
      </div>
      <div className="live-tv__meta">
        <div>
          <p className="kicker">TV</p>
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
          <p>Señal HLS integrada. Si falla, usa el enlace externo de respaldo.</p>
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
    <a className={`button button--${variant}`} href="#tv-en-vivo">
      <Play size={16} />
      {label}
    </a>
  );
}
