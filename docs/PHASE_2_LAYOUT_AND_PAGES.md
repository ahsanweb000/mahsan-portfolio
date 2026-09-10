# PHASE 2 — LAYOUT & PAGES
## M.Ahsan Personal Portfolio

> Depends on: PHASE_1_OVERVIEW_AND_DESIGN_SYSTEM.md
> All design tokens, colors, typography, spacing, and animation values are defined in Phase 1. Do not redefine them here — import and use them.

---

## 2.1 NAVBAR

### Behavior
- Position: `fixed` top, full width, `z-index: 100`
- Default state: transparent background, no border
- Scrolled state (past 80px): `backdrop-filter: blur(20px)`, `background: rgba(10,10,10,0.8)`, subtle bottom border using `--color-border`
- Transition: smooth `0.3s ease` between states

### Structure (left → right)
```
[ Logo: "M.Ahsan" ] ←————————→ [ About | Work | Contact ] [ Hire Me → ]
```

### Logo
- Text-based: "M.Ahsan" in `--font-primary`, weight 700, color `--color-white`
- On hover: color transitions to `--color-accent`

### Nav Links
- Font: `--text-small`, weight 500, color `--color-text-secondary`
- On hover: color `--color-white`, underline grows from left (CSS `scaleX` transition)
- Active page: color `--color-accent`

### CTA Button ("Hire Me")
- Background: `--color-accent`
- Text: `--color-bg` (dark text on cyan)
- Border radius: `--radius-sm`
- Padding: `10px 20px`
- On hover: slight glow `box-shadow: 0 0 20px --color-accent-glow`, scale `1.02`

### Mobile Navbar
- Logo remains visible
- Nav links + CTA hidden, replaced by hamburger icon (3 lines → X on open)
- On open: full-screen dark overlay, links centered vertically, large font size
- Overlay background: `rgba(10,10,10,0.97)` with grain texture

---

## 2.2 FOOTER

### Structure
```
[ Logo + tagline ]     [ Navigation ]     [ Services ]     [ Contact + Socials ]

[ Copyright line — left ]                              [ Back to top — right ]
```

### Columns

**Column 1 — Brand**
- Logo: "M.Ahsan"
- Tagline: "Building intelligent web experiences."
- Social icons below (LinkedIn, GitHub, Twitter/X, Instagram)

**Column 2 — Navigation**
- Links: Home, About, Work, Contact

**Column 3 — Services**
- Web Development
- AI Chatbots
- AI Voice Agents

**Column 4 — Contact**
- Email address (placeholder: hello@mahsan.dev)
- "Available for freelance work" status indicator (green dot + text)

### Bottom Bar
- Left: `© 2024 M.Ahsan. All rights reserved.`
- Right: "Back to top ↑" — smooth scrolls to top on click

### Style
- Background: `--color-surface` (#111111), slightly lighter than page bg
- Top border: 1px `--color-border`
- Padding top: `--space-2xl`

---

## 2.3 HOME PAGE (`/`)

### Section Order
1. Hero
2. What I Do (Service Cards)
3. Diagonal Marquee Strip
4. Selected Work Preview (3 featured projects)
5. CTA Banner

---

### Section 1 — Hero

**Layout:** Full viewport height (`100vh`), centered content

**Background:**
- 3D animated scene using **Three.js**
- Content: floating abstract geometric shapes (icosahedrons, toruses, morphing blobs) in dark gray/charcoal tones
- Color palette of 3D objects: `#1a1a1a` to `#2a2a2a` — no bright colors in the 3D scene
- Subtle cyan point light source positioned top-right illuminating objects
- Camera slowly drifts/rotates — no fast movement
- Performance: cap at 60fps, reduce geometry complexity on mobile, disable entirely below 768px

**Content (centered, stacked):**
```
[ Small label: "Full-Stack Developer & AI Specialist" ]
[ H1: "I Build Websites." ]
[ H1: "I Build Intelligence." ]
[ Subtext: "Web development, AI chatbots, and voice agents — crafted for impact." ]
[ CTA Row: [ View My Work ] [ Contact Me ] ]
```

**Typography:**
- Label: `--text-small`, weight 400, `--color-text-secondary`, letter-spacing `0.1em`
- H1: `--text-hero`, weight 800, `--color-white`
- Subtext: `--text-body`, weight 300, `--color-text-secondary`, max-width 480px
- "View My Work" button: solid `--color-accent` fill
- "Contact Me" button: transparent, 1px `--color-accent` border, `--color-accent` text

**Entrance Animation (GSAP, on page load):**
1. Label fades in (0.3s delay)
2. H1 line 1 reveals via clip-path word by word (0.5s delay, staggered 0.1s per word)
3. H1 line 2 same treatment (follows line 1)
4. Subtext fades up (after H1 complete)
5. CTA buttons fade in together

**Scroll Indicator:**
- Animated down arrow or "Scroll" text at bottom center
- Fades out after user scrolls 100px

---

### Section 2 — What I Do (Service Cards)

**Layout:** 3 glassmorphism cards in a row, centered, max-width 1100px

**Card Structure (per card):**
```
[ Icon (SVG, cyan colored) ]
[ Service Title ]
[ 2-line description ]
[ "Learn More →" text link ]
```

**Card Style:**
- Background: `--glass-bg`
- Border: 1px `--glass-border`
- Backdrop filter: `--glass-blur`
- Border radius: `--radius-lg`
- Padding: `--space-xl`
- On hover: border color shifts to `rgba(0,229,255,0.3)`, subtle cyan glow shadow, 3D tilt `±8deg`
- Grain opacity reduced to `0.015` over card surface

**Three Cards:**

| Card | Icon | Title | Description |
|---|---|---|---|
| 1 | Code brackets SVG | Web Development | Fast, responsive, and visually stunning websites built for performance and conversions. |
| 2 | Chat bubble SVG | AI Chatbots | Intelligent conversational agents that automate support, qualify leads, and engage users 24/7. |
| 3 | Waveform/mic SVG | AI Voice Agents | Human-like voice AI that handles calls, bookings, and customer interactions autonomously. |

---

### Section 3 — Diagonal Marquee Strip

**Style:** Two strips, stacked, scrolling in opposite directions
- Rotation: `rotate(-4deg)` applied to container
- Overflow: hidden on parent, strips extend beyond edges
- Background: `--color-accent` on first strip, `--color-surface` with white text on second
- Text: repeating — "Web Development ✦ AI Chatbots ✦ Voice Agents ✦ M.Ahsan ✦"
- Speed: `30s` linear infinite loop
- Strip 1: scrolls left
- Strip 2: scrolls right

---

### Section 4 — Selected Work Preview

**Layout:** 3 project cards in a grid (3 columns desktop, 1 column mobile)
- Shows only 3 featured/published projects from Supabase
- "View All Work →" link below grid

**Project Card Structure:**
```
[ Project Image (16:9 ratio) ]
[ Category Tag (e.g. "Web Dev") ]
[ Project Title ]
[ Short Description ]
```

**Card hover:** Image scales to `1.05`, dark overlay appears with "View Project →" centered

---

### Section 5 — CTA Banner

**Layout:** Full-width dark section, centered text

```
[ "Ready to build something remarkable?" ]
[ "Let's work together and bring your ideas to life." ]
[ "Start a Project →" button ]
```

- Background: subtle radial gradient from `rgba(0,229,255,0.05)` center to transparent
- Button: large, filled `--color-accent`

---

## 2.4 ABOUT PAGE (`/about`)

### Section Order
1. Page Hero (heading + subtext)
2. Bio (photo + text)
3. Skills & Tech Stack
4. CTA

---

### Section 1 — Page Hero
```
[ "About Me" — H1 ]
[ "Developer. AI Specialist. Problem Solver." — subtext ]
```
- Centered, minimal, fade-in on load

### Section 2 — Bio
**Layout:** Two columns — photo left (40%), text right (60%)

- Photo: rounded `--radius-lg`, slight cyan border glow, placeholder profile image
- Text: 3–4 short paragraphs — who M.Ahsan is, what he builds, his philosophy
- Placeholder copy focused on web dev + AI expertise

### Section 3 — Skills & Tech Stack
**Layout:** Tags/pills grouped by category

Categories:
- **Web Development:** HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, Node.js
- **AI & Automation:** OpenAI API, LangChain, Voiceflow, Retell AI, Bland AI
- **Backend & Database:** Supabase, PostgreSQL, REST APIs
- **Tools:** Git, Figma, VS Code, Antigravity

**Tag style:** `--radius-full`, background `rgba(0,229,255,0.08)`, border `1px rgba(0,229,255,0.2)`, text `--color-accent`, padding `6px 14px`

### Section 4 — CTA
- Same CTA Banner component as Home page

---

## 2.5 WORK / PROJECTS PAGE (`/work`)

### Layout
- Page heading: "Selected Work"
- Subtext: "A collection of projects across web development, AI chatbots, and voice agents."
- Grid: 3 columns desktop, 2 columns tablet, 1 column mobile
- All published projects fetched from Supabase

### Project Card
```
[ Image (16:9, object-fit: cover) ]
[ Row: Category Tag | Year ]
[ Project Title ]
[ Short Description (2 lines max, truncated) ]
```

**Category Tags:**
- "Web Dev" — neutral border
- "AI Chatbot" — cyan tint
- "Voice Agent" — cyan tint, different icon

**Card hover:** image scales `1.05`, overlay with "View Project →" appears

**Empty state:** If no published projects exist, show: "Projects coming soon. Check back later."

---

## 2.6 CONTACT PAGE (`/contact`)

### Layout: Two columns
- Left (40%): contact info + social links
- Right (60%): contact form

### Left Column
```
[ "Let's Talk" — H2 ]
[ Short paragraph: "Have a project in mind? Reach out and let's make it happen." ]
[ Email: hello@mahsan.dev ]
[ Social Links: LinkedIn, GitHub, Twitter/X ]
```

### Right Column — Contact Form
**Fields:**
- Name (text input, required)
- Email (email input, required)
- Subject (text input, required)
- Message (textarea, required, min 4 rows)
- Submit button: "Send Message →"

**Form behavior:**
- Client-side validation before submit
- On submit: POST to Supabase or a serverless function
- Success state: form replaced with "Message sent. I'll be in touch soon."
- Error state: inline field-level error messages

**Input style:**
- Background: `rgba(255,255,255,0.03)`
- Border: 1px `--color-border`
- On focus: border color `--color-accent`, subtle cyan glow
- Border radius: `--radius-sm`
- Text color: `--color-text-primary`
