'use client';

import { useEffect } from 'react';

export default function ImagePickerModal({
  images,
  onSelect,
  onClose,
}: {
  images: string[] | null;
  onSelect: (path: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(33,29,24,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full flex flex-col"
        style={{
          maxWidth: '40rem',
          maxHeight: '80vh',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-line)',
          boxShadow: '0 1px 2px rgba(33,29,24,.08), 0 4px 12px rgba(33,29,24,.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--color-line)' }}>
          <span className="u-eyebrow">pick an image</span>
          <button type="button" onClick={onClose} className="u-eyebrow">
            ( close )
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {images === null && <p className="u-eyebrow">( loading… )</p>}
          {images !== null && images.length === 0 && <p className="u-eyebrow">( no images in /public yet )</p>}
          {images !== null && images.length > 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
              {images.map((path) => (
                <button
                  type="button"
                  key={path}
                  onClick={() => onSelect(path)}
                  className="text-left"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)', padding: 4 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={path}
                    alt=""
                    style={{ width: '100%', height: 72, objectFit: 'cover', display: 'block' }}
                  />
                  <span
                    className="u-eyebrow block mt-1 truncate"
                    style={{ fontSize: '0.65rem', letterSpacing: 0 }}
                    title={path}
                  >
                    {path}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
