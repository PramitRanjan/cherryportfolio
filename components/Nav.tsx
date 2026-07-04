import { getSiteContent } from '@/lib/site-content';
import type { SectionKey } from '@/lib/site-content-schema';
import { NavInner } from '@/components/NavInner';

const HREF_BY_SECTION: Record<SectionKey, string> = {
  home: '/',
  work: '/work',
  about: '/about',
  creative: '/creative',
  play: '/play',
};

export function Nav() {
  const { visibleSections, copy } = getSiteContent();

  const links = visibleSections.map((key) => ({
    key,
    label: copy.navLabels[key] ?? key,
    href: HREF_BY_SECTION[key],
  }));

  return <NavInner links={links} />;
}
