'use client';

import { motion, useReducedMotion } from 'motion/react';

export function MarqueeRibbon({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();
  const items = Array.from({ length: 6 });

  return (
    <div
      aria-hidden="true"
      className="home-marquee mt-4 overflow-hidden py-5"
      style={{ borderTop: '1px solid var(--color-line)', borderBottom: '1px solid var(--color-line)' }}
    >
      <motion.div
        className="marquee-track flex w-max items-baseline"
        animate={prefersReducedMotion ? { x: 0 } : { x: ['0%', '-50%'] }}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: 18,
                ease: 'linear',
                repeat: Number.POSITIVE_INFINITY,
              }
        }
        style={{ willChange: 'transform' }}
      >
        {[0, 1].map((group) => (
          <div key={group} className="marquee-segment flex shrink-0 items-baseline gap-12 pr-12">
            {items.map((_, i) => (
              <span key={`${group}-${i}`} className="flex shrink-0 items-baseline gap-12">
                <span
                  className="font-serif italic"
                  style={{
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.5rem)',
                    color: 'var(--color-body)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {text}
                </span>
                <span aria-hidden="true" style={{ color: 'var(--color-accent)', fontSize: '0.95rem' }}>
                  ✿
                </span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
