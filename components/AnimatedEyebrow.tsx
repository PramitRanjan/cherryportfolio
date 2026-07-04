'use client';

import { useEffect, useRef, useState } from 'react';

/** Mono eyebrow whose tracking settles in as it enters the viewport. */
export function AnimatedEyebrow({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={`u-eyebrow ${className ?? ''}`}
      style={{
        letterSpacing: inView ? '0.14em' : '0.3em',
        opacity: inView ? 1 : 0,
        transition: `letter-spacing var(--motion-slow) var(--ease-settle), opacity var(--motion-slow) var(--ease-settle)`,
      }}
    >
      {children}
    </p>
  );
}
