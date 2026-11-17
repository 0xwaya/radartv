'use client';

import { Pause, Play, Radio, Volume2 } from 'lucide-react';

import { usePlayer } from '@/components/player/player-provider';

export function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlayback, stop, setVolume, volume, errorMessage } =
    usePlayer();

  return (
    <div className="global-player">
      <div className="shell global-player__inner">
        <div className="global-player__meta">
          <span className="global-player__badge">
            <Radio size={14} />
            Reproductor permanente
          </span>
          <div>
            <p className="global-player__title">{currentTrack?.title ?? 'Listo para reproducir en vivo'}</p>
            <p
              className={`global-player__subtitle${errorMessage ? ' global-player__subtitle--error' : ''}`}
            >
              {errorMessage ??
                currentTrack?.subtitle ??
                'Usa cualquier acción en vivo para iniciar la reproducción.'}
            </p>
          </div>
        </div>
        <div className="global-player__controls">
          <button className="player-button" onClick={() => void togglePlayback()} type="button">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pausar' : 'Reproducir'}
          </button>
          <button className="player-button player-button--quiet" onClick={stop} type="button">
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
