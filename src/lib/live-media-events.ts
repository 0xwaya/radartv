/** Lightweight coordination — avoid remounting the live TV iframe. */

export function requestLiveTvPlay() {
  if (typeof window === 'undefined') {
    return;
  }

  const target = document.getElementById('tv-en-vivo');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function pauseLiveTv() {
  // Intentionally a no-op: tearing down the tvstream iframe mid-broadcast
  // caused glitchy reloads. Radio and TV can coexist; the user controls each.
}

export function notifyLiveRadioPlay() {
  // No-op companion for pauseLiveTv — kept so call sites stay stable.
}
