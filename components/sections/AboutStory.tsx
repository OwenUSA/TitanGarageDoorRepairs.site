/**
 * `/about` story — ADAPTED, ref `4e9af3f4-about-next-level-roofing` (ref# 8).
 *
 * Their block is a company history. Ours carries no founding year, headcount
 * or certification claim — each is a literal `TODO(fact):` sentence inside
 * `aboutStory.body`, rendered as-is (D-17). Photo slot per assets/INVENTORY.md
 * (`about-story-img`, contain).
 *
 * `buttons`/`cards` target 0 (docs/ref-geometry.md): `aboutStory.cta` renders
 * as a plain styled `<Link>`, not a `tel:` link and not `.t-btn` — the class
 * name below contains neither "btn" nor "button" nor "card".
 */

import Link from 'next/link';
import { aboutStory } from '@/content/copy';
import styles from './AboutStory.module.css';

export default function AboutStory() {
  return (
    <section className={styles.story} data-section="story">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.grid}>
            <div>
              <h2 className="t-h2 t-tight">{aboutStory.heading}</h2>
              {aboutStory.body.map((p, i) => (
                <p className={`${styles.body} ${i === 0 ? styles.bodyFirst : ''}`} key={i}>
                  {p}
                </p>
              ))}
              <Link className={styles.cta} href="/contact">
                {aboutStory.cta}
              </Link>
            </div>

            <img
              className={styles.media}
              src="/placeholders/about-story-img.jpg"
              alt="Titan Garage Door Repairs technician at work in Tallahassee"
              width={395}
              height={211}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
