'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const wipeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const wipe = wipeRef.current;
    const content = contentRef.current;
    if (!wipe || !content) return;

    // Respect prefers-reduced-motion
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!motionOk) {
      wipe.style.display = 'none';
      content.style.opacity = '1';
      return;
    }

    // Skip the wipe on the very first page load so content is immediately visible
    if (isFirstMount.current) {
      isFirstMount.current = false;
      wipe.style.display = 'none';
      content.style.opacity = '1';
      return;
    }

    // Route transition: wipe slides in from left → covers screen → slides out to right
    const tl = gsap.timeline({
      onComplete: () => {
        if (wipe) {
          wipe.style.display = 'none';
        }
      },
    });

    gsap.set(wipe, {
      display: 'block',
      scaleX: 1,
      transformOrigin: 'left center',
      opacity: 1,
    });
    gsap.set(content, { opacity: 0 });

    tl.to(wipe, {
      scaleX: 0,
      transformOrigin: 'right center',
      duration: 0.6,
      ease: 'power4.inOut',
    }).to(
      content,
      {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      },
      '-=0.15'
    );

    return () => {
      tl.kill();
      if (wipe) {
        wipe.style.display = 'none';
      }
      if (content) {
        content.style.opacity = '1';
      }
    };
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Cyan wipe overlay — hidden by default to prevent stuck screens */}
      <div
        ref={wipeRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--color-accent)',
          zIndex: 9997,
          pointerEvents: 'none',
          transformOrigin: 'left center',
          display: 'none',
          transform: 'scaleX(0)',
        }}
      />
      {/* Page content */}
      <div ref={contentRef} style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}