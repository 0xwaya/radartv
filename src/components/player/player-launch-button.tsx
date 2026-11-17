'use client';

import { ExternalLink, LoaderCircle, Pause, Play } from 'lucide-react';

import { usePlayer } from '@/components/player/player-provider';
import type { Track } from '@/content/site';

type PlayerLaunchButtonProps = {
  track: Track;
  variant?: 'primary' | 'secondary';
};

export function PlayerLaunchButton({ track, variant = 'primary' }: PlayerLaunchButtonProps) {
  const { playTrack, stop, isPlaying, isLoading, currentTrack } = usePlayer();
  const isThisTrack = currentTrack?.id === track.id;
  const active = isThisTrack && isPlaying;
  const connecting = isThisTrack && isLoading;

  if (!track.url && track.externalUrl) {
    return (
      <a className={`button button--${variant}`} href={track.externalUrl} rel="noreferrer" target="_blank">
        <ExternalLink size={16} />
        Abrir Fuente
      </a>
    );
  }

  const label =
    track.kind === 'live'
      ? connecting
        ? 'Conectando…'
        : active
          ? 'Pausar Radio'
          : 'Escuchar En Vivo'
      : connecting
        ? 'Cargando…'
        : active
          ? 'Pausar'
          : 'Reproducir Preview';

  return (
    <button
      aria-busy={connecting}
      className={`button button--${variant}`}
      disabled={connecting}
      onClick={() => {
        if (active) {
          stop();
          return;
        }
        void playTrack(track);
      }}
      type="button"
    >
      {connecting ? (
        <LoaderCircle className="button__spin" size={16} />
      ) : active ? (
        <Pause size={16} />
      ) : (
        <Play size={16} />
      )}
      {label}
    </button>
  );
}
