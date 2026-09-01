/**
 * `/` intro copy band — ADAPTED, ref `dfeef600-elevate-your-roof-with-next-level`
 * (ref# 8). Their two paragraphs are an awards-and-credentials pitch; ours
 * carries the proposition (who answers the phone, what happens on the call)
 * with every award claim gone under D-14.
 *
 * Long-form copy, so `t-container--text` (960px measure) and the 16/24 body
 * face — never the lede face (task brief). `buttons`/`cards` target 0
 * (docs/ref-geometry.md): the CTA is a plain `<Link>`, no "btn"/"button"/
 * "card" substring, no `tel:` href.
 */

import Link from 'next/link';
import { homeIntro } from '@/content/copy';
import styles from './HomeIntro.module.css';

export default function HomeIntro() {
  return (
    <section data-section="intro">
      <div className={`t-section ${styles.inner}`}>
        <div className={`t-container t-container--text ${styles.col}`}>
          <h2 className="t-h2 t-tight">{homeIntro.heading}</h2>

          {homeIntro.body.map((paragraph, i) => (
            <p className={styles.body} key={i}>
              {paragraph}
            </p>
          ))}

          <Link className={styles.link} href="/contact">
            {homeIntro.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
