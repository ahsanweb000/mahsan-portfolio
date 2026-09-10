'use client';

import Link from 'next/link';

interface CTABannerProps {
  heading?: string;
  subtext?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function CTABanner({
  heading = 'Ready to build something remarkable?',
  subtext = "Let's work together and bring your ideas to life.",
  buttonLabel = 'Start a Project →',
  buttonHref = '/contact',
}: CTABannerProps) {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'var(--space-3xl) var(--space-lg)',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,229,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: 'var(--text-h1)',
            fontWeight: 800,
            color: 'var(--color-white)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: 'var(--space-md)',
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontSize: 'var(--text-body)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            marginBottom: 'var(--space-xl)',
          }}
        >
          {subtext}
        </p>
        <Link
          href={buttonHref}
          data-cursor-cta
          className="cta-banner-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 40px',
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            fontWeight: 700,
            fontSize: 'var(--text-body)',
            borderRadius: 'var(--radius-sm)',
            transition: 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.3s ease',
          }}
        >
          {buttonLabel}
        </Link>
      </div>

      <style>{`
        .cta-banner-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(0, 229, 255, 0.35) !important;
        }
      `}</style>
    </section>
  );
}