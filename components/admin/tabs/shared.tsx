'use client';

import type { WorkProject } from '@/lib/site-content-schema';
import { TextField, StringListField, ImageField, ItemCard, AddButton, moveItem, type useImagePicker } from '@/components/admin/fields';

const EMPTY_PROJECT: WorkProject = {
  title: '',
  oneliner: '',
  tags: [],
  href: '',
};

export function WorkProjectListEditor({
  items,
  onChange,
  picker,
}: {
  items: WorkProject[];
  onChange: (items: WorkProject[]) => void;
  picker: ReturnType<typeof useImagePicker>;
}) {
  function updateItem(i: number, next: WorkProject) {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  }

  return (
    <div>
      {items.map((item, i) => (
        <ItemCard
          key={i}
          title={item.title || `project ${i + 1}`}
          onMoveUp={i > 0 ? () => onChange(moveItem(items, i, -1)) : undefined}
          onMoveDown={i < items.length - 1 ? () => onChange(moveItem(items, i, 1)) : undefined}
          onRemove={() => onChange(items.filter((_, j) => j !== i))}
        >
          <TextField label="title" value={item.title} onChange={(v) => updateItem(i, { ...item, title: v })} />
          <TextField label="oneliner" value={item.oneliner} onChange={(v) => updateItem(i, { ...item, oneliner: v })} />
          <TextField label="href" value={item.href} onChange={(v) => updateItem(i, { ...item, href: v })} />
          <TextField label="year" value={item.year ?? ''} onChange={(v) => updateItem(i, { ...item, year: v })} />
          <TextField label="accent" value={item.accent ?? ''} onChange={(v) => updateItem(i, { ...item, accent: v })} />
          <StringListField label="tags" items={item.tags} onChange={(v) => updateItem(i, { ...item, tags: v })} placeholder="tag" />
          <ImageField
            label="cover"
            value={item.cover ?? ''}
            onChange={(v) => updateItem(i, { ...item, cover: v })}
            onPick={() => picker.openPicker((path) => updateItem(i, { ...item, cover: path }))}
          />
          <ImageField
            label="hover image"
            value={item.hoverImage ?? ''}
            onChange={(v) => updateItem(i, { ...item, hoverImage: v })}
            onPick={() => picker.openPicker((path) => updateItem(i, { ...item, hoverImage: path }))}
          />
          <StringListField
            label="preview images"
            items={item.previewImages ?? []}
            onChange={(v) => updateItem(i, { ...item, previewImages: v })}
            placeholder="image path"
          />
        </ItemCard>
      ))}
      <AddButton label="project" onClick={() => onChange([...items, { ...EMPTY_PROJECT }])} />
    </div>
  );
}
