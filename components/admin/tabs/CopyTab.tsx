'use client';

import type { SiteContent } from '@/lib/site-content-schema';
import { SECTION_KEYS } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import { TextField } from '@/components/admin/fields';

export default function CopyTab({ content, patch }: { content: SiteContent; patch: Patch }) {
  const { copy } = content;

  return (
    <div>
      <TextField label="footer line" value={copy.footerLine} onChange={(v) => patch((d) => { d.copy.footerLine = v; return d; })} />
      <TextField label="footer meta" value={copy.footerMeta} onChange={(v) => patch((d) => { d.copy.footerMeta = v; return d; })} />
      <TextField label="work cta" value={copy.workCta} onChange={(v) => patch((d) => { d.copy.workCta = v; return d; })} />
      <TextField label="scroll cue" value={copy.scrollCue} onChange={(v) => patch((d) => { d.copy.scrollCue = v; return d; })} />
      <TextField label="empty state" value={copy.emptyState} onChange={(v) => patch((d) => { d.copy.emptyState = v; return d; })} />

      <h2 className="u-eyebrow mb-4 mt-8" style={{ color: 'var(--color-ink)' }}>nav labels</h2>
      {SECTION_KEYS.map((key) => (
        <TextField
          key={key}
          label={key}
          value={copy.navLabels[key] ?? ''}
          onChange={(v) => patch((d) => { d.copy.navLabels[key] = v; return d; })}
        />
      ))}
    </div>
  );
}
