/**
 * Instagram mobile web often tries to hand off via `instagram://…`.
 * Opera (and some WebViews) reject that custom scheme as an “invalid address”.
 * Route Instagram CTAs through our same-origin bridge first; open the real profile
 * only from an explicit new-tab click on that page.
 */
export const instagramBridgePath = '/go/instagram';

const knownInstagramProfiles: Record<string, string> = {
  deibisromero: 'deibisromero',
  elradar_oficial: 'elradar_oficial',
};

export function isInstagramHref(href: string): boolean {
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    return host === 'instagram.com';
  } catch {
    return false;
  }
}

/** Map an Instagram profile URL to the same-origin bridge path (optional ?profile=). */
export function instagramBridgeHref(href: string): string {
  try {
    const url = new URL(href);
    const handle = url.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
    if (handle && handle !== 'deibisromero' && knownInstagramProfiles[handle]) {
      return `${instagramBridgePath}?profile=${knownInstagramProfiles[handle]}`;
    }
  } catch {
    // fall through to default bridge
  }
  return instagramBridgePath;
}

export function externalAnchorProps(href: string): {
  href: string;
  rel?: 'noopener noreferrer';
  target?: '_blank';
} {
  if (isInstagramHref(href)) {
    return { href: instagramBridgeHref(href) };
  }
  return { href, rel: 'noopener noreferrer', target: '_blank' };
}
