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
  masterSeed: 3100,
  gradientSamples: 5,
};
