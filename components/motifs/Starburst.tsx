export interface StarburstProps {
  children: React.ReactNode;
  tint?: string;
  textColor?: string;
  className?: string;
  points?: number;
}

function burstPath(points: number, outer: number, inner: number): string {
  const steps: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / points - Math.PI / 2;
    steps.push(`${i === 0 ? 'M' : 'L'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`);
  }
  return steps.join(' ') + ' Z';
}

/** The yellow starburst sticker from her moodboard — award/callout moments. */
export default function Starburst({
  children,
  tint = 'var(--color-amber)',
  textColor = 'var(--color-oxblood)',
  className,
  points = 16,
}: StarburstProps) {
  return (
    <div className={`relative inline-grid place-items-center ${className ?? ''}`} style={{ transform: 'rotate(-8deg)' }}>
      <svg aria-hidden="true" viewBox="-100 -100 200 200" className="col-start-1 row-start-1 h-full w-full">
        <path d={burstPath(points, 98, 62)} fill={tint} />
      </svg>
      <div
        className="col-start-1 row-start-1 px-6 text-center font-mono"
        style={{ color: textColor, fontSize: '0.66rem', letterSpacing: '0.06em', lineHeight: 1.45 }}
      >
        {children}
      </div>
    </div>
  );
}
