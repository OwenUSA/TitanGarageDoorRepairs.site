/**
 * `/contact` phone card and hours block — NOVEL.
 *
 * The reference keeps its NAP in the footer; ours is split out into a
 * page-level block, so it has no counterpart and is measured by token
 * conformance at zero violations, once, at 1440 (A-9).
 *
 * Every fact comes from `lib/business.ts`. A hard-coded phone number, address
 * or set of hours anywhere else in the codebase is a bug — that single source
 * is what keeps NAP consistent across the header, the footer, the call bar,
 * the JSON-LD and this block.
 *
 * D-06: 7:00 AM - 7:00 PM, seven days, one block. No "24/7", no emergency
 * cover, no after-hours claim. D-03: no email, anywhere, in any form.
 */

import { Clock, MapPin, Phone } from 'lucide-react';
import { contactMap, contactNap } from '@/content/copy';
import { addressLine, business, callAriaLabel } from '@/lib/business';
import styles from './ContactNap.module.css';

export default function ContactNap() {
  return (
    <section className={styles.nap} data-section="nap-card">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <h2 className="t-h3">{contactNap.heading}</h2>

          <div className={styles.grid}>
            <div className={styles.panel}>
              <p className={styles.label}>
                <Phone size={24} strokeWidth={2} aria-hidden="true" /> {contactNap.phoneLabel}
              </p>
              <p className={styles.value}>
                <a className={styles.phone} href={business.phoneHref} aria-label={callAriaLabel}>
                  {business.phoneDisplay}
                </a>
              </p>
            </div>

            <div className={styles.panel}>
              <p className={styles.label}>
                <MapPin size={24} strokeWidth={2} aria-hidden="true" /> {contactNap.addressLabel}
              </p>
              {/* Displayed as text only. D-07: the address is fictional and is
                  never handed to a geocoder — the map is embedded by
                  coordinates in <BusinessMap>. */}
              <p className={styles.value}>{addressLine}</p>
            </div>

            <div className={styles.panel}>
              <p className={styles.label}>
                <Clock size={24} strokeWidth={2} aria-hidden="true" /> {contactNap.hoursLabel}
              </p>
              <p className={styles.value}>{business.hours.display}</p>
            </div>
          </div>

          <p className={`t-muted ${styles.note}`}>{contactNap.note}</p>
          <p className={`t-small t-muted ${styles.area}`}>{business.serviceArea}</p>

          {/* Relocated from the map band: the reference's map band is the embed
              and nothing else, and this band is NOVEL, so it has no height
              target for the extra copy to break. The words are unchanged. */}
          <h3 className={`t-h3 ${styles.subhead}`}>{contactMap.heading}</h3>
          <p className={`t-muted ${styles.value}`}>{contactMap.body}</p>
        </div>
      </div>
    </section>
  );
}
