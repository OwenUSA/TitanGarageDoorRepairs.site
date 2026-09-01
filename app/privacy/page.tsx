/**
 * ROUTE STUB — Prompt 5 landed the shell; this page renders the shell and a
 * single title band and nothing else. Prompt 7 replaces the body with the
 * sections listed for /privacy in docs/sections.md.
 *
 * The band carries data-section="stub" so the harness reports it as an
 * unclaimed extra rather than silently pairing it against a reference band.
 */

import type { Metadata } from 'next';
import { meta } from '@/content/copy';

export const metadata: Metadata = {
  title: meta['/privacy'].title,
  description: meta['/privacy'].description,
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return (
    <section className="t-section" data-section="stub" data-route="privacy">
      <div className="t-container t-container--text">
        <h1 className="t-h1 t-tight">Privacy policy</h1>
        <p className="t-lede t-muted" style={{ marginTop: 'var(--spacing-m)' }}>
          Prompt 7 builds the policy body and the phone-and-postal contact section here. NOVEL: token conformance only.
        </p>
      </div>
    </section>
  );
}
