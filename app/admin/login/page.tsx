'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-body)',
    fontFamily: 'var(--font-primary)',
    outline: 'none',
    cursor: 'text',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-lg)',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2xl)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--text-h2)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-white)', marginBottom: 'var(--space-xs)' }}>
            M.Ahsan<span style={{ color: 'var(--color-accent)' }}>.</span>
          </p>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>
            Admin access only
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className="admin-input"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="admin-input"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255,80,80,0.08)',
              border: '1px solid rgba(255,80,80,0.25)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-small)',
              color: 'rgba(255,120,120,0.9)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 'var(--space-sm)',
              padding: '13px',
              background: loading ? 'rgba(0,229,255,0.4)' : 'var(--color-accent)',
              color: 'var(--color-bg)',
              fontWeight: 700,
              fontSize: 'var(--text-body)',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s ease',
              fontFamily: 'var(--font-primary)',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        .admin-input {
          cursor: text !important;
        }
        .admin-input:focus {
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 3px var(--color-accent-glow) !important;
        }
        .admin-input::placeholder { color: var(--color-text-muted); }
      `}</style>
    </div>
  );
}