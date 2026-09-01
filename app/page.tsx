/**
 * `/` — home.
 *
 * Section order is the Prompt 3 structural gate, not the reference's:
 *   - `trust-row` (their "Why Choose Us") rises ABOVE the intro band;
 *   - the `intro` band drops BELOW the three service blocks;
 *   - the FAQ leaves the home page entirely and lands on /services.
 * Dropped per Prompt 3 item 2: discounts band, blog posts, partner logo strip.
 * Added: the map band (D-08) and the mobile sticky call bar (shell).
 *
 * Composition is owned by the lead so two section builders never edit the same
 * file. Each band lives in its own component under components/sections/.
 */

import type { Metadata } from 'next';
import { meta } from '@/content/copy';

import HomeHero from '@/components/sections/HomeHero';
import HomeTrustRow from '@/components/sections/HomeTrustRow';
import HomeServiceA from '@/components/sections/HomeServiceA';
import HomeServiceB from '@/components/sections/HomeServiceB';
import HomeServiceC from '@/components/sections/HomeServiceC';
import HomeIntro from '@/components/sections/HomeIntro';
import HomeProjects from '@/components/sections/HomeProjects';
import HomeTestimonials from '@/components/sections/HomeTestimonials';
import HomeMap from '@/components/sections/HomeMap';
import CtaBand from '@/components/sections/CtaBand';

export const metadata: Metadata = {
  title: meta['/'].title,
  description: meta['/'].description,
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <>
      <HomeHero />
      <HomeTrustRow />
      <HomeServiceA />
      <HomeServiceB />
      <HomeServiceC />
      <HomeIntro />
      <HomeProjects />
      <HomeTestimonials />
      <HomeMap />
      <CtaBand />
    </>
  );
}
