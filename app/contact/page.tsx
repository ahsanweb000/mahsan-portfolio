'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>('idle');

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!validateEmail(email)) e.email = 'Please enter a valid email address.';
    if (!subject.trim()) e.subject = 'Subject is required.';
    if (!message.trim()) e.message = 'Message is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState('submitting');

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contact_submissions')
        .insert({ name, email, subject, message });

      if (error) throw error;
      setFormState('success');
    } catch (err) {
      console.error('Contact form submission error:', err);
      setFormState('error');
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${hasError ? 'rgba(255,80,80,0.5)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-body)',
    outline: 'none',
    fontFamily: 'var(--font-primary)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 'var(--text-small)',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-xs)',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'rgba(255,100,100,0.9)',
    marginTop: '4px',
  };

  return (
    <section style={{ padding: 'var(--space-2xl) var(--space-lg)', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="contact-grid" style={{ display: 'grid', gap: 'var(--space-2xl)', alignItems: 'start' }}>
        <div>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 'var(--space-sm)' }}>
            Get in touch
          </p>
          <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, color: 'var(--color-white)', letterSpacing: '-0.02em', marginBottom: 'var(--space-md)' }}>
            Let&apos;s Talk.
          </h1>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '36ch', marginBottom: 'var(--space-xl)' }}>
            Have a project in mind? Reach out and let&apos;s make it happen.
          </p>

          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)' }}>
              EMAIL
            </p>
            <a href="mailto:hello@mahsan.dev" className="contact-email" style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-primary)', fontWeight: 500, transition: 'color 0.2s ease' }}>
              hello@mahsan.dev
            </a>
          </div>

          <div>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginBottom: 'var(--space-md)' }}>
              SOCIALS
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="contact-social" style={{ color: 'var(--color-text-secondary)', display: 'inline-flex', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', transition: 'color 0.2s ease, border-color 0.2s ease' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          {formState === 'success' ? (
            <div style={{ padding: 'var(--space-2xl)', background: 'rgba(0,229,100,0.06)', border: '1px solid rgba(0,229,100,0.2)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✓</div>
              <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-white)', marginBottom: 'var(--space-sm)' }}>Message sent.</h2>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                I&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div>
                <label htmlFor="name" style={labelStyle}>Name <span style={{ color: 'rgba(255,80,80,0.7)' }}>*</span></label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle(!!errors.name)} className="contact-input" required />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" style={labelStyle}>Email <span style={{ color: 'rgba(255,80,80,0.7)' }}>*</span></label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle(!!errors.email)} className="contact-input" required />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="subject" style={labelStyle}>Subject <span style={{ color: 'rgba(255,80,80,0.7)' }}>*</span></label>
                <input id="subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="What's this about?" style={inputStyle(!!errors.subject)} className="contact-input" required />
                {errors.subject && <p style={errorStyle}>{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" style={labelStyle}>Message <span style={{ color: 'rgba(255,80,80,0.7)' }}>*</span></label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell me about your project..." rows={5} style={{ ...inputStyle(!!errors.message), resize: 'vertical', minHeight: '140px' }} className="contact-input" required />
                {errors.message && <p style={errorStyle}>{errors.message}</p>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  data-cursor-cta
                  className="btn-submit"
                  style={{
                    padding: '14px 36px',
                    background: formState === 'submitting' ? 'rgba(0,229,255,0.5)' : 'var(--color-accent)',
                    color: 'var(--color-bg)',
                    fontWeight: 700,
                    fontSize: 'var(--text-small)',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    letterSpacing: '0.02em',
                    fontFamily: 'var(--font-primary)',
                  }}
                >
                  {formState === 'submitting' ? 'Sending…' : 'Send Message →'}
                </button>

                {formState === 'error' && (
                  <p style={{ fontSize: 'var(--text-small)', color: 'rgba(255,100,100,0.9)' }}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .contact-grid { grid-template-columns: 2fr 3fr; }
        @media (max-width: 767px) { .contact-grid { grid-template-columns: 1fr !important; } }
        .contact-input:focus { border-color: var(--color-accent) !important; box-shadow: 0 0 0 3px var(--color-accent-glow) !important; outline: none; }
        .contact-input::placeholder { color: var(--color-text-muted); }
        .contact-email:hover { color: var(--color-accent) !important; }
        .contact-social:hover { color: var(--color-accent) !important; border-color: rgba(0,229,255,0.3) !important; }
        .btn-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
      `}</style>
    </section>
  );
}