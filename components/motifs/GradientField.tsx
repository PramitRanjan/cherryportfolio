import type { ReactNode } from 'react';
import { gradientStops, type AccentPreset } from '@/lib/motifs';

export interface GradientFieldProps {
  preset?: AccentPreset;
  stops?: string;
  variant?: 'wash' | 'mesh';
  grain?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Soft per-project gradient ground. `wash` = single linear sweep; `mesh` =
 * layered radial blurs built from the same stop tokens, for a diffused feel.
 */
export default function GradientField({
  preset,
  stops,
  variant = 'wash',
  grain = false,
  className,
  children,
}: GradientFieldProps) {
  const stopList = stops ?? gradientStops(preset);

  const background =
    variant === 'mesh'
      ? [
          `radial-gradient(120% 90% at 15% 20%, ${stopList}, transparent 70%)`,
          `radial-gradient(100% 80% at 85% 15%, ${stopList}, transparent 65%)`,
          `radial-gradient(110% 100% at 50% 100%, ${stopList}, transparent 70%)`,
        ].join(', ')
      : `linear-gradient(135deg, ${stopList})`;

  return (
    <div
      className={`${grain ? 'u-grain' : ''} ${className ?? ''}`}
      style={{ background }}
    >
      {children}
    </div>
  );
}
