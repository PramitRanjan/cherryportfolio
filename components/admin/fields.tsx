'use client';

import { useState, type ReactNode } from 'react';

const inputStyle: React.CSSProperties = {
  border: '1px solid var(--color-line)',
  background: 'var(--color-surface)',
  padding: '0.55rem 0.75rem',
  color: 'var(--color-ink)',
  fontFamily: 'var(--font-sans)',
  width: '100%',
};

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="u-eyebrow block mb-1.5">{children}</label>;
}

export function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  minRows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  minRows?: number;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={minRows}
        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
      />
    </div>
  );
}

export function StringListField({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="u-eyebrow"
              style={{ color: 'var(--color-muted)', padding: '0 0.25rem' }}
              aria-label={`remove ${label} item ${i + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="u-eyebrow self-start"
          style={{ color: 'var(--color-accent-2)' }}
        >
          + add {placeholder ?? 'item'}
        </button>
      </div>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  onPick,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onPick: () => void;
}) {
  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-2">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
        <button
          type="button"
          onClick={onPick}
          className="u-eyebrow shrink-0"
          style={{ border: '1px solid var(--color-line)', padding: '0 0.85rem', color: 'var(--color-ink)' }}
        >
          pick
        </button>
      </div>
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  helper,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  helper?: string;
}) {
  return (
    <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <span>
        <span className="u-eyebrow block">{label}</span>
        {helper && (
          <span className="block text-sm" style={{ color: 'var(--color-muted)' }}>
            {helper}
          </span>
        )}
      </span>
    </label>
  );
}

export function ItemCard({
  title,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: {
  title: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mb-5 p-4" style={{ border: '1px solid var(--color-line)', background: 'var(--color-surface)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="u-eyebrow" style={{ color: 'var(--color-ink)' }}>
          {title || '( untitled )'}
        </span>
        <div className="flex gap-3 u-eyebrow">
          <button type="button" onClick={onMoveUp} disabled={!onMoveUp} style={{ opacity: onMoveUp ? 1 : 0.3 }}>
            ↑
          </button>
          <button type="button" onClick={onMoveDown} disabled={!onMoveDown} style={{ opacity: onMoveDown ? 1 : 0.3 }}>
            ↓
          </button>
          <button type="button" onClick={onRemove} style={{ color: 'var(--color-pop-red)' }}>
            remove
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="u-eyebrow"
      style={{ border: '1px dashed var(--color-line)', padding: '0.6rem 1rem', color: 'var(--color-accent-2)', width: '100%' }}
    >
      + add {label}
    </button>
  );
}

/** Move array item at index i by delta (-1 up, +1 down). */
export function moveItem<T>(items: T[], i: number, delta: number): T[] {
  const j = i + delta;
  if (j < 0 || j >= items.length) return items;
  const next = [...items];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function useImagePicker() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[] | null>(null);
  const [target, setTarget] = useState<((path: string) => void) | null>(null);

  async function openPicker(onSelect: (path: string) => void) {
    setTarget(() => onSelect);
    setOpen(true);
    if (images === null) {
      const res = await fetch('/api/admin/file-picker');
      const data = await res.json();
      setImages(data.images ?? []);
    }
  }

  function select(path: string) {
    target?.(path);
    setOpen(false);
  }

  function close() {
    setOpen(false);
  }

  return { open, images, openPicker, select, close };
}
