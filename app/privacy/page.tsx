// UNREVIEWED TEMPLATE — requires legal review before launch
/**
 * `/privacy` — three NOVEL sections (title, body, contact), measured once by
 * token conformance at 1440 only (A-9). No reference page exists to diff
 * against, so there is no height target here (docs/sections.md).
 *
 * D-16: generated per what the site actually does — a phone-callback form,
 * no email collection, no analytics, no tracking pixels, no chat widget, no
 * cookie banner, no cookies beyond what the framework sets. No GDPR/CCPA
 * compliance claim. Contact section lists phone and postal address only.
 */

import type { Metadata } from 'next';
import { meta, privacy } from '@/content/copy';
import { business, addressLine, callAriaLabel } from '@/lib/business';
import CtaBand from '@/components/sections/CtaBand';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: meta['/privacy'].title,
  description: meta['/privacy'].description,
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: meta['/privacy'].title,
    description: meta['/privacy'].description,
    url: '/privacy',
    siteName: business.name,
    type: 'website',
    images: [{ url: '/placeholders/home-hero-bg.jpg', width: 1376, height: 784, alt: business.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta['/privacy'].title,
    description: meta['/privacy'].description,
    images: ['/placeholders/home-hero-bg.jpg'],
  },
};

export default function Page() {
  return (
    <>
      {/* UNREVIEWED TEMPLATE — requires legal review before launch */}

      <section data-section="title">
        <div className="t-section">
          <div className="t-container t-container--text">
            <h1 className="t-h1 t-tight">{privacy.heading}</h1>
            <p className={`t-lede t-muted ${styles.sub}`}>{privacy.updated}</p>
          </div>
        </div>
      </section>

      <section data-section="body">
        <div className="t-section">
          <div className="t-container t-container--text">
            <div className={styles.list}>
              {privacy.sections.map((s) => (
                <div className={styles.item} key={s.heading}>
                  <h2 className="t-h3">{s.heading}</h2>
                  <p className={`t-muted ${styles.itemBody}`}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-section="contact">
        <div className="t-section t-band--alt">
          <div className="t-container t-container--text">
            <h2 className="t-h3">How to reach us</h2>
            <p className={`t-muted ${styles.contactBody}`}>
              Phone is the fastest way to reach us. No electronic mail address is published
              anywhere on this site.
            </p>
            <div className={styles.contactDetails}>
              <a className="t-btn t-btn--call" href={business.phoneHref} aria-label={callAriaLabel}>
                {business.phoneDisplay}
              </a>
              <p className={`t-small t-muted ${styles.address}`}>{addressLine}</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
