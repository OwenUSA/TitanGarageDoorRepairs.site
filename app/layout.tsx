import type { Metadata } from 'next';
import './globals.css';

import { display, body as bodyFont } from '@/lib/fonts';
import { meta, nav } from '@/content/copy';
import { business, localBusinessJsonLd } from '@/lib/business';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CallBar from '@/components/CallBar';

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: meta['/'].title,
  description: meta['/'].description,
  applicationName: business.name,
  // D-15: no analytics, no pixels, no verification tokens.
  robots: { index: true, follow: true },
  icons: { icon: '/placeholders/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${bodyFont.variable}`}>
      <body>
        {/* First focusable element in the document. #main carries
            scroll-margin-top so the 224px sticky header cannot cover it. */}
        <a className="t-skip" href="#main">
          {nav.skipToContent}
        </a>

        <SiteHeader />

        <main id="main">{children}</main>

        <SiteFooter />
        <CallBar />

        {/* LocalBusiness only. No email (D-03), no aggregateRating and no
            review (D-13), no priceRange (D-12), no areaServed city array
            (D-02). Built from lib/business.ts, never re-typed here. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
