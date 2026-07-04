/**
 * The entire site is one validated JSON file: content/site-content.json.
 * This module is the single source of truth for its shape.
 */

export const SECTION_KEYS = ['home', 'work', 'about', 'creative', 'play'] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export interface LinkItem {
  label: string;
  href: string;
}

export interface EntryItem {
  org: string;
  role: string;
  date: string;
  desc: string;
}

export interface ProjectLink {
  title: string;
  href: string;
}

export interface MediaBlock {
  kind: 'image' | 'gallery' | 'embed';
  images?: string[];
  embedUrl?: string;
  caption?: string;
  layout?: 'full' | 'inset' | 'split';
}

/**
 * One chapter of a case study. The canonical narrative arc
 * (problem → role → research → process → solution → outcomes) is the
 * seeded default order, but Cherry can reorder, rename, or omit
 * sections per project purely through content.
 */
export interface CaseSection {
  key: string;
  eyebrow: string;
  headline?: string;
  body: string; // rich text (markdown)
  media?: MediaBlock[];
}

export interface WorkProject {
  title: string;
  oneliner: string;
  tags: string[];
  href: string;
  cover?: string;
  hoverImage?: string;
  previewImages?: string[];
  accent?: string; // accent token name, e.g. "aurora" → var(--accent-aurora)
  year?: string;
}

export interface CaseStudyContent {
  slug: string;
  title: string;
  oneliner: string;
  type: string;
  tags: string[];
  accent?: string;
  heroImage?: string;
  year?: string;
  award?: string; // real awards only
  team?: string; // real collaborators only
  prev: ProjectLink | null;
  next: ProjectLink | null;
  pullQuote?: string;
  sections: CaseSection[];
}

export interface CreativeItem {
  title: string;
  caption?: string;
  image?: string;
  tint?: string;
}

export interface PlayItem {
  title: string;
  body?: string;
  href?: string;
  motif?: string;
}

export interface SiteCopy {
  navLabels: Partial<Record<SectionKey, string>>;
  footerLine: string;
  footerMeta: string;
  workCta: string;
  scrollCue: string;
  emptyState: string;
  [k: string]: unknown;
}

export interface SiteContent {
  home: {
    hero: { name: string; tagline: string; intro: string; eyebrow: string };
    selectedWork: { heading: string; body: string; items: WorkProject[] };
    about: { heading: string; body: string; linkLabel: string };
  };
  workPage: {
    heroTitle: string;
    heroBody: string;
    projects: WorkProject[];
  };
  aboutPage: {
    heroBody: string;
    whoIAm: string; // rich text
    experience: EntryItem[];
    education: EntryItem[];
    tools: string[];
    contactTitle: string;
    contactBody: string;
    contactLinks: LinkItem[];
  };
  creative: { heroTitle: string; heroBody: string; items: CreativeItem[] };
  play: { heroTitle: string; heroBody: string; experiments: PlayItem[] };
  copy: SiteCopy;
  visibleSections: SectionKey[];
  caseStudies: CaseStudyContent[];
}

/* ============================================================
   Validation — structural guard with failing-path reporting
   ============================================================ */

class ValidationError extends Error {}

function fail(path: string, expected: string): never {
  throw new ValidationError(`site-content invalid at "${path}": expected ${expected}`);
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function str(x: Record<string, unknown>, key: string, path: string): void {
  if (typeof x[key] !== 'string') fail(`${path}.${key}`, 'string');
}

function optStr(x: Record<string, unknown>, key: string, path: string): void {
  if (x[key] !== undefined && typeof x[key] !== 'string') fail(`${path}.${key}`, 'string | undefined');
}

function strArray(x: Record<string, unknown>, key: string, path: string): void {
  const v = x[key];
  if (!Array.isArray(v) || v.some((s) => typeof s !== 'string')) fail(`${path}.${key}`, 'string[]');
}

function objArray(
  x: Record<string, unknown>,
  key: string,
  path: string,
  check: (item: Record<string, unknown>, itemPath: string) => void,
): void {
  const v = x[key];
  if (!Array.isArray(v)) fail(`${path}.${key}`, 'array');
  v.forEach((item, i) => {
    if (!isRecord(item)) fail(`${path}.${key}[${i}]`, 'object');
    check(item, `${path}.${key}[${i}]`);
  });
}

function checkLink(x: Record<string, unknown>, path: string): void {
  str(x, 'label', path);
  str(x, 'href', path);
}

function checkEntry(x: Record<string, unknown>, path: string): void {
  str(x, 'org', path);
  str(x, 'role', path);
  str(x, 'date', path);
  str(x, 'desc', path);
}

function checkMediaBlock(x: Record<string, unknown>, path: string): void {
  if (x.kind !== 'image' && x.kind !== 'gallery' && x.kind !== 'embed') {
    fail(`${path}.kind`, `'image' | 'gallery' | 'embed'`);
  }
  if (x.images !== undefined) strArray(x, 'images', path);
  optStr(x, 'embedUrl', path);
  optStr(x, 'caption', path);
  if (x.layout !== undefined && x.layout !== 'full' && x.layout !== 'inset' && x.layout !== 'split') {
    fail(`${path}.layout`, `'full' | 'inset' | 'split' | undefined`);
  }
}

function checkWorkProject(x: Record<string, unknown>, path: string): void {
  str(x, 'title', path);
  str(x, 'oneliner', path);
  strArray(x, 'tags', path);
  str(x, 'href', path);
  optStr(x, 'cover', path);
  optStr(x, 'hoverImage', path);
  if (x.previewImages !== undefined) strArray(x, 'previewImages', path);
  optStr(x, 'accent', path);
  optStr(x, 'year', path);
}

function checkCaseSection(x: Record<string, unknown>, path: string): void {
  str(x, 'key', path);
  str(x, 'eyebrow', path);
  optStr(x, 'headline', path);
  str(x, 'body', path);
  if (x.media !== undefined) objArray(x, 'media', path, checkMediaBlock);
}

function checkProjectLinkOrNull(v: unknown, path: string): void {
  if (v === null) return;
  if (!isRecord(v)) fail(path, 'ProjectLink | null');
  str(v, 'title', path);
  str(v, 'href', path);
}

function checkCaseStudy(x: Record<string, unknown>, path: string): void {
  str(x, 'slug', path);
  str(x, 'title', path);
  str(x, 'oneliner', path);
  str(x, 'type', path);
  strArray(x, 'tags', path);
  optStr(x, 'accent', path);
  optStr(x, 'heroImage', path);
  optStr(x, 'year', path);
  optStr(x, 'award', path);
  optStr(x, 'team', path);
  if (!('prev' in x)) fail(`${path}.prev`, 'ProjectLink | null');
  if (!('next' in x)) fail(`${path}.next`, 'ProjectLink | null');
  checkProjectLinkOrNull(x.prev, `${path}.prev`);
  checkProjectLinkOrNull(x.next, `${path}.next`);
  optStr(x, 'pullQuote', path);
  objArray(x, 'sections', path, checkCaseSection);
}

/** Throws a ValidationError naming the failing path. */
export function assertSiteContent(x: unknown): asserts x is SiteContent {
  if (!isRecord(x)) fail('$', 'object');

  if (!isRecord(x.home)) fail('home', 'object');
  if (!isRecord(x.home.hero)) fail('home.hero', 'object');
  str(x.home.hero, 'name', 'home.hero');
  str(x.home.hero, 'tagline', 'home.hero');
  str(x.home.hero, 'intro', 'home.hero');
  str(x.home.hero, 'eyebrow', 'home.hero');
  if (!isRecord(x.home.selectedWork)) fail('home.selectedWork', 'object');
  str(x.home.selectedWork, 'heading', 'home.selectedWork');
  str(x.home.selectedWork, 'body', 'home.selectedWork');
  objArray(x.home.selectedWork, 'items', 'home.selectedWork', checkWorkProject);
  if (!isRecord(x.home.about)) fail('home.about', 'object');
  str(x.home.about, 'heading', 'home.about');
  str(x.home.about, 'body', 'home.about');
  str(x.home.about, 'linkLabel', 'home.about');

  if (!isRecord(x.workPage)) fail('workPage', 'object');
  str(x.workPage, 'heroTitle', 'workPage');
  str(x.workPage, 'heroBody', 'workPage');
  objArray(x.workPage, 'projects', 'workPage', checkWorkProject);

  if (!isRecord(x.aboutPage)) fail('aboutPage', 'object');
  str(x.aboutPage, 'heroBody', 'aboutPage');
  str(x.aboutPage, 'whoIAm', 'aboutPage');
  objArray(x.aboutPage, 'experience', 'aboutPage', checkEntry);
  objArray(x.aboutPage, 'education', 'aboutPage', checkEntry);
  strArray(x.aboutPage, 'tools', 'aboutPage');
  str(x.aboutPage, 'contactTitle', 'aboutPage');
  str(x.aboutPage, 'contactBody', 'aboutPage');
  objArray(x.aboutPage, 'contactLinks', 'aboutPage', checkLink);

  if (!isRecord(x.creative)) fail('creative', 'object');
  str(x.creative, 'heroTitle', 'creative');
  str(x.creative, 'heroBody', 'creative');
  objArray(x.creative, 'items', 'creative', (item, p) => {
    str(item, 'title', p);
    optStr(item, 'caption', p);
    optStr(item, 'image', p);
    optStr(item, 'tint', p);
  });

  if (!isRecord(x.play)) fail('play', 'object');
  str(x.play, 'heroTitle', 'play');
  str(x.play, 'heroBody', 'play');
  objArray(x.play, 'experiments', 'play', (item, p) => {
    str(item, 'title', p);
    optStr(item, 'body', p);
    optStr(item, 'href', p);
    optStr(item, 'motif', p);
  });

  if (!isRecord(x.copy)) fail('copy', 'object');
  if (!isRecord(x.copy.navLabels)) fail('copy.navLabels', 'object');
  str(x.copy, 'footerLine', 'copy');
  str(x.copy, 'footerMeta', 'copy');
  str(x.copy, 'workCta', 'copy');
  str(x.copy, 'scrollCue', 'copy');
  str(x.copy, 'emptyState', 'copy');

  const vs = x.visibleSections;
  if (!Array.isArray(vs) || vs.some((k) => !SECTION_KEYS.includes(k as SectionKey))) {
    fail('visibleSections', `array of ${SECTION_KEYS.join(' | ')}`);
  }

  objArray(x, 'caseStudies', '$', checkCaseStudy);
}

export function isSiteContent(x: unknown): x is SiteContent {
  try {
    assertSiteContent(x);
    return true;
  } catch {
    return false;
  }
}
