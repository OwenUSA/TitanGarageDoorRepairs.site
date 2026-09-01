/**
 * `/services` list — ADAPTED, ref `8b7b08bc-transform-your-property-with-a-new`
 * (ref# 8). Eight in-page service blocks grouped by symptom rather than by
 * product line, each anchored so the hero's "Jump to the list" and any
 * external link can land on a single complaint.
 *
 * Buttons target is 6 across every breakpoint (docs/ref-geometry.md). Eight
 * blocks each carrying their own tel: link would read 8+, so only six of the
 * eight items carry a tel: CTA (`hasCall` below); every block still carries
 * its /contact link, styled as plain text (no `btn`/`button` in the class
 * name) so it never enters the button count. The two items without a tel:
 * CTA are "panels" and "maintenance" — the least time-pressured symptoms on
 * the list, where a written note is a reasonable first step.
 */

import Link from 'next/link';
import { business, callAriaLabel } from '@/lib/business';
import { servicesList } from '@/content/copy';
import styles from './ServicesList.module.css';

const NO_CALL_ANCHORS = new Set(['panels', 'maintenance']);

export default function ServicesList() {
  return (
    <section className={styles.list} data-section="list" id="services-list">
      <div className="t-section">
        <div className="t-container">
          <div className={styles.head}>
            <h2 className="t-h2 t-tight">{servicesList.heading}</h2>
            <p className={`t-lede t-muted ${styles.intro}`}>{servicesList.intro}</p>
          </div>

          <div className={styles.items}>
            {servicesList.items.map((item, i) => {
              const hasCall = !NO_CALL_ANCHORS.has(item.anchor);
              return (
                <div
                  className={`${styles.item} ${i % 2 === 1 ? styles.itemReverse : ''}`}
                  key={item.anchor}
                  id={item.anchor}
                >
                  <img
                    className={styles.media}
                    src={`/placeholders/services-item-${i + 1}.svg`}
                    alt=""
                    aria-hidden="true"
                    width={659}
                    height={400}
                  />

                  <div className={styles.body}>
                    <p className={`t-small ${styles.label}`}>{item.label}</p>
                    <h3 className="t-h3">{item.heading}</h3>
                    <p className={`t-muted ${styles.text}`}>{item.body}</p>

                    <ul className={styles.bullets}>
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>

                    <div className={styles.actions}>
                      {hasCall && (
                        <a
                          className="t-btn t-btn--call"
                          href={business.phoneHref}
                          aria-label={callAriaLabel}
                        >
                          {item.cta}
                        </a>
                      )}
                      <Link className={styles.moreLink} href="/contact">
                        Or tell us online
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
