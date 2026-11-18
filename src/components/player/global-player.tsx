'use client';

import { Pause, Play, Radio, Volume2 } from 'lucide-react';

import { usePlayer } from '@/components/player/player-provider';

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    isTvActive,
    isMinutoActive,
    togglePlayback,
    stop,
    stopTv,
    stopMinuto,
    setVolume,
    volume,
    errorMessage,
  } = usePlayer();

  const busy = isPlaying || isLoading || isTvActive || isMinutoActive;

  const title = isMinutoActive
    ? 'Minuto en la Noticia activo'
    : isTvActive
      ? 'Señal de la estación activa'
      : isLoading
        ? 'Conectando radio en vivo…'
        : (currentTrack?.title ?? 'Listo para reproducir en vivo');

  const subtitle =
    errorMessage ??
    (isMinutoActive
      ? 'Radio y TV de estación detenidas. Usa Escuchar En Vivo o Ver TV En Vivo para cambiar.'
      : isTvActive
        ? 'Radio y Minuto detenidos. Usa Escuchar En Vivo para volver a la radio.'
        : (currentTrack?.subtitle ??
          'Radio, señal de estación y Minuto son señales distintas — una a la vez.'));

  return (
    <div className={`global-player${busy ? ' global-player--active' : ''}`}>
      <div className="shell global-player__inner">
        <div className="global-player__meta">
          <span className="global-player__badge">
            <Radio size={14} />
            Reproductor permanente
          </span>
          <div>
            <p className="global-player__title">{title}</p>
            <p
              className={`global-player__subtitle${errorMessage ? ' global-player__subtitle--error' : ''}`}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div className="global-player__controls">
          <button
            className="player-button"
            disabled={isLoading}
            onClick={() => void togglePlayback()}
            type="button"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isLoading ? 'Conectando…' : isPlaying ? 'Pausar' : 'Reproducir'}
          </button>
          <button
            className="player-button player-button--quiet"
            onClick={() => {
              stop();
              stopTv();
              stopMinuto();
            }}
            type="button"
          >
            Detener
          </button>
          <label className="global-player__volume">
            <Volume2 size={16} />
            <input
              aria-label="Volumen del reproductor"
              max="1"
              min="0"
              onChange={(event) => setVolume(Number(event.target.value))}
              step="0.01"
              type="range"
              value={volume}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
