/**
 * robots.txt — acceptance gate 13.
 *
 * D-15: no analytics, no trackers, so nothing to disallow for privacy reasons.
 * D-02: no /locations/* tree exists to exclude. Five routes, all indexable.
 */
import type { MetadataRoute } from 'next';
import { business } from '@/lib/business';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${business.siteUrl}/sitemap.xml`,
    host: business.siteUrl,
  };
}
