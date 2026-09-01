// Font acquisition (Prompt 2). Prompt 5 wires these into the root layout.
//
// Both families the reference actually renders text in are SIL OFL and are served by
// next/font/google at build time. Nothing is lifted from the reference's CDN, and no
// font file is checked into this repo.
//
//   Mohave  — display / headings.  license: OFL  (google/fonts ofl/mohave/METADATA.pb)
//   Lato    — body.                license: OFL  (google/fonts ofl/lato/METADATA.pb)
//
// ARCHIVO_NARROW below is the designated substitute, kept for the case where Mohave has
// to be dropped. See docs/known-divergence.md before changing any of this.

import { Mohave, Lato } from 'next/font/google';

export const display = Mohave({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const body = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});
