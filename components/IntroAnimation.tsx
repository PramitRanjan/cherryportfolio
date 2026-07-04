'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * First-visit hero choreography. Children opt in via data attributes:
 *   data-intro="focus" — focus-pull (blur → sharp), staggered in DOM order
 *   data-intro="pop"   — soft scale-in after the focus elements
 * Runs once per session; repeat visits and reduced-motion get the settled
 * state immediately.
 */
export default function IntroAnimation({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const focus = Array.from(el.querySelectorAll<HTMLElement>('[data-intro="focus"]'));
    const pop = Array.from(el.querySelectorAll<HTMLElement>('[data-intro="pop"]'));
    if (focus.length === 0 && pop.length === 0) return;

    const seen = sessionStorage.getItem('cherry_intro') === '1';
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (seen) return;

      const tl = gsap.timeline({
        onComplete: () => sessionStorage.setItem('cherry_intro', '1'),
      });
      tl.fromTo(
        focus,
        { opacity: 0, y: 24, filter: 'blur(14px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', stagger: 0.15 },
      );
      tl.fromTo(
        pop,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08 },
        '-=0.35',
      );

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
