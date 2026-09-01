'use client';

/**
 * `/services` FAQ — ADAPTED, relocated from the reference's home section
 * `090e14dc-frequently-asked-questions` (ref# 16, structural move 3). No
 * same-route counterpart exists on `/services`, so the harness reports this
 * section UNPAIRED — that is expected, not a defect (docs/sections.md).
 *
 * Mechanism per docs/behavior/05-faq-accordion.md: grid-template-rows 0fr ->
 * 1fr on the panel wrapper, never max-height, never a measured pixel height,
 * never <details>. Multi-select, all closed by default, no state persisted
 * across a route change (component-local `useState`).
 */

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { servicesFaq } from '@/content/copy';
import styles from './ServicesFaq.module.css';

function slug(i: number) {
  return `faq-${i}`;
}

export default function ServicesFaq() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [instant, setInstant] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const hash = window.location.hash.replace('#', '');
    const index = servicesFaq.items.findIndex((_, i) => slug(i) === hash);
    if (index >= 0) {
      setOpen(new Set([index]));
    }

    // Deep-linked item opens without a transition (one frame), everything
    // else keeps the animated toggle from here on.
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, []);

  function toggle(i: number) {
    setInstant(false);
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: servicesFaq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section className={styles.faq} data-section="faq">
      <div className="t-section">
        <div className="t-container t-container--text">
          <h2 className="t-h2 t-tight">{servicesFaq.heading}</h2>

          <div className={styles.items}>
            {servicesFaq.items.map((item, i) => {
              const isOpen = open.has(i);
              const buttonId = `${slug(i)}-q`;
              const panelId = `${slug(i)}-panel`;
              return (
                <div
                  className={`${styles.item} ${isOpen ? styles.open : ''}`}
                  key={item.q}
                >
                  <h3 className={styles.question}>
                    <button
                      type="button"
                      id={buttonId}
                      className={styles.trigger}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={styles.chevron}
                        size={24}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`${styles.panelWrap} ${instant ? styles.instant : ''}`}
                  >
                    <div className={styles.panelInner}>
                      <p className={`t-muted ${styles.answer}`}>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}
