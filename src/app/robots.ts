import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE_URL = 'https://capimind.com';

/**
 * robots.txt — guides search engine crawlers.
 *
 * Key points:
 *  - Allow all crawlers to access the root (the homepage is the only indexable route).
 *  - Explicitly disallow the old WordPress paths that Google has cached from the
 *    previous version of the site so they are removed from the index faster.
 *  - Point to the sitemap so Google discovers the canonical route set immediately.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // Legacy WordPress paths previously indexed — explicitly disallow so
          // Google drops them from the SERP faster than a 404 would.
          '/hello-world',
          '/hello-world/*',
          '/sample-page',
          '/sample-page/*',
          '/reservation',
          '/reservation/*',
          '/contact',
          '/contact/*',
          '/des-outils-pedagogiques',
          '/des-outils-pedagogiques/*',
          '/blog',
          '/blog/*',
          '/wp-admin',
          '/wp-admin/*',
          '/wp-login.php',
          '/wp-content/*',
          '/wp-includes/*',
          '/category/*',
          '/tag/*',
          '/author/*',
          '/2024/*',
          '/2025/*',
          '/?p=*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/hello-world', '/sample-page', '/reservation', '/contact', '/blog'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
