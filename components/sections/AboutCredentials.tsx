/**
 * `/about` credentials — NOVEL, replaces the reference's dropped logo strip
 * (D-09, docs/sections.md). No counterpart to diff against; measured by
 * token conformance only, at 0 violations.
 *
 * Every chip is a literal `TODO(fact):` string from `aboutCredentials.chips`
 * — never filled in with an invented licence number, carrier or
 * certification (D-14, D-17). Sized to the `about-credentials-1..3` slot
 * dimensions from assets/INVENTORY.md: 179x100 @390, 147x147 @768, 265x100
 * @1440.
 */

import { aboutCredentials } from '@/content/copy';
import styles from './AboutCredentials.module.css';

export default function AboutCredentials() {
  return (
    <section className={styles.credentials} data-section="credentials">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container t-container--text">
          <h2 className="t-h2 t-tight">{aboutCredentials.heading}</h2>
          <p className={`t-muted ${styles.body}`}>{aboutCredentials.body}</p>

          <ul className={styles.chips}>
            {aboutCredentials.chips.map((chip) => (
              <li className={`t-chip ${styles.chip}`} key={chip}>
                <span>{chip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
