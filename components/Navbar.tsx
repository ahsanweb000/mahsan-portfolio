'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'About',   href: '/about' },
  { label: 'Work',    href: '/work' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-lg)',
          height: '72px',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          backgroundColor: scrolled ? 'rgba(10,10,10,0.8)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          transition: 'backdrop-filter 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Link href="/" className="nav-logo" style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: '-0.03em', transition: 'color 0.2s ease' }}>
          M.Ahsan<span style={{ color: 'var(--color-accent)' }}>.</span>
        </Link>

        <ul className="nav-desktop" style={{ display: 'flex', gap: 'var(--space-lg)', listStyle: 'none', alignItems: 'center' }}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link href={link.href} className="nav-link" data-active={isActive} style={{
                  fontSize: 'var(--text-small)',
                  fontWeight: 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  position: 'relative',
                  paddingBottom: '4px',
                  display: 'inline-block',
                }}>
                  {link.label}
                  <span className="nav-underline" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '1px',
                    background: 'var(--color-white)',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left center',
                    transition: 'transform 0.25s ease',
                    ...(isActive ? { background: 'var(--color-accent)' } : {}),
                  }} />
                </Link>
              </li>
            );
          })}

          <li>
            <Link href="/contact" data-cursor-cta className="hire-me-btn" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              background: 'var(--color-accent)',
              color: 'var(--color-bg)',
              fontWeight: 700,
              fontSize: 'var(--text-small)',
              borderRadius: 'var(--radius-sm)',
              transition: 'box-shadow 0.3s ease, transform 0.2s ease',
              letterSpacing: '0.01em',
            }}>
              Hire Me →
            </Link>
          </li>
        </ul>

        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{ background: 'none', border: 'none', padding: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: '5px' }}
        >
          {[
            { transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' },
            { opacity: mobileOpen ? 0 : 1 },
            { transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' },
          ].map((extra, i) => (
            <span key={i} style={{
              display: 'block', width: '24px', height: '2px',
              background: mobileOpen ? 'var(--color-accent)' : 'var(--color-text-primary)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              ...extra,
            }} />
          ))}
        </button>
      </nav>

      <div
        className="nav-mobile-overlay"
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          backgroundColor: 'rgba(10,10,10,0.97)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xl)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden={!mobileOpen}
      >
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
            fontSize: 'var(--text-h2)', fontWeight: 700,
            color: pathname === link.href ? 'var(--color-accent)' : 'var(--color-text-primary)',
          }}>
            {link.label}
          </Link>
        ))}
        <Link href="/contact" onClick={() => setMobileOpen(false)} style={{
          marginTop: 'var(--space-md)', padding: '14px 40px',
          background: 'var(--color-accent)', color: 'var(--color-bg)',
          fontWeight: 700, fontSize: 'var(--text-body)', borderRadius: 'var(--radius-sm)',
        }}>
          Hire Me →
        </Link>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-hamburger { display: none !important; }
          .nav-desktop { display: flex !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        .nav-logo:hover { color: var(--color-accent) !important; }
        .nav-link:hover { color: var(--color-white) !important; }
        .nav-link:hover .nav-underline { transform: scaleX(1) !important; }
        .hire-me-btn:hover {
          box-shadow: 0 0 20px rgba(0,229,255,0.4) !important;
          transform: scale(1.02) !important;
        }
      `}</style>
    </>
  );
}