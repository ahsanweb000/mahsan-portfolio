# M.Ahsan — Personal Portfolio & Admin CMS

> Modern, high-performance developer portfolio built with Next.js 14 App Router, TypeScript, Tailwind CSS, GSAP, Three.js (React Three Fiber), and Supabase.

---

## Features

- **Dynamic Hero Scene**: 3D interactive floating geometric mesh canvas built with Three.js / React Three Fiber.
- **Micro-interactions & Animations**: GSAP page wipe transitions, glassmorphism cards with 3D hover tilt, continuous dual-direction marquee strips, and interactive custom cursor.
- **Complete Headless CMS (Admin Panel)**:
  - Secure email + password authentication with Supabase Auth & protected Next.js middleware.
  - Analytics overview dashboard.
  - Full CRUD Projects management with category filters and Supabase Storage image uploads.
  - Live site content editor (hero text, services, biography, social links).
  - Categorized technical skills manager.
  - Contact submissions inbox with unread tracking, message details, and mailto reply.
  - SEO settings manager (meta title, description counter, and OpenGraph image uploads).
- **SEO & Search Engine Optimizations**:
  - Auto-generated `robots.txt` and `sitemap.xml`.
  - Comprehensive OpenGraph and Twitter card metadata.

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Custom Design Tokens
- **3D & Animation**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [GSAP](https://greensock.com/gsap/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Auth, Storage)

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ahsanweb000/mahsan-portfolio.git
cd mahsan-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy the example environment file and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup
Apply the database schema located at `supabase/schema.sql` inside your Supabase SQL Editor.

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
The admin dashboard is available at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## License
This project is proprietary and confidential.
