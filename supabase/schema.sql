-- ================================================================
-- M.Ahsan Portfolio — Supabase Database Schema
-- ================================================================
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor → New query
--   2. Paste this entire file and click "Run"
-- ================================================================


-- ── EXTENSIONS ───────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ================================================================
-- TABLE: projects
-- ================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  description text        NOT NULL,
  category    text        NOT NULL CHECK (category IN ('web_dev', 'ai_chatbot', 'voice_agent')),
  image_url   text,
  year        integer     NOT NULL,
  status      text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  "order"     integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read published projects only
CREATE POLICY "Public read published projects"
  ON public.projects FOR SELECT
  USING (status = 'published');

-- Authenticated users have full access
CREATE POLICY "Authenticated full access on projects"
  ON public.projects FOR ALL
  USING (auth.role() = 'authenticated');

-- Sample seed data (feel free to edit)
INSERT INTO public.projects (title, description, category, year, status, "order") VALUES
  ('NextCommerce — E-Commerce Platform',
   'A full-stack e-commerce platform with real-time inventory, Stripe checkout, and an AI-powered product recommendation engine.',
   'web_dev', 2025, 'published', 1),
  ('LexBot — Legal AI Assistant',
   'An AI chatbot trained on legal documents that handles client intake, answers FAQs, and qualifies leads for a law firm 24/7.',
   'ai_chatbot', 2025, 'published', 2),
  ('VoiceDesk — Receptionist Agent',
   'A natural-sounding AI voice agent that answers inbound calls, books appointments, and routes enquiries — with zero human intervention.',
   'voice_agent', 2024, 'published', 3),
  ('HealthTrack — Patient Portal',
   'A HIPAA-compliant patient management portal with appointment booking, real-time messaging with doctors, and health record access.',
   'web_dev', 2024, 'published', 4),
  ('ShopBot — E-Commerce Chatbot',
   'A conversational commerce chatbot that helps customers find products, tracks orders, handles returns, and recovers abandoned carts.',
   'ai_chatbot', 2024, 'published', 5),
  ('BookingVoice — Salon Assistant',
   'AI voice agent for a salon chain that handles appointment bookings, sends confirmations, and follows up with no-shows.',
   'voice_agent', 2024, 'published', 6);


-- ================================================================
-- TABLE: site_content  (single-row — always id = 1)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id                  integer     PRIMARY KEY DEFAULT 1,
  hero_headline_1     text        NOT NULL DEFAULT 'I Build Websites.',
  hero_headline_2     text        NOT NULL DEFAULT 'I Build Intelligence.',
  hero_subtext        text        NOT NULL DEFAULT 'Web development, AI chatbots, and voice agents — crafted for impact.',
  hero_cta_primary    text        NOT NULL DEFAULT 'View My Work',
  hero_cta_secondary  text        NOT NULL DEFAULT 'Contact Me',
  about_bio           text        NOT NULL DEFAULT '',
  about_photo_url     text,
  service_1_title     text        NOT NULL DEFAULT 'Web Development',
  service_1_description text      NOT NULL DEFAULT 'Fast, responsive, and visually stunning websites built for performance and conversions.',
  service_2_title     text        NOT NULL DEFAULT 'AI Chatbots',
  service_2_description text      NOT NULL DEFAULT 'Intelligent conversational agents that automate support, qualify leads, and engage users 24/7.',
  service_3_title     text        NOT NULL DEFAULT 'AI Voice Agents',
  service_3_description text      NOT NULL DEFAULT 'Human-like voice AI that handles calls, bookings, and customer interactions autonomously.',
  contact_email       text        NOT NULL DEFAULT 'hello@mahsan.dev',
  social_linkedin     text,
  social_github       text,
  social_twitter      text,
  social_instagram    text,
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site content"
  ON public.site_content FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated full access on site_content"
  ON public.site_content FOR ALL USING (auth.role() = 'authenticated');

-- Seed the single row
INSERT INTO public.site_content (
  id, hero_headline_1, hero_headline_2, hero_subtext,
  hero_cta_primary, hero_cta_secondary,
  about_bio,
  service_1_title, service_1_description,
  service_2_title, service_2_description,
  service_3_title, service_3_description,
  contact_email,
  social_linkedin, social_github, social_twitter, social_instagram
) VALUES (
  1,
  'I Build Websites.',
  'I Build Intelligence.',
  'Web development, AI chatbots, and voice agents — crafted for impact.',
  'View My Work',
  'Contact Me',
  'I''m M.Ahsan — a full-stack developer and AI specialist who builds digital products that combine beautiful design with intelligent functionality.',
  'Web Development', 'Fast, responsive, and visually stunning websites built for performance and conversions.',
  'AI Chatbots', 'Intelligent conversational agents that automate support, qualify leads, and engage users 24/7.',
  'AI Voice Agents', 'Human-like voice AI that handles calls, bookings, and customer interactions autonomously.',
  'hello@mahsan.dev',
  'https://linkedin.com', 'https://github.com', 'https://twitter.com', 'https://instagram.com'
) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- TABLE: seo_metadata  (single-row — always id = 1)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  id               integer     PRIMARY KEY DEFAULT 1,
  site_title       text        NOT NULL DEFAULT 'M.Ahsan — Web Development · AI Chatbots · AI Voice Agents',
  site_description text        NOT NULL DEFAULT 'M.Ahsan is a developer specialising in web development, AI chatbots, and AI voice agents.',
  og_title         text        NOT NULL DEFAULT 'M.Ahsan — Web Development · AI Chatbots · AI Voice Agents',
  og_description   text        NOT NULL DEFAULT 'M.Ahsan — developer specialising in web development, AI chatbots, and AI voice agents.',
  og_image_url     text,
  twitter_handle   text,
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT seo_single_row CHECK (id = 1)
);

CREATE TRIGGER seo_metadata_updated_at
  BEFORE UPDATE ON public.seo_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read seo"
  ON public.seo_metadata FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated full access on seo_metadata"
  ON public.seo_metadata FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.seo_metadata (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- TABLE: contact_submissions
-- ================================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text        NOT NULL,
  message    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read       boolean     NOT NULL DEFAULT false
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit the form
CREATE POLICY "Public can insert contact submissions"
  ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated admin can read submissions
CREATE POLICY "Authenticated read contact submissions"
  ON public.contact_submissions FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated can update (mark as read)
CREATE POLICY "Authenticated update contact submissions"
  ON public.contact_submissions FOR UPDATE USING (auth.role() = 'authenticated');


-- ================================================================
-- TABLE: skills
-- ================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id       uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name     text    NOT NULL,
  category text    NOT NULL,
  "order"  integer NOT NULL DEFAULT 0
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read skills"
  ON public.skills FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated full access on skills"
  ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- Seed default skills
INSERT INTO public.skills (name, category, "order") VALUES
  ('HTML',        'Web Development', 1),
  ('CSS',         'Web Development', 2),
  ('JavaScript',  'Web Development', 3),
  ('React',       'Web Development', 4),
  ('Next.js',     'Web Development', 5),
  ('Tailwind CSS','Web Development', 6),
  ('Node.js',     'Web Development', 7),
  ('OpenAI API',  'AI & Automation', 1),
  ('LangChain',   'AI & Automation', 2),
  ('Voiceflow',   'AI & Automation', 3),
  ('Retell AI',   'AI & Automation', 4),
  ('Bland AI',    'AI & Automation', 5),
  ('Supabase',    'Backend & Database', 1),
  ('PostgreSQL',  'Backend & Database', 2),
  ('REST APIs',   'Backend & Database', 3),
  ('Git',         'Tools', 1),
  ('Figma',       'Tools', 2),
  ('VS Code',     'Tools', 3),
  ('Antigravity', 'Tools', 4);


-- ================================================================
-- STORAGE BUCKETS
-- ================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile',
  'profile',
  true,
  3145728,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public read profile"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile');

CREATE POLICY "Authenticated upload profile"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile' AND auth.role() = 'authenticated');
