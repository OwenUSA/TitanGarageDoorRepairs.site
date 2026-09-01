/**
 * `/contact` title band — ADAPTED, ref `687131be-contact` (ref# 6).
 *
 * Thin band: target box.h is 84 / 77 / 90 @ 390/768/1440 (docs/ref-geometry.md),
 * identical to `/about`'s title target — same construction. No `t-section` on
 * the section element (that puts 80px of padding-block on it and blows the
 * target); the padding lives on `.inner` instead. `buttons`/`cards` target
 * 0 here — no tel: link, no `t-btn`, no class containing "btn" or "card"
 * anywhere in this subtree.
 */

import { contactTitle } from '@/content/copy';
import styles from './ContactTitle.module.css';

export default function ContactTitle() {
  return (
    <section className={styles.title} data-section="title">
      <div className={`t-container ${styles.inner}`}>
        <h1 className="t-h1 t-tight">{contactTitle.heading}</h1>
        <p className={`t-small t-muted ${styles.sub}`}>{contactTitle.sub}</p>
      </div>
    </section>
  );
}
