/**
 * The single source of truth for every business fact on this site.
 *
 * A hard-coded phone number, address, or set of hours ANYWHERE else in the
 * codebase is a bug. Components import from here; `content/copy.ts` carries
 * sentences, not facts.
 *
 * EVERY VALUE BELOW IS FICTIONAL AND DELIBERATE (CLAUDE.md CONSTANTS):
 *   - the street address does not exist and will not geocode;
 *   - the coordinates are real Oklahoma City coordinates, and the map is
 *     embedded BY COORDINATES ONLY (D-07) — never pass `address` to a geocoder;
 *   - the phone is inside the 555-01XX reserved range and cannot ring anyone.
 * All of it is listed in docs/PRE-LAUNCH.md as must-replace-before-public.
 *
 * Nothing here may be extended with a fact that is not in CONSTANTS. Years in
 * business, licence numbers, crew size, review counts, prices, warranty terms
 * and response times are TODO(fact) per D-14/D-17 and live in
 * docs/facts-needed.md — not in this file.
 */

export const business = {
  name: 'Titan Garage Door Repairs',
  tagline: 'The door gets fixed right, and a person picks up the phone.',

  /** Display form. Rendered as-is; never reformatted at the call site. */
  phoneDisplay: '(405) 555-0142',
  /** RFC 3966 form for href. The ONLY string that may follow `tel:`. */
  phoneHref: 'tel:+14055550142',
  /** E.164, for JSON-LD `telephone`. */
  phoneE164: '+1-405-555-0142',
  /** Digit-by-digit, so a screen reader reads a number rather than a year. */
  phoneSpoken: '4 0 5, 5 5 5, 0 1 4 2',

  address: {
    street: '4820 Kestrel Lane',
    locality: 'Oklahoma City',
    region: 'OK',
    postalCode: '73120',
    country: 'US',
  },

  /** "35.5760,-97.5680" — the only geographic input the site ever uses. */
  coords: { lat: 35.576, lng: -97.568 },

  hours: {
    /** Human form, single block, all seven days (D-06). */
    display: 'Open 7 days, 7:00 AM – 7:00 PM',
    opens: '07:00',
    closes: '19:00',
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },

  serviceArea: 'Serving the Oklahoma City metro and the surrounding communities.',

  /** Local-only build (D-18). Used for canonical metadata and JSON-LD `url`. */
  siteUrl: 'https://titangaragedoorrepairs.site',
} as const;

export const addressLine = `${business.address.street}, ${business.address.locality}, ${business.address.region} ${business.address.postalCode}`;

export const coordsString = `${business.coords.lat.toFixed(4)},${business.coords.lng.toFixed(4)}`;

/**
 * Keyless Google embed, BY COORDINATES (D-07). No API key, no `.env`, and the
 * fictional address is never sent to a geocoder.
 */
export const mapEmbedUrl = (zoom: number) =>
  `https://www.google.com/maps?q=${coordsString}&z=${zoom}&output=embed`;

/** Directions deep link (D-08). Also coordinates only. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordsString}`;

/** Full spoken name for the call CTAs' accessible label. */
export const callAriaLabel = `Call ${business.name} at ${business.phoneSpoken}`;

/**
 * LocalBusiness JSON-LD.
 *
 * Deliberately absent, and each omission is a rule, not an oversight:
 *   - `email`                          D-03, no email anywhere on this site
 *   - `aggregateRating` / `review`     D-13, fabricated review markup is a
 *                                      legal problem, not a content gap
 *   - `priceRange`                     D-12, no prices, not even a band
 *   - `areaServed` city array          D-02, the locations page is deleted and
 *                                      so is its schema
 */
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: business.name,
  description: business.tagline,
  url: business.siteUrl,
  telephone: business.phoneE164,
  image: `${business.siteUrl}/placeholders/logo-header.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    postalCode: business.address.postalCode,
    addressCountry: business.address.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: business.coords.lat,
    longitude: business.coords.lng,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: business.hours.days.map((d) => `https://schema.org/${d}`),
      opens: business.hours.opens,
      closes: business.hours.closes,
    },
  ],
} as const;

export default business;
