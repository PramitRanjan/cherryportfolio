'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import type { WorkProject } from '@/lib/site-content-schema';
import { accentVar, gradientStops, motifForAccent } from '@/lib/motifs';
import GradientField from '@/components/motifs/GradientField';
import AsciiArt from '@/components/motifs/AsciiArt';
import { HoverImageCarousel } from '@/components/HoverImageCarousel';

export interface ProjectCardProps {
  project: WorkProject;
  index: number;
}

const UNIFORM_TILE_ASPECT_RATIO = 1280 / 744;

function coverFrames(project: WorkProject): string[] {
  const cover = project.cover ?? project.hoverImage;
  const frames = [cover, ...(project.previewImages ?? [])].filter((src): src is string => Boolean(src));
  return Array.from(new Set(frames));
}

/** The cover tile — carousel of her images if she has any, else the project's designed motif. */
function CoverTile({ project, hovered }: { project: WorkProject; hovered: boolean }) {
  const frames = coverFrames(project);
  if (frames.length) {
    return <HoverImageCarousel images={frames} alt={project.title} hovered={hovered} />;
  }
  return (
    <GradientField
      stops={gradientStops(project.accent)}
      grain
      className="flex h-full w-full items-center justify-center overflow-hidden"
    >
      <AsciiArt form={motifForAccent(project.accent)} tint="var(--color-surface)" className="text-[9px] opacity-90" />
    </GradientField>
  );
}

/** One gallery tile: cover carousel, then number/title/tags/view below. */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={project.href}
      className="group block"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{ '--row-accent': accentVar(project.accent) } as CSSProperties}
    >
      <div
        className="w-full overflow-hidden transition-colors"
        style={{
          aspectRatio: UNIFORM_TILE_ASPECT_RATIO,
          border: `1px solid ${hovered ? 'var(--color-pink)' : 'var(--color-line)'}`,
          transitionDuration: 'var(--motion-fast)',
        }}
      >
        <div
          className="relative h-full w-full transition-transform duration-700 group-hover:scale-[1.02]"
          style={{ transitionTimingFunction: 'var(--ease-settle)' }}
        >
          <CoverTile project={project} hovered={hovered} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="u-eyebrow shrink-0" style={{ color: 'var(--color-muted)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3
          className="font-serif italic transition-transform duration-500 group-hover:translate-x-1"
          style={{ fontSize: 'var(--text-h3)', transitionTimingFunction: 'var(--ease-settle)' }}
        >
          {project.title}
        </h3>
      </div>
      <p className="mt-1.5" style={{ color: 'var(--color-muted)' }}>
        {project.oneliner}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="u-pill" style={{ color: accentVar(project.accent) }}>
            {tag}
          </span>
        ))}
        <span
          className="u-eyebrow ml-auto font-mono transition-colors group-hover:text-[color:var(--row-accent)]"
          style={{ color: 'var(--color-muted)' }}
        >
          view →
        </span>
      </div>
    </Link>
  );
}
