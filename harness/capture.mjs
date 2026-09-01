/**
 * Capture one side (reference or ours) for one route at one breakpoint.
 * Usage:
 *   node harness/capture.mjs --side ref  --route / --bp 1440
 *   node harness/capture.mjs --side ours --route /about --bp 390
 *   node harness/capture.mjs --side ref  --all            (all routes x BP_SET, 2 at a time)
 * Writes .harness/<side>/<route>-<bp>/{sections.json, NN-label.png, full.png}
 * Prints one summary line per pass. Never dumps its output.
 */
import path from 'node:path';
import fs from 'node:fs';
import { REFERENCE, LOCAL, BP_SET, ROUTE_MAP } from './config.mjs';
import { openBrowser, newPageAt, gotoStable, extractSections, extractProfile, shotSection, writeJSON, ensure, slug } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const side = arg('--side', 'ref');
const all = argv.includes('--all');
const headed = argv.includes('--headed');
const routeArg = arg('--route', '/');
const bpArg = Number(arg('--bp', 1440));

export function urlFor(side, route) {
  if (side === 'ours') return LOCAL + route;
  const m = ROUTE_MAP[route];
  if (!m || !m.refPath) return null; // NOVEL route: no reference page
  return REFERENCE + m.refPath;
}

async function capture(browser, side, route, bp) {
  const url = urlFor(side, route);
  const outDir = path.join('.harness', side, `${slug(route)}-${bp}`);
  if (!url) {
    ensure(outDir);
    writeJSON(path.join(outDir, 'sections.json'), { side, route, bp, novel: true, sections: [] });
    console.log(`capture ${side} ${route} @${bp}: NOVEL (no reference page) -> ${outDir}`);
    return { side, route, bp, novel: true };
  }
  const page = await newPageAt(browser, bp);
  try {
    const status = await gotoStable(page, url);
    const profile = await extractProfile(page);
    const sections = await extractSections(page);
    ensure(outDir);
    let shots = 0;
    for (const s of sections) {
      if (!s.inFlow) continue;                 // overlays/drawers captured as states, not sections
      if (s.box.h < 40 || s.chars === 0) continue;
      const f = path.join(outDir, `${String(s.i).padStart(3, '0')}-${s.label}.png`);
      try { await shotSection(page, s.box, f); s.shot = f; shots++; } catch (e) { s.shotError = e.message.slice(0, 80); }
    }
    await page.screenshot({ path: path.join(outDir, 'full.png'), fullPage: true, animations: 'disabled', caret: 'hide' });
    writeJSON(path.join(outDir, 'sections.json'), { side, route, bp, url, status, profile, sections });
    console.log(`capture ${side} ${route} @${bp}: status=${status} height=${profile.height} inflow=${sections.filter((s) => s.inFlow).length} shots=${shots} -> ${outDir}`);
    await page.context().close();
    return { side, route, bp, status, height: profile.height, shots };
  } catch (e) {
    await page.context().close().catch(() => {});
    console.log(`capture ${side} ${route} @${bp}: ERROR ${e.message.slice(0, 120)}`);
    return { side, route, bp, error: e.message.slice(0, 200) };
  }
}

const jobs = all
  ? Object.keys(ROUTE_MAP).flatMap((r) => BP_SET.map((bp) => ({ route: r, bp })))
  : [{ route: routeArg, bp: bpArg }];

const browser = await openBrowser({ headed });
const results = [];
let idx = 0;
async function worker() { while (idx < jobs.length) { const j = jobs[idx++]; results.push(await capture(browser, side, j.route, j.bp)); } }
await Promise.all(Array.from({ length: 2 }, worker)); // MAX_AGENTS = 2
await browser.close();
writeJSON(path.join('.harness', side, 'summary.json'), { generated: new Date().toISOString(), side, results });
console.log(`SUMMARY ${side}: ${results.length} passes, ${results.filter((r) => r.error).length} failed`);
