// Per-site harness config -- Titan Garage Door Repairs.
// The shared harness at ../_shared/harness carries no site data by design.
// See _shared/harness/src/config.mjs for the full field list and defaults.

export default {
  referenceOrigin: 'https://www.nextlevelok.com',
  devPort: 3100,

  // ref path -> our route. Note the direction: the package keys on the REFERENCE path,
  // which is the inverse of this site's legacy harness/config.mjs.
  //
  // /services draws from the reference's /roof-replacement page -- the nearest structural
  // counterpart, since a roofer has no garage-door service index.
  routeMap: {
    '/': '/',
    '/about': '/about',
    '/roof-replacement': '/services',
    '/contact': '/contact',
  },

  // /privacy has NO reference page: it is NOVEL by definition, measured by token
  // conformance only. It has nothing to pair against, so it cannot appear in routeMap --
  // but it must still be built and render-truth gated, hence the explicit list.
  ourRoutes: ['/', '/about', '/services', '/contact', '/privacy'],

  breakpoints: { diff: [390, 768, 1440], extra: [430], canonical: 1440 },

  // The reference is neither Divi nor Avada -- it emits section.flex-element.section.
  // Third distinct builder across three sites, which is exactly why segmentation is
  // per-site config and not baked into the package.
  sectionCandidates: ['section.flex-element.section', 'main > section', 'section'],
  // EXACT selectors only -- config.mjs rejects [class*=] matchers (Atlas defect #1).
  chromeSelectors: ['header', 'footer', 'nav.site-header'],
  headerSelector: 'header, .site-header',
  navToggleSelector: 'button[aria-controls], .nav-toggle, .hamburger',
  drawerSelector: '[data-drawer], .mobile-menu, .nav-drawer',
  ctaSelector: 'a[href^="tel:"], button, [class*=btn], [class*=button]',
  logoSelector: 'header img, .logo img, #logo',
  iconFontFamilies: /fontawesome|icomoon|material/i,

  thresholds: { fidelity: 2, struct: 5, token: 0 },
  fidelityMode: 'auto',

  tokenSources: ['app/globals.css', 'app/tokens.css', 'styles/tokens.css'],
  contractPath: 'docs/sections.md',
  reportPath: 'docs/divergence.md',
  copyModulePath: 'content/copy.ts',

  industryAllowlist: [
    'garage door', 'torsion spring', 'extension spring', 'opener', 'cable', 'roller',
    'track', 'panel', 'off-track', 'remote', 'keypad', 'sensor', 'weather seal',
    'residential', 'commercial', 'same-day', 'free estimate', 'repair', 'installation',
    'replacement',
  ],
  gramN: 5,
  trigramMax: 0.15,
  lengthTolerance: 0.1,

  // masterSeed is set when the palette is generated (merged prompt 5+9). Each site MUST
  // use a different seed -- the palette is one of the things that makes these sites
  // genuinely different rather than one template recoloured.
  // --- palette (merged Prompt 5+9) ------------------------------------------
  // Ramp EXTRACTED from the reference's computed styles (painted-area weighted, home +
  // /contact + /roof-replacement). These are their colours, recorded so the rotation has
  // a real structure to preserve; they are NOT the colours this site ships.
  //
  //   primary      rgb(27,139,215)  the structural brand blue, 2.95Mpx of painted band
  //   primaryDeep  rgb(1,24,40)     the dark band under the hero and the footer
  //   accent       rgb(197,23,22)   the CTA fill -- highest chroma on their page
  //   accentDeep   #8e1010          derived: their CTA has no darker state; L/C ordering
  //                                 is asserted by the gate (accentDeep darker, no more
  //                                 chromatic than accent)
  //   neutral*     #fff / #f2f2f2 / #999 / #747474 / #000
  referenceRamp: {
    primary: '#1b8bd7',
    primaryDeep: '#011828',
    accent: '#c51716',
    accentDeep: '#8e1010',
    neutral0: '#ffffff',
    neutral200: '#f2f2f2',
    neutral400: '#999999',
    neutral600: '#747474',
    neutral900: '#000000',
  },

  // EXEMPT from hue rotation (A-7). A randomly green error state is a bug.
  semantic: {
    error: '#b3261e',
    success: '#1e7a3c',
    warning: '#a15c00',
  },

  // The fg/bg combinations the shell ACTUALLY renders. Adding a pair here that nothing
  // renders makes the gate stricter than the site; omitting one the site renders is how
  // Atlas shipped an invisible CTA. Keep this list synchronised with app/globals.css.
  //
  // The focus ring is TWO layers -- a surface-coloured inner halo and a dark outer ring --
  // which is the only construction that holds 3:1 against both a white page and a
  // saturated button using one token. Both layers are gated below.
  pairsInUse: [
    { name: 'body-on-surface',        fg: 'neutral900',   bg: 'neutral0',     min: 4.5, kind: 'text' },
    { name: 'muted-on-surface',       fg: 'neutral600',   bg: 'neutral0',     min: 4.5, kind: 'text' },
    { name: 'heading-on-surface',     fg: 'primaryDeep',  bg: 'neutral0',     min: 4.5, kind: 'text' },
    { name: 'eyebrow-on-surface',     fg: 'accentDeep',   bg: 'neutral0',     min: 4.5, kind: 'text' },
    { name: 'body-on-alt',            fg: 'neutral900',   bg: 'neutral200',   min: 4.5, kind: 'text' },
    // NOTE: there is deliberately no muted-grey-on-alt-band pair. neutral600 on
    // neutral200 is 4.23:1 in the REFERENCE's own ramp, so a rotation cannot rescue it.
    // On the alt band, secondary text is neutral900 at normal weight, never grey.
    { name: 'heading-on-alt',         fg: 'primaryDeep',  bg: 'neutral200',   min: 4.5, kind: 'text' },
    { name: 'body-on-dark',           fg: 'neutral0',     bg: 'primaryDeep',  min: 4.5, kind: 'text' },
    { name: 'muted-on-dark',          fg: 'neutral200',   bg: 'primaryDeep',  min: 4.5, kind: 'text' },
    { name: 'eyebrow-on-dark',        fg: 'primary',      bg: 'primaryDeep',  min: 4.5, kind: 'text' },
    // The CTA band and the hero scrim are a single ramp, not two flat fields. Gated on
    // the WORST sample along it (A-13 / Atlas defect).
    { name: 'band-text-on-gradient',  fg: 'neutral0',     bg: { gradient: ['primaryDeep', 'accentDeep'] }, min: 4.5, kind: 'text' },
    { name: 'band-muted-on-gradient', fg: 'neutral200',   bg: { gradient: ['primaryDeep', 'accentDeep'] }, min: 4.5, kind: 'text' },
    { name: 'cta-label',              fg: 'neutral0',     bg: 'accent',       min: 4.5, kind: 'cta'  },
    { name: 'cta-label-hover',        fg: 'neutral0',     bg: 'accentDeep',   min: 4.5, kind: 'text' },
    { name: 'ghost-label-on-surface', fg: 'primaryDeep',  bg: 'neutral0',     min: 4.5, kind: 'text' },
    { name: 'ghost-edge-on-surface',  fg: 'borderStrong', bg: 'neutral0',     min: 3,   kind: 'ui'   },
    { name: 'ghost-edge-on-dark',     fg: 'neutral0',     bg: 'primaryDeep',  min: 3,   kind: 'ui'   },
    { name: 'input-edge-on-surface',  fg: 'borderStrong', bg: 'neutral0',     min: 3,   kind: 'ui'   },
    { name: 'input-edge-on-alt',      fg: 'borderStrong', bg: 'neutral200',   min: 3,   kind: 'ui'   },
    { name: 'focus-ring-on-page',     fg: 'focus',        bg: 'neutral0',     min: 3,   kind: 'focus' },
    { name: 'focus-halo-on-accent',   fg: 'neutral0',     bg: 'accent',       min: 3,   kind: 'focus' },
    { name: 'focus-halo-on-dark',     fg: 'neutral0',     bg: 'primaryDeep',  min: 3,   kind: 'focus' },
    { name: 'error-on-surface',       fg: 'error',        bg: 'neutral0',     min: 4.5, kind: 'text' },
    { name: 'success-on-surface',     fg: 'success',      bg: 'neutral0',     min: 4.5, kind: 'text' },
  ],

  masterSeed: 3203,
  gradientSamples: 5,
};
