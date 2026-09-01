/**
 * `/` hero — ADAPTED, ref `81f74bc3-roofing-done-right` (ref# 7).
 *
 * Built by the lead: it consumes the frozen shell's button and band vocabulary
 * and is the section every other home band inherits its rhythm from.
 *
 * The proposition is "a person picks up the phone" (Prompt 3 item 3), not speed
 * and not emergency cover — the reference leads on neither and we may not claim
 * a response time (D-17).
 */

import Link from 'next/link';
import { Check } from 'lucide-react';
import { homeHero } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';
import styles from './HomeHero.module.css';

export default function HomeHero() {
  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.col}>
            <p className={`t-eyebrow ${styles.eyebrow}`}>{homeHero.eyebrow}</p>

            <h1 className={`t-h1 t-tight ${styles.headline}`}>{homeHero.headline}</h1>

            <p className={`t-lede ${styles.sub}`}>{homeHero.sub}</p>

            <ul className={styles.points}>
              {homeHero.points.map((p) => (
                <li className={styles.point} key={p}>
                  <Check
                    className={styles.pointIcon}
                    size={24}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <a
                className="t-btn t-btn--call"
                href={business.phoneHref}
                aria-label={callAriaLabel}
              >
                {homeHero.callCta}
              </a>
              <Link className="t-btn t-btn--ghost" href="/contact">
                {homeHero.secondaryCta}
              </Link>
            </div>

            {/* "Free estimate" is the one commercial claim D-12 permits. */}
            <p className={`t-small t-muted ${styles.note}`}>{homeHero.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
