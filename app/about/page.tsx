import type { Metadata } from 'next';
import SectionReveal from '@/components/SectionReveal';
import CTABanner from '@/components/CTABanner';
import { createClient } from '@/lib/supabase/server';
import type { Skill, SiteContent } from '@/lib/types';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about M.Ahsan — full-stack developer, AI chatbot builder, and AI voice agent specialist.',
};

export const dynamic = 'force-dynamic';

const DEFAULT_SKILLS: { category: string; tags: string[] }[] = [
  {
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js'],
  },
  {
    category: 'AI & Automation',
    tags: ['OpenAI API', 'LangChain', 'Voiceflow', 'Retell AI', 'Bland AI'],
  },
  {
    category: 'Backend & Database',
    tags: ['Supabase', 'PostgreSQL', 'REST APIs'],
  },
  {
    category: 'Tools',
    tags: ['Git', 'Figma', 'VS Code', 'Antigravity'],
  },
];

export default async function AboutPage() {
  let siteContent: Partial<SiteContent> | null = null;
  let skillsGrouped = DEFAULT_SKILLS;

  try {
    const isConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-ref') &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-anon-public-key');

    if (isConfigured) {
      const supabase = await createClient();
      const [contentRes, skillsRes] = await Promise.all([
        supabase.from('site_content').select('*').eq('id', 1).maybeSingle(),
        supabase.from('skills').select('*').order('order', { ascending: true }),
      ]);

      if (contentRes.data) {
        siteContent = contentRes.data;
      }

      if (skillsRes.data && skillsRes.data.length > 0) {
        const groups: Record<string, string[]> = {};
        (skillsRes.data as Skill[]).forEach((s) => {
          if (!groups[s.category]) groups[s.category] = [];
          groups[s.category].push(s.name);
        });
        skillsGrouped = Object.entries(groups).map(([category, tags]) => ({
          category,
          tags,
        }));
      }
    }
  } catch (err) {
    console.error('AboutPage Supabase fetch error:', err);
  }
  return (
    <>
      <section
        style={{
          padding: 'var(--space-2xl) var(--space-lg) var(--space-xl)',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <SectionReveal>
          <h1
            style={{
              fontSize: 'var(--text-h1)',
              fontWeight: 800,
              color: 'var(--color-white)',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-md)',
            }}
          >
            About Me
          </h1>
          <p
            style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-text-secondary)',
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            Developer. AI Specialist. Problem Solver.
          </p>
        </SectionReveal>
      </section>

      <section
        style={{
          padding: 'var(--space-xl) var(--space-lg)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
            gap: 'var(--space-2xl)',
            alignItems: 'start',
          }}
          className="bio-grid"
        >
          <SectionReveal>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                aspectRatio: '4/5',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #222 60%, #1a1a1a 100%)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 0 40px rgba(0,229,255,0.08)',
              }}
            >
              {siteContent?.about_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={siteContent.about_photo_url}
                  alt="M.Ahsan"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)',
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'rgba(0,229,255,0.12)',
                      border: '2px solid rgba(0,229,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                    }}
                  >
                    👤
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Photo coming soon</p>
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'inset 0 0 0 1px rgba(0,229,255,0.15)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </SectionReveal>

          <SectionReveal delay={150} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <h2
              style={{
                fontSize: 'var(--text-h2)',
                fontWeight: 700,
                color: 'var(--color-white)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Hi, I&apos;m M.Ahsan.
            </h2>
            {siteContent?.about_bio ? (
              <div style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {siteContent.about_bio}
              </div>
            ) : (
              <>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  I&apos;m a full-stack developer and AI specialist who builds digital products that combine beautiful design with intelligent functionality. I specialise in creating web experiences that don&apos;t just look great — they convert and perform.
                </p>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  My work spans across custom websites and web applications, AI-powered chatbots that handle real customer conversations, and voice agents that can pick up the phone, qualify leads, and book appointments — all without human intervention.
                </p>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  I believe great technology should be invisible. The best systems are the ones your users never notice — they just work, flawlessly, every time. That&apos;s the standard I build to.
                </p>
                <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                  When I&apos;m not building, I&apos;m researching what&apos;s next in AI — and figuring out how to put it to work for the businesses I partner with.
                </p>
              </>
            )}

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0,229,100,0.06)', border: '1px solid rgba(0,229,100,0.2)', borderRadius: 'var(--radius-full)', width: 'fit-content', marginTop: 'var(--space-sm)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E564', boxShadow: '0 0 8px rgba(0,229,100,0.6)', animation: 'pulse 2s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: '#00E564' }}>Available for new projects</span>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section
        style={{
          padding: 'var(--space-2xl) var(--space-lg)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <SectionReveal style={{ marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 'var(--space-sm)' }}>
            Tech Stack
          </p>
          <h2
            style={{
              fontSize: 'var(--text-h2)',
              fontWeight: 700,
              color: 'var(--color-white)',
              letterSpacing: '-0.02em',
            }}
          >
            Skills &amp; tools I use.
          </h2>
        </SectionReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {skillsGrouped.map((group, gi) => (
            <SectionReveal key={group.category} delay={gi * 80}>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.1em',
                  marginBottom: 'var(--space-md)',
                  textTransform: 'uppercase',
                }}
              >
                {group.category}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(0,229,255,0.08)',
                      border: '1px solid rgba(0,229,255,0.2)',
                      color: 'var(--color-accent)',
                      fontSize: 'var(--text-small)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <SectionReveal>
        <CTABanner
          heading="Like what you see?"
          subtext="Let's work together on your next project."
          buttonLabel="Get in Touch →"
          buttonHref="/contact"
        />
      </SectionReveal>

      <style>{`
        @media (max-width: 767px) {
          .bio-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}