/**
 * STEP A — profile the reference.
 * Usage: node harness/profile.mjs [--bp 1440] [--headed]
 * Writes .harness/profile/<page>-<bp>.json and .harness/profile/summary.json
 * Concurrency: 2 pages max (MAX_AGENTS).
 */
import path from 'node:path';
import { REFERENCE, PROFILE_BPS, ROUTE_MAP, VOCAB_PAGES } from './config.mjs';
import { openBrowser, newPageAt, gotoStable, extractProfile, extractSections, captureStates, writeJSON, ensure, slug } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const headed = argv.includes('--headed');
const only = arg('--bp', null);
const BPS = only ? [Number(only)] : PROFILE_BPS;

const PAGES = [
  ...new Set([...Object.values(ROUTE_MAP).map((r) => r.refPath).filter(Boolean), ...VOCAB_PAGES]),
];

const OUT = '.harness/profile';
ensure(OUT);

async function profileOne(browser, refPath, bp) {
  const page = await newPageAt(browser, bp);
  const name = slug(refPath);
  try {
    const status = await gotoStable(page, REFERENCE + refPath);
    if (status >= 400) {
      await page.context().close();
      return { refPath, bp, status, blocked: true };
    }
    const prof = await extractProfile(page);
    const sections = await extractSections(page);
    let states = [];
    if (bp === 390 || bp === 1440) {
      states = await captureStates(page, path.join(OUT, `${name}-${bp}`), bp);
    }
    const rec = { refPath, bp, status, profile: prof, sections, states };
    const f = writeJSON(path.join(OUT, `${name}-${bp}.json`), rec);
    console.log(`profile ${refPath} @${bp}: status=${status} height=${prof.height} sections=${prof.sectionCount} blocks=${sections.length} mediaQueries=${prof.cssBreakpoints.length} -> ${f}`);
    await page.context().close();
    return { refPath, bp, status, height: prof.height, sections: prof.sectionCount, blocks: sections.length };
  } catch (e) {
    await page.context().close().catch(() => {});
    console.log(`profile ${refPath} @${bp}: ERROR ${e.message.slice(0, 120)}`);
    return { refPath, bp, error: e.message.slice(0, 200) };
  }
}

const jobs = [];
for (const p of PAGES) for (const bp of BPS) jobs.push({ p, bp });

const browser = await openBrowser({ headed });
const results = [];
const MAX = 2;
let idx = 0;
async function worker() {
  while (idx < jobs.length) {
    const j = jobs[idx++];
    results.push(await profileOne(browser, j.p, j.bp));
  }
}
await Promise.all(Array.from({ length: MAX }, worker));
await browser.close();
writeJSON(path.join(OUT, 'summary.json'), { generated: new Date().toISOString(), reference: REFERENCE, results });
console.log(`SUMMARY: ${results.length} passes, ${results.filter((r) => r.error || r.blocked).length} failed -> ${OUT}/summary.json`);
