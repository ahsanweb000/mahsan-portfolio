# PHASE 3 — BACKEND & SUPABASE ARCHITECTURE
## M.Ahsan Personal Portfolio

> Depends on: PHASE_1_OVERVIEW_AND_DESIGN_SYSTEM.md, PHASE_2_LAYOUT_AND_PAGES.md
> This phase covers the full Supabase setup — database schema, storage, authentication, and data-fetching patterns.

---

## 3.1 SUPABASE PROJECT SETUP

- Create a Supabase project
- Store credentials in environment variables — NEVER hardcode in source:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Server-side only, never expose to client
```

---

## 3.2 DATABASE SCHEMA

### Table: `projects`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, default `gen_random_uuid()` | Unique project ID |
| `title` | `text` | NOT NULL | Project title |
| `description` | `text` | NOT NULL | Short description (shown on card) |
| `category` | `text` | NOT NULL, CHECK IN ('web_dev','ai_chatbot','voice_agent') | Service category |
| `image_url` | `text` | NULLABLE | Public URL from Supabase Storage |
| `year` | `integer` | NOT NULL | Year completed |
| `status` | `text` | NOT NULL, default `'draft'`, CHECK IN ('draft','published') | Draft/publish toggle |
| `order` | `integer` | default `0` | Display order (lower = first) |
| `created_at` | `timestamptz` | default `now()` | Auto timestamp |
| `updated_at` | `timestamptz` | default `now()` | Auto timestamp |

---

### Table: `site_content`

Single-row table for all editable site-wide content. Use `upsert` to update.

| Column | Type | Description |
|---|---|---|
| `id` | `integer` | Always 1 — single row |
| `hero_headline_1` | `text` | Hero H1 line 1 |
| `hero_headline_2` | `text` | Hero H1 line 2 |
| `hero_subtext` | `text` | Hero subtext paragraph |
| `hero_cta_primary` | `text` | Primary CTA button label |
| `hero_cta_secondary` | `text` | Secondary CTA button label |
| `about_bio` | `text` | Full bio content (supports markdown) |
| `about_photo_url` | `text` | Public URL from Supabase Storage |
| `service_1_title` | `text` | Service card 1 title |
| `service_1_description` | `text` | Service card 1 description |
| `service_2_title` | `text` | Service card 2 title |
| `service_2_description` | `text` | Service card 2 description |
| `service_3_title` | `text` | Service card 3 title |
| `service_3_description` | `text` | Service card 3 description |
| `contact_email` | `text` | Contact email displayed on site |
| `social_linkedin` | `text` | LinkedIn URL |
| `social_github` | `text` | GitHub URL |
| `social_twitter` | `text` | Twitter/X URL |
| `social_instagram` | `text` | Instagram URL |
| `updated_at` | `timestamptz` | Auto timestamp |

---

### Table: `seo_metadata`

| Column | Type | Description |
|---|---|---|
| `id` | `integer` | Always 1 — single row |
| `site_title` | `text` | Browser tab title |
| `site_description` | `text` | Meta description |
| `og_title` | `text` | Open Graph title |
| `og_description` | `text` | Open Graph description |
| `og_image_url` | `text` | Open Graph image URL |
| `twitter_handle` | `text` | Twitter handle for Twitter card |
| `updated_at` | `timestamptz` | Auto timestamp |

---

### Table: `contact_submissions`

Stores form submissions from `/contact`.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `name` | `text` | Sender name |
| `email` | `text` | Sender email |
| `subject` | `text` | Subject line |
| `message` | `text` | Full message |
| `created_at` | `timestamptz` | Submission timestamp |
| `read` | `boolean` | default `false` — mark as read from admin |

---

### Table: `skills`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY |
| `name` | `text` | Skill name (e.g. "React") |
| `category` | `text` | Group (e.g. "Web Development") |
| `order` | `integer` | Display order within category |

---

## 3.3 ROW LEVEL SECURITY (RLS)

Enable RLS on all tables. Apply the following policies:

### `projects` table
```sql
-- Public can read published projects only
CREATE POLICY "Public read published projects"
ON projects FOR SELECT
USING (status = 'published');

-- Only authenticated users can do everything
CREATE POLICY "Authenticated full access"
ON projects FOR ALL
USING (auth.role() = 'authenticated');
```

### `site_content` table
```sql
CREATE POLICY "Public read site content"
ON site_content FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated full access"
ON site_content FOR ALL USING (auth.role() = 'authenticated');
```

### `seo_metadata` table
```sql
CREATE POLICY "Public read seo"
ON seo_metadata FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated full access"
ON seo_metadata FOR ALL USING (auth.role() = 'authenticated');
```

### `contact_submissions` table
```sql
-- Anyone can insert (submit the form)
CREATE POLICY "Public can insert"
ON contact_submissions FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated can read submissions
CREATE POLICY "Authenticated read"
ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
```

### `skills` table
```sql
CREATE POLICY "Public read skills"
ON skills FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated full access"
ON skills FOR ALL USING (auth.role() = 'authenticated');
```

---

## 3.4 SUPABASE STORAGE

### Bucket: `project-images`
- Public bucket: YES (images served publicly)
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
- Max file size: 5MB
- File path pattern: `projects/{project_id}/{filename}`

### Bucket: `profile`
- Public bucket: YES
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
- Max file size: 3MB
- File path pattern: `profile/avatar.{ext}`

### Storage Policies
```sql
-- Public read on both buckets
CREATE POLICY "Public read project images"
ON storage.objects FOR SELECT USING (bucket_id = 'project-images');

-- Only authenticated can upload/delete
CREATE POLICY "Authenticated upload project images"
ON storage.objects FOR INSERT USING (
  bucket_id = 'project-images' AND auth.role() = 'authenticated'
);
```

---

## 3.5 AUTHENTICATION

- Provider: Supabase Auth — email + password only
- No OAuth providers
- Only ONE user account should exist (the admin — M.Ahsan)
- Create the admin user manually via Supabase dashboard — do NOT expose a public signup flow
- Session persistence: handled by Supabase client SDK automatically

### Auth Flow
```
User visits /admin
→ Middleware checks for active Supabase session
→ No session? Redirect to /admin/login
→ Session exists? Render admin dashboard

/admin/login
→ Email + password form
→ On success: redirect to /admin
→ On failure: show "Invalid credentials" error (do not specify which field is wrong)
```

---

## 3.6 DATA FETCHING PATTERNS

### Public pages (SSR/SSG recommended)
```javascript
// Fetch published projects — server side
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'published')
  .order('order', { ascending: true });

// Fetch site content
const { data: content } = await supabase
  .from('site_content')
  .select('*')
  .single();
```

### Admin pages (client-side, authenticated)
- Use Supabase client with active session
- Always verify session server-side via middleware before rendering admin routes
- Never trust client-side session alone for protected mutations

### Realtime (optional)
- Not required for this project — standard fetch on page load is sufficient
