/**
 * `/services` hero — ADAPTED, ref `6f224353-roof-replacement` (ref# 6).
 *
 * The reference embeds a 5-field lead form with an email field inline in the
 * hero. We drop the form entirely (D-03 / D-05) and carry an anchor row that
 * jumps straight to the eight in-page service blocks instead.
 *
 * Target box.h: 758 @390 / 846 @768 / 676 @1440 (docs/ref-geometry.md).
 * Target buttons: 1 @390 / 2 @768 / 2 @1440 — the secondary jump link is
 * hidden below 768 so only the tel: CTA is visible/counted there.
 */

import { business, callAriaLabel } from '@/lib/business';
import { servicesHero } from '@/content/copy';
import styles from './ServicesHero.module.css';

export default function ServicesHero() {
  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.col}>
            <p className={`t-eyebrow ${styles.eyebrow}`}>{servicesHero.eyebrow}</p>

            <h1 className={`t-h1 t-tight ${styles.headline}`}>{servicesHero.headline}</h1>

            <p className={`t-lede ${styles.sub}`}>{servicesHero.sub}</p>

            <ul className={styles.points}>
              {servicesHero.points.map((p) => (
                <li className={styles.point} key={p}>
                  {p}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <a
                className="t-btn t-btn--call"
                href={business.phoneHref}
                aria-label={callAriaLabel}
              >
                {servicesHero.callCta}
              </a>
              <a className={`t-btn t-btn--ghost ${styles.jump}`} href="#services-list">
                {servicesHero.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
