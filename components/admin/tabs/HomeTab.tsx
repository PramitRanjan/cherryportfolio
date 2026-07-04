'use client';

import type { SiteContent } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import { TextField, AreaField, type useImagePicker } from '@/components/admin/fields';
import { WorkProjectListEditor } from '@/components/admin/tabs/shared';

export default function HomeTab({
  content,
  patch,
  picker,
}: {
  content: SiteContent;
  patch: Patch;
  picker: ReturnType<typeof useImagePicker>;
}) {
  const { hero, selectedWork, about } = content.home;

  return (
    <div>
      <h2 className="u-eyebrow mb-4" style={{ color: 'var(--color-ink)' }}>hero</h2>
      <TextField label="name" value={hero.name} onChange={(v) => patch((d) => { d.home.hero.name = v; return d; })} />
      <TextField label="eyebrow" value={hero.eyebrow} onChange={(v) => patch((d) => { d.home.hero.eyebrow = v; return d; })} />
      <TextField label="tagline" value={hero.tagline} onChange={(v) => patch((d) => { d.home.hero.tagline = v; return d; })} />
      <AreaField label="intro" value={hero.intro} onChange={(v) => patch((d) => { d.home.hero.intro = v; return d; })} />

      <h2 className="u-eyebrow mb-4 mt-8" style={{ color: 'var(--color-ink)' }}>selected work</h2>
      <TextField
        label="heading"
        value={selectedWork.heading}
        onChange={(v) => patch((d) => { d.home.selectedWork.heading = v; return d; })}
      />
      <AreaField
        label="body"
        value={selectedWork.body}
        onChange={(v) => patch((d) => { d.home.selectedWork.body = v; return d; })}
      />
      <WorkProjectListEditor
        items={selectedWork.items}
        picker={picker}
        onChange={(items) => patch((d) => { d.home.selectedWork.items = items; return d; })}
      />

      <h2 className="u-eyebrow mb-4 mt-8" style={{ color: 'var(--color-ink)' }}>about teaser</h2>
      <TextField label="heading" value={about.heading} onChange={(v) => patch((d) => { d.home.about.heading = v; return d; })} />
      <AreaField label="body" value={about.body} onChange={(v) => patch((d) => { d.home.about.body = v; return d; })} />
      <TextField label="link label" value={about.linkLabel} onChange={(v) => patch((d) => { d.home.about.linkLabel = v; return d; })} />
    </div>
  );
}
