import 'server-only';
import rawContent from '@/content/site-content.json';
import {
  assertSiteContent,
  type CaseStudyContent,
  type SectionKey,
  type SiteContent,
} from '@/lib/site-content-schema';

let validated: SiteContent | null = null;

/**
 * The whole site reads through here. Static import means dev edits
 * hot-reload and prod updates arrive via the GitHub-commit → redeploy
 * path (Git is the database).
 */
export function getSiteContent(): SiteContent {
  if (!validated) {
    assertSiteContent(rawContent);
    validated = rawContent;
  }
  return validated;
}

export function getCaseStudy(slug: string): CaseStudyContent | undefined {
  return getSiteContent().caseStudies.find((cs) => cs.slug === slug);
}

export function getVisibleSections(): SectionKey[] {
  return getSiteContent().visibleSections;
}
