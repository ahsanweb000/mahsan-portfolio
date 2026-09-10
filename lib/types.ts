/**
 * lib/types.ts
 * -----------
 * Shared TypeScript interfaces matching the Supabase database schema.
 * Used across server components, client components, and API routes.
 */

// ── projects table ────────────────────────────────────────────────
export type ProjectCategory = 'web_dev' | 'ai_chatbot' | 'voice_agent';
export type ProjectStatus = 'draft' | 'published';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  image_url: string | null;
  year: number;
  status: ProjectStatus;
  order: number;
  created_at: string;
  updated_at: string;
}

// ── site_content table ────────────────────────────────────────────
export interface SiteContent {
  id: number;
  hero_headline_1: string;
  hero_headline_2: string;
  hero_subtext: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_bio: string;
  about_photo_url: string | null;
  service_1_title: string;
  service_1_description: string;
  service_2_title: string;
  service_2_description: string;
  service_3_title: string;
  service_3_description: string;
  contact_email: string;
  social_linkedin: string | null;
  social_github: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  updated_at: string;
}

// ── seo_metadata table ────────────────────────────────────────────
export interface SeoMetadata {
  id: number;
  site_title: string;
  site_description: string;
  og_title: string;
  og_description: string;
  og_image_url: string | null;
  twitter_handle: string | null;
  updated_at: string;
}

// ── contact_submissions table ─────────────────────────────────────
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

// ── skills table ──────────────────────────────────────────────────
export interface Skill {
  id: string;
  name: string;
  category: string;
  order: number;
}

// ── UI helper type for ProjectCard (maps DB category to display label) ─
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  web_dev: 'Web Dev',
  ai_chatbot: 'AI Chatbot',
  voice_agent: 'Voice Agent',
};

// Default fallback content when Supabase is not yet configured
export const DEFAULT_SITE_CONTENT: Partial<SiteContent> = {
  hero_headline_1: 'I Build Websites.',
  hero_headline_2: 'I Build Intelligence.',
  hero_subtext: 'Web development, AI chatbots, and voice agents — crafted for impact.',
  hero_cta_primary: 'View My Work',
  hero_cta_secondary: 'Contact Me',
  about_bio: '',
  contact_email: 'hello@mahsan.dev',
  social_linkedin: 'https://linkedin.com',
  social_github: 'https://github.com',
  social_twitter: 'https://twitter.com',
  social_instagram: 'https://instagram.com',
};

export const DEFAULT_SKILLS: { category: string; tags: string[] }[] = [
  { category: 'Web Development', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js'] },
  { category: 'AI & Automation', tags: ['OpenAI API', 'LangChain', 'Voiceflow', 'Retell AI', 'Bland AI'] },
  { category: 'Backend & Database', tags: ['Supabase', 'PostgreSQL', 'REST APIs'] },
  { category: 'Tools', tags: ['Git', 'Figma', 'VS Code', 'Antigravity'] },
];