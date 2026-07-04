'use client';

import type { SiteContent, CreativeItem } from '@/lib/site-content-schema';
import type { Patch } from '@/components/admin/DashboardEditor';
import { TextField, AreaField, ImageField, ItemCard, AddButton, moveItem, type useImagePicker } from '@/components/admin/fields';

const EMPTY_ITEM: CreativeItem = { title: '' };

export default function CreativeTab({
  content,
  patch,
  picker,
}: {
  content: SiteContent;
  patch: Patch;
  picker: ReturnType<typeof useImagePicker>;
}) {
  const { creative } = content;
  const items = creative.items;

  function update(i: number, next: CreativeItem) {
    const copy = [...items];
    copy[i] = next;
    patch((d) => { d.creative.items = copy; return d; });
  }

  function setItems(next: CreativeItem[]) {
    patch((d) => { d.creative.items = next; return d; });
  }

  return (
    <div>
      <TextField
        label="hero title"
        value={creative.heroTitle}
        onChange={(v) => patch((d) => { d.creative.heroTitle = v; return d; })}
      />
      <AreaField
        label="hero body"
        value={creative.heroBody}
        onChange={(v) => patch((d) => { d.creative.heroBody = v; return d; })}
      />

      <h2 className="u-eyebrow mb-4 mt-8" style={{ color: 'var(--color-ink)' }}>items</h2>
      {items.map((item, i) => (
        <ItemCard
          key={i}
          title={item.title || `item ${i + 1}`}
          onMoveUp={i > 0 ? () => setItems(moveItem(items, i, -1)) : undefined}
          onMoveDown={i < items.length - 1 ? () => setItems(moveItem(items, i, 1)) : undefined}
          onRemove={() => setItems(items.filter((_, j) => j !== i))}
        >
          <TextField label="title" value={item.title} onChange={(v) => update(i, { ...item, title: v })} />
          <TextField label="caption" value={item.caption ?? ''} onChange={(v) => update(i, { ...item, caption: v })} />
          <ImageField
            label="image"
            value={item.image ?? ''}
            onChange={(v) => update(i, { ...item, image: v })}
            onPick={() => picker.openPicker((path) => update(i, { ...item, image: path }))}
          />
          <TextField label="tint" value={item.tint ?? ''} onChange={(v) => update(i, { ...item, tint: v })} />
        </ItemCard>
      ))}
      <AddButton label="item" onClick={() => setItems([...items, { ...EMPTY_ITEM }])} />
    </div>
  );
}
