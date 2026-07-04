'use client';

import { useCallback, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { WorkProject } from '@/lib/site-content-schema';
import { accentVar, gradientStops, motifForAccent } from '@/lib/motifs';
import GradientField from '@/components/motifs/GradientField';
import AsciiArt from '@/components/motifs/AsciiArt';

export interface ProjectCardProps {
  project: WorkProject;
  index: number;
}

const PREVIEW_WIDTH = 190;
const PREVIEW_HEIGHT = 120;
const PREVIEW_OFFSET = 44;

function previewSrc(project: WorkProject): string | undefined {
  return project.cover ?? project.hoverImage ?? project.previewImages?.[0];
}

/** The preview tile — image if she has one, else the project's designed motif. */
function PreviewTile({ project, className }: { project: WorkProject; className?: string }) {
  const src = previewSrc(project);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={`h-full w-full object-cover ${className ?? ''}`}
        style={{ border: '1px solid var(--color-line)' }}
      />
    );
  }
  return (
    <GradientField
      stops={gradientStops(project.accent)}
      grain
      className={`flex h-full w-full items-center justify-center overflow-hidden ${className ?? ''}`}
    >
      <AsciiArt form={motifForAccent(project.accent)} tint="var(--color-surface)" className="text-[9px] opacity-90" />
    </GradientField>
  );
}

/**
 * One editorial index row. The preview follows the pointer on hover while the
 * row keeps its reserved year/arrow column stable.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);

  const updatePreview = useCallback((event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === 'touch') return;

    const maxX = window.innerWidth - PREVIEW_WIDTH - 12;
    const maxY = window.innerHeight - PREVIEW_HEIGHT - 12;

    setPreview({
      x: Math.max(12, Math.min(event.clientX + PREVIEW_OFFSET, maxX)),
      y: Math.max(12, Math.min(event.clientY + PREVIEW_OFFSET, maxY)),
    });
  }, []);

  return (
    <Link
      href={project.href}
      className="group -mx-4 block px-4 transition-colors hover:bg-[color-mix(in_srgb,var(--row-accent)_7%,transparent)] md:-mx-6 md:px-6"
      onPointerEnter={updatePreview}
      onPointerMove={updatePreview}
      onPointerLeave={() => setPreview(null)}
      style={
        {
          borderTop: '1px solid var(--color-line)',
          transitionDuration: 'var(--motion-med)',
          '--row-accent': accentVar(project.accent),
        } as CSSProperties
      }
    >
      {preview &&
        createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none fixed hidden h-[120px] w-[190px] overflow-hidden opacity-100 md:block"
            style={{
              left: preview.x,
              top: preview.y,
              zIndex: 2147483647,
              boxShadow: '0 12px 34px rgba(23,19,16,0.16)',
            }}
          >
            <PreviewTile project={project} />
          </div>,
          document.body,
        )}

      {/* inline cover — small screens only */}
      <div className="pt-6 md:hidden">
        <div className="aspect-[16/9] w-full overflow-hidden">
          <PreviewTile project={project} />
        </div>
      </div>

      <div className="flex items-center gap-5 py-6 md:gap-8 md:py-7">
        <span
          className="u-eyebrow shrink-0 transition-colors group-hover:text-[color:var(--row-accent)]"
          style={{ transitionDuration: 'var(--motion-fast)' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <h3
            className="font-serif italic transition-transform duration-500 group-hover:translate-x-2"
            style={{ fontSize: 'var(--text-h1)', transitionTimingFunction: 'var(--ease-settle)' }}
          >
            {project.title}
          </h3>
          <p className="mt-1.5 max-w-md" style={{ color: 'var(--color-muted)' }}>
            {project.oneliner}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="u-pill" style={{ color: accentVar(project.accent) }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* right column: reserved space; preview now tracks near the cursor */}
        <div className="relative hidden h-[132px] w-[112px] shrink-0 md:block">
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-end font-mono text-[color:var(--color-muted)] transition-colors duration-300 group-hover:text-[color:var(--row-accent)]"
          >
            {project.year ? `${project.year} →` : '→'}
          </span>
        </div>
      </div>
    </Link>
  );
}
