# PHASE 1 — PROJECT OVERVIEW & DESIGN SYSTEM
## M.Ahsan Personal Portfolio

---

## 1.1 PROJECT IDENTITY

| Field | Value |
|---|---|
| Project Type | Personal Portfolio Website |
| Owner | M.Ahsan |
| Services Showcased | Web Development, AI Chatbots, AI Voice Agents |
| Primary Goal | Attract clients, showcase work, establish professional identity |
| Target Audience | Potential clients across industries |
| Admin Access | `/admin` — Supabase Auth (email + password) |

---

## 1.2 SITE MAP

```
/               → Home
/about          → About
/work           → Work & Projects
/contact        → Contact
/admin          → Admin Panel (protected)
/admin/login    → Admin Login (public-facing entry)
```

---

## 1.3 DESIGN TOKENS

### Colors

```css
--color-bg:          #0A0A0A;   /* Primary background — near true black */
--color-surface:     #111111;   /* Elevated surfaces, section backgrounds */
--color-card-bg:     #141414;   /* Card base before glass effect */
--color-accent:      #00E5FF;   /* Electric Cyan — ONLY accent color */
--color-accent-glow: rgba(0, 229, 255, 0.15); /* Glow shadow for accent elements */
--color-text-primary:   #F0F0F0;  /* Main body text */
--color-text-secondary: #888888;  /* Subtitles, metadata, labels */
--color-text-muted:     #444444;  /* Dividers, disabled states */
--color-white:       #FFFFFF;   /* Headings, high-contrast text */
--color-border:      rgba(255, 255, 255, 0.08); /* Subtle borders */
```

### Accent Color Usage Rules
- DO use `--color-accent` on: CTA buttons, hover glows on cards, active nav links, cursor trail, section dividers, hover states
- DO NOT use `--color-accent` on: body text, backgrounds, decorative elements
- ONE accent color only — no secondary accent colors anywhere on the site

### Glassmorphism Token

```css
--glass-bg:      rgba(255, 255, 255, 0.04);
--glass-border:  rgba(255, 255, 255, 0.08);
--glass-blur:    blur(16px);
--glass-shadow:  0 8px 32px rgba(0, 0, 0, 0.4);
```

### Grain Texture Overlay
- Apply a CSS/SVG noise grain texture as a fixed `::before` pseudo-element on `<body>`
- Opacity: `0.035` (3.5%) — subtle, never overpowering
- Blend mode: `overlay`
- Coverage: full site, every page
- Exception: reduce grain opacity to `0.015` directly over glassmorphism card surfaces to preserve the frosted effect

---

## 1.4 TYPOGRAPHY

### Font Stack

```css
--font-primary: 'Plus Jakarta Sans', sans-serif;  /* All UI text */
--font-display: 'Plus Jakarta Sans', sans-serif;  /* Hero headlines — heavier weight */
```

> Use Plus Jakarta Sans exclusively. It is warm, rounded, and modern — do not introduce a second typeface. Vary weight and size to create hierarchy, not a second family.

### Type Scale

```css
--text-hero:   clamp(3.5rem, 8vw, 7rem);    /* Hero headline */
--text-h1:     clamp(2.5rem, 5vw, 4rem);    /* Page headings */
--text-h2:     clamp(1.75rem, 3vw, 2.5rem); /* Section headings */
--text-h3:     clamp(1.25rem, 2vw, 1.5rem); /* Card titles */
--text-body:   1rem;                          /* Body text (16px) */
--text-small:  0.875rem;                      /* Labels, metadata */
--text-xs:     0.75rem;                       /* Footer fine print */
```

### Typography Rules
- Font weights: 300 (light body), 400 (regular), 600 (semibold subheadings), 700 (bold headings), 800 (hero)
- Letter spacing: `-0.02em` on large headings, `0` on body
- Line height: `1.2` on headings, `1.7` on body text
- Max line length: 70 characters for body paragraphs
- Case: sentence case everywhere — NO ALL CAPS labels or eyebrows
- Text alignment: centered for hero section, left-aligned for all other content

---

## 1.5 SPACING SYSTEM

```css
--space-xs:   4px
--space-sm:   8px
--space-md:   16px
--space-lg:   32px
--space-xl:   64px
--space-2xl:  128px
--space-3xl:  192px
```

---

## 1.6 BORDER RADIUS

```css
--radius-sm:   6px;   /* Buttons, tags */
--radius-md:   12px;  /* Cards */
--radius-lg:   20px;  /* Glass panels */
--radius-full: 9999px; /* Pills, avatar */
```

---

## 1.7 ANIMATION & MOTION SYSTEM

### Global Principles
- Animation library: **GSAP** (primary) + **Framer Motion** (if React-based)
- All animations must respect `prefers-reduced-motion` — wrap all GSAP/motion calls in a check and disable non-essential motion if set
- Mobile: disable parallax and 3D effects entirely on viewport width < 768px, use simple fade-in as fallback

### Animation Tokens

```css
--transition-fast:   0.15s ease;
--transition-base:   0.3s ease;
--transition-slow:   0.6s cubic-bezier(0.16, 1, 0.3, 1);
--transition-page:   0.8s cubic-bezier(0.76, 0, 0.24, 1);
```

### Motion Inventory

| Element | Animation |
|---|---|
| Page transition | Full-screen cyan wipe (enter) / reverse wipe (exit) — GSAP |
| Hero headline | Staggered word reveal on load (clip-path mask) |
| Section entrance | Fade up (`translateY: 40px → 0`, opacity `0 → 1`) triggered by IntersectionObserver |
| Glassmorphism cards | Subtle 3D tilt on mouse move (max `±8deg`) + cyan glow border on hover |
| Navbar | Blur background increases on scroll past hero |
| Marquee strips | Continuous horizontal scroll, diagonal CSS `rotate(-6deg)` |
| Custom cursor | Small circle + trailing dot, scales up on hoverable elements, turns cyan on CTAs |
| Parallax | Background layers scroll at `0.5x` speed relative to foreground on desktop |

---

## 1.8 RESPONSIVE BREAKPOINTS

```css
--bp-mobile:  480px
--bp-tablet:  768px
--bp-desktop: 1024px
--bp-wide:    1440px
```

### Mobile Rules
- Disable: 3D card tilt, parallax, custom cursor, diagonal marquee rotation (make horizontal)
- Simplify: 3D hero animation falls back to a static dark gradient with subtle CSS particle effect
- Navbar: collapses to hamburger menu with full-screen overlay on mobile
- Grid: all multi-column grids collapse to single column

---

## 1.9 SHARED COMPONENTS

The following components are used across multiple pages. Build them once, reuse everywhere:

- `<Navbar />` — sticky, see Phase 2
- `<Footer />` — full, see Phase 2
- `<GlassCard />` — reusable glassmorphism card shell
- `<CursorEffect />` — custom cursor, mounted globally
- `<PageTransition />` — wraps every page, handles enter/exit animation
- `<MarqueeStrip />` — configurable text, speed, and diagonal angle
- `<GrainOverlay />` — fixed `::before` pseudo-element on body, applied globally
- `<SectionReveal />` — IntersectionObserver wrapper for fade-up entrance animations
