/**
 * `/contact` map — ADAPTED, ref `63d93a8b83aac101be57176d` (ref# 7).
 *
 * The reference band contains the embed and nothing else — 1440x300, 768x365,
 * 390x214 — so this one does too. Its heading, its paragraph and its call CTA
 * live in the adjacent <ContactNap> band, which is NOVEL and has no height
 * target for them to break. See ContactMap.module.css for the measured
 * reasoning; recorded in docs/known-divergence.md.
 *
 * D-07: keyless Google embed, coordinates only, never the fictional address.
 * D-08: zoom 15 on /contact, lazy, explicit title, fixed-size wrapper so a late
 * mount cannot shift layout, and a "Get directions" deep link — all four are in
 * the frozen <BusinessMap>. `showAddress` stays at its default (true): this is
 * the instance that prints the address text beside the map.
 */

import BusinessMap from '@/components/BusinessMap';
import styles from './ContactMap.module.css';

export default function ContactMap() {
  return (
    <section className={styles.map} data-section="map">
      <div className={styles.inner}>
        <div className="t-container">
          <div className={styles.frame}>
            <BusinessMap id="contact-map" zoom={15} poster="contact-map-poster" />
          </div>
        </div>
      </div>
    </section>
  );
}
