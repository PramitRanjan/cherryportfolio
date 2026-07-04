import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { GsapReveal } from '@/components/GsapReveal';
import { AnimatedEyebrow } from '@/components/AnimatedEyebrow';
import StickerCard from '@/components/motifs/StickerCard';
import GradientField from '@/components/motifs/GradientField';
import AsciiArt from '@/components/motifs/AsciiArt';
import { gradientStops, motifForAccent } from '@/lib/motifs';

export const metadata: Metadata = { title: 'Creative' };

export default function CreativePage() {
  const { creative, copy } = getSiteContent();

  return (
    <main className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
      <AnimatedEyebrow>( creative )</AnimatedEyebrow>
      <GsapReveal>
        <h1 className="mt-4 font-serif italic" style={{ fontSize: 'var(--text-hero)' }}>
          {creative.heroTitle}
        </h1>
        <p className="u-measure mt-5" style={{ color: 'var(--color-muted)' }}>
          {creative.heroBody}
        </p>
      </GsapReveal>

      {creative.items.length === 0 ? (
        <p className="u-eyebrow mt-16">{copy.emptyState}</p>
      ) : (
        <GsapReveal className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
          {creative.items.map((item, i) => (
            <StickerCard
              key={item.title}
              kind={i % 3 === 1 ? 'tape' : 'polaroid'}
              tilt={[-3, 2, -1.5][i % 3]}
              className="pb-3"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
              ) : (
                <GradientField
                  stops={gradientStops(item.tint)}
                  grain
                  className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden"
                >
                  <AsciiArt
                    form={motifForAccent(item.tint)}
                    tint="var(--color-surface)"
                    className="text-[9px] opacity-85"
                  />
                </GradientField>
              )}
              <div className="px-4 pt-3">
                <p style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{item.title}</p>
                {item.caption && (
                  <p className="u-script mt-0.5" style={{ fontSize: '1.05rem', color: 'var(--color-muted)' }}>
                    {item.caption}
                  </p>
                )}
              </div>
            </StickerCard>
          ))}
        </GsapReveal>
      )}
    </main>
  );
}
