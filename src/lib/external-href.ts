/**
 * Instagram mobile web often tries to hand off via `instagram://…`.
 * Opera treats that custom scheme as an invalid address, especially in a new tab.
 * Same-tab HTTPS navigation keeps the web profile usable after dismissing the dialog.
 */
export function isInstagramHref(href: string): boolean {
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    return host === 'instagram.com';
  } catch {
    return false;
  }
}

export function externalAnchorProps(href: string): {
  href: string;
  rel: 'noopener noreferrer';
  target?: '_blank';
} {
  if (isInstagramHref(href)) {
    return { href, rel: 'noopener noreferrer' };
  }
  return { href, rel: 'noopener noreferrer', target: '_blank' };
}
