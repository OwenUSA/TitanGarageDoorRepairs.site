/**
 * rAF-sampled motion trace. Used ONLY to decide whether motion is scroll-linked.
 * Scrolls at ~3px/frame via requestAnimationFrame — never scrollTo() in a loop to
 * fixed offsets, which cannot see staggers, easing, or sub-step transitions.
 * Also measures the sticky-header transition (height/background at top vs engaged).
 *
 * Usage: node harness/motion.mjs [--route /] [--bp 1440] [--px 3] [--frames 900]
 * Writes .harness/motion/<page>-<bp>.json, prints a verdict line.
 */
import path from 'node:path';
import { REFERENCE, ROUTE_MAP } from './config.mjs';
import { openBrowser, newPageAt, gotoStable, writeJSON, slug } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const route = arg('--route', '/');
const bp = Number(arg('--bp', 1440));
const perFrame = Number(arg('--px', 3));
const maxFrames = Number(arg('--frames', 900));

const refPath = ROUTE_MAP[route]?.refPath ?? route;
const browser = await openBrowser();
const page = await newPageAt(browser, bp);
await gotoStable(page, REFERENCE + refPath);
// gotoStable freezes transitions for screenshots; motion tracing needs them live.
await page.reload({ waitUntil: 'networkidle' });

const trace = await page.evaluate(async ({ perFrame, maxFrames }) => {
  const header = document.querySelector('header, .dmHeader, [class*="header"]') ||
    [...document.querySelectorAll('div')].find((d) => getComputedStyle(d).position === 'fixed' && d.getBoundingClientRect().top === 0 && d.getBoundingClientRect().height > 60);
  const watched = [...document.querySelectorAll('section, [class*=reveal], [class*=fade], [class*=animate], img')]
    .slice(0, 40)
    .map((el) => ({ el, key: (el.tagName + '.' + (el.className || '').toString().slice(0, 24)).trim() }));
  const samples = [];
  const read = (y) => ({
    y,
    header: header ? (() => { const s = getComputedStyle(header); const r = header.getBoundingClientRect();
      return { h: +r.height.toFixed(1), top: +r.top.toFixed(1), bg: s.backgroundColor, transform: s.transform, opacity: s.opacity, shadow: s.boxShadow.slice(0, 40) }; })() : null,
    els: watched.map(({ el, key }) => {
      const s = getComputedStyle(el);
      return { key, t: s.transform === 'none' ? 'none' : s.transform, o: +Number(s.opacity).toFixed(3), fil: s.filter };
    }),
  });
  const frame = () => new Promise((r) => requestAnimationFrame(r));
  const max = document.documentElement.scrollHeight - window.innerHeight;
  let y = 0, n = 0;
  samples.push(read(0));
  while (y < max && n < maxFrames) {
    y += perFrame; n++;
    window.scrollBy(0, perFrame);
    await frame();
    if (n % 4 === 0) samples.push(read(Math.round(window.scrollY)));
  }
  return { samples, frames: n, max };
}, { perFrame, maxFrames });

// Verdict: does anything change as a continuous function of scrollY (scroll-linked),
// or do values only step once (time-driven transition / reveal), or never (static)?
const changes = {};
for (const s of trace.samples) {
  for (const e of s.els) {
    const k = e.key;
    (changes[k] ||= new Set()).add(e.t + '|' + e.o);
  }
}
const varying = Object.entries(changes).map(([k, v]) => ({ k, distinct: v.size })).filter((x) => x.distinct > 1);
const continuous = varying.filter((x) => x.distinct > 6);
const headerStates = new Set(trace.samples.map((s) => s.header && (s.header.h + '|' + s.header.bg + '|' + s.header.transform)));

const verdict = continuous.length
  ? 'SCROLL-LINKED (continuous per-frame change detected)'
  : varying.length
    ? 'TIME-DRIVEN (discrete state changes only — CSS transitions / reveals)'
    : 'STATIC (no motion detected during scroll)';

const out = writeJSON(path.join('.harness', 'motion', `${slug(route)}-${bp}.json`), {
  route, bp, perFrame, frames: trace.frames, sampleCount: trace.samples.length,
  verdict, varying, continuous, headerDistinctStates: headerStates.size,
  headerFirst: trace.samples[0].header, headerLast: trace.samples[trace.samples.length - 1].header,
  samples: trace.samples.filter((_, i) => i % 8 === 0),
});
console.log(`motion ${route} @${bp}: ${verdict} | frames=${trace.frames} sampled=${trace.samples.length} varying=${varying.length} continuous=${continuous.length} headerStates=${headerStates.size} -> ${out}`);
await browser.close();
