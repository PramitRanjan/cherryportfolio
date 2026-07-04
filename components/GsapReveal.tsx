'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface GsapRevealProps {
  children: React.ReactNode;
  delay?: number;
  /** stagger direct children instead of revealing the wrapper as one */
  stagger?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  as?: 'div' | 'section' | 'span';
  className?: string;
}

/**
 * The site's reveal language: focus-pull. Elements arrive slightly low and
 * out of focus, then settle sharp. Under prefers-reduced-motion nothing is
 * ever hidden — content is simply there.
 */
export function GsapReveal({
  children,
  delay = 0,
  stagger,
  y,
  blur = true,
  once = true,
  as: Tag = 'div',
  className,
}: GsapRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = stagger !== undefined ? Array.from(el.children) : el;

      gsap.set(targets, {
        opacity: 0,
        y: y ?? 28,
        filter: blur ? 'blur(10px)' : 'none',
      });

      const tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [delay, stagger, y, blur, once]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  );
}
