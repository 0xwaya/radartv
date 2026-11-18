export type StreamItem = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
};

const STREAMS_URL = 'https://www.youtube.com/@deibisromerolocutor/streams';
const WATCH_URL = 'https://www.youtube.com/watch?v=';

const FALLBACK_STREAMS: StreamItem[] = [
  {
    id: 'canal-streams',
    title: 'Ver todos los streams en el canal oficial',
    url: STREAMS_URL,
    thumbnail: 'https://i.ytimg.com/vi_webp/live/default.webp',
  },
  {
    id: 'canal-home',
    title: 'Canal de Deibis Romero en YouTube',
    url: 'https://www.youtube.com/@deibisromerolocutor',
    thumbnail: 'https://i.ytimg.com/vi_webp/default/default.webp',
  },
];

/** UI chrome / hotkey dialog labels that must never appear as stream titles. */
const JUNK_TITLE_RE =
  /^(keyboard shortcuts|skip navigation|watch later|added|share|save to playlist|add to queue)$/i;

function decodeTitle(value: string) {
  return value
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .trim();
}

function isUsableTitle(title: string) {
  return title.length >= 3 && !JUNK_TITLE_RE.test(title);
}

function isVideoId(value: string | undefined): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(value);
}

/** Prefer the lockup's own contentId; fall back to thumbnail / videoId fields. */
function extractLockupVideoId(block: string): string | null {
  const contentId = block.match(/"contentId":"([a-zA-Z0-9_-]{11})"/)?.[1];
  if (isVideoId(contentId)) return contentId;

  const videoId = block.match(/"videoId":"([a-zA-Z0-9_-]{11})"/)?.[1];
  if (isVideoId(videoId)) return videoId;

  const fromThumb = block.match(/vi\/([a-zA-Z0-9_-]{11})\//)?.[1];
  return isVideoId(fromThumb) ? fromThumb : null;
}

/**
 * Extract balanced `{...}` objects that follow `"key":` in YouTube's
 * ytInitialData blob. Limited depth/size so a malformed page cannot hang SSR.
 */
function extractObjects(html: string, key: string, max = 12, maxLen = 20000): string[] {
  const needle = `"${key}":{`;
  const out: string[] = [];
  let start = 0;

  while (out.length < max) {
    const i = html.indexOf(needle, start);
    if (i < 0) break;

    const braceStart = i + needle.length - 1;
    let depth = 0;
    let end = -1;

    for (let k = braceStart; k < html.length && k < braceStart + maxLen; k += 1) {
      const ch = html[k];
      if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          end = k;
          break;
        }
      }
    }

    if (end > braceStart) {
      out.push(html.slice(i, end + 1));
    }

    start = i + needle.length;
  }

  return out;
}

/** Current YouTube channel /streams markup (lockupViewModel). */
function parseLockupStreams(html: string, limit: number): StreamItem[] {
  const seen = new Set<string>();
  const items: StreamItem[] = [];

  for (const block of extractObjects(html, 'lockupViewModel', Math.max(limit * 2, 12))) {
    const videoId = extractLockupVideoId(block);
    const titleMatch = block.match(
      /"lockupMetadataViewModel":\{"title":\{"content":"([^"]+)"/,
    );
    if (!videoId || !titleMatch) continue;

    const title = decodeTitle(titleMatch[1]);
    if (seen.has(videoId) || !isUsableTitle(title)) continue;

    seen.add(videoId);
    items.push({
      id: videoId,
      title,
      url: `${WATCH_URL}${videoId}`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    });

    if (items.length >= limit) break;
  }

  return items;
}

/**
 * Legacy videoRenderer markup. Keep as a fallback — the old regex could
 * pair a real videoId with nearby UI chrome titles (e.g. "Keyboard shortcuts").
 */
function parseLegacyStreams(html: string, limit: number): StreamItem[] {
  // Cap the gap between videoId and title so UI chrome elsewhere on the page
  // cannot be paired with a stream id (the original "Keyboard shortcuts" bug).
  const regex =
    /"videoId":"([a-zA-Z0-9_-]{11})"[\s\S]{0,800}?"title":\{"runs":\[\{"text":"([^"]+)"/g;
  const seen = new Set<string>();
  const items: StreamItem[] = [];

  for (const match of html.matchAll(regex)) {
    const [, videoId, rawTitle] = match;
    const title = decodeTitle(rawTitle);
    if (seen.has(videoId) || !isUsableTitle(title)) continue;

    seen.add(videoId);
    items.push({
      id: videoId,
      title,
      url: `${WATCH_URL}${videoId}`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    });

    if (items.length >= limit) break;
  }

  return items;
}

export async function getTopStreams(limit = 6): Promise<StreamItem[]> {
  try {
    const response = await fetch(STREAMS_URL, {
      next: { revalidate: 1800 },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; RadarTV/1.0; +https://radartv.vercel.app)',
      },
    });

    if (!response.ok) {
      return FALLBACK_STREAMS;
    }

    const html = await response.text();
    const lockup = parseLockupStreams(html, limit);
    if (lockup.length > 0) {
      return lockup;
    }

    const legacy = parseLegacyStreams(html, limit);
    return legacy.length > 0 ? legacy : FALLBACK_STREAMS;
  } catch {
    return FALLBACK_STREAMS;
  }
}
