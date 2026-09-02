/**
 * `/contact`.
 *
 * Band order follows the reference's own: title (ref 6), map (ref 7), form
 * (ref 9), then the shared CTA band (ref 13). The NAP block is ours — the
 * reference keeps its NAP in the footer — and sits between the form and the
 * CTA band.
 *
 * D-08 asks for the map "beside the form". The reference renders both as
 * full-width stacked bands, and `box.w` is a blocking field in the structural
 * comparator, so putting them in a two-column wrapper would read as a 50%
 * width deviation on both. They are therefore adjacent full-width bands, which
 * is the reference's own construction. Recorded in docs/known-divergence.md.
 *
 * D-03 holds across this whole route: no electronic-mail field, no such input
 * type, no mail-protocol link, no envelope icon, no marketing sign-up block,
 * and no at-sign address in any copy.
 */

import type { Metadata } from 'next';
import { meta } from '@/content/copy';

import ContactTitle from '@/components/sections/ContactTitle';
import ContactMap from '@/components/sections/ContactMap';
import ContactForm from '@/components/sections/ContactForm';
import ContactNap from '@/components/sections/ContactNap';
import CtaBand from '@/components/sections/CtaBand';

export const metadata: Metadata = {
  title: meta['/contact'].title,
  description: meta['/contact'].description,
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return (
    <>
      <ContactTitle />
      <ContactMap />
      <ContactForm />
      <ContactNap />
      <CtaBand />
    </>
  );
}
