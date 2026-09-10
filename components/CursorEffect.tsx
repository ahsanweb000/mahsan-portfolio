'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CursorEffect() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop and non-admin pages
    if (pathname?.startsWith('/admin')) return;
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`;
    };

    const onEnterHoverable = () => {
      cursor.classList.add('cursor--grow');
    };
    const onLeaveHoverable = () => {
      cursor.classList.remove('cursor--grow');
    };
    const onEnterCta = () => {
      cursor.classList.add('cursor--cta');
    };
    const onLeaveCta = () => {
      cursor.classList.remove('cursor--cta');
    };

    // Trailing dot — smooth lag via requestAnimationFrame
    const animateDot = () => {
      dotX += (mouseX - dotX) * 0.12;
      dotY += (mouseY - dotY) * 0.12;
      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      requestAnimationFrame(animateDot);
    };
    const rafId = requestAnimationFrame(animateDot);

    window.addEventListener('mousemove', onMove);

    // Attach grow/cta effects to hoverable elements
    const hoverTargets = document.querySelectorAll<HTMLElement>(
      'a, button, [data-cursor-grow]'
    );
    const ctaTargets = document.querySelectorAll<HTMLElement>(
      '[data-cursor-cta], .btn-primary'
    );

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', onEnterHoverable);
      el.addEventListener('mouseleave', onLeaveHoverable);
    });
    ctaTargets.forEach((el) => {
      el.addEventListener('mouseenter', onEnterCta);
      el.addEventListener('mouseleave', onLeaveCta);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterHoverable);
        el.removeEventListener('mouseleave', onLeaveHoverable);
      });
      ctaTargets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterCta);
        el.removeEventListener('mouseleave', onLeaveCta);
      });
    };
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid var(--color-text-secondary)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        }}
        className="custom-cursor"
      />
      {/* Trailing dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />

      {/* Cursor state styles injected inline */}
      <style>{`
        @media (min-width: 768px) {
          body, a, button {
            cursor: none;
          }
        }
        .custom-cursor.cursor--grow {
          width: 48px !important;
          height: 48px !important;
          border-color: var(--color-accent) !important;
        }
        .custom-cursor.cursor--cta {
          width: 48px !important;
          height: 48px !important;
          background-color: var(--color-accent-glow) !important;
          border-color: var(--color-accent) !important;
        }
        @media (max-width: 767px) {
          .custom-cursor, .custom-cursor + div { display: none !important; }
        }
      `}</style>
    </>
  );
}