import Link from 'next/link';
import RippleField from '@/components/motifs/RippleField';
import KoiDrift from '@/components/motifs/KoiDrift';

export default function NotFound() {
  return (
    <main className="relative mx-auto flex max-w-6xl flex-col items-center justify-center overflow-hidden px-6 text-center" style={{ minHeight: 'calc(100svh - 12rem)' }}>
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 w-[36rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2">
        <RippleField rings={7} drift className="w-full opacity-70" />
        <KoiDrift count={1} className="absolute inset-0" />
      </div>

      <p className="u-eyebrow relative">( lost? )</p>
      <h1 className="relative mt-4 font-serif italic" style={{ fontSize: 'var(--text-hero)' }}>
        This page drifted away.
      </h1>
      <Link
        href="/"
        className="u-eyebrow relative mt-10 inline-block transition-colors hover:text-[color:var(--color-accent)]"
        style={{ transitionDuration: 'var(--motion-fast)' }}
      >
        ( take me home )
      </Link>
    </main>
  );
}
