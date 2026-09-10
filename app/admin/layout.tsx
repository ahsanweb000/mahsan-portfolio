'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    href: '/admin/projects',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Site Content',
    href: '/admin/site-content',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    label: 'Skills',
    href: '/admin/skills',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: 'Contact Submissions',
    href: '/admin/contact',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'SEO Settings',
    href: '/admin/seo',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <div className="admin-root-reset">{children}</div>;
  }

  return (
    <div className="admin-root-reset" style={{ minHeight: '100vh', display: 'flex', background: '#0A0A0A', color: '#F0F0F0', fontFamily: 'var(--font-primary)' }}>
      <aside
        className="admin-sidebar"
        style={{
          width: '240px',
          background: '#0D0D0D',
          borderRight: '1px solid #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1E1E1E' }}>
          <Link href="/" target="_blank" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>M.Ahsan</span>
            <span style={{ color: '#00E5FF', fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '4px', fontWeight: 600 }}>ADMIN</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#00E5FF' : '#888888',
                      background: isActive ? '#141414' : 'transparent',
                      borderLeft: isActive ? '3px solid #00E5FF' : '3px solid transparent',
                      textDecoration: 'none',
                      transition: 'background 0.2s ease, color 0.2s ease',
                    }}
                    className="admin-nav-link"
                  >
                    <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#00E5FF' : '#888888' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #1E1E1E' }}>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: '#161616',
                border: '1px solid #222222',
                borderRadius: '6px',
                color: '#AAAAAA',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
              }}
              className="admin-signout-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-main" style={{ flex: 1, marginLeft: '240px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="admin-mobile-header" style={{ display: 'none', padding: '16px 20px', background: '#0D0D0D', borderBottom: '1px solid #1E1E1E', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: '#FFFFFF' }}>M.Ahsan ADMIN</span>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {NAV_ITEMS.map(i => (
              <Link key={i.href} href={i.href} style={{ padding: '6px 10px', fontSize: '0.75rem', color: pathname === i.href ? '#00E5FF' : '#888', background: '#161616', borderRadius: '4px', textDecoration: 'none' }}>
                {i.label}
              </Link>
            ))}
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        .admin-root-reset {
          cursor: default !important;
        }
        .admin-root-reset a, .admin-root-reset button, .admin-root-reset input, .admin-root-reset select, .admin-root-reset textarea {
          cursor: pointer !important;
        }
        .admin-root-reset input[type="text"], .admin-root-reset input[type="email"], .admin-root-reset input[type="password"], .admin-root-reset input[type="number"], .admin-root-reset textarea {
          cursor: text !important;
        }
        .admin-nav-link:hover {
          background: #141414 !important;
          color: #FFFFFF !important;
        }
        .admin-signout-btn:hover {
          background: rgba(255, 68, 68, 0.1) !important;
          color: #FF4444 !important;
          border-color: rgba(255, 68, 68, 0.3) !important;
        }
        @media (max-width: 860px) {
          .admin-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .admin-mobile-header { display: flex !important; }
        }
      `}</style>
    </div>
  );
}