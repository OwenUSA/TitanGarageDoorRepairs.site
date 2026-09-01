/**
 * Shared "Learn more about" CTA band — ref `9328cbef-learn-more-about`.
 *
 * Rendered on /, /about, /services and /contact, identically, exactly as the
 * reference repeats it. Lead-owned shared component.
 *
 * The reference band carries two links and no button-class element. Ours
 * carries one `tel:` anchor and one internal link, so `buttons` reads 1 against
 * their 0 — a deliberate, recorded residual: D-04 makes every rendered phone
 * number a dialable link, and this band exists to be called from.
 */

import Link from 'next/link';
import { ctaBand } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';
import styles from './CtaBand.module.css';

export default function CtaBand() {
  return (
    <section className={styles.band} data-section="cta-band">
      <div className={`t-band--gradient ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.grid}>
            <div>
              <p className="t-eyebrow">{ctaBand.headingA}</p>
              <h2 className={`t-h2 t-tight ${styles.headingB}`}>{ctaBand.headingB}</h2>
              <p className={`t-muted ${styles.body}`}>{ctaBand.body}</p>

              <div className={styles.actions}>
                <a
                  className="t-btn t-btn--call"
                  href={business.phoneHref}
                  aria-label={callAriaLabel}
                >
                  {ctaBand.cta} — {business.phoneDisplay}
                </a>
                <Link className={styles.secondary} href="/services">
                  See what we work on
                </Link>
              </div>
            </div>

            <img
              className={styles.media}
              src="/placeholders/home-cta-media.svg"
              alt=""
              aria-hidden="true"
              width={636}
              height={298}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
