'use client';

import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';
import { accentVar } from '@/lib/motifs';

export type FrameCorner = 'tl' | 'tr' | 'bl' | 'br';

export interface FrameCursor {
  label: string;
  color: string; // raw CSS color / token
  corner?: FrameCorner;
}

export interface FrameHandlesProps {
  children: ReactNode;
  /** single cursor chip (back-compat) */
  label?: string;
  /** multiple Figma-multiplayer cursors, e.g. her skills in different colors */
  cursors?: FrameCursor[];
  tint?: string;
  animateIn?: boolean;
  className?: string;
}

const HANDLE_POSITIONS = [
  { top: 0, left: 0, translate: '-50%, -50%' },
  { top: 0, right: 0, translate: '50%, -50%' },
  { bottom: 0, left: 0, translate: '-50%, 50%' },
  { bottom: 0, right: 0, translate: '50%, 50%' },
] as const;

/** A single multiplayer-style cursor: pointer arrow + name pill. */
function Cursor({ label, color, corner = 'tr', index = 0 }: FrameCursor & { index?: number }) {
  const flip = corner === 'tr' || corner === 'br';
  const arrowRotation =
    corner === 'tl'
      ? 'rotate(135deg)'
      : corner === 'tr'
        ? 'rotate(-135deg)'
        : corner === 'bl'
          ? 'rotate(45deg)'
          : 'rotate(-45deg)';
  return (
    <span
      aria-hidden="true"
      className={`motif-frame-cursor motif-frame-cursor-${corner}`}
      style={{
        '--cursor-color': color,
      } as CSSProperties}
    >
      <span
        className="motif-frame-cursor-inner"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
            '--cursor-i': String(index),
            '--cursor-drift-x': flip ? '-4px' : '4px',
          } as CSSProperties}
      >
        <span className="motif-frame-cursor-arrow">
          <svg viewBox="0 0 12 14" fill="none" style={{ transform: arrowRotation }}>
            <path d="M1 1L10.5 7L6 8L4 12.5L1 1Z" fill={color} stroke="var(--color-surface)" strokeWidth="0.75" strokeLinejoin="round" />
          </svg>
        </span>
        <span
          className="motif-frame-cursor-label"
        >
          {label}
        </span>
      </span>
    </span>
  );
}

/**
 * Figma-style selection frame: hairline outline, four corner handles, and
 * multiplayer cursor chips — used on the hero to label her name with her
 * skills, each in its own collaborator color.
 */
export default function FrameHandles({
  children,
  label,
  cursors,
  tint,
  animateIn = false,
  className,
}: FrameHandlesProps) {
  const color = tint ? accentVar(tint) : 'var(--color-accent-2)';
  const chips: FrameCursor[] = cursors ?? (label ? [{ label, color, corner: 'tr' }] : []);

  return (
    <div className={`relative inline-block ${className ?? ''}`}>
      <style>{`
        .motif-frame-cursor {
          --cursor-offset: 128%;
          --cursor-nudge: 10%;
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          pointer-events: none;
          white-space: nowrap;
          z-index: 2;
        }
        .motif-frame-cursor-tl {
          top: 0;
          left: 0;
          flex-direction: row;
          transform: translate(calc(var(--cursor-nudge) * -1), calc(var(--cursor-offset) * -1));
        }
        .motif-frame-cursor-tr {
          top: 0;
          right: 0;
          flex-direction: row-reverse;
          transform: translate(var(--cursor-nudge), calc(var(--cursor-offset) * -1));
        }
        .motif-frame-cursor-bl {
          bottom: 0;
          left: 0;
          flex-direction: row;
          transform: translate(calc(var(--cursor-nudge) * -1), var(--cursor-offset));
        }
        .motif-frame-cursor-br {
          right: 0;
          bottom: 0;
          flex-direction: row-reverse;
          transform: translate(var(--cursor-nudge), var(--cursor-offset));
        }
        .motif-frame-cursor-arrow,
        .motif-frame-cursor-arrow svg {
          display: inline-flex;
          width: 15px;
          height: 18px;
        }
        .motif-frame-cursor-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--cursor-color);
          color: white;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 16px;
          padding: 5px 9px 6px;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(23, 19, 16, 0.24);
          text-align: center;
          text-transform: none;
        }
        @keyframes motif-frame-cursor-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          42% { transform: translate3d(var(--cursor-drift-x), -7px, 0); }
          72% { transform: translate3d(calc(var(--cursor-drift-x) * -0.5), -2px, 0); }
        }
        @keyframes motif-frame-cursor-tap {
          0%, 78%, 100% { transform: scale(1); }
          84% { transform: scale(0.92); }
          90% { transform: scale(1.04); }
        }
        .motif-frame-cursor-inner {
          animation: motif-frame-cursor-drift 3.8s var(--ease-drift) infinite !important;
          animation-delay: calc(var(--cursor-i, 0) * -680ms) !important;
        }
        .motif-frame-cursor-arrow {
          display: inline-flex;
          transform-origin: 30% 20%;
          animation: motif-frame-cursor-tap 3.8s var(--ease-settle) infinite !important;
          animation-delay: calc(var(--cursor-i, 0) * -680ms) !important;
        }
        @media (max-width: 699px) {
          .motif-frame-cursor {
            --cursor-offset: 138%;
            --cursor-nudge: 6%;
            gap: 3px;
          }
          .motif-frame-cursor-inner {
            --cursor-drift-x: 3px;
            animation-duration: 5.2s !important;
          }
          .motif-frame-cursor-arrow {
            animation-duration: 5.2s !important;
          }
          .motif-frame-cursor-arrow,
          .motif-frame-cursor-arrow svg {
            width: 11px;
            height: 13px;
          }
          .motif-frame-cursor-label {
            font-size: 10px;
            line-height: 12px;
            padding: 3px 6px 4px;
            box-shadow: 0 2px 4px rgba(23, 19, 16, 0.22);
          }
        }
      `}</style>

      {animateIn && (
        <style>{`
          @keyframes motif-frame-outline { from { opacity: 0; } to { opacity: 1; } }
          @keyframes motif-frame-pop {
            0% { opacity: 0; transform: translate(var(--handle-t)) scale(0.6); }
            80% { opacity: 1; transform: translate(var(--handle-t)) scale(1.06); }
            100% { opacity: 1; transform: translate(var(--handle-t)) scale(1); }
          }
          @media (prefers-reduced-motion: no-preference) {
            .motif-frame-outline-in { animation: motif-frame-outline var(--motion-med) var(--ease-settle) both; }
            .motif-frame-handle-in {
              animation: motif-frame-pop var(--motion-med) var(--ease-settle) both;
              animation-delay: calc(var(--motion-fast) * var(--handle-i, 0) / 3);
            }
          }
        `}</style>
      )}

      {children}

      {/* outline */}
      <span
        aria-hidden="true"
        className={animateIn ? 'motif-frame-outline-in' : ''}
        style={{ position: 'absolute', inset: 0, border: `1px solid ${color}`, pointerEvents: 'none' }}
      />

      {/* corner handles */}
      {HANDLE_POSITIONS.map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={animateIn ? 'motif-frame-handle-in' : ''}
          style={
            {
              position: 'absolute',
              width: 8,
              height: 8,
              background: 'var(--color-surface)',
              border: `1px solid ${color}`,
              pointerEvents: 'none',
              top: 'top' in pos ? pos.top : undefined,
              bottom: 'bottom' in pos ? pos.bottom : undefined,
              left: 'left' in pos ? pos.left : undefined,
              right: 'right' in pos ? pos.right : undefined,
              transform: `translate(${pos.translate})`,
              '--handle-t': pos.translate,
              '--handle-i': i,
            } as React.CSSProperties
          }
        />
      ))}

      {/* multiplayer cursors */}
      {chips.map((c, i) => (
        <Cursor key={i} {...c} index={i} />
      ))}
    </div>
  );
}
