import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assertSiteContent, isSiteContent } from '../lib/site-content-schema.ts';

const seed = () => JSON.parse(readFileSync(join(import.meta.dirname, '../content/site-content.json'), 'utf8'));

test('seed content passes the guard', () => {
  assert.equal(isSiteContent(seed()), true);
});

test('guard rejects missing caseStudies with the failing path', () => {
  const broken = seed();
  delete broken.caseStudies;
  assert.throws(() => assertSiteContent(broken), /caseStudies/);
});

test('guard rejects a case section without a body', () => {
  const broken = seed();
  delete broken.caseStudies[0].sections[0].body;
  assert.throws(() => assertSiteContent(broken), /sections\[0\]\.body/);
});

test('guard rejects unknown visibleSections keys', () => {
  const broken = seed();
  broken.visibleSections.push('secret');
  assert.throws(() => assertSiteContent(broken), /visibleSections/);
});

test('guard rejects a media block with a bad kind', () => {
  const broken = seed();
  broken.caseStudies[0].sections[0].media = [{ kind: 'video' }];
  assert.throws(() => assertSiteContent(broken), /kind/);
});

test('prev/next chain is consistent with slugs', () => {
  const content = seed();
  const hrefs = new Set(content.caseStudies.map((c: { slug: string }) => `/work/${c.slug}`));
  for (const cs of content.caseStudies) {
    if (cs.prev) assert.equal(hrefs.has(cs.prev.href), true, `${cs.slug}.prev → ${cs.prev.href}`);
    if (cs.next) assert.equal(hrefs.has(cs.next.href), true, `${cs.slug}.next → ${cs.next.href}`);
  }
});
