/**
 * Custom 404 — acceptance gate 7. Renders inside the frozen shell (header,
 * footer, call bar come from app/layout.tsx) and uses only Prompt 5 tokens
 * and shell classes; it introduces no new token (A-6).
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { business, callAriaLabel } from '@/lib/business';

export const metadata: Metadata = {
  title: `Page not found | ${business.name}`,
  description: 'That page does not exist. Every page on this site is one click away.',
  robots: { index: false, follow: true },
};

const ROUTES: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
];

export default function NotFound() {
  return (
    <section data-section="notfound">
      <div className="t-section">
        <div className="t-container t-container--text">
          <h1 className="t-h1 t-tight">That page is not here</h1>
          <p className="t-lede t-muted">
            The link may be old or mistyped. Everything on this site is one click below, or
            call the shop and a technician will pick up.
          </p>
          <p>
            <a className="t-btn t-btn--call" href={business.phoneHref} aria-label={callAriaLabel}>
              Call {business.phoneDisplay}
            </a>
          </p>
          <ul>
            {ROUTES.map((r) => (
              <li key={r.href}>
                <Link href={r.href}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
