/**
 * `/` service feature C — ADAPTED, ref `7e95da6d-specialty-roof-repairs`
 * (ref# 12). Regrouped by symptom (Prompt 3 item 4). Image left.
 *
 * `buttons`/`cards` target 0 (docs/ref-geometry.md): plain `<Link>`, no
 * "btn"/"button"/"card" substring, no `tel:` href.
 */

import Link from 'next/link';
import { homeServices } from '@/content/copy';
import styles from './HomeServiceC.module.css';

export default function HomeServiceC() {
  return (
    <section data-section="svc-c">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.grid}>
            <img
              className={styles.media}
              src="/placeholders/home-svc-c-img.jpg"
              alt="Broken garage door spring replacement in Oklahoma City"
              width={659}
              height={400}
            />

            <div className={styles.col}>
              <h2 className="t-h2 t-tight">{homeServices.c.heading}</h2>
              <p className={styles.body}>{homeServices.c.body}</p>
              <Link className={styles.link} href="/services">
                {homeServices.c.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
