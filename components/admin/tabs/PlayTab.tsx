'use client';

import type { SiteContent, PlayItem } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import { TextField, AreaField, ItemCard, AddButton, moveItem } from '@/components/admin/fields';

const EMPTY_EXPERIMENT: PlayItem = { title: '' };

export default function PlayTab({ content, patch }: { content: SiteContent; patch: Patch }) {
  const { play } = content;
  const items = play.experiments;

  function update(i: number, next: PlayItem) {
    const copy = [...items];
    copy[i] = next;
    patch((d) => { d.play.experiments = copy; return d; });
  }

  function setItems(next: PlayItem[]) {
    patch((d) => { d.play.experiments = next; return d; });
  }

  return (
    <div>
      <TextField
        label="hero title"
        value={play.heroTitle}
        onChange={(v) => patch((d) => { d.play.heroTitle = v; return d; })}
      />
      <AreaField
        label="hero body"
        value={play.heroBody}
        onChange={(v) => patch((d) => { d.play.heroBody = v; return d; })}
      />

      <h2 className="u-eyebrow mb-4 mt-8" style={{ color: 'var(--color-ink)' }}>experiments</h2>
      {items.map((item, i) => (
        <ItemCard
          key={i}
          title={item.title || `experiment ${i + 1}`}
          onMoveUp={i > 0 ? () => setItems(moveItem(items, i, -1)) : undefined}
          onMoveDown={i < items.length - 1 ? () => setItems(moveItem(items, i, 1)) : undefined}
          onRemove={() => setItems(items.filter((_, j) => j !== i))}
        >
          <TextField label="title" value={item.title} onChange={(v) => update(i, { ...item, title: v })} />
          <AreaField label="body" value={item.body ?? ''} onChange={(v) => update(i, { ...item, body: v })} minRows={3} />
          <TextField label="href" value={item.href ?? ''} onChange={(v) => update(i, { ...item, href: v })} />
          <TextField label="motif" value={item.motif ?? ''} onChange={(v) => update(i, { ...item, motif: v })} />
        </ItemCard>
      ))}
      <AddButton label="experiment" onClick={() => setItems([...items, { ...EMPTY_EXPERIMENT }])} />
    </div>
  );
}
