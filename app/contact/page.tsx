/**
 * ROUTE STUB — Prompt 5 landed the shell; this page renders the shell and a
 * single title band and nothing else. Prompt 7 replaces the body with the
 * sections listed for /contact in docs/sections.md.
 *
 * The band carries data-section="stub" so the harness reports it as an
 * unclaimed extra rather than silently pairing it against a reference band.
 */

import type { Metadata } from 'next';
import { meta } from '@/content/copy';

export const metadata: Metadata = {
  title: meta['/contact'].title,
  description: meta['/contact'].description,
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return (
    <section className="t-section" data-section="stub" data-route="contact">
      <div className="t-container t-container--text">
        <h1 className="t-h1 t-tight">Contact and callback</h1>
        <p className="t-lede t-muted" style={{ marginTop: 'var(--spacing-m)' }}>
          Prompt 7 builds the title band, the callback form, the phone card, the map and the CTA band here.
        </p>
      </div>
    </section>
  );
}
