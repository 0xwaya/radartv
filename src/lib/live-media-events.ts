/** User-gesture events so video players only start after an explicit click. */

export const LIVE_TV_PLAY_EVENT = 'radartv:play-station-tv';
export const MINUTO_PLAY_EVENT = 'radartv:play-minuto';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

/** Starts the station live TV HLS player (not Minuto, not radio). */
export function requestLiveTvPlay() {
  if (typeof window === 'undefined') {
    return;
  }

  scrollToId('tv-en-vivo');
  window.dispatchEvent(new CustomEvent(LIVE_TV_PLAY_EVENT));
}

/** Starts Minuto en la Noticia (tvstream embed Deibis sent). */
export function requestMinutoPlay() {
  if (typeof window === 'undefined') {
    return;
  }

  scrollToId('minuto-noticia');
  window.dispatchEvent(new CustomEvent(MINUTO_PLAY_EVENT));
}
