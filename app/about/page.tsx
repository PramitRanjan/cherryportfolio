import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/site-content';
import { renderRichText } from '@/lib/security';
import { GsapReveal } from '@/components/GsapReveal';
import { AnimatedEyebrow } from '@/components/AnimatedEyebrow';
import AsciiArt from '@/components/motifs/AsciiArt';
import RippleField from '@/components/motifs/RippleField';

export const metadata: Metadata = { title: 'About' };

function CvRows({ entries }: { entries: { org: string; role: string; date: string; desc: string }[] }) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-line)' }}>
      {entries.map((entry) => (
        <div
          key={`${entry.org}-${entry.role}`}
          className="grid gap-2 py-6 md:grid-cols-[8rem_1fr] md:gap-8"
          style={{ borderTop: '1px solid var(--color-line)' }}
        >
          <p className="u-eyebrow pt-1">{entry.date || '—'}</p>
          <div>
            <p style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{entry.org}</p>
            <p className="mt-0.5" style={{ color: 'var(--color-body)' }}>
              {entry.role}
            </p>
            <p className="mt-2 max-w-xl" style={{ color: 'var(--color-muted)', fontSize: 'var(--text-meta)' }}>
              {entry.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const ABOUT_DIRECTIONS = [
  {
    label: 'Design lens',
    value: 'Time, memory, ritual',
  },
  {
    label: 'Working mode',
    value: 'Story first, product second',
  },
  {
    label: 'Current focus',
    value: 'Warm systems for slower attention',
  },
];

const ABOUT_THREADS = [
  'Vietnamese memory and everyday rituals',
  'UX that makes small pauses feel useful',
  'Visual systems with a storyteller’s warmth',
];

export default function AboutPage() {
  const { aboutPage } = getSiteContent();

  return (
    <main className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
      <section className="relative">
        <AsciiArt
          form="sparkle"
          tint="var(--color-amber)"
          className="absolute -top-8 right-6 hidden text-[10px] opacity-60 md:block"
        />
        <div className="flex items-center justify-between gap-6">
          <AnimatedEyebrow>( about )</AnimatedEyebrow>
          <p className="u-eyebrow hidden text-right md:block" style={{ color: 'var(--color-muted)' }}>
            ( design with empathy )
          </p>
        </div>

        <GsapReveal>
          <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_22rem] md:items-end md:gap-16">
            <h1
              className="font-serif italic"
              style={{ color: 'var(--color-ink)', fontSize: 'clamp(5rem, 14vw, 12rem)', lineHeight: 0.85 }}
            >
              Cherry
              <span className="block">Phan</span>
            </h1>
            <p
              className="font-serif italic"
              style={{ color: 'var(--color-ink)', fontSize: 'clamp(1.8rem, 3.2vw, 3rem)', lineHeight: 1.08 }}
            >
              {aboutPage.heroBody}
            </p>
          </div>
        </GsapReveal>

        <GsapReveal delay={0.08}>
          <div className="mt-10 grid gap-0 border-y border-[color:var(--color-line)] md:grid-cols-3">
            {ABOUT_DIRECTIONS.map((item, index) => (
              <div
                key={item.label}
                className={`grid gap-2 py-5 md:px-6 ${
                  index === 0 ? '' : 'border-t border-[color:var(--color-line)] md:border-l md:border-t-0'
                }`}
              >
                <p className="u-eyebrow">{item.label}</p>
                <p style={{ color: 'var(--color-body)', lineHeight: 1.3 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </GsapReveal>
      </section>

      <section className="mt-20 grid gap-10 md:mt-28 md:grid-cols-[15rem_1fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <AnimatedEyebrow>( direction )</AnimatedEyebrow>
          <ul className="mt-6 space-y-4">
            {ABOUT_THREADS.map((thread, index) => (
              <li key={thread} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="u-eyebrow tabular-nums" style={{ color: 'var(--color-accent)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span style={{ color: 'var(--color-body)', lineHeight: 1.35 }}>{thread}</span>
              </li>
            ))}
          </ul>
        </div>
        <GsapReveal>
          <div
            className="u-rich-text"
            style={{ fontSize: '1.12rem', maxWidth: '72ch' }}
            dangerouslySetInnerHTML={{ __html: renderRichText(aboutPage.whoIAm) }}
          />
        </GsapReveal>
      </section>

      <section className="mt-20 grid gap-10 md:mt-28 md:grid-cols-[10rem_1fr] md:gap-16">
        <AnimatedEyebrow className="md:sticky md:top-28 md:self-start">( experience )</AnimatedEyebrow>
        <GsapReveal>
          <CvRows entries={aboutPage.experience} />
        </GsapReveal>
      </section>

      <section className="mt-20 grid gap-10 md:mt-28 md:grid-cols-[10rem_1fr] md:gap-16">
        <AnimatedEyebrow className="md:sticky md:top-28 md:self-start">( education )</AnimatedEyebrow>
        <GsapReveal>
          <CvRows entries={aboutPage.education} />
        </GsapReveal>
      </section>

      {aboutPage.tools.length > 0 && (
        <section className="mt-20 grid gap-10 md:mt-28 md:grid-cols-[10rem_1fr] md:gap-16">
          <AnimatedEyebrow className="md:sticky md:top-28 md:self-start">( tools )</AnimatedEyebrow>
          <GsapReveal>
            <div className="flex flex-wrap gap-3">
              {aboutPage.tools.map((tool) => (
                <span
                  key={tool}
                  className="u-eyebrow px-3 py-1.5"
                  style={{ border: '1px solid var(--color-line)', borderRadius: 999 }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </GsapReveal>
        </section>
      )}

      <section className="relative mt-24 pb-8 md:mt-36">
        <RippleField
          rings={5}
          className="absolute -right-10 top-0 w-72 opacity-60"
          drift
        />
        <AnimatedEyebrow>{`( ${aboutPage.contactTitle.toLowerCase()} )`}</AnimatedEyebrow>
        <GsapReveal>
          <p
            className="u-measure mt-4 font-serif italic"
            style={{ fontSize: 'var(--text-h1)', color: 'var(--color-ink)' }}
          >
            {aboutPage.contactBody}
          </p>
          <ul className="mt-8 flex flex-wrap gap-6">
            {aboutPage.contactLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="u-eyebrow transition-colors hover:text-[color:var(--color-accent)]"
                  style={{ transitionDuration: 'var(--motion-fast)' }}
                >
                  ( {link.label.toLowerCase()} )
                </a>
              </li>
            ))}
          </ul>
        </GsapReveal>
      </section>
    </main>
  );
}
