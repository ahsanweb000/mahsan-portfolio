'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

const NAV_LINKS = [
  { label: 'Home',    href: '/' },
  { label: 'About',   href: '/about' },
  { label: 'Work',    href: '/work' },
  { label: 'Contact', href: '/contact' },
];

const SERVICES = ['Web Development', 'AI Chatbots', 'AI Voice Agents'];

export default function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', paddingTop: 'var(--space-2xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-lg)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-xl)',
          paddingBottom: 'var(--space-xl)',
        }}>
          <div>
            <p style={{ fontSize: 'var(--text-h3)', fontWeight: 800, color: 'var(--color-white)', letterSpacing: '-0.03em', marginBottom: 'var(--space-sm)' }}>
              M.Ahsan<span style={{ color: 'var(--color-accent)' }}>.</span>
            </p>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-lg)', maxWidth: '26ch' }}>
              Building intelligent web experiences.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="social-icon" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s ease, transform 0.2s ease', display: 'inline-flex' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: 'var(--color-white)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
              Navigation
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {NAV_LINKS.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="footer-link" style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', transition: 'color 0.2s ease' }}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: 'var(--color-white)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
              Services
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {SERVICES.map((s) => (
                <li key={s}>
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 'var(--text-small)', fontWeight: 700, color: 'var(--color-white)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
              Contact
            </p>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>
              Available for freelance & contract projects worldwide.
            </p>
            <a href="mailto:hello@mahsan.dev" style={{ fontSize: 'var(--text-small)', color: 'var(--color-accent)', fontWeight: 600 }}>
              hello@mahsan.dev →
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--space-md)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00E676', display: 'inline-block', boxShadow: '0 0 8px #00E676' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Available for work
              </span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: 'var(--space-lg) 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            © {year} M.Ahsan. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ background: 'none', border: 'none', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', cursor: 'pointer', transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', gap: '4px' }}
            className="back-to-top"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      <style>{`
        .footer-link:hover, .social-icon:hover, .back-to-top:hover {
          color: var(--color-accent) !important;
        }
        .social-icon:hover { transform: translateY(-2px); }
      `}</style>
    </footer>
  );
}