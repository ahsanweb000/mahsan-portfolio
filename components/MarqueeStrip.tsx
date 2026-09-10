'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MarqueeStripProps {
  items: string[];
  speed?: number;
  angle?: number;
  gap?: string;
  className?: string;
}

export default function MarqueeStrip({
  items,
  speed = 80,
  angle = -6,
  gap = '3rem',
  className = '',
}: MarqueeStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const repeated = [...items, ...items, ...items, ...items];

  useEffect(() => {
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const track = trackRef.current;
    if (!track || !motionOk) return;

    const totalWidth = track.scrollWidth / 2;
    const duration = totalWidth / speed;

    tweenRef.current = gsap.to(track, {
      x: `-=${totalWidth}`,
      duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [speed, items]);

  return (
    <div
      className={`marquee-strip-outer ${className}`}
      style={{
        overflow: 'hidden',
        width: '100%',
        padding: '1.5rem 0',
      }}
      aria-hidden="true"
    >
      <div
        className="marquee-strip-inner"
        ref={trackRef}
        style={{
          display: 'flex',
          gap,
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {repeated.map((item, idx) => (
          <span
            key={idx}
            style={{
              fontSize: 'var(--text-small)',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {item}
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                margin: '0 1.5rem',
                verticalAlign: 'middle',
              }}
            />
          </span>
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .marquee-strip-outer {
            transform: rotate(${angle}deg);
            width: calc(100% + 8rem) !important;
            margin-left: -4rem;
          }
        }
        @media (max-width: 767px) {
          .marquee-strip-outer {
            transform: none !important;
            width: 100% !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}