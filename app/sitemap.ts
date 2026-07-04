import type { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const { visibleSections, caseStudies } = getSiteContent();

  const sectionPaths: Record<string, string> = {
    home: '/',
    work: '/work',
    about: '/about',
    creative: '/creative',
    play: '/play',
  };

  const pages = visibleSections.map((key) => ({ url: absoluteUrl(sectionPaths[key]) }));
  const studies = visibleSections.includes('work')
    ? caseStudies.map((cs) => ({ url: absoluteUrl(`/work/${cs.slug}`) }))
    : [];

  return [...pages, ...studies];
}
