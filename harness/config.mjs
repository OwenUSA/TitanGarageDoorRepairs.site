// Harness configuration. Single source of truth for the capture instrument.
export const REFERENCE = 'https://www.nextlevelok.com';
export const LOCAL = 'http://localhost:3100';
export const PORT = 3100;

// BP_SET is fixed at three. 430 is captured in the PROFILE pass only (real-device
// width for a phone-call-driven business); it is not a diff breakpoint.
export const BP_SET = [390, 768, 1440];
export const PROFILE_BPS = [390, 430, 768, 1440];
export const BP_HEIGHT = { 390: 844, 430: 932, 768: 1024, 1440: 900 };

export const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// Our five routes -> the reference page(s) they draw from.
// A route with refPath null has no page-level reference (NOVEL by definition).
export const ROUTE_MAP = {
  '/': { refPath: '/', label: 'home' },
  '/about': { refPath: '/about', label: 'about' },
  '/services': { refPath: '/roof-replacement', label: 'services' },
  '/contact': { refPath: '/contact', label: 'contact' },
  '/privacy': { refPath: null, label: 'privacy' },
};

// Extra reference pages profiled for section vocabulary only.
export const VOCAB_PAGES = ['/faqs', '/reviews', '/serving-area'];

export const SECTION_SELECTOR = 'section.flex-element.section';
export const THRESHOLD = 2;        // % divergent pixel area, FIDELITY
export const STRUCT_THRESHOLD = 5; // % structural metric deviation, ADAPTED
export const TOKEN_THRESHOLD = 0;  // token violations, NOVEL
