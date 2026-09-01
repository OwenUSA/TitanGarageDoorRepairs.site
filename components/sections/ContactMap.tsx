/**
 * `/contact` map — ADAPTED, ref `63d93a8b83aac101be57176d` (ref# 7).
 *
 * D-08 requires the map beside the form at wide breakpoints; the actual grid
 * pairing lives in `app/contact/contact-layout.module.css`, this component
 * only renders its own band. D-07: keyless Google embed, coordinates only,
 * never the fictional address. `showAddress` is left at its default (true) —
 * this is the /contact instance, the one that prints the address text next
 * to the map (docs/wave-conventions.md, BusinessMap contract).
 *
 * Target box.h: 214 @390 / 365 @768 / 300 @1440 (docs/ref-geometry.md).
 */

import { contactMap } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';
import BusinessMap from '@/components/BusinessMap';
import styles from './ContactMap.module.css';

export default function ContactMap() {
  return (
    <section className={styles.map} data-section="map">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <h2 className="t-h3">{contactMap.heading}</h2>
          <p className={`t-muted ${styles.body}`}>{contactMap.body}</p>

          <a
            className="t-btn t-btn--call"
            href={business.phoneHref}
            aria-label={callAriaLabel}
          >
            {business.phoneDisplay}
          </a>

          <div className={styles.frame}>
            <BusinessMap id="contact-map" zoom={15} poster="contact-map-poster" />
          </div>
        </div>
      </div>
    </section>
  );
}
