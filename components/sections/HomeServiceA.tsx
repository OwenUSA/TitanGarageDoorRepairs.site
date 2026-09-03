/**
 * `/` service feature A — ADAPTED, ref `4166deaa-residential-and-commercial-roof-in`
 * (ref# 10). Regrouped by symptom instead of product line (Prompt 3 item 4).
 * Image left.
 *
 * `buttons`/`cards` target 0 (docs/ref-geometry.md): the copy CTA is a plain
 * `<Link>` with no "btn"/"button"/"card" substring in its class name and no
 * `tel:` href — tel coverage is already carried by the header, hero, call
 * bar, footer and CTA band.
 */

import Link from 'next/link';
import { homeServices } from '@/content/copy';
import styles from './HomeServiceA.module.css';

export default function HomeServiceA() {
  return (
    <section data-section="svc-a">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.grid}>
            <img
              className={styles.media}
              src="/placeholders/home-svc-a-img.svg"
              alt="Garage door safety sensor and track repair in Oklahoma City"
              width={659}
              height={400}
            />

            <div className={styles.col}>
              <h2 className="t-h2 t-tight">{homeServices.a.heading}</h2>
              <p className={styles.body}>{homeServices.a.body}</p>
              <Link className={styles.link} href="/services">
                {homeServices.a.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
