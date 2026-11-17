'use client';

import Hls from 'hls.js';
import { AlertCircle, ExternalLink, LoaderCircle, Pause, Play, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { usePlayer } from '@/components/player/player-provider';
import { deibisProfile, watchLiveUrl } from '@/content/site';
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

type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function LiveTvPlayer({
  title = 'El Radar TV En Vivo',
  className = '',
}: LiveTvPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const autoPlayRef = useRef(false);
  const { stop: stopRadio } = usePlayer();
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      stopRadio();
      setStatus('loading');
      setErrorMessage(null);
      await video.play();
    } catch {
      // Autoplay may be blocked until a later gesture; keep stream attached.
      setStatus((current) => (current === 'playing' ? current : 'paused'));
      if (autoPlayRef.current) {
        setErrorMessage('Toca “Ver en vivo” en el reproductor para iniciar el video.');
      }
    }
  }, [stopRadio]);

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
      video.removeAttribute('src');
      video.load();
      video.src = watchLiveUrl;
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        if (autoPlayRef.current) {
          void tryPlay();
        } else {
          setStatus('paused');
        }
      };
      video.addEventListener('canplay', onCanPlay);
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
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlayRef.current) {
          void tryPlay();
        } else {
          setStatus('paused');
        }
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
        setErrorMessage('No se pudo cargar la señal de TV. Prueba de nuevo o ábrela en el enlace externo.');
        destroyHls();
      });
      return;
    }

    setStatus('error');
    setErrorMessage('Este navegador no soporta reproducción HLS integrada.');
  }, [destroyHls, reloadToken, tryPlay]);

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

    const onPlaying = () => {
      setStatus('playing');
      setErrorMessage(null);
    };
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

  useEffect(() => {
    const onPlayRequest = () => {
      autoPlayRef.current = true;
      const video = videoRef.current;
      if (!video) {
        return;
      }

      const startWhenReady = () => {
        if (autoPlayRef.current) {
          void tryPlay();
        }
      };

      if (video.readyState >= 2) {
        startWhenReady();
        return;
      }

      // Stream still buffering — play as soon as media can start.
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        startWhenReady();
      };
      video.addEventListener('canplay', onCanPlay);
      void tryPlay();
    };

    const onPauseRequest = () => {
      autoPlayRef.current = false;
      videoRef.current?.pause();
    };

    window.addEventListener(LIVE_TV_PLAY_EVENT, onPlayRequest);
    window.addEventListener(LIVE_TV_PAUSE_EVENT, onPauseRequest);
    window.addEventListener(LIVE_RADIO_PLAY_EVENT, onPauseRequest);

    return () => {
      window.removeEventListener(LIVE_TV_PLAY_EVENT, onPlayRequest);
      window.removeEventListener(LIVE_TV_PAUSE_EVENT, onPauseRequest);
      window.removeEventListener(LIVE_RADIO_PLAY_EVENT, onPauseRequest);
    };
  }, [tryPlay]);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (status === 'error') {
      autoPlayRef.current = true;
      setReloadToken((value) => value + 1);
      return;
    }

    if (video.paused) {
      autoPlayRef.current = true;
      await tryPlay();
      return;
    }

    autoPlayRef.current = false;
    video.pause();
  };

  const retry = () => {
    autoPlayRef.current = true;
    setReloadToken((value) => value + 1);
  };

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';

  return (
    <div className={`live-tv ${className}`.trim()} id="tv-en-vivo">
      <div className="live-tv__frame">
        <video
          ref={videoRef}
          className="live-tv__video"
          controls={false}
          playsInline
          poster={deibisProfile.image}
          preload="auto"
        />
        <div className={`live-tv__overlay${isPlaying ? ' live-tv__overlay--playing' : ''}`}>
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
              {status === 'error' ? (
                <RefreshCw size={18} />
              ) : isLoading ? (
                <LoaderCircle className="button__spin" size={18} />
              ) : isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} />
              )}
              {status === 'error'
                ? 'Reintentar'
                : isLoading
                  ? 'Conectando…'
                  : isPlaying
                    ? 'Pausar'
                    : 'Ver en vivo'}
            </button>
            <a className="live-tv__external" href={watchLiveUrl} rel="noreferrer" target="_blank">
              <ExternalLink size={15} />
              Abrir fuente
            </a>
          </div>
        </div>
        {isLoading ? <div className="live-tv__loading">Conectando señal…</div> : null}
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
