import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/site-content';
import { GsapReveal } from '@/components/GsapReveal';
import { AnimatedEyebrow } from '@/components/AnimatedEyebrow';
import AsciiArt from '@/components/motifs/AsciiArt';
import { ASCII_FORMS, type AsciiFormName } from '@/lib/motifs';

export const metadata: Metadata = { title: 'Play' };

const TINTS = ['var(--color-accent)', 'var(--color-accent-2)', 'var(--color-terracotta)', 'var(--color-sage)'];

function isForm(x: string | undefined): x is AsciiFormName {
  return x !== undefined && x in ASCII_FORMS;
}

export default function PlayPage() {
  const { play, copy } = getSiteContent();

  return (
    <main className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
      <AnimatedEyebrow>( play )</AnimatedEyebrow>
      <GsapReveal>
        <h1 className="mt-4 font-serif italic" style={{ fontSize: 'var(--text-hero)' }}>
          {play.heroTitle}
        </h1>
        <p className="u-measure mt-5" style={{ color: 'var(--color-muted)' }}>
          {play.heroBody}
        </p>
      </GsapReveal>

      {play.experiments.length === 0 ? (
        <p className="u-eyebrow mt-16">{copy.emptyState}</p>
      ) : (
        <GsapReveal className="mt-16" stagger={0.12}>
          {play.experiments.map((experiment, i) => {
            const inner = (
              <div
                className="flex items-center gap-8 py-8"
                style={{ borderTop: '1px solid var(--color-line)' }}
              >
                <AsciiArt
                  form={isForm(experiment.motif) ? experiment.motif : 'sparkle'}
                  tint={TINTS[i % TINTS.length]}
                  className="hidden shrink-0 text-[7px] sm:block"
                />
                <div>
                  <h2 className="font-serif italic" style={{ fontSize: 'var(--text-h2)' }}>
                    {experiment.title}
                  </h2>
                  {experiment.body && (
                    <p className="u-measure mt-2" style={{ color: 'var(--color-muted)' }}>
                      {experiment.body}
                    </p>
                  )}
                </div>
              </div>
            );
            return experiment.href ? (
              <Link key={experiment.title} href={experiment.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={experiment.title}>{inner}</div>
            );
          })}
        </GsapReveal>
      )}
    </main>
  );
}
