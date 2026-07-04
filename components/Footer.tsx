import { getSiteContent } from '@/lib/site-content';
import KoiDrift from '@/components/motifs/KoiDrift';

/** Compact cream sign-off — hairline rule, one warm line, one koi. */
export function Footer() {
  const { copy, aboutPage } = getSiteContent();

  return (
    <footer
      className="relative mt-28 overflow-hidden"
      style={{ borderTop: '1px solid var(--color-line)' }}
    >
      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16">
        <p
          className="font-serif italic"
          style={{ fontSize: 'var(--text-h1)', lineHeight: 1.1, color: 'var(--color-ink)' }}
        >
          {copy.footerLine}
        </p>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <ul className="flex flex-wrap gap-6">
            {aboutPage.contactLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="u-eyebrow transition-colors hover:text-[color:var(--color-accent)]"
                  style={{ transitionDuration: 'var(--motion-fast)' }}
                >
                  ( {link.label.toLowerCase()} )
                </a>
              </li>
            ))}
          </ul>
          <p className="u-eyebrow" style={{ color: 'var(--color-muted)' }}>
            {copy.footerMeta}
          </p>
        </div>
      </div>

      {/* one koi slipping past the corner */}
      <KoiDrift count={1} className="absolute -right-10 top-2 hidden h-32 w-64 opacity-70 md:block" />
    </footer>
  );
}
