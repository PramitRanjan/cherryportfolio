import { accentVar } from '@/lib/motifs';

export interface RippleFieldProps {
  rings?: number;
  tint?: string;
  className?: string;
  drift?: boolean;
}

/* Irregular multipliers so ring spacing reads as hand-drawn, not generated. */
const SPACING = [1, 0.92, 1.08, 0.97, 1.05, 0.9, 1.1, 0.95];

/**
 * Engraved concentric water rings, viewed from a low angle (ellipse, not
 * circle). Hairline strokes, fading outward. `drift` breathes very slowly.
 */
export default function RippleField({
  rings = 5,
  tint,
  className,
  drift = false,
}: RippleFieldProps) {
  const stroke = tint ? accentVar(tint) : 'var(--color-line)';
  const rxBase = 18;
  const ratio = 2.4;

  let rx = rxBase;
  const ellipses = Array.from({ length: rings }, (_, i) => {
    const spacingMult = SPACING[i % SPACING.length];
    rx += rxBase * 0.85 * spacingMult;
    const ry = rx / ratio;
    const opacity = 0.5 - (i / Math.max(rings - 1, 1)) * 0.36;
    const strokeWidth = 1.1 - (i / Math.max(rings - 1, 1)) * 0.5;
    return { rx, ry, opacity: Math.max(opacity, 0.08), strokeWidth: Math.max(strokeWidth, 0.4) };
  });

  const maxRx = ellipses[ellipses.length - 1]?.rx ?? rxBase;
  const maxRy = ellipses[ellipses.length - 1]?.ry ?? rxBase / ratio;
  // rings sit dead-centre of the viewBox so callers can centre the SVG itself
  const cx = Math.ceil(maxRx * 1.04);
  const cy = Math.ceil(maxRy * 1.08);
  const viewW = cx * 2;
  const viewH = cy * 2;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${viewW} ${viewH}`}
      className={`${drift ? 'motif-ripple-drift' : ''} ${className ?? ''}`}
      style={{ overflow: 'visible' }}
    >
      {drift && (
        <style>{`
          @keyframes motif-ripple-breathe {
            0% { transform: scale(1); opacity: 0.92; }
            100% { transform: scale(1.02); opacity: 1; }
          }
          .motif-ripple-drift {
            transform-origin: center;
          }
          @media (prefers-reduced-motion: no-preference) {
            .motif-ripple-drift {
              animation: motif-ripple-breathe 8s var(--ease-drift, ease-in-out) infinite alternate;
            }
          }
        `}</style>
      )}
      <g>
        {ellipses.map((e, i) => (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={e.rx}
            ry={e.ry}
            fill="none"
            stroke={stroke}
            strokeWidth={e.strokeWidth}
            opacity={e.opacity}
          />
        ))}
      </g>
    </svg>
  );
}
