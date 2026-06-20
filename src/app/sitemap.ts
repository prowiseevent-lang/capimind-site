import type { MetadataRoute } from 'next';

const SITE_URL = 'https://capimind.com';

/**
 * sitemap.xml — declares the canonical, indexable route set for CapiMind.
 *
 * CapiMind is a single-page application. The homepage (`/`) is the only route
 * that should appear in Google's index. All legacy WordPress paths (e.g.
 * /hello-world, /sample-page, /reservation, /contact, /blog) have been removed
 * and are now disallowed in robots.txt + redirected via next.config.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
