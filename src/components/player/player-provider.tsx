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
import { LIVE_TV_PLAY_EVENT } from '@/lib/live-media-events';

export type ActiveMedium = 'none' | 'radio' | 'tv';

type PlayerContextValue = {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  isTvActive: boolean;
  activeMedium: ActiveMedium;
  volume: number;
  errorMessage: string | null;
  playTrack: (track: Track) => Promise<void>;
  togglePlayback: () => Promise<void>;
  startTv: () => void;
  stopTv: () => void;
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
    artwork: [{ src: deibisProfile.image, sizes: '512x512', type: 'image/jpeg' }],
  });
  navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
}

function ensureAudioElement(audioRef: { current: HTMLAudioElement | null }) {
  if (audioRef.current) {
    return audioRef.current;
  }

  const audio = new Audio();
  audio.preload = 'none';
  audioRef.current = audio;
  return audio;
}

function hardStopAudio(audio: HTMLAudioElement) {
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTvActive, setIsTvActive] = useState(false);
  const [volume, setVolumeState] = useState(0.72);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeMedium: ActiveMedium = isTvActive ? 'tv' : isPlaying || isLoading ? 'radio' : 'none';

  const stopTv = useCallback(() => {
    setIsTvActive(false);
  }, []);

  const stopRadio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }
    hardStopAudio(audio);
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const startTv = useCallback(() => {
    stopRadio();
    setIsTvActive(true);
    document.getElementById('tv-en-vivo')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [stopRadio]);

  useEffect(() => {
    const audio = ensureAudioElement(audioRef);

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
      setIsLoading(false);
      setErrorMessage(null);
    };
    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setErrorMessage('No se pudo reproducir la señal. Inténtalo de nuevo en unos segundos.');
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      hardStopAudio(audio);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    syncMediaSession(currentTrack, isPlaying);
  }, [currentTrack, isPlaying]);

  // Hero “Ver TV En Vivo” and in-player CTA both go through this event.
  useEffect(() => {
    const onPlayTv = () => startTv();
    window.addEventListener(LIVE_TV_PLAY_EVENT, onPlayTv);
    return () => window.removeEventListener(LIVE_TV_PLAY_EVENT, onPlayTv);
  }, [startTv]);

  const playTrack = useCallback(
    async (track: Track) => {
      if (!track.url) {
        if (track.externalUrl) {
          window.open(track.externalUrl, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      // Exclusive: radio kills TV embed so it cannot keep playing in the background.
      stopTv();

      const audio = ensureAudioElement(audioRef);
      setCurrentTrack(track);
      setErrorMessage(null);
      setIsLoading(true);

      try {
        const alreadyLoaded =
          Boolean(audio.getAttribute('src')) &&
          (audio.src === track.url ||
            audio.src.startsWith(`${track.url}?`) ||
            audio.src.startsWith(`${track.url}&`));

        if (!alreadyLoaded) {
          audio.src = track.url;
          audio.load();
        }

        await audio.play();
      } catch {
        try {
          audio.src = track.url;
          audio.load();
          await audio.play();
        } catch {
          setIsPlaying(false);
          setIsLoading(false);
          setErrorMessage(
            'No se pudo iniciar la reproducción. Revisa tu conexión o prueba más tarde.',
          );
        }
      }
    },
    [stopTv],
  );

  const togglePlayback = useCallback(async () => {
    const audio = ensureAudioElement(audioRef);

    if (!currentTrack || !audio.getAttribute('src')) {
      await playTrack(liveTrack);
      return;
    }

    if (audio.paused) {
      try {
        stopTv();
        setErrorMessage(null);
        setIsLoading(true);
        await audio.play();
      } catch {
        setIsPlaying(false);
        setIsLoading(false);
        setErrorMessage('No se pudo reanudar la señal en vivo.');
      }
      return;
    }

    audio.pause();
  }, [currentTrack, playTrack, stopTv]);

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
      stopRadio();
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
    };
  }, [stopRadio, togglePlayback]);

  const setVolume = (nextVolume: number) => {
    const audio = ensureAudioElement(audioRef);
    audio.volume = nextVolume;
    setVolumeState(nextVolume);
    window.localStorage.setItem('radartv-volume', String(nextVolume));
  };

  const stop = () => {
    stopRadio();
  };

  const clearError = () => setErrorMessage(null);

  const value: PlayerContextValue = {
    currentTrack,
    isPlaying,
    isLoading,
    isTvActive,
    activeMedium,
    volume,
    errorMessage,
    playTrack,
    togglePlayback,
    startTv,
    stopTv,
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
