/**
 * `/about` title band — ADAPTED, ref `d753ccbe-about` (ref# 6).
 *
 * Thin band: target box.h is 84 / 77 / 90 @ 390/768/1440, so it carries the H1
 * and the sub and nothing else. No `t-section` on it (that puts 80px of
 * padding-block on the element and blows the target). `buttons`/`cards`
 * target 0 here — no tel: link, no `t-btn`, no class containing "btn" or
 * "card" anywhere in this subtree.
 */

import { aboutTitle } from '@/content/copy';
import styles from './AboutTitle.module.css';

export default function AboutTitle() {
  return (
    <section className={styles.title} data-section="title">
      <div className={`t-container ${styles.inner}`}>
        <h1 className="t-h1 t-tight">{aboutTitle.heading}</h1>
        <p className={`t-small t-muted ${styles.sub}`}>{aboutTitle.sub}</p>
      </div>
    </section>
  );
}
