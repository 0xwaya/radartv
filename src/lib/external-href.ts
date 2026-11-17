/**
 * Instagram mobile web often tries to hand off via `instagram://…`.
 * Opera (and some WebViews) reject that custom scheme as an “invalid address”.
 * Route Instagram CTAs through our same-origin bridge first; open the real profile
 * only from an explicit new-tab click on that page.
 */
export const instagramBridgePath = '/go/instagram';

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
  rel?: 'noopener noreferrer';
  target?: '_blank';
} {
  if (isInstagramHref(href)) {
    return { href: instagramBridgePath };
  }
  return { href, rel: 'noopener noreferrer', target: '_blank' };
}
