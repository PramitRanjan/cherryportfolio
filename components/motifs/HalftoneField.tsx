import { accentVar } from '@/lib/motifs';

export interface HalftoneFieldProps {
  variant?: 'flower' | 'fade';
  tint?: string;
  className?: string;
}

/**
 * True halftone — a dot matrix whose dot sizes describe a form, like the
 * grey halftone florals on her personal banner. 'flower' renders a six-petal
 * bloom; 'fade' is a radial field for layering over gradients.
 */
export default function HalftoneField({ variant = 'flower', tint, className }: HalftoneFieldProps) {
  const color = tint ? accentVar(tint) : 'var(--color-ink)';
  const size = 260;
  const step = 10;
  const dots: { x: number; y: number; r: number }[] = [];

  const c = size / 2;

  if (variant === 'flower') {
    const petals = Array.from({ length: 6 }, (_, k) => {
      const a = (k * Math.PI) / 3 + Math.PI / 6;
      return { x: c + Math.cos(a) * 62, y: c + Math.sin(a) * 62, r: 55 };
    });
    for (let y = step / 2; y < size; y += step) {
      for (let x = step / 2; x < size; x += step) {
        let intensity = 0;
        for (const p of petals) {
          const d = Math.hypot(x - p.x, y - p.y);
          intensity = Math.max(intensity, 1 - d / p.r);
        }
        const dCore = Math.hypot(x - c, y - c);
        intensity = Math.max(intensity, 1 - dCore / 30);
        const r = intensity * step * 0.46;
        if (r > 0.55) dots.push({ x, y, r });
      }
    }
  } else {
    for (let y = step / 2; y < size; y += step) {
      for (let x = step / 2; x < size; x += step) {
        const d = Math.hypot(x - c, y - c);
        const intensity = Math.max(0, 1 - d / (size * 0.52));
        const r = intensity * step * 0.42;
        if (r > 0.4) dots.push({ x, y, r });
      }
    }
  }

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${size} ${size}`} className={className} style={{ overflow: 'visible' }}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} />
      ))}
    </svg>
  );
}
