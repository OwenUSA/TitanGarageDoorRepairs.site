/**
 * `/` testimonials — ref `307b2389-here-s-what-our-satisfied-customer`
 * (ref# 15), ADAPTED, measured structurally.
 *
 * Target box.h: 873 @390 / 748 @768 / 536 @1440 (docs/ref-geometry.md).
 * Ref buttons: 1/1/1 — the call CTA is the only element in this subtree
 * matching `a[href^="tel:"], button, [class*=btn], [class*=button]`.
 *
 * D-13: the reference's five-star review widget has no counterpart we may
 * build. These three blocks stay the literal `[TESTIMONIAL PLACEHOLDER]`
 * string — no invented name, quote, star rating or review count, and no
 * Review/AggregateRating JSON-LD anywhere on the site.
 */

import { Quote } from 'lucide-react';
import { homeTestimonials } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';
import styles from './HomeTestimonials.module.css';

export default function HomeTestimonials() {
  return (
    <section data-section="testimonials">
      <div className={`t-section t-band--alt ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.head}>
            <h2 className="t-h2 t-tight">{homeTestimonials.heading}</h2>
            <p className={`t-lede t-muted ${styles.body}`}>{homeTestimonials.body}</p>
          </div>

          <ul className={styles.grid}>
            {homeTestimonials.placeholders.map((p, i) => (
              <li className={styles.slot} key={i}>
                <Quote className={styles.icon} size={60} strokeWidth={2} aria-hidden="true" />
                <p className={styles.quote}>{p}</p>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <a
              className="t-btn t-btn--call"
              href={business.phoneHref}
              aria-label={callAriaLabel}
            >
              {homeTestimonials.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
