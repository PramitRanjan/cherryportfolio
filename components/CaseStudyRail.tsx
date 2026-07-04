'use client';

import { useEffect, useState } from 'react';

export interface RailItem {
  id: string;
  label: string;
}

/** Sticky mono chapter rail with scrollspy — desktop case studies only. */
export function CaseStudyRail({ items, accent }: { items: RailItem[]; accent: string }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="sticky top-28 hidden self-start xl:block">
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="u-eyebrow block transition-colors"
              style={{
                color: active === item.id ? accent : 'var(--color-muted)',
                transitionDuration: 'var(--motion-fast)',
              }}
            >
              {String(i + 1).padStart(2, '0')} — {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
