/**
 * `/` service feature B — ADAPTED, ref `16d2fa52-specialized-exterior-services`
 * (ref# 11). Regrouped by symptom (Prompt 3 item 4). Image right.
 *
 * `buttons`/`cards` target 0 (docs/ref-geometry.md): plain `<Link>`, no
 * "btn"/"button"/"card" substring, no `tel:` href.
 */

import Link from 'next/link';
import { homeServices } from '@/content/copy';
import styles from './HomeServiceB.module.css';

export default function HomeServiceB() {
  return (
    <section data-section="svc-b">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.grid}>
            <img
              className={styles.media}
              src="/placeholders/home-svc-b-img.svg"
              alt=""
              aria-hidden="true"
              width={659}
              height={400}
            />

            <div className={styles.col}>
              <h2 className="t-h2 t-tight">{homeServices.b.heading}</h2>
              <p className={styles.body}>{homeServices.b.body}</p>
              <Link className={styles.link} href="/services">
                {homeServices.b.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
