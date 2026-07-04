import { ImageResponse } from 'next/og';

export const alt = 'Cherry Phan portfolio preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#f7f0df',
          color: '#171310',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.28,
            backgroundImage:
              'linear-gradient(rgba(31, 24, 19, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 24, 19, 0.08) 1px, transparent 1px)',
            backgroundSize: '78px 78px',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 30,
            border: '2px solid rgba(44, 70, 199, 0.9)',
            display: 'flex',
          }}
        />
        {[
          { top: 20, left: 20 },
          { top: 20, right: 20 },
          { bottom: 20, left: 20 },
          { bottom: 20, right: 20 },
        ].map((pos, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: 22,
              height: 22,
              border: '2px solid #2c46c7',
              background: '#f7f0df',
              ...pos,
            }}
          />
        ))}

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '54px 58px 48px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 24, letterSpacing: 4, color: '#2c46c7' }}>
            <div>PORTFOLIO</div>
            <div>VER. 2026</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 24, letterSpacing: 4, color: '#2c46c7' }}>
              ( PRODUCT &amp; UX DESIGNER )
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 128, fontStyle: 'italic', lineHeight: 0.86 }}>
              <span>Cherry</span>
              <span>Phan</span>
            </div>
            <div style={{ fontSize: 54, fontStyle: 'italic', lineHeight: 1.05 }}>
              Design with empathy.
            </div>
            <div
              style={{
                maxWidth: 860,
                fontFamily: 'system-ui, sans-serif',
                fontSize: 28,
                lineHeight: 1.45,
                color: 'rgba(23, 19, 16, 0.62)',
              }}
            >
              Product and UX work about time, memory, ritual, and the small moments we usually rush past.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'monospace', fontSize: 24, letterSpacing: 4 }}>
            <div style={{ color: '#2c46c7' }}>LINKEDIN ↗</div>
            <div style={{ color: 'rgba(23, 19, 16, 0.46)' }}>( SCROLL SLOWLY )</div>
            <div style={{ color: '#2c46c7' }}>( SAVANNAH, GA )</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
