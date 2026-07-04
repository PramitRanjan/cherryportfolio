'use client';

import type { SiteContent, SectionKey } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import { CheckboxField } from '@/components/admin/fields';

// Canonical order preserved on write regardless of toggle order.
const CANONICAL_ORDER: SectionKey[] = ['home', 'work', 'about', 'creative', 'play'];

export default function VisibilityTab({
  content,
  patch,
  sectionKeys,
}: {
  content: SiteContent;
  patch: Patch;
  sectionKeys: readonly SectionKey[];
}) {
  const visible = new Set(content.visibleSections);

  function toggle(key: SectionKey, checked: boolean) {
    patch((d) => {
      const next = new Set(d.visibleSections);
      if (checked) next.add(key);
      else next.delete(key);
      d.visibleSections = CANONICAL_ORDER.filter((k) => next.has(k));
      return d;
    });
  }

  return (
    <div>
      <p className="u-eyebrow mb-6" style={{ color: 'var(--color-muted)' }}>
        hidden sections still render if you visit the url — they&apos;re just not in the nav.
      </p>
      {sectionKeys.map((key) => (
        <CheckboxField
          key={key}
          label={key}
          checked={visible.has(key)}
          onChange={(v) => toggle(key, v)}
        />
      ))}
    </div>
  );
}
