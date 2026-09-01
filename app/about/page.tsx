/**
 * `/about` — Prompt 6+7 wave. Section order per docs/sections.md:
 *   title -> story -> what-we-do -> credentials -> cta-band.
 * `logos` (their partner-mark strip, ref# 10) is DELETED per D-09; nothing
 * replaces it structurally — `credentials` is the NOVEL section that stands
 * in for the dropped logo strip, not a positional swap.
 */

import type { Metadata } from 'next';
import { meta } from '@/content/copy';

import AboutTitle from '@/components/sections/AboutTitle';
import AboutStory from '@/components/sections/AboutStory';
import AboutWhatWeDo from '@/components/sections/AboutWhatWeDo';
import AboutCredentials from '@/components/sections/AboutCredentials';
import CtaBand from '@/components/sections/CtaBand';

export const metadata: Metadata = {
  title: meta['/about'].title,
  description: meta['/about'].description,
  alternates: { canonical: '/about' },
};

export default function Page() {
  return (
    <>
      <AboutTitle />
      <AboutStory />
      <AboutWhatWeDo />
      <AboutCredentials />
      <CtaBand />
    </>
  );
}
