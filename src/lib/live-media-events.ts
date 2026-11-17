/** Dispatched after a user click so LiveTvPlayer can mount the embed. */

export const LIVE_TV_PLAY_EVENT = 'radartv:play-live-tv';

export function requestLiveTvPlay() {
  if (typeof window === 'undefined') {
    return;
  }

  document.getElementById('tv-en-vivo')?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
  window.dispatchEvent(new CustomEvent(LIVE_TV_PLAY_EVENT));
}
