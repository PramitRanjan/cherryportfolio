'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/** Cross-fades through images while hovered; holds on the first frame otherwise. */
export function HoverImageCarousel({ images, alt, hovered }: { images: string[]; alt: string; hovered: boolean }) {
  const frames = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (frames.length <= 1) return undefined;
    if (!hovered) {
      if (startTimer.current) clearTimeout(startTimer.current);
      if (rotateTimer.current) clearInterval(rotateTimer.current);
      setActiveIndex(0);
      return undefined;
    }

    startTimer.current = setTimeout(() => {
      setActiveIndex(1);
      rotateTimer.current = setInterval(() => {
        setActiveIndex((current) => (current + 1) % frames.length);
      }, 1350);
    }, 380);

    return () => {
      if (startTimer.current) clearTimeout(startTimer.current);
      if (rotateTimer.current) clearInterval(rotateTimer.current);
    };
  }, [frames, hovered]);

  if (!frames.length) return null;

  return (
    <>
      {frames.map((src, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: index === activeIndex ? 1 : 0, transition: 'opacity 240ms ease-out' }}
        />
      ))}
    </>
  );
}
