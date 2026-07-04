'use client';

import type { SiteContent, EntryItem, LinkItem } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import { TextField, AreaField, StringListField, ItemCard, AddButton, moveItem } from '@/components/admin/fields';

const EMPTY_ENTRY: EntryItem = { org: '', role: '', date: '', desc: '' };
const EMPTY_LINK: LinkItem = { label: '', href: '' };

function EntryListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: EntryItem[];
  onChange: (items: EntryItem[]) => void;
}) {
  function update(i: number, next: EntryItem) {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  }

  return (
    <div>
      <h3 className="u-eyebrow mb-3" style={{ color: 'var(--color-ink)' }}>{label}</h3>
      {items.map((item, i) => (
        <ItemCard
          key={i}
          title={item.org || `entry ${i + 1}`}
          onMoveUp={i > 0 ? () => onChange(moveItem(items, i, -1)) : undefined}
          onMoveDown={i < items.length - 1 ? () => onChange(moveItem(items, i, 1)) : undefined}
          onRemove={() => onChange(items.filter((_, j) => j !== i))}
        >
          <TextField label="org" value={item.org} onChange={(v) => update(i, { ...item, org: v })} />
          <TextField label="role" value={item.role} onChange={(v) => update(i, { ...item, role: v })} />
          <TextField label="date" value={item.date} onChange={(v) => update(i, { ...item, date: v })} />
          <AreaField label="desc" value={item.desc} onChange={(v) => update(i, { ...item, desc: v })} minRows={3} />
        </ItemCard>
      ))}
      <AddButton label="entry" onClick={() => onChange([...items, { ...EMPTY_ENTRY }])} />
    </div>
  );
}

function LinkListEditor({ items, onChange }: { items: LinkItem[]; onChange: (items: LinkItem[]) => void }) {
  function update(i: number, next: LinkItem) {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  }

  return (
    <div>
      {items.map((item, i) => (
        <ItemCard
          key={i}
          title={item.label || `link ${i + 1}`}
          onMoveUp={i > 0 ? () => onChange(moveItem(items, i, -1)) : undefined}
          onMoveDown={i < items.length - 1 ? () => onChange(moveItem(items, i, 1)) : undefined}
          onRemove={() => onChange(items.filter((_, j) => j !== i))}
        >
          <TextField label="label" value={item.label} onChange={(v) => update(i, { ...item, label: v })} />
          <TextField label="href" value={item.href} onChange={(v) => update(i, { ...item, href: v })} />
        </ItemCard>
      ))}
      <AddButton label="link" onClick={() => onChange([...items, { ...EMPTY_LINK }])} />
    </div>
  );
}

export default function AboutTab({ content, patch }: { content: SiteContent; patch: Patch }) {
  const { aboutPage } = content;

  return (
    <div>
      <AreaField
        label="hero body"
        value={aboutPage.heroBody}
        onChange={(v) => patch((d) => { d.aboutPage.heroBody = v; return d; })}
      />
      <AreaField
        label="who I am"
        value={aboutPage.whoIAm}
        onChange={(v) => patch((d) => { d.aboutPage.whoIAm = v; return d; })}
        minRows={6}
      />

      <div className="mt-8">
        <EntryListEditor
          label="experience"
          items={aboutPage.experience}
          onChange={(items) => patch((d) => { d.aboutPage.experience = items; return d; })}
        />
      </div>

      <div className="mt-8">
        <EntryListEditor
          label="education"
          items={aboutPage.education}
          onChange={(items) => patch((d) => { d.aboutPage.education = items; return d; })}
        />
      </div>

      <div className="mt-8">
        <StringListField
          label="tools"
          items={aboutPage.tools}
          onChange={(v) => patch((d) => { d.aboutPage.tools = v; return d; })}
          placeholder="tool"
        />
      </div>

      <h2 className="u-eyebrow mb-4 mt-8" style={{ color: 'var(--color-ink)' }}>contact</h2>
      <TextField
        label="contact title"
        value={aboutPage.contactTitle}
        onChange={(v) => patch((d) => { d.aboutPage.contactTitle = v; return d; })}
      />
      <AreaField
        label="contact body"
        value={aboutPage.contactBody}
        onChange={(v) => patch((d) => { d.aboutPage.contactBody = v; return d; })}
        minRows={3}
      />
      <LinkListEditor
        items={aboutPage.contactLinks}
        onChange={(items) => patch((d) => { d.aboutPage.contactLinks = items; return d; })}
      />
    </div>
  );
}
