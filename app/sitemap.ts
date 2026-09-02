/**
 * sitemap.xml — acceptance gate 13.
 *
 * Exactly the five routes in CONSTANTS. D-01 forbids a sixth; D-02 forbids any
 * /locations/* entry. The list is the same literal the nav and footer read.
 */
import type { MetadataRoute } from 'next';
import { business } from '@/lib/business';

const ROUTES = ['/', '/about', '/services', '/contact', '/privacy'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: new URL(route, business.siteUrl).toString(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));
}
