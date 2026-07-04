import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { GsapReveal } from '@/components/GsapReveal';
import { AnimatedEyebrow } from '@/components/AnimatedEyebrow';
import { WorkIndex } from '@/components/WorkIndex';

export const metadata: Metadata = { title: 'Work' };

export default function WorkPage() {
  const { workPage } = getSiteContent();

  return (
    <main className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
      <AnimatedEyebrow>( work )</AnimatedEyebrow>
      <GsapReveal>
        <h1 className="mt-4 font-serif italic" style={{ fontSize: 'var(--text-hero)' }}>
          {workPage.heroTitle}
        </h1>
        <p className="u-measure mt-5" style={{ color: 'var(--color-muted)' }}>
          {workPage.heroBody}
        </p>
      </GsapReveal>

      <GsapReveal className="mt-14" stagger={0.1}>
        <WorkIndex projects={workPage.projects} />
      </GsapReveal>
    </main>
  );
}
