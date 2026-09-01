/**
 * ROUTE STUB — Prompt 5 landed the shell; this page renders the shell and a
 * single title band and nothing else. Prompt 6 replaces the body with the
 * sections listed for / in docs/sections.md.
 *
 * The band carries data-section="stub" so the harness reports it as an
 * unclaimed extra rather than silently pairing it against a reference band.
 */

import type { Metadata } from 'next';
import { meta } from '@/content/copy';

export const metadata: Metadata = {
  title: meta['/'].title,
  description: meta['/'].description,
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <section className="t-section" data-section="stub" data-route="home">
      <div className="t-container t-container--text">
        <h1 className="t-h1 t-tight">Titan Garage Door Repairs</h1>
        <p className="t-lede t-muted" style={{ marginTop: 'var(--spacing-m)' }}>
          Prompt 6 builds the hero, trust row, service blocks, intro, projects, testimonials, map and CTA band here.
        </p>
      </div>
    </section>
  );
}
