/**
 * `/` service-area map — NOVEL.
 *
 * D-08 requires a map on the home page at zoom ~13, lazy, with an explicit
 * title, a fixed aspect-ratio wrapper, and a "Get directions" link. All four
 * live in the frozen <BusinessMap>; this band only positions it.
 *
 * D-07: the embed is built from MAP_COORDS, never from the fictional address.
 * The address is deliberately NOT repeated here — it belongs to the /contact
 * NAP card and the footer, and repeating it a third time is a NAP-consistency
 * risk for no gain.
 */

import BusinessMap from '@/components/BusinessMap';
import { homeMap } from '@/content/copy';
import styles from './HomeMap.module.css';

export default function HomeMap() {
  return (
    <section data-section="map">
      <div className="t-section t-band--alt">
        <div className="t-container">
          <div className={styles.head}>
            <h2 className="t-h2 t-tight">{homeMap.heading}</h2>
            <p className={`t-lede t-muted ${styles.body}`}>{homeMap.body}</p>
          </div>
          <div className={styles.map}>
            <BusinessMap id="home-map" zoom={13} poster="home-map-poster" showAddress={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
