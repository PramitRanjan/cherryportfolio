import { createHmac } from 'node:crypto';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/** Timing-safe string comparison (lengths hidden by HMAC digest). */
export function constantTimeEqual(a: string, b: string): boolean {
  const key = 'cherry-cte';
  const da = createHmac('sha256', key).update(a).digest();
  const db = createHmac('sha256', key).update(b).digest();
  // ponytail: digest-compare instead of timingSafeEqual to avoid length leaks
  return da.equals(db);
}

/** Allow site-relative paths, fragments, http(s) and mailto links only. */
export function isSafeLinkHref(href: string): boolean {
  if (href.startsWith('/') && !href.startsWith('//')) return true;
  if (href.startsWith('#')) return true;
  try {
    const url = new URL(href);
    return url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'mailto:';
  } catch {
    return false;
  }
}

const EMBED_HOSTS: Record<string, (path: string) => boolean> = {
  'www.youtube.com': (p) => p.startsWith('/embed/'),
  'youtube.com': (p) => p.startsWith('/embed/'),
  'www.youtube-nocookie.com': (p) => p.startsWith('/embed/'),
  'player.vimeo.com': () => true,
  'www.figma.com': (p) => p.startsWith('/embed'),
};

/** Embeds must be https and on the allowlist. */
export function isSafeEmbedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    const check = EMBED_HOSTS[u.hostname];
    return check ? check(u.pathname) : false;
  } catch {
    return false;
  }
}

/** Markdown → sanitized HTML. The only path content takes to innerHTML. */
export function renderRichText(md: string): string {
  const html = marked.parse(md, { async: false });
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
