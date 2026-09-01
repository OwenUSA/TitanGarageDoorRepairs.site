/**
 * `/about` what-we-do — ADAPTED, ref `560bf22b-about` (ref# 9).
 *
 * Their 83-item list is their full service tree; ours is the eight
 * garage-door services grouped by symptom (Prompt 3 item 4) — a deliberate
 * information-count change, so `listItems` is not chased (docs/sections.md).
 * The height target IS chased: 2424 / 1368 / 1181 @ 390/768/1440, so each
 * item gets real vertical room instead of a compressed list.
 *
 * `buttons`/`cards` target 0 (docs/ref-geometry.md): no `t-btn`, no `tel:`
 * link, no class name containing "btn"/"button"/"card", no `<article>`.
 */

import { aboutWhatWeDo } from '@/content/copy';
import styles from './AboutWhatWeDo.module.css';

export default function AboutWhatWeDo() {
  return (
    <section className={styles.whatWeDo} data-section="what-we-do">
      <div className={`t-band--alt ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.head}>
            <h2 className="t-h2 t-tight">{aboutWhatWeDo.heading}</h2>
            <p className={styles.intro}>{aboutWhatWeDo.intro}</p>
          </div>

          <ul className={styles.list}>
            {aboutWhatWeDo.items.map((item) => (
              <li className={styles.item} key={item.label}>
                <h3 className={`t-h3 ${styles.itemLabel}`}>{item.label}</h3>
                <p className={styles.itemBody}>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
