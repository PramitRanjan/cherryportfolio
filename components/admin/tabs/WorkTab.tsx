'use client';

import type { SiteContent } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import { TextField, AreaField, type useImagePicker } from '@/components/admin/fields';
import { WorkProjectListEditor } from '@/components/admin/tabs/shared';

export default function WorkTab({
  content,
  patch,
  picker,
}: {
  content: SiteContent;
  patch: Patch;
  picker: ReturnType<typeof useImagePicker>;
}) {
  const { workPage } = content;

  return (
    <div>
      <TextField
        label="hero title"
        value={workPage.heroTitle}
        onChange={(v) => patch((d) => { d.workPage.heroTitle = v; return d; })}
      />
      <AreaField
        label="hero body"
        value={workPage.heroBody}
        onChange={(v) => patch((d) => { d.workPage.heroBody = v; return d; })}
      />

      <h2 className="u-eyebrow mb-4 mt-8" style={{ color: 'var(--color-ink)' }}>projects</h2>
      <WorkProjectListEditor
        items={workPage.projects}
        picker={picker}
        onChange={(items) => patch((d) => { d.workPage.projects = items; return d; })}
      />
    </div>
  );
}
