/**
 * `/` trust row — ADAPTED, ref `9794f2c3-why-choose-us` (ref# 9).
 *
 * Their six chips are invented facts (24/7 emergency, financing, military
 * discount) we may not claim. Ours mixes real held facts (hours, estimates,
 * a person answering) with literal `TODO(fact):` chips per D-14 — rendered
 * as-is, never filled in with an invented value.
 *
 * `buttons` and `cards` both target 0 on this section (docs/ref-geometry.md):
 * no `t-btn`, no `tel:` link, no class name containing "btn"/"button"/"card",
 * no `<article>`. `t-chip` is safe — it matches neither substring.
 */

import { Calendar, Tag, PhoneCall, Award, ShieldCheck, BadgeCheck } from 'lucide-react';
import { homeTrust } from '@/content/copy';
import styles from './HomeTrustRow.module.css';

const icons = [Calendar, Tag, PhoneCall, Award, ShieldCheck, BadgeCheck];

export default function HomeTrustRow() {
  return (
    <section data-section="trust-row">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.grid}>
            <div className={styles.col}>
              <h2 className="t-h2 t-tight">{homeTrust.heading}</h2>

              <ul className={styles.chips}>
                {homeTrust.chips.map((chip, i) => {
                  const Icon = icons[i] ?? Award;
                  return (
                    <li className={`t-chip ${styles.chip}`} key={`${chip}-${i}`}>
                      <Icon
                        className={styles.icon}
                        size={60}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{chip}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <img
              className={styles.media}
              src="/placeholders/home-trust-img.svg"
              alt=""
              aria-hidden="true"
              width={360}
              height={223}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
