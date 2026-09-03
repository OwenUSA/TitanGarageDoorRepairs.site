/**
 * `/` recent projects — ref `62d22b2f-recent-projects` (ref# 14), FIDELITY,
 * measured structurally (fidelityMode=auto, docs/wave-conventions.md).
 *
 * Target box.h: 356 @390 / 378 @768 / 512 @1440 (docs/ref-geometry.md).
 * Ref buttons: 2/2/2 — the call CTA plus the secondary link, nothing else in
 * this subtree matches `a[href^="tel:"], button, [class*=btn], [class*=button]`.
 *
 * Every photographic slot here is a placeholder per KD-03: image fidelity is
 * not chased, the strip only has to hold the reference's height and count.
 */

import Link from 'next/link';
import { homeProjects } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';
import styles from './HomeProjects.module.css';

const slots = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default function HomeProjects() {
  return (
    <section data-section="projects">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.head}>
            <h2 className="t-h2 t-tight">{homeProjects.heading}</h2>
            <div className={styles.actions}>
              <a
                className="t-btn t-btn--ghost"
                href={business.phoneHref}
                aria-label={callAriaLabel}
              >
                {business.phoneDisplay}
              </a>
              <Link className="t-btn t-btn--call" href="/contact">
                {homeProjects.cta}
              </Link>
            </div>
          </div>

          <ul className={styles.strip}>
            {slots.map((n) => (
              <li className={styles.slide} key={n}>
                <picture>
                  <source
                    media="(min-width: 768px)"
                    srcSet={`/placeholders/home-project-${n}.jpg`}
                  />
                  <img
                    className={styles.shot}
                    src={`/placeholders/home-project-${n}-m.jpg`}
                    alt={`Completed garage door repair in Oklahoma City, project ${n}`}
                    width={378}
                    height={300}
                    loading="lazy"
                  />
                </picture>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
