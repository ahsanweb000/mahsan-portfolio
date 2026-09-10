import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mahsan.dev';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/work', '/contact'],
      disallow: ['/admin', '/admin/*', '/api', '/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}