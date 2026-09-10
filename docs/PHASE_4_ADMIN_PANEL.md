# PHASE 4 — ADMIN PANEL
## M.Ahsan Personal Portfolio

> Depends on: PHASE_3_BACKEND_AND_SUPABASE.md
> The admin panel is a protected internal tool — not a public-facing page. Design priority is clarity and efficiency, not visual flair. Keep it clean, functional, and fast. Use the same dark color palette for consistency but strip out animations and grain texture.

---

## 4.1 ACCESS & PROTECTION

- Route: `/admin` and all sub-routes `/admin/*`
- Protection: server-side middleware checks Supabase session on every request
- Unauthenticated access to ANY `/admin/*` route → immediate redirect to `/admin/login`
- Do NOT render any admin UI before session is confirmed — not even a loading shell

---

## 4.2 ADMIN LOGIN PAGE (`/admin/login`)

### Layout
- Centered card on dark background
- No navbar, no footer — standalone page

### Content
```
[ "M.Ahsan" logo/wordmark ]
[ "Admin Access" heading ]
[ Email input ]
[ Password input ]
[ "Sign In" button ]
[ Error message area (hidden until error) ]
```

### Behavior
- On submit: call `supabase.auth.signInWithPassword({ email, password })`
- Success: redirect to `/admin`
- Failure: show "Invalid email or password." — never specify which field failed
- Button shows loading state during auth call
- No "Forgot password" link — admin resets via Supabase dashboard directly

---

## 4.3 ADMIN DASHBOARD (`/admin`)

### Layout
```
[ Sidebar — fixed left, 240px wide ]
[ Main content area — fills remaining width ]
```

### Sidebar
```
[ Logo: "M.Ahsan Admin" ]
[ ——————————————— ]
[ Dashboard (overview) ]
[ Projects ]
[ Site Content ]
[ Skills ]
[ Contact Submissions ]
[ SEO Settings ]
[ ——————————————— ]
[ Sign Out ]
```

- Active item: cyan left border + slightly lighter background
- Sidebar background: `#0D0D0D`
- On mobile: sidebar collapses to top navigation bar

### Dashboard Overview Cards
8 summary cards arranged in a 4-column grid:

| Card | Data |
|---|---|
| Total Projects | Count of all projects |
| Published | Count where status = 'published' |
| Drafts | Count where status = 'draft' |
| Unread Messages | Count where read = false |

---

## 4.4 PROJECTS SECTION (`/admin/projects`)

### List View
- Table with columns: Thumbnail | Title | Category | Year | Status | Actions
- Status shown as badge: "Published" (green) / "Draft" (gray)
- Actions per row: Edit | Delete
- "Add New Project" button top-right
- Rows sortable by drag handle (updates `order` column in Supabase)

### Add / Edit Project Form
Fields:
- **Title** — text input, required
- **Description** — textarea, required
- **Category** — dropdown: Web Development / AI Chatbot / Voice Agent
- **Year** — number input, required
- **Image** — file upload input
  - Accepts: JPG, PNG, WebP, max 5MB
  - On upload: sends to Supabase Storage bucket `project-images`
  - Shows preview thumbnail after upload
  - Shows current image if editing
- **Status** — toggle switch: Draft / Published
- **Order** — number input (lower = appears first on site)

**Save button:** "Save Project"
**Cancel button:** returns to list without saving

**On save:**
- Validate all required fields client-side
- Upload image to Supabase Storage if new image selected, get public URL
- Upsert record to `projects` table
- Show success toast: "Project saved."
- Return to list view

**On delete:**
- Show confirmation dialog: "Delete this project? This cannot be undone."
- On confirm: delete from `projects` table + delete image from Storage
- Show success toast: "Project deleted."

---

## 4.5 SITE CONTENT SECTION (`/admin/site-content`)

### Layout
Card-based — one card per section of the website. All cards visible on one scrollable page.

---

**Card 1 — Hero Section**
- Hero Headline Line 1 (text input)
- Hero Headline Line 2 (text input)
- Hero Subtext (textarea)
- Primary CTA Label (text input)
- Secondary CTA Label (text input)

---

**Card 2 — Service Cards**

Repeated 3 times (one per service):
- Service Title (text input)
- Service Description (textarea)

---

**Card 3 — About / Bio**
- Bio Text (rich textarea — supports basic markdown: bold, italic, line breaks)
- Profile Photo Upload
  - Uploads to `profile` bucket in Supabase Storage
  - Shows current photo preview

---

**Card 4 — Contact Info**
- Contact Email (email input)
- LinkedIn URL (text input)
- GitHub URL (text input)
- Twitter/X URL (text input)
- Instagram URL (text input)

---

**Save behavior:**
- Each card has its own "Save Changes" button
- On save: upsert to `site_content` table (always row id = 1)
- Show success toast per card: "Changes saved."

---

## 4.6 SKILLS SECTION (`/admin/skills`)

### List View
- Skills grouped by category
- Each skill shown as a row: Name | Category | Order | Delete button
- "Add Skill" button at top

### Add Skill Form (inline or modal)
- Skill Name (text input)
- Category (dropdown: Web Development / AI & Automation / Backend & Database / Tools)
- Order (number)

---

## 4.7 CONTACT SUBMISSIONS (`/admin/contact`)

### List View
- Table: Name | Email | Subject | Date | Read Status | Actions
- Unread rows highlighted with subtle left border in cyan
- Actions: View (opens full message in modal) | Mark as Read | Delete

### View Message Modal
```
[ From: Name <email> ]
[ Subject ]
[ Date ]
[ ——— ]
[ Full message body ]
[ ——— ]
[ Mark as Read ] [ Delete ] [ Close ]
```

- On open: automatically mark as read (update `read = true` in Supabase)

---

## 4.8 SEO SETTINGS (`/admin/seo`)

Single form with all SEO fields:

- Site Title (text input) — appears in browser tab
- Meta Description (textarea, max 160 chars — show char counter)
- OG Title (text input)
- OG Description (textarea)
- OG Image Upload (file upload → Supabase Storage)
- Twitter Handle (text input, e.g. @mahsan)

"Save SEO Settings" button at bottom.

---

## 4.9 ADMIN UI STYLE RULES

- Background: `#0A0A0A` (same as site)
- Surface: `#111111` for cards and sidebar
- NO grain texture overlay in admin
- NO animations beyond simple `0.2s ease` transitions on interactive elements
- NO custom cursor in admin — use default browser cursor
- Typography: same font (Plus Jakarta Sans), but simpler hierarchy
- Accent: `--color-accent` (#00E5FF) used only for: active nav items, primary buttons, focus rings, success states
- Error color: `#FF4444`
- Success color: `#00C48C`
- Input focus: `box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.4)`
- All forms: proper `<label>` for every input for accessibility
