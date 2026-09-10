# PHASE 5 — TECHNICAL ARCHITECTURE
## M.Ahsan Personal Portfolio

> Depends on: All previous phases
> This phase defines the full technical stack, folder structure, performance requirements, and implementation constraints. Read this before writing any code.

---

## 5.1 RECOMMENDED TECH STACK

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG for public pages, API routes for form handling, middleware for admin auth |
| Styling | Tailwind CSS + CSS Variables | Utility classes + design token system from Phase 1 |
| 3D Animation | Three.js | Hero background 3D scene |
| Animation | GSAP | Page transitions, scroll reveals, marquee strips |
| Database | Supabase (PostgreSQL) | As specified |
| Auth | Supabase Auth | As specified |
| Storage | Supabase Storage | Project images, profile photo |
| Deployment | Vercel | Native Next.js support, edge middleware |
| Language | TypeScript | Type safety across the full project |

---

## 5.2 FOLDER STRUCTURE

```
/
├── app/
│   ├── layout.tsx              # Root layout — Navbar, Footer, GrainOverlay, CursorEffect, PageTransition
│   ├── page.tsx                # Home page (/)
│   ├── about/
│   │   └── page.tsx            # About page (/about)
│   ├── work/
│   │   └── page.tsx            # Work/Projects page (/work)
│   ├── contact/
│   │   └── page.tsx            # Contact page (/contact)
│   └── admin/
│       ├── layout.tsx          # Admin layout — sidebar, auth guard
│       ├── page.tsx            # Admin dashboard (/admin)
│       ├── login/
│       │   └── page.tsx        # Admin login (/admin/login)
│       ├── projects/
│       │   └── page.tsx        # Projects management
│       ├── site-content/
│       │   └── page.tsx        # Site content editor
│       ├── skills/
│       │   └── page.tsx        # Skills management
│       ├── contact/
│       │   └── page.tsx        # Contact submissions
│       └── seo/
│           └── page.tsx        # SEO settings
│
├── components/
│   ├── global/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── GrainOverlay.tsx
│   │   ├── CursorEffect.tsx
│   │   └── PageTransition.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── HeroCanvas.tsx      # Three.js 3D scene
│   │   ├── ServiceCards.tsx
│   │   ├── MarqueeStrip.tsx
│   │   ├── SelectedWork.tsx
│   │   └── CTABanner.tsx
│   ├── work/
│   │   └── ProjectCard.tsx
│   ├── about/
│   │   ├── BioSection.tsx
│   │   └── SkillTags.tsx
│   ├── contact/
│   │   └── ContactForm.tsx
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── DashboardCards.tsx
│   │   ├── ProjectsTable.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── SiteContentEditor.tsx
│   │   ├── SkillsManager.tsx
│   │   └── SubmissionsTable.tsx
│   └── ui/
│       ├── GlassCard.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Toast.tsx
│       ├── Modal.tsx
│       └── SectionReveal.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client (service role)
│   │   └── middleware.ts       # Auth session check for admin routes
│   ├── types.ts                # TypeScript types matching Supabase schema
│   └── utils.ts                # Shared utility functions
│
├── middleware.ts                # Next.js middleware — protects /admin routes
├── public/
│   └── fonts/                  # Plus Jakarta Sans font files (self-hosted)
│
└── styles/
    └── globals.css             # CSS variables (Phase 1 tokens) + base styles
```

---

## 5.3 MIDDLEWARE (ADMIN PROTECTION)

```typescript
// middleware.ts — runs on every /admin/* request
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
```

---

## 5.4 TYPESCRIPT TYPES

```typescript
// lib/types.ts

export type ProjectCategory = 'web_dev' | 'ai_chatbot' | 'voice_agent'
export type ProjectStatus = 'draft' | 'published'

export interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  image_url: string | null
  year: number
  status: ProjectStatus
  order: number
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: number
  hero_headline_1: string
  hero_headline_2: string
  hero_subtext: string
  hero_cta_primary: string
  hero_cta_secondary: string
  about_bio: string
  about_photo_url: string | null
  service_1_title: string
  service_1_description: string
  service_2_title: string
  service_2_description: string
  service_3_title: string
  service_3_description: string
  contact_email: string
  social_linkedin: string
  social_github: string
  social_twitter: string
  social_instagram: string
  updated_at: string
}

export interface SEOMetadata {
  id: number
  site_title: string
  site_description: string
  og_title: string
  og_description: string
  og_image_url: string | null
  twitter_handle: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  read: boolean
}

export interface Skill {
  id: string
  name: string
  category: string
  order: number
}
```

---

## 5.5 PERFORMANCE REQUIREMENTS

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 (desktop), ≥ 75 (mobile) |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Cumulative Layout Shift | < 0.1 |

### Performance Rules
- Three.js canvas: lazy-load, initialize after page hydration — do not block render
- GSAP: import only used modules (`gsap/ScrollTrigger`, etc.) — no full bundle
- Images: all images use Next.js `<Image />` component with proper `width`, `height`, and `priority` on hero images
- Fonts: self-host Plus Jakarta Sans via `next/font/local` — no Google Fonts CDN request
- Admin panel: does NOT need to meet public page performance targets — function over speed

---

## 5.6 SEO IMPLEMENTATION

- Use Next.js `generateMetadata()` function on each public page
- Fetch `seo_metadata` from Supabase server-side and apply to metadata
- Each page has its own relevant title suffix: `About | M.Ahsan`, `Work | M.Ahsan`
- OG image served from Supabase Storage public URL
- `robots.txt`: allow all public routes, disallow `/admin/*`
- `sitemap.xml`: auto-generated for `/`, `/about`, `/work`, `/contact`

---

## 5.7 IMPLEMENTATION ORDER

Build in this exact order to avoid dependency issues:

```
1. Supabase setup (schema, RLS, storage buckets)
2. Next.js project scaffold + TypeScript + Tailwind
3. CSS variables (Phase 1 design tokens) in globals.css
4. Shared UI components (Button, Input, GlassCard, etc.)
5. Global components (Navbar, Footer, GrainOverlay)
6. CursorEffect + PageTransition (GSAP)
7. Home page — Hero (static first, add Three.js after)
8. Home page — Service Cards, Marquee, Selected Work, CTA
9. About page
10. Work/Projects page
11. Contact page + form submission
12. Admin login page
13. Admin middleware (route protection)
14. Admin dashboard + all sections
15. Three.js hero animation (add last — after everything else works)
16. GSAP scroll animations + parallax (add last)
17. SEO metadata
18. Performance audit + optimization
19. Deployment to Vercel
```

---

## 5.8 DO NOT

- DO NOT use `localStorage` or `sessionStorage` for auth — use Supabase session cookies
- DO NOT expose `SUPABASE_SERVICE_ROLE_KEY` to the client — server-side only
- DO NOT render any admin content before session is verified
- DO NOT add a public user registration flow — admin account created manually only
- DO NOT use inline styles — use Tailwind classes and CSS variables only
- DO NOT add a second accent color — cyan (`#00E5FF`) is the only accent
- DO NOT skip `prefers-reduced-motion` check on all GSAP animations
- DO NOT initialize Three.js on mobile (viewport < 768px) — use CSS fallback
