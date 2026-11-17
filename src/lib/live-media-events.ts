/** Cross-widget signals so radio and TV don't fight for attention. */

export const LIVE_TV_PLAY_EVENT = 'radartv:play-live-tv';
export const LIVE_TV_PAUSE_EVENT = 'radartv:pause-live-tv';
export const LIVE_RADIO_PLAY_EVENT = 'radartv:play-live-radio';

export function requestLiveTvPlay() {
  if (typeof window === 'undefined') {
    return;
  }

  const target = document.getElementById('tv-en-vivo');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.dispatchEvent(new CustomEvent(LIVE_TV_PLAY_EVENT));
}

export function pauseLiveTv() {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(LIVE_TV_PAUSE_EVENT));
}

export function notifyLiveRadioPlay() {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(LIVE_RADIO_PLAY_EVENT));
}
