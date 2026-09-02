/**
 * Shared shell — footer NAP band and footer site-links band.
 *
 * Two bands, matching the reference's two footer sections (ref 20, "SERVING
 * AREA / CONTACT US / BUSINESS HOURS", 178px @1440; and ref 21, site links,
 * 127px @1440). Both are ADAPTED in docs/sections.md:
 *   - their serving-area column is a city list plus a "24/7 Emergency" claim.
 *     Ours is ONE SERVICE_AREA sentence (D-02) and 07:00-19:00 seven days
 *     (D-06). No emergency claim, no after-hours claim.
 *   - their four links are service pages; ours are the five fixed routes (D-01),
 *     one of which is Privacy, which they do not have.
 *
 * There is NO email column and no sign-up block (D-03).
 *
 * FROZEN after Prompt 5 (A-6).
 */

import Link from 'next/link';
import { Clock, MapPin, Phone } from 'lucide-react';
import { footerNap, footerLinks, nav, contactNap } from '@/content/copy';
import { business, addressLine, callAriaLabel } from '@/lib/business';

const ROUTES = [
  ...nav.items,
  { label: 'Privacy Policy', href: '/privacy' },
] as const;

export default function SiteFooter() {
  return (
    <footer>
      <section className="t-band--dark t-section" data-section="footer-nap">
        {/* INVENTORY slot `logo-footer`, 171x68 @1440. White lockup, because the
            NAP band is --color-primary-deep. Decorative: the footer already
            names the business in its links band. */}
        <div className="t-container">
          <img
            className="t-footer__logo"
            src="/placeholders/logo-footer.png"
            alt=""
            aria-hidden="true"
            width={171}
            height={50}
          />
        </div>

        <div className="t-container t-footer__nap">
          <div>
            <h2 className="t-footer__heading">
              <Phone size={24} strokeWidth={2} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 8 }} />
              {footerNap.callHeading}
            </h2>
            <a className="t-footer__phone" href={business.phoneHref} aria-label={callAriaLabel}>
              {business.phoneDisplay}
            </a>
            <p className="t-muted">{business.hours.display}</p>
          </div>

          <div>
            <h2 className="t-footer__heading">
              <MapPin size={24} strokeWidth={2} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 8 }} />
              {footerNap.areaHeading}
            </h2>
            {/* The single SERVICE_AREA sentence is the only survivor of the
                deleted locations page (D-02). */}
            <p className="t-muted">{footerNap.area}</p>
            <p className="t-muted" style={{ marginTop: 'var(--spacing-xs)' }}>
              {addressLine}
            </p>
          </div>

          <div>
            <h2 className="t-footer__heading">
              <Clock size={24} strokeWidth={2} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-4px', marginRight: 8 }} />
              {contactNap.hoursLabel}
            </h2>
            {/* NAP gate (Prompt 11): hours have ONE source, lib/business.ts.
                This column previously rendered a second copy from content/copy.ts
                that had drifted to a hyphen where business.hours.display uses an
                en dash -- two strings for one fact is the defect the gate exists
                to catch. */}
            <p className="t-muted">{business.hours.display}</p>
          </div>
        </div>
      </section>

      <section
        className="t-band--dark"
        data-section="footer-links"
        style={{ paddingBlock: 'var(--spacing-l)', borderTop: '1px solid var(--color-border)' }}
      >
        <div className="t-container">
          <h2 className="t-visually-hidden">{footerLinks.heading}</h2>
          <nav className="t-footer__links" aria-label="Footer">
            {ROUTES.map((r) => (
              <Link key={r.href} href={r.href} className="t-footer__link">
                {r.label}
              </Link>
            ))}
          </nav>
          <p className="t-muted t-small" style={{ marginTop: 'var(--spacing-s)' }}>
            {footerLinks.brand}
          </p>
        </div>
      </section>
    </footer>
  );
}
