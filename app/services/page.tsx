/**
 * ROUTE STUB — Prompt 5 landed the shell; this page renders the shell and a
 * single title band and nothing else. Prompt 7 replaces the body with the
 * sections listed for /services in docs/sections.md.
 *
 * The band carries data-section="stub" so the harness reports it as an
 * unclaimed extra rather than silently pairing it against a reference band.
 */

import type { Metadata } from 'next';
import { meta } from '@/content/copy';

export const metadata: Metadata = {
  title: meta['/services'].title,
  description: meta['/services'].description,
  alternates: { canonical: '/services' },
};

export default function Page() {
  return (
    <section className="t-section" data-section="stub" data-route="services">
      <div className="t-container t-container--text">
        <h1 className="t-h1 t-tight">Garage door services</h1>
        <p className="t-lede t-muted" style={{ marginTop: 'var(--spacing-m)' }}>
          Prompt 7 builds the services hero, the eight in-page service blocks, the FAQ accordion and the CTA band here.
        </p>
      </div>
    </section>
  );
}
