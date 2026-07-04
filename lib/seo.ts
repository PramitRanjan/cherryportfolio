/** Canonical site origin — set NEXT_PUBLIC_SITE_URL in prod (no trailing slash). */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path}`;
}
