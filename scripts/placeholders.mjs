/**
 * Generate neutral placeholder SVGs into public/placeholders/.
 *
 * One file per slot at its 1440 rendered size, plus a second `-m` file only where the
 * slot's aspect ratio changes between breakpoints (same rule Prompt 10 uses for crops).
 * Each placeholder is: dominant-colour fill, slot ID, and pixel dimensions as text.
 * Nothing else. No external service, no network dependency.
 *
 * Dimensions and dominant colours come from harness/assets.mjs measurements of the
 * reference (`.harness/assets/*.json`) — the reference's own imagery is never stored.
 *
 * Usage: node scripts/placeholders.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/placeholders';
fs.mkdirSync(OUT, { recursive: true });

/** slot: id, route, section, dims per bp [w,h], aspect, fit, dominant, note */
export const SLOTS = [
  // ---- shared shell -------------------------------------------------------
  { id: 'logo-header', route: 'all', section: 'header', dims: { 390: [190, 76], 768: [180, 72], 1440: [250, 100] }, fit: 'contain', dominant: '#3c5b76', note: 'wordmark; set in Mohave until a file is handed over' },
  { id: 'logo-footer', route: 'all', section: 'footer-nap', dims: { 390: [198, 79], 768: [188, 75], 1440: [171, 68] }, fit: 'contain', dominant: '#3c5b76' },
  { id: 'favicon', route: 'all', section: 'head', dims: { 390: [32, 32], 768: [32, 32], 1440: [32, 32] }, fit: 'contain', dominant: '#3c5b76' },

  // ---- home ---------------------------------------------------------------
  { id: 'home-hero-bg', route: '/', section: 'hero', dims: { 390: [390, 1000], 768: [768, 1004], 1440: [1440, 820] }, fit: 'cover', dominant: '#69666b', note: 'aspect changes 0.39 / 0.76 / 1.76 — needs a portrait crop' },
  { id: 'home-trust-img', route: '/', section: 'trust-row', dims: { 390: [311, 227], 768: [311, 227], 1440: [360, 223] }, fit: 'cover', radius: 30, dominant: '#8c8c88' },
  { id: 'home-svc-a-img', route: '/', section: 'svc-a', dims: { 390: [327, 236], 768: [337, 243], 1440: [659, 400] }, fit: 'cover', radius: 25, dominant: '#7d8380' },
  { id: 'home-svc-b-img', route: '/', section: 'svc-b', dims: { 390: [327, 218], 768: [337, 224], 1440: [659, 400] }, fit: 'cover', radius: 25, dominant: '#9c9e89' },
  { id: 'home-svc-c-img', route: '/', section: 'svc-c', dims: { 390: [327, 217], 768: [337, 224], 1440: [659, 400] }, fit: 'cover', radius: 25, dominant: '#9c938d' },
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `home-project-${n}`, route: '/', section: 'projects',
    dims: { 390: [252, 200], 768: [194, 200], 1440: [378, 300] }, fit: 'cover',
    dominant: ['#6d6e6e', '#9e9996', '#b8b8b7', '#8f8f8e', '#7f8285', '#8a8781', '#6d6e6e', '#9e9996'][n - 1],
    note: n > 4 ? 'dominant inherited from the sampled four; slider items 5–8 render off-screen' : undefined,
  })),
  { id: 'home-cta-media', route: 'all', section: 'cta-band', dims: { 390: [359, 298], 768: [339, 298], 1440: [636, 298] }, fit: 'cover', dominant: '#6f655a', note: 'reference mounts a video here; poster image only, no video in this build' },

  // ---- about --------------------------------------------------------------
  { id: 'about-story-img', route: '/about', section: 'story', dims: { 390: [359, 192], 768: [707, 378], 1440: [395, 211] }, fit: 'contain', dominant: '#cadded', note: 'reference renders its own logo in this slot; ours is a photo slot' },
  { id: 'about-credentials-1', route: '/about', section: 'credentials', dims: { 390: [179, 100], 768: [147, 147], 1440: [265, 100] }, fit: 'contain', dominant: '#e8eaee', note: 'TODO(fact) chip at badge-strip dimensions' },
  { id: 'about-credentials-2', route: '/about', section: 'credentials', dims: { 390: [179, 100], 768: [147, 147], 1440: [265, 100] }, fit: 'contain', dominant: '#e8eaee', note: 'TODO(fact) chip' },
  { id: 'about-credentials-3', route: '/about', section: 'credentials', dims: { 390: [179, 100], 768: [147, 147], 1440: [265, 100] }, fit: 'contain', dominant: '#e8eaee', note: 'TODO(fact) chip' },

  // ---- services -----------------------------------------------------------
  { id: 'services-hero-bg', route: '/services', section: 'hero', dims: { 390: [390, 758], 768: [768, 846], 1440: [1440, 676] }, fit: 'cover', dominant: '#86716b', note: 'aspect changes 0.51 / 0.91 / 2.13 — needs a portrait crop' },
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    id: `services-item-${n}`, route: '/services', section: 'list',
    dims: { 390: [327, 218], 768: [337, 224], 1440: [659, 400] }, fit: 'cover', radius: 25,
    dominant: '#8b8b87',
    note: 'OURS-NEW: inherits the home service-feature block geometry from the section vocabulary',
  })),

  // ---- contact ------------------------------------------------------------
  { id: 'contact-map-poster', route: '/contact', section: 'map', dims: { 390: [359, 300], 768: [707, 300], 1440: [636, 300] }, fit: 'cover', dominant: '#dfe3d8', note: 'OURS-NEW: static poster behind the lazy map iframe' },
  { id: 'home-map-poster', route: '/', section: 'map', dims: { 390: [359, 300], 768: [707, 300], 1440: [1325, 360] }, fit: 'cover', dominant: '#dfe3d8', note: 'OURS-NEW: required by D-08' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Readable label colour against the fill. */
function ink(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.55 ? '#1a1a1a' : '#f5f5f5';
}

function svg({ id, w, h, dominant, radius = 0, tag }) {
  const fg = ink(dominant);
  const label = tag ? `${id} · ${tag}` : id;
  const fs = Math.max(10, Math.min(20, Math.round(Math.min(w, h) / 12)));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)} placeholder">
  <rect width="${w}" height="${h}" rx="${radius}" fill="${dominant}"/>
  <g fill="${fg}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" text-anchor="middle">
    <text x="${w / 2}" y="${h / 2 - fs * 0.2}" font-size="${fs}">${esc(label)}</text>
    <text x="${w / 2}" y="${h / 2 + fs * 1.2}" font-size="${Math.round(fs * 0.85)}" opacity="0.75">${w}×${h}</text>
  </g>
</svg>
`;
}

const aspect = (d) => +(d[0] / d[1]).toFixed(2);
let written = 0, extra = 0;
const manifest = [];

for (const s of SLOTS) {
  const d1440 = s.dims[1440], d390 = s.dims[390], d768 = s.dims[768];
  const desk = path.join(OUT, `${s.id}.svg`);
  fs.writeFileSync(desk, svg({ id: s.id, w: d1440[0], h: d1440[1], dominant: s.dominant, radius: s.radius || 0 }));
  written++;
  const files = [`/placeholders/${s.id}.svg`];
  // Second file only where the aspect ratio actually changes across the set.
  const ratios = [aspect(d390), aspect(d768), aspect(d1440)];
  const changes = Math.max(...ratios) / Math.min(...ratios) > 1.15;
  if (changes) {
    const m = path.join(OUT, `${s.id}-m.svg`);
    fs.writeFileSync(m, svg({ id: `${s.id}-m`, w: d390[0], h: d390[1], dominant: s.dominant, radius: s.radius || 0 }));
    extra++; written++;
    files.push(`/placeholders/${s.id}-m.svg`);
  }
  manifest.push({ ...s, aspect: { 390: ratios[0], 768: ratios[1], 1440: ratios[2] }, aspectChanges: changes, files });
}

fs.writeFileSync('public/placeholders/manifest.json', JSON.stringify(manifest, null, 1));
console.log(`placeholders: ${SLOTS.length} slots, ${written} files (${extra} portrait crops) -> ${OUT}`);
