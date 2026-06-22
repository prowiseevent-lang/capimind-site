import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE_URL = 'https://capimind.com';

/**
 * sitemap.xml — declares the canonical, indexable route set for CapiMind.
 *
 * CapiMind is a single-page application, but we expose the 6 main in-page
 * sections as anchor URLs so Google can generate proper sitelinks
 * (À propos, Formations, Services, Pourquoi nous, FAQ, Contact) instead of
 * the legacy WordPress pages that are currently cached.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const sections = [
    { anchor: '#about', label: 'À propos', priority: 0.9 },
    { anchor: '#courses', label: 'Formations', priority: 0.9 },
    { anchor: '#services', label: 'Services', priority: 0.9 },
    { anchor: '#features', label: 'Pourquoi nous', priority: 0.8 },
    { anchor: '#faq', label: 'FAQ', priority: 0.7 },
    { anchor: '#contact', label: 'Contact', priority: 0.9 },
  ];

  const urls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  sections.forEach((section) => {
    urls.push({
      url: `${SITE_URL}/${section.anchor}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: section.priority,
    });
  });

  return urls;
}
