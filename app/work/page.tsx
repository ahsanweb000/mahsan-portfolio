import type { Metadata } from 'next';
import SectionReveal from '@/components/SectionReveal';
import ProjectCard, { type Project } from '@/components/ProjectCard';
import { createClient } from '@/lib/supabase/server';
import { CATEGORY_LABELS, type ProjectCategory } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Work',
  description: 'A collection of web development, AI chatbot, and AI voice agent projects by M.Ahsan.',
};

export const dynamic = 'force-dynamic';

const STATIC_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'NextCommerce — E-Commerce Platform',
    description: 'A full-stack e-commerce platform with real-time inventory, Stripe checkout, and an AI-powered product recommendation engine built with Next.js and Supabase.',
    category: 'Web Dev',
    year: '2025',
  },
  {
    id: '2',
    title: 'LexBot — Legal AI Assistant',
    description: 'An AI chatbot trained on legal documents that handles client intake, answers FAQs, and qualifies leads for a law firm 24/7 without human involvement.',
    category: 'AI Chatbot',
    year: '2025',
  },
  {
    id: '3',
    title: 'VoiceDesk — Receptionist Agent',
    description: 'A natural-sounding AI voice agent that answers inbound calls, books appointments, and routes enquiries — with zero human intervention.',
    category: 'Voice Agent',
    year: '2024',
  },
  {
    id: '4',
    title: 'HealthTrack — Patient Portal',
    description: 'A HIPAA-compliant patient management portal with appointment booking, real-time messaging with doctors, and health record access.',
    category: 'Web Dev',
    year: '2024',
  },
  {
    id: '5',
    title: 'ShopBot — E-Commerce Chatbot',
    description: 'A conversational commerce chatbot that helps customers find products, tracks orders, handles returns, and recovers abandoned carts automatically.',
    category: 'AI Chatbot',
    year: '2024',
  },
  {
    id: '6',
    title: 'BookingVoice — Salon Assistant',
    description: 'AI voice agent for a salon chain that handles appointment bookings, sends confirmations, and follows up with no-shows — all via phone calls.',
    category: 'Voice Agent',
    year: '2024',
  },
];

export default async function WorkPage() {
  let projects: Project[] = STATIC_PROJECTS;
  let isConnected = false;

  try {
    const isConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-ref') &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-anon-public-key');

    if (isConfigured) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('order', { ascending: true });

      if (!error && data) {
        isConnected = true;
        projects = data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          category: (CATEGORY_LABELS[p.category as ProjectCategory] || 'Web Dev') as Project['category'],
          year: String(p.year),
          imageUrl: p.image_url || undefined,
        }));
      }
    }
  } catch (err) {
    console.error('WorkPage fetch error:', err);
  }
  return (
    <section style={{ padding: 'var(--space-2xl) var(--space-lg)', maxWidth: '1200px', margin: '0 auto' }}>
      <SectionReveal style={{ marginBottom: 'var(--space-2xl)' }}>
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 'var(--space-sm)' }}>
          Portfolio
        </p>
        <h1
          style={{
            fontSize: 'var(--text-h1)',
            fontWeight: 800,
            color: 'var(--color-white)',
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-md)',
          }}
        >
          Selected Work.
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: '60ch' }}>
          A collection of projects across web development, AI chatbots, and voice agents.
        </p>
      </SectionReveal>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
          <p style={{ fontSize: 'var(--text-h3)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Projects coming soon. Check back later.
          </p>
        </div>
      ) : (
        <div className="work-grid" style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          {projects.map((project, i) => (
            <SectionReveal key={project.id} delay={Math.min(i % 3, 2) * 100}>
              <ProjectCard project={project} />
            </SectionReveal>
          ))}
        </div>
      )}

      <style>{`
        .work-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 1023px) {
          .work-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          .work-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}