'use client';

import { useRef, useCallback } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  radius?: 'sm' | 'md' | 'lg';
  noTilt?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  style,
  radius = 'md',
  noTilt = false,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const radiusMap = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (noTilt || window.innerWidth < 768) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    },
    [noTilt]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-card ${className}`}
      style={{
        position: 'relative',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        boxShadow: 'var(--glass-shadow)',
        borderRadius: radiusMap[radius],
        transition: 'transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      data-cursor-grow
    >
      {children}

      <style>{`
        .glass-card:hover {
          border-color: rgba(0, 229, 255, 0.3) !important;
          box-shadow: var(--glass-shadow), 0 0 24px rgba(0, 229, 255, 0.15) !important;
        }
        @media (max-width: 767px) {
          .glass-card {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}