import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent } from '@/lib/site-content';
import IntroAnimation from '@/components/IntroAnimation';
import { GsapReveal } from '@/components/GsapReveal';
import { AnimatedEyebrow } from '@/components/AnimatedEyebrow';
import { WorkIndex } from '@/components/WorkIndex';
import FrameHandles from '@/components/motifs/FrameHandles';
import KoiDrift from '@/components/motifs/KoiDrift';
import StickerCard from '@/components/motifs/StickerCard';
import { MarqueeRibbon } from '@/components/MarqueeRibbon';

const CURSOR_CORNERS = ['tl', 'tr', 'bl', 'br'] as const;
const CURSOR_COLORS = [
  '#2c46c7', // Cherry cobalt
  '#d8351f', // Cherry red
  '#e2679a', // Cherry pink
  '#de9526', // Cherry amber
];

export default function Home() {
  const { home, copy, aboutPage } = getSiteContent();
  const [eyebrowLeft, eyebrowRight] = home.hero.eyebrow.split('—').map((s) => s.trim());
  const place = copy.footerMeta.split('—')[0]?.trim().toLowerCase();
  const contact = aboutPage.contactLinks[0];
  const skills = Array.isArray(copy.heroSkills) ? (copy.heroSkills as string[]) : [];
  const cursors = skills.slice(0, 4).map((label, i) => ({
    label,
    color: CURSOR_COLORS[i % CURSOR_COLORS.length],
    corner: CURSOR_CORNERS[i % CURSOR_CORNERS.length],
  }));

  return (
    <main className="overflow-x-clip">
      {/* ============ hero — a centered, quiet artifact cover ============ */}
      <section className="home-hero-section relative overflow-hidden">
        <div
          aria-hidden="true"
          className="u-gridlines absolute inset-0 opacity-[0.32]"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 0%, black 42%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 42%, transparent 78%)',
          }}
        />

        {/* one koi, drifting slowly through the upper right */}
        <KoiDrift
          count={1}
          followCursor
          className="absolute inset-0 hidden md:block"
        />
        <KoiDrift
          count={1}
          className="home-hero-koi-mobile absolute md:hidden"
        />

        <IntroAnimation className="home-hero relative flex flex-col items-center justify-center px-6 text-center">
          {/* corner-pinned metadata — composed like the portfolio covers she pins */}
          <p data-intro="pop" className="home-hero-meta home-hero-meta-left u-eyebrow absolute left-6 top-7 md:left-10">
            {eyebrowLeft}
          </p>
          <p data-intro="pop" className="home-hero-meta home-hero-meta-right u-eyebrow absolute right-6 top-7 text-right md:right-10">
            {eyebrowRight}
          </p>

          {typeof copy.heroRole === 'string' && (
            <p data-intro="focus" className="home-hero-role u-eyebrow">
              {copy.heroRole}
            </p>
          )}

          <div data-intro="focus" className="home-hero-title-wrap mt-10">
            <FrameHandles cursors={cursors}>
              <h1
                className="home-hero-name font-serif italic"
                style={{
                  fontSize: 'var(--text-display)',
                  lineHeight: 0.92,
                  letterSpacing: 0,
                  padding: '0.06em 0.18em 0.1em',
                }}
              >
                {home.hero.name.split(' ').map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </h1>
            </FrameHandles>
          </div>

          <p
            data-intro="focus"
            className="home-hero-tagline mt-10 font-serif italic"
            style={{ fontSize: 'var(--text-h2)', color: 'var(--color-ink)' }}
          >
            {home.hero.tagline}
          </p>

          <p
            data-intro="focus"
            className="home-hero-intro mt-5 max-w-[46ch]"
            style={{ color: 'var(--color-muted)' }}
          >
            {home.hero.intro}
          </p>

          <div data-intro="pop" className="home-hero-bottom">
            {contact && (
              <a
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="home-hero-contact u-eyebrow transition-colors hover:text-[color:var(--color-accent)]"
                style={{ transitionDuration: 'var(--motion-fast)' }}
              >
                {contact.label.toLowerCase()} ↗
              </a>
            )}
            <p
              className="home-hero-scroll u-eyebrow"
              style={{ color: 'var(--color-muted)' }}
            >
              {copy.scrollCue}
            </p>
            {place && (
              <p className="home-hero-place u-eyebrow text-right">
                ( {place} )
              </p>
            )}
          </div>
        </IntroAnimation>
      </section>

      {/* ============ marquee ribbon ============ */}
      {typeof copy.marquee === 'string' && copy.marquee && (
        <MarqueeRibbon text={copy.marquee as string} />
      )}

      {/* ============ selected work ============ */}
      <section className="mx-auto mt-16 max-w-6xl px-6 md:mt-24">
        <AnimatedEyebrow>{`( ${home.selectedWork.heading.toLowerCase()} )`}</AnimatedEyebrow>
        <GsapReveal>
          <p
            className="u-measure mt-4 font-serif italic"
            style={{ fontSize: 'var(--text-h2)', color: 'var(--color-ink)', lineHeight: 1.25 }}
          >
            {home.selectedWork.body}
          </p>
        </GsapReveal>

        <GsapReveal className="mt-12" stagger={0.12}>
          <WorkIndex projects={home.selectedWork.items} />
        </GsapReveal>

        <GsapReveal className="mt-8">
          <Link
            href="/work"
            className="u-eyebrow inline-block transition-colors hover:text-[color:var(--color-accent)]"
            style={{ transitionDuration: 'var(--motion-fast)' }}
          >
            ( {copy.workCta} )
          </Link>
        </GsapReveal>
      </section>

      {/* ============ about teaser ============ */}
      <section className="mx-auto mt-28 max-w-6xl px-6 md:mt-40">
        <div className="grid items-center gap-12 md:grid-cols-[auto_1fr] md:gap-20">
          <GsapReveal className="justify-self-center md:justify-self-start">
            <StickerCard
              kind="polaroid"
              tilt={-3}
              className="w-60 border-[color:rgba(188,140,32,0.44)] bg-[#f7e3a3] shadow-[0_12px_34px_rgba(153,111,25,0.2)]"
            >
              <div
                className="relative aspect-square w-full overflow-hidden"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(255, 242, 189, 0.95), rgba(237, 184, 70, 0.72))',
                }}
              >
                <Image
                  src="/images/1776141580005.png"
                  alt="Portrait of Cherry Phan"
                  fill
                  sizes="(max-width: 768px) 240px, 320px"
                  className="object-cover object-center"
                  priority={false}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-20"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 246, 209, 0.58), transparent)',
                  }}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-10"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(248, 223, 138, 0.98), rgba(223, 168, 46, 0.96))',
                  borderTop: '1px solid rgba(164, 119, 20, 0.28)',
                }}
              />
              <p
                className="absolute inset-x-0 bottom-[0.72rem] text-center u-eyebrow"
                style={{ fontSize: '0.72rem', color: '#744f13' }}
              >
                Hi Its Me, Cherry!
              </p>
            </StickerCard>
          </GsapReveal>

          <div>
            <AnimatedEyebrow>{`( ${home.about.heading.toLowerCase()} )`}</AnimatedEyebrow>
            <GsapReveal delay={0.1}>
              <p
                className="u-measure mt-4 font-serif italic"
                style={{ fontSize: 'var(--text-h2)', color: 'var(--color-ink)', lineHeight: 1.3 }}
              >
                {home.about.body}
              </p>
              <Link
                href="/about"
                className="u-eyebrow mt-8 inline-block transition-colors hover:text-[color:var(--color-accent)]"
                style={{ transitionDuration: 'var(--motion-fast)' }}
              >
                ( {home.about.linkLabel} )
              </Link>
            </GsapReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
