'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { gsap } from 'gsap';
import GlassCard from '@/components/GlassCard';
import SectionReveal from '@/components/SectionReveal';
import CTABanner from '@/components/CTABanner';
import ProjectCard, { type Project } from '@/components/ProjectCard';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_LABELS, type ProjectCategory, type SiteContent } from '@/lib/types';

// Lazy-load Three.js scene (heavy, client-only, no SSR)
const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

const FEATURED_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'NextCommerce — E-Commerce Platform',
    description: 'A full-stack e-commerce platform with real-time inventory, Stripe checkout, and an AI-powered product recommendation engine.',
    category: 'Web Dev',
    year: '2025',
  },
  {
    id: '2',
    title: 'LexBot — Legal AI Assistant',
    description: 'An AI chatbot trained on legal documents that handles client intake, answers FAQs, and qualifies leads for a law firm 24/7.',
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
];

const SERVICES = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: 'Web Development',
    desc: 'Fast, responsive, and visually stunning websites built for performance and conversions.',
    link: '#',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: 'AI Chatbots',
    desc: 'Intelligent conversational agents that automate support, qualify leads, and engage users 24/7.',
    link: '#',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    title: 'AI Voice Agents',
    desc: 'Human-like voice AI that handles calls, bookings, and customer interactions autonomously.',
    link: '#',
  },
];

const MARQUEE_TEXT = ['Web Development', 'AI Chatbots', 'Voice Agents', 'M.Ahsan'];

export default function HomePage() {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const h1Line1Ref = useRef<HTMLHeadingElement>(null);
  const h1Line2Ref = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(FEATURED_PROJECTS);
  const [siteContent, setSiteContent] = useState<Partial<SiteContent>>({});

  useEffect(() => {
    const isConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-ref') &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-anon-public-key');

    if (!isConfigured) return;

    const fetchLiveContent = async () => {
      try {
        const supabase = createClient();
        const [projRes, contentRes] = await Promise.all([
          supabase
            .from('projects')
            .select('*')
            .eq('status', 'published')
            .order('order', { ascending: true })
            .limit(3),
          supabase.from('site_content').select('*').eq('id', 1).maybeSingle(),
        ]);

        if (projRes.data && projRes.data.length > 0) {
          setFeaturedProjects(
            projRes.data.map((p) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              category: (CATEGORY_LABELS[p.category as ProjectCategory] || 'Web Dev') as Project['category'],
              year: String(p.year),
              imageUrl: p.image_url || undefined,
            }))
          );
        }

        if (contentRes.data) {
          setSiteContent(contentRes.data);
        }
      } catch (err) {
        console.error('Failed to load Supabase data on Home:', err);
      }
    };

    fetchLiveContent();
  }, []);

  useEffect(() => {
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!motionOk) return;

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(labelRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);

    if (h1Line1Ref.current) {
      const words = h1Line1Ref.current.querySelectorAll<HTMLSpanElement>('.hero-word');
      tl.fromTo(words, { clipPath: 'inset(0 100% 0 0)', opacity: 0 }, {
        clipPath: 'inset(0 0% 0 0)', opacity: 1,
        duration: 0.6, stagger: 0.1, ease: 'power3.out',
      }, 0.5);
    }

    if (h1Line2Ref.current) {
      const words = h1Line2Ref.current.querySelectorAll<HTMLSpanElement>('.hero-word');
      tl.fromTo(words, { clipPath: 'inset(0 100% 0 0)', opacity: 0 }, {
        clipPath: 'inset(0 0% 0 0)', opacity: 1,
        duration: 0.6, stagger: 0.1, ease: 'power3.out',
      }, 0.9);
    }

    tl.fromTo(subtextRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.4);
    tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.7);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const wrapWords = (text: string) =>
    text.split(' ').map((word, i) => (
      <span key={i} className="hero-word" style={{ display: 'inline-block', marginRight: '0.28em' }}>
        {word}
      </span>
    ));

  return (
    <>
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}>
        <HeroScene />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(10,10,10,0.7) 100%)', zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '0 var(--space-lg)', maxWidth: '820px' }}>
          <p ref={labelRef} style={{ opacity: 0, fontSize: 'var(--text-small)', fontWeight: 400, color: 'var(--color-text-secondary)', letterSpacing: '0.1em', marginBottom: 'var(--space-lg)' }}>
            Full-Stack Developer &amp; AI Specialist
          </p>

          <h1 ref={h1Line1Ref} style={{ fontSize: 'var(--text-hero)', fontWeight: 800, color: 'var(--color-white)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '0.1em', overflow: 'hidden' }}>
            {wrapWords(siteContent.hero_headline_1 || 'I Build Websites.')}
          </h1>

          <h1 ref={h1Line2Ref} style={{ fontSize: 'var(--text-hero)', fontWeight: 800, color: 'var(--color-white)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 'var(--space-lg)', overflow: 'hidden' }}>
            {wrapWords(siteContent.hero_headline_2 || 'I Build Intelligence.')}
          </h1>

          <p ref={subtextRef} style={{ opacity: 0, fontSize: 'var(--text-body)', fontWeight: 300, color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto var(--space-xl)', lineHeight: 1.7 }}>
            {siteContent.hero_subtext || 'Web development, AI chatbots, and voice agents — crafted for impact.'}
          </p>

          <div ref={ctaRef} style={{ opacity: 0, display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/work" data-cursor-cta className="btn-accent" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', background: 'var(--color-accent)',
              color: 'var(--color-bg)', fontWeight: 700, fontSize: 'var(--text-small)',
              borderRadius: 'var(--radius-sm)', transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}>
              {siteContent.hero_cta_primary || 'View My Work'}
            </Link>
            <Link href="/contact" data-cursor-grow className="btn-outline" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', background: 'transparent',
              color: 'var(--color-accent)', fontWeight: 600, fontSize: 'var(--text-small)',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-accent)',
              transition: 'background 0.2s ease, box-shadow 0.3s ease',
            }}>
              {siteContent.hero_cta_secondary || 'Contact Me'}
            </Link>
          </div>
        </div>

        <div
          ref={scrollIndicatorRef}
          style={{
            position: 'absolute', bottom: 'var(--space-xl)', left: '50%', transform: 'translateX(-50%)',
            zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            opacity: scrolled ? 0 : 1, transition: 'opacity 0.4s ease', pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>Scroll</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--color-text-muted), transparent)', animation: 'scrollFade 1.8s ease-in-out infinite' }} />
        </div>
      </section>

      <section style={{ padding: 'var(--space-2xl) var(--space-lg)', maxWidth: '1100px', margin: '0 auto' }}>
        <SectionReveal style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 'var(--space-sm)' }}>
            What I do
          </p>
          <h2 style={{ fontSize: 'var(--text-h1)', fontWeight: 800, color: 'var(--color-white)', letterSpacing: '-0.02em' }}>
            Services
          </h2>
        </SectionReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
          {SERVICES.map((s, i) => (
            <SectionReveal key={s.title} delay={i * 120}>
              <GlassCard style={{ padding: 'var(--space-xl)', height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }} radius="lg">
                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'rgba(0,229,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-white)' }}>{s.title}</h3>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-accent)', fontWeight: 600 }}>
                  Learn More →
                </span>
              </GlassCard>
            </SectionReveal>
          ))}
        </div>
      </section>

      <div style={{ overflow: 'hidden', transform: 'rotate(-4deg)', margin: 'var(--space-xl) 0', padding: '0' }} aria-hidden="true">
        <div className="marquee-strip-1" style={{
          display: 'flex', gap: '2rem', padding: '14px 0',
          background: 'var(--color-accent)', color: 'var(--color-bg)',
          whiteSpace: 'nowrap', animation: 'marqueeLeft 20s linear infinite',
          width: 'max-content',
        }}>
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT].map((t, i) => (
            <span key={i} style={{ fontSize: 'var(--text-small)', fontWeight: 700, letterSpacing: '0.08em', flexShrink: 0 }}>
              {t} <span style={{ margin: '0 0.5rem', opacity: 0.6 }}>✦</span>
            </span>
          ))}
        </div>
        <div className="marquee-strip-2" style={{
          display: 'flex', gap: '2rem', padding: '14px 0',
          background: 'var(--color-surface)', color: 'var(--color-text-secondary)',
          whiteSpace: 'nowrap', animation: 'marqueeRight 20s linear infinite',
          width: 'max-content',
        }}>
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT].map((t, i) => (
            <span key={i} style={{ fontSize: 'var(--text-small)', fontWeight: 600, letterSpacing: '0.08em', flexShrink: 0 }}>
              {t} <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <section style={{ padding: 'var(--space-2xl) var(--space-lg)', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionReveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 'var(--space-sm)' }}>
              Selected work
            </p>
            <h2 style={{ fontSize: 'var(--text-h1)', fontWeight: 800, color: 'var(--color-white)', letterSpacing: '-0.02em' }}>
              Recent projects.
            </h2>
          </div>
          <Link href="/work" className="view-all-link" style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--color-text-secondary)', transition: 'color 0.2s ease', whiteSpace: 'nowrap' }}>
            View All Work →
          </Link>
        </SectionReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
          {featuredProjects.map((project, i) => (
            <SectionReveal key={project.id} delay={i * 100}>
              <ProjectCard project={project} />
            </SectionReveal>
          ))}
        </div>
      </section>

      <SectionReveal>
        <CTABanner />
      </SectionReveal>

      <style>{`
        .btn-accent:hover { opacity: 0.88; transform: translateY(-2px); }
        .btn-outline:hover { background: rgba(0,229,255,0.08) !important; box-shadow: 0 0 20px rgba(0,229,255,0.2); }
        .view-all-link:hover { color: var(--color-accent) !important; }

        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        @keyframes scrollFade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-strip-1, .marquee-strip-2 { animation: none !important; }
        }
      `}</style>
    </>
  );
}