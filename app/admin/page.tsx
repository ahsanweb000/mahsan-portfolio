import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let user = null;
  let totalProjects = 0;
  let publishedProjects = 0;
  let draftProjects = 0;
  let unreadMessages = 0;
  let recentMessages: Array<{ id: string; name: string; email: string; subject: string; created_at: string; read: boolean }> = [];

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData?.user || null;

    if (user) {
      const [allProjRes, pubProjRes, draftProjRes, unreadRes, recentRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('read', false),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      totalProjects = allProjRes.count || 0;
      publishedProjects = pubProjRes.count || 0;
      draftProjects = draftProjRes.count || 0;
      unreadMessages = unreadRes.count || 0;
      recentMessages = recentRes.data || [];
    }
  } catch (err) {
    console.error('Failed to load admin metrics:', err);
  }

  if (!user) {
    redirect('/admin/login');
  }

  const statCards = [
    { label: 'Total Projects', value: totalProjects, color: '#00E5FF', sub: 'In portfolio database' },
    { label: 'Published', value: publishedProjects, color: '#00C48C', sub: 'Live on public site' },
    { label: 'Drafts', value: draftProjects, color: '#888888', sub: 'Hidden from public' },
    { label: 'Unread Messages', value: unreadMessages, color: unreadMessages > 0 ? '#00E5FF' : '#888888', sub: 'Contact inquiries' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#888888', fontSize: '0.875rem', marginTop: '6px', margin: 0 }}>
            Welcome back, <span style={{ color: '#00E5FF' }}>{user.email}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/admin/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: '#00E5FF',
              color: '#0A0A0A',
              fontWeight: 700,
              fontSize: '0.8125rem',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            + Add Project
          </Link>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              background: '#161616',
              border: '1px solid #262626',
              color: '#F0F0F0',
              fontWeight: 600,
              fontSize: '0.8125rem',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            View Live Site ↗
          </Link>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#111111',
              border: '1px solid #1F1F1F',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: '#888888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {card.label}
            </span>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: card.color, lineHeight: 1 }}>
              {card.value}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#666666' }}>
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
          Quick Navigation
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Projects Catalog', desc: 'Add, update or reorder projects shown in portfolio', href: '/admin/projects', action: 'Manage Projects →' },
            { title: 'Site Content', desc: 'Edit Hero headlines, Bio, Service details and socials', href: '/admin/site-content', action: 'Edit Content →' },
            { title: 'Skills & Tools', desc: 'Manage your tech stack categories and displayed tools', href: '/admin/skills', action: 'Manage Skills →' },
            { title: 'SEO Configuration', desc: 'Update Meta titles, Open Graph tags and descriptions', href: '/admin/seo', action: 'Update SEO →' },
          ].map((sec) => (
            <Link
              key={sec.title}
              href={sec.href}
              style={{
                background: '#111111',
                border: '1px solid #1F1F1F',
                borderRadius: '8px',
                padding: '20px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              className="admin-quick-card"
            >
              <div>
                <p style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>{sec.title}</p>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.8125rem', color: '#888888', lineHeight: 1.5 }}>{sec.desc}</p>
              </div>
              <span style={{ fontSize: '0.8125rem', color: '#00E5FF', fontWeight: 600 }}>{sec.action}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Recent Inquiries
          </h2>
          <Link href="/admin/contact" style={{ fontSize: '0.8125rem', color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
            View All ({unreadMessages} unread) →
          </Link>
        </div>

        <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '8px', overflow: 'hidden' }}>
          {recentMessages.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#666666', fontSize: '0.875rem' }}>
              No messages received yet. Submit a test inquiry through the public contact form!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E1E1E', color: '#666666', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 20px' }}>Sender</th>
                  <th style={{ padding: '12px 20px' }}>Subject</th>
                  <th style={{ padding: '12px 20px' }}>Date</th>
                  <th style={{ padding: '12px 20px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((msg) => (
                  <tr key={msg.id} style={{ borderBottom: '1px solid #1A1A1A' }}>
                    <td style={{ padding: '14px 20px', color: '#FFFFFF', fontWeight: 600 }}>
                      {msg.name}
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#888888', fontWeight: 400 }}>{msg.email}</span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#CCCCCC' }}>{msg.subject}</td>
                    <td style={{ padding: '14px 20px', color: '#888888', fontSize: '0.8125rem' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: msg.read ? '#1C1C1C' : 'rgba(0, 229, 255, 0.1)',
                        color: msg.read ? '#888888' : '#00E5FF',
                      }}>
                        {msg.read ? 'Read' : 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        .admin-quick-card:hover {
          border-color: #00E5FF !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
