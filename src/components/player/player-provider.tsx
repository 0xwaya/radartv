'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { deibisProfile, liveTrack, type Track } from '@/content/site';

type PlayerContextValue = {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  errorMessage: string | null;
  playTrack: (track: Track) => Promise<void>;
  togglePlayback: () => Promise<void>;
  setVolume: (volume: number) => void;
  stop: () => void;
  clearError: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function syncMediaSession(track: Track | null, isPlaying: boolean) {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
    return;
  }

  if (!track) {
    navigator.mediaSession.metadata = null;
    return;
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: deibisProfile.name,
    album: 'El Radar Radio',
    artwork: [
      { src: deibisProfile.image, sizes: '512x512', type: 'image/jpeg' },
    ],
  });
  navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.72);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const storedVolume = window.localStorage.getItem('radartv-volume');
    if (storedVolume) {
      const parsed = Number(storedVolume);
      if (!Number.isNaN(parsed)) {
        audio.volume = parsed;
        setVolumeState(parsed);
      }
    } else {
      audio.volume = 0.72;
    }

    const handlePlay = () => {
      setIsPlaying(true);
      setErrorMessage(null);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      setErrorMessage('No se pudo reproducir la señal. Inténtalo de nuevo en unos segundos.');
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    syncMediaSession(currentTrack, isPlaying);
  }, [currentTrack, isPlaying]);

  const playTrack = useCallback(async (track: Track) => {
    if (!track.url || !audioRef.current) {
      if (track.externalUrl) {
        window.open(track.externalUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    try {
      if (audioRef.current.src !== track.url) {
        audioRef.current.src = track.url;
      }

      setCurrentTrack(track);
      setErrorMessage(null);
      await audioRef.current.play();
    } catch {
      setIsPlaying(false);
      setErrorMessage('No se pudo iniciar la reproducción. Revisa tu conexión o prueba más tarde.');
    }
  }, []);

  const togglePlayback = useCallback(async () => {
    if (!audioRef.current) {
      return;
    }

    if (!currentTrack) {
      await playTrack(liveTrack);
      return;
    }

    if (audioRef.current.paused) {
      try {
        setErrorMessage(null);
        await audioRef.current.play();
      } catch {
        setIsPlaying(false);
        setErrorMessage('No se pudo reanudar la señal en vivo.');
      }
      return;
    }

    audioRef.current.pause();
  }, [currentTrack, playTrack]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    navigator.mediaSession.setActionHandler('play', () => {
      void togglePlayback();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      audioRef.current?.pause();
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      if (!audioRef.current) {
        return;
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
    };
  }, [togglePlayback]);

  const setVolume = (nextVolume: number) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = nextVolume;
    setVolumeState(nextVolume);
    window.localStorage.setItem('radartv-volume', String(nextVolume));
  };

  const stop = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const clearError = () => setErrorMessage(null);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    errorMessage,
    playTrack,
    togglePlayback,
    setVolume,
    stop,
    clearError,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }

  return context;
}
