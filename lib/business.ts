/**
 * The single source of truth for every business fact on this site.
 *
 * A hard-coded phone number, address, or set of hours ANYWHERE else in the
 * codebase is a bug. Components import from here; `content/copy.ts` carries
 * sentences, not facts.
 *
 * Real business facts, verified against domains-table.md. Coordinates were
 * geocoded from the street address via the US Census geocoder.
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
  phoneDisplay: '(850) 955-3844',
  /** RFC 3966 form for href. The ONLY string that may follow `tel:`. */
  phoneHref: 'tel:+18509553844',
  /** E.164, for JSON-LD `telephone`. */
  phoneE164: '+1-850-955-3844',
  /** Digit-by-digit, so a screen reader reads a number rather than a year. */
  phoneSpoken: '8 5 0, 9 5 5, 3 8 4 4',

  address: {
    street: '6710 Hunt St, Ste 1',
    locality: 'Milton',
    region: 'FL',
    postalCode: '32570',
    country: 'US',
  },

  /** Geocoded from the street address (Nominatim/OSM). */
  coords: { lat: 30.6296, lng: -87.0419 },

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

  serviceArea: 'Serving Tallahassee and the surrounding communities.',

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
