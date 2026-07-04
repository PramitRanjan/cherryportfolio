'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MediaBlock } from '@/lib/site-content-schema';
import { isSafeEmbedUrl } from '@/lib/security';

export function CaseStudyMedia({ block }: { block: MediaBlock }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const images = block.images ?? [];

  useEffect(() => {
    if (activeIndex === null) return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverscroll = document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (images.length < 2) return;
      if (event.key === 'ArrowRight') setActiveIndex((index) => (index === null ? 0 : (index + 1) % images.length));
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => {
          if (index === null) return 0;
          return (index - 1 + images.length) % images.length;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousOverscroll;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, images.length]);

  if (block.kind === 'embed') {
    if (!block.embedUrl || !isSafeEmbedUrl(block.embedUrl)) return null;
    return (
      <figure className="my-10">
        <iframe
          src={block.embedUrl}
          className="aspect-video w-full"
          style={{ border: '1px solid var(--color-line)' }}
          allowFullScreen
          loading="lazy"
        />
        {block.caption && <figcaption className="u-eyebrow mt-3">{block.caption}</figcaption>}
      </figure>
    );
  }

  if (images.length === 0) return null;

  const layout = block.layout ?? 'full';
  const gridClass =
    block.kind === 'gallery' || layout === 'split'
      ? 'grid gap-4 sm:grid-cols-2'
      : 'grid gap-4';
  const widthClass = layout === 'inset' ? 'mx-auto max-w-2xl' : '';

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activeCountLabel = activeIndex === null ? null : `${activeIndex + 1} / ${images.length}`;
  const cycle = (direction: -1 | 1) => {
    setActiveIndex((index) => {
      if (index === null) return 0;
      return (index + direction + images.length) % images.length;
    });
  };
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || images.length < 2) return;
    const endX = event.changedTouches[0]?.clientX;
    if (typeof endX !== 'number') return;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 48) return;
    cycle(deltaX < 0 ? 1 : -1);
  };

  return (
    <>
      <figure className={`my-10 ${widthClass}`}>
        <div className={gridClass}>
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block overflow-hidden text-left"
              style={{ border: '1px solid var(--color-line)' }}
              aria-label={`Open image ${index + 1}${block.caption ? ` from ${block.caption}` : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={block.caption ?? ''}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        {block.caption && <figcaption className="u-eyebrow mt-3">{block.caption}</figcaption>}
      </figure>

      {activeImage &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,16,13,0.82)] px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Expanded case study image"
            onClick={() => setActiveIndex(null)}
            onTouchMove={(event) => event.preventDefault()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 px-3 py-2 u-eyebrow"
              style={{
                color: 'var(--color-surface)',
                border: '1px solid rgba(252, 249, 242, 0.22)',
                background: 'rgba(252, 249, 242, 0.08)',
              }}
              aria-label="Close lightbox"
            >
              close
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  cycle(-1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 u-eyebrow"
                style={{
                  color: 'var(--color-surface)',
                  border: '1px solid rgba(252, 249, 242, 0.22)',
                  background: 'rgba(252, 249, 242, 0.08)',
                }}
                aria-label="Previous image"
              >
                ←
              </button>
            )}

            <div
              className="mx-auto flex max-h-full w-full max-w-6xl flex-col gap-4"
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="overflow-hidden"
                style={{
                  border: '1px solid rgba(252, 249, 242, 0.18)',
                  background: 'rgba(252, 249, 242, 0.04)',
                  touchAction: 'pan-y',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={block.caption ?? ''}
                  className="max-h-[78vh] w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="u-eyebrow" style={{ color: 'rgba(252, 249, 242, 0.9)' }}>
                  {block.caption ?? 'Case study image'}
                </p>
                {images.length > 1 && activeCountLabel && (
                  <p className="u-eyebrow" style={{ color: 'rgba(252, 249, 242, 0.72)' }}>
                    {activeCountLabel}
                  </p>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  cycle(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 u-eyebrow"
                style={{
                  color: 'var(--color-surface)',
                  border: '1px solid rgba(252, 249, 242, 0.22)',
                  background: 'rgba(252, 249, 242, 0.08)',
                }}
                aria-label="Next image"
              >
                →
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
