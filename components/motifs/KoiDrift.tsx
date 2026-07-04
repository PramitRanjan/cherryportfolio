'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export interface KoiDriftProps {
  count?: 1 | 2 | 3;
  className?: string;
  /** 'ink' for dark grounds (footer) — cream-line koi */
  scheme?: 'paper' | 'ink';
  followCursor?: boolean;
}

/*
 * Koi seen from above, nose pointing right (offset-rotate keeps it forward).
 * viewBox 0 0 64 30 — teardrop body widest behind the head, forked flowing
 * caudal tail, two pectoral fins. Kohaku pattern: pale body, red patches.
 */
function Koi({
  size,
  body,
  patch,
  patch2,
  outline,
}: {
  size: number;
  body: string;
  patch: string;
  patch2: string;
  outline: string;
}) {
  return (
    <svg viewBox="0 0 64 30" width={size} height={size * 0.47} style={{ overflow: 'visible' }}>
      {/* caudal tail — two soft lobes trailing off the peduncle */}
      <path
        d="M17 15 C 12 12, 9 8, 6 3 C 4.5 1.5, 3 1, 1.5 1.5 C 5 6, 6.5 11, 6 15 C 6.5 19, 5 24, 1.5 28.5 C 3 29, 4.5 28.5, 6 27 C 9 22, 12 18, 17 15 Z"
        fill={body}
        stroke={outline}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* body — teardrop, blunt nose right, tapering left into the peduncle */}
      <path
        d="M61 15 C 61 11.5, 57 8, 51 7 C 43 5.6, 33 6.5, 26 9.5 C 21 11.5, 17.5 13.5, 15.5 15 C 17.5 16.5, 21 18.5, 26 20.5 C 33 23.5, 43 24.4, 51 23 C 57 22, 61 18.5, 61 15 Z"
        fill={body}
        stroke={outline}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      {/* pectoral fins — small petals swept back from behind the head */}
      <path
        d="M46 8.2 C 45 5.5, 42.5 3.2, 39 2.2 C 40.5 4.8, 42 6.6, 43.5 8 Z"
        fill={body}
        stroke={outline}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path
        d="M46 21.8 C 45 24.5, 42.5 26.8, 39 27.8 C 40.5 25.2, 42 23.4, 43.5 22 Z"
        fill={body}
        stroke={outline}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* kohaku patches */}
      <path
        d="M55 9.5 C 51 8.2, 46.5 8, 43.5 9 C 43 11, 43.5 13.5, 45.5 15.2 C 49 16, 53.5 15.2, 56.5 13.2 C 56.8 11.8, 56.2 10.4, 55 9.5 Z"
        fill={patch}
      />
      <path
        d="M35 12.5 C 31 13.5, 27.5 15.5, 26 17.5 C 28.5 19.5, 32.5 20.6, 36 20.2 C 37.5 18, 37.5 14.8, 35 12.5 Z"
        fill={patch2}
      />
      {/* eyes — top view, one each side of the head */}
      <circle cx="56.5" cy="11.2" r="0.95" fill="var(--color-ink)" />
      <circle cx="56.5" cy="18.8" r="0.95" fill="var(--color-ink)" />
    </svg>
  );
}

/* One fish per slot: loop path, size, duration, delay. Negative delays
   scatter them along their orbits from the first paint. */
const FISH = [
  { id: 'a', path: "path('M 40 90 C 40 40, 140 20, 190 60 C 240 100, 220 150, 160 150 C 100 150, 40 140, 40 90 Z')", size: 76, duration: '46s', delay: '-6s' },
  { id: 'b', path: "path('M 260 130 C 300 90, 340 90, 350 130 C 360 172, 320 190, 280 180 C 244 172, 224 166, 260 130 Z')", size: 54, duration: '38s', delay: '-20s' },
  { id: 'c', path: "path('M 150 210 C 190 180, 250 190, 260 230 C 270 268, 220 280, 180 268 C 144 258, 116 236, 150 210 Z')", size: 64, duration: '52s', delay: '-33s' },
] as const;

const FOLLOW_DISTANCE = 58;
const HOME_POINT = { x: 0.74, y: 0.3 };
const ACTIVE_ZONE = { left: 0.3, right: 0.72, top: 0.2, bottom: 0.76 };
const FISH_MARGIN = 52;

/** Koi drifting on slow elliptical loops — her Vietnamese-heritage thread. */
export default function KoiDrift({ count = 2, className, scheme = 'paper', followCursor = false }: KoiDriftProps) {
  const fish = FISH.slice(0, count);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, hasPointer: false });
  const motionRef = useRef({ x: 0, y: 0, angle: 0, initialized: false });
  const [leader, setLeader] = useState({ x: 0, y: 0, angle: 0, ready: false, active: false });

  const palettes =
    scheme === 'ink'
      ? [
          { body: 'var(--color-surface)', patch: 'var(--color-accent)', patch2: 'var(--color-terracotta)', outline: 'var(--color-oxblood)' },
          { body: 'var(--color-terracotta)', patch: 'var(--color-surface)', patch2: 'var(--color-amber)', outline: 'var(--color-oxblood)' },
          { body: 'var(--color-surface)', patch: 'var(--color-terracotta)', patch2: 'var(--color-accent)', outline: 'var(--color-oxblood)' },
        ]
      : [
          /* kohaku: pale body, red patches */
          { body: 'var(--color-surface)', patch: 'var(--color-accent)', patch2: 'var(--color-terracotta)', outline: 'var(--color-oxblood)' },
          /* hi utsuri-ish: warm body, pale patch */
          { body: 'var(--color-terracotta)', patch: 'var(--color-surface)', patch2: 'var(--color-oxblood)', outline: 'var(--color-oxblood)' },
          { body: 'var(--color-amber)', patch: 'var(--color-surface)', patch2: 'var(--color-terracotta)', outline: 'var(--color-oxblood)' },
        ];

  useEffect(() => {
    if (!followCursor) return undefined;

    let frame = 0;

    const seedPosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || motionRef.current.initialized) return;

      motionRef.current = {
        x: rect.width * HOME_POINT.x,
        y: rect.height * HOME_POINT.y,
        angle: 0.35,
        initialized: true,
      };
      pointerRef.current = {
        x: rect.width * HOME_POINT.x,
        y: rect.height * HOME_POINT.y,
        hasPointer: false,
      };
      setLeader({ ...motionRef.current, ready: true, active: false });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const isInsideFollowZone =
        localX >= rect.width * ACTIVE_ZONE.left &&
        localX <= rect.width * ACTIVE_ZONE.right &&
        localY >= rect.height * ACTIVE_ZONE.top &&
        localY <= rect.height * ACTIVE_ZONE.bottom;

      pointerRef.current = {
        x: localX,
        y: localY,
        hasPointer: isInsideFollowZone,
      };
    };

    const tick = () => {
      seedPosition();

      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && motionRef.current.initialized) {
        const pointer = pointerRef.current;
        const current = motionRef.current;
        const heroIsVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        const shouldFollow = pointer.hasPointer && heroIsVisible;
        if (shouldFollow) {
          const dx = pointer.x - current.x;
          const dy = pointer.y - current.y;
          const dist = Math.hypot(dx, dy);
          const ux = dist > 0.001 ? dx / dist : Math.cos(current.angle);
          const uy = dist > 0.001 ? dy / dist : Math.sin(current.angle);
          const targetX = pointer.x - ux * FOLLOW_DISTANCE;
          const targetY = pointer.y - uy * FOLLOW_DISTANCE;
          const targetAngle = Math.atan2(dy, dx);
          const turn = Math.atan2(Math.sin(targetAngle - current.angle), Math.cos(targetAngle - current.angle));

          current.x += (targetX - current.x) * 0.065;
          current.y += (targetY - current.y) * 0.065;
          current.angle += turn * 0.09;
        } else {
          const now = performance.now();
          let targetAngle = current.angle + Math.sin(now / 1500) * 0.018;

          if (current.x < FISH_MARGIN) targetAngle = 0.08;
          if (current.x > rect.width - FISH_MARGIN) targetAngle = Math.PI - 0.08;
          if (current.y < FISH_MARGIN) targetAngle = Math.PI / 2;
          if (current.y > rect.height - FISH_MARGIN) targetAngle = -Math.PI / 2;

          const turn = Math.atan2(Math.sin(targetAngle - current.angle), Math.cos(targetAngle - current.angle));

          current.angle += turn * 0.045;
          current.x += Math.cos(current.angle) * 0.55;
          current.y += Math.sin(current.angle) * 0.55;
        }

        current.x = Math.max(24, Math.min(current.x, rect.width - 24));
        current.y = Math.max(24, Math.min(current.y, rect.height - 24));

        setLeader({
          x: current.x,
          y: current.y,
          angle: current.angle,
          ready: true,
          active: shouldFollow,
        });
      }

      frame = window.requestAnimationFrame(tick);
    };

    seedPosition();
    window.addEventListener('pointermove', handlePointerMove);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, [followCursor]);

  // NOTE: no position class of its own — callers place it (usually `absolute`);
  // the fish inside anchor to this box via their offset paths.
  return (
    <div ref={containerRef} aria-hidden="true" className={`pointer-events-none ${className ?? 'relative'}`}>
      <style>{`
        @keyframes motif-koi-swim {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes motif-koi-mobile-swim {
          0% { transform: translate3d(clamp(9rem, 56vw, 15rem), 1.1rem, 0) rotate(176deg); }
          28% { transform: translate3d(clamp(4.25rem, 28vw, 8rem), 0.05rem, 0) rotate(194deg); }
          54% { transform: translate3d(0.35rem, 2.35rem, 0) rotate(154deg); }
          76% { transform: translate3d(clamp(4.5rem, 31vw, 9rem), 4.2rem, 0) rotate(7deg); }
          100% { transform: translate3d(clamp(9rem, 56vw, 15rem), 1.1rem, 0) rotate(-6deg); }
        }
        @media (max-width: 699px) {
          .home-hero-koi-mobile [data-koi-swim='true'] {
            top: 0 !important;
            left: 0 !important;
            offset-path: none !important;
            offset-distance: 0 !important;
            offset-rotate: 0deg !important;
            animation: motif-koi-mobile-swim 19s linear infinite !important;
            will-change: transform;
          }
        }
      `}</style>
      {followCursor && fish[0] ? (
        <div
          style={
            {
              position: 'absolute',
              top: leader.ready ? leader.y : '32%',
              left: leader.ready ? leader.x : '68%',
              opacity: leader.ready ? 1 : 0,
              transform: `translate(-50%, -50%) rotate(${leader.angle}rad)`,
              transformOrigin: 'center',
              filter: 'drop-shadow(0 10px 18px rgba(23, 19, 16, 0.12))',
              transition: 'opacity var(--motion-med) var(--ease-settle)',
            } as CSSProperties
          }
        >
          <Koi size={fish[0].size} {...palettes[0]} />
        </div>
      ) : fish.map((f, i) => (
        <div
          key={f.id}
          data-koi-swim="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            offsetPath: f.path,
            offsetRotate: 'auto',
            offsetDistance: '0%',
            animation: `motif-koi-swim ${f.duration} linear infinite`,
            animationDelay: f.delay,
          }}
        >
          <Koi size={f.size} {...palettes[i % palettes.length]} />
        </div>
      ))}
    </div>
  );
}
