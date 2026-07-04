import type { ReactNode } from 'react';

export interface StickerCardProps {
  children: ReactNode;
  kind?: 'tape' | 'stamp' | 'polaroid' | 'note';
  tilt?: number;
  className?: string;
}

/**
 * Tilted paper ephemera — tape strip, stamp perforation, polaroid caption
 * bar, or a plain noted card. Paper-on-paper shadow, straightens on hover.
 */
export default function StickerCard({
  children,
  kind = 'note',
  tilt = -2,
  className,
}: StickerCardProps) {
  return (
    <div
      className={`motif-sticker motif-sticker-${kind} ${className ?? ''}`}
      style={{ '--sticker-tilt': `${tilt}deg` } as React.CSSProperties}
    >
      <style>{`
        .motif-sticker {
          position: relative;
          background: var(--color-surface);
          transform: rotate(var(--sticker-tilt));
          box-shadow: 0 1px 2px rgba(33, 29, 24, 0.08), 0 4px 12px rgba(33, 29, 24, 0.06);
          transition: transform var(--motion-fast) var(--ease-settle), box-shadow var(--motion-fast) var(--ease-settle);
        }
        @media (hover: hover) {
          .motif-sticker:hover {
            transform: rotate(0deg) translateY(-2px);
            box-shadow: 0 2px 4px rgba(33, 29, 24, 0.1), 0 8px 18px rgba(33, 29, 24, 0.08);
          }
        }

        .motif-sticker-note {
          border: 1px solid var(--color-line);
        }

        .motif-sticker-polaroid {
          border: 1px solid var(--color-line);
          padding-bottom: 2.25rem;
        }

        /* perforation lives only in the padding rim; the inner wrapper's solid
           surface covers the tile pattern everywhere else */
        .motif-sticker-stamp {
          padding: 8px;
          background: radial-gradient(circle at 0 0, transparent 4px, var(--color-surface) 4.5px);
          background-size: 14px 14px;
          box-shadow: none;
        }
        .motif-sticker-stamp > .motif-sticker-stamp-inner {
          position: relative;
          background: var(--color-surface);
          border: 1px solid var(--color-line);
        }

        .motif-sticker-tape {
          border: 1px solid var(--color-line);
        }
        .motif-sticker-tape::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          width: 46%;
          min-width: 64px;
          height: 22px;
          background: linear-gradient(
            0deg,
            rgba(252, 249, 242, 0.55),
            rgba(252, 249, 242, 0.75)
          );
          border: 1px solid rgba(217, 106, 139, 0.18);
          transform: translateX(-50%) rotate(-2deg);
          pointer-events: none;
        }
      `}</style>
      {kind === 'stamp' ? <div className="motif-sticker-stamp-inner">{children}</div> : children}
    </div>
  );
}
