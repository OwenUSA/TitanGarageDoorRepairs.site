/**
 * Compare ours against the reference, three ways, and rank by divergence.
 *   FIDELITY -> pixel diff  (pixelmatch), threshold 2%
 *   ADAPTED  -> structural metric deviation, threshold 5%
 *   NOVEL    -> token conformance, threshold 0 violations
 *
 * Usage: node harness/diff.mjs [--route /] [--bp 1440] [--all]
 * Reads .harness/{ref,ours}/<route>-<bp>/sections.json, writes
 * .harness/diff/<route>-<bp>.json and rewrites docs/divergence.md.
 * Prints a ranked table. Screenshots are never opened here — numbers only.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { BP_SET, ROUTE_MAP, THRESHOLD, STRUCT_THRESHOLD, TOKEN_THRESHOLD } from './config.mjs';
import { readJSON, writeJSON, ensure, slug } from './lib.mjs';
import { loadTokens, conformance } from './tokens.mjs';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const all = argv.includes('--all');

/* --------------------------------------------------- classification source */

/** Parse docs/sections.md — the contract. Table columns: route | id | our section | ref page | ref# | class | reason */
export function loadClasses(file = 'docs/sections.md') {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) continue;
    const c = line.split('|').map((s) => s.trim());
    if (c.length < 7) continue;
    const [, route, id, , , refIdx, rawClass] = c;
    // sections.md marks reclassified rows with **bold**; strip emphasis before matching.
    const klass = (rawClass || '').replace(/\*/g, '').trim();
    if (!/^(FIDELITY|ADAPTED|NOVEL|DELETED)$/.test(klass)) continue;
    (out[route] ||= []).push({ id, refIdx: refIdx === '—' || refIdx === '' ? null : Number(refIdx), class: klass });
  }
  return out;
}

/* ------------------------------------------------------------ pixel diff */

async function pixelDiff(refPng, oursPng, outPng) {
  if (!refPng || !oursPng || !fs.existsSync(refPng) || !fs.existsSync(oursPng)) {
    return { pct: 100, note: 'missing capture on one side' };
  }
  const rm = await sharp(refPng).metadata();
  const w = rm.width, h = rm.height;
  const a = await sharp(refPng).ensureAlpha().raw().toBuffer();
  const b = await sharp(oursPng).resize(w, h, { fit: 'contain', background: '#ffffff' }).ensureAlpha().raw().toBuffer();
  const out = Buffer.alloc(w * h * 4);
  const changed = pixelmatch(a, b, out, w, h, { threshold: 0.1, includeAA: false });
  if (outPng) { ensure(path.dirname(outPng)); await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(outPng); }
  return { pct: +((changed / (w * h)) * 100).toFixed(2), w, h, changed };
}

/* ------------------------------------------------------- structural diff */

const px = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
const cols = (v) => (v && v !== 'none' ? v.trim().split(/\s+/).length : 0);

function metrics(s) {
  const a = s.appearance || {};
  const h0 = (s.headings && s.headings[0] && s.headings[0].appearance) || {};
  const p0 = (s.para && s.para[0] && s.para[0].appearance) || {};
  return {
    sectionW: s.box.w, sectionH: s.box.h,
    padTop: px(a.paddingTop), padBottom: px(a.paddingBottom), padLeft: px(a.paddingLeft), padRight: px(a.paddingRight),
    gap: px(a.gap), gridCols: cols(a.gridTemplateColumns),
    radius: px(a.borderRadius), borderTop: px(a.borderTopWidth), borderBottom: px(a.borderBottomWidth),
    childCount: (s.grid || []).length,
    child1W: (s.grid[0] || {}).w || 0, child1H: (s.grid[0] || {}).h || 0,
    child2Dx: (s.grid[1] || {}).dx || 0, child2Dy: (s.grid[1] || {}).dy || 0,
    hFontSize: px(h0.fontSize), hWeight: px(h0.fontWeight), hLetter: px(h0.letterSpacing), hLine: px(h0.lineHeight),
    pFontSize: px(p0.fontSize), pLine: px(p0.lineHeight), pWeight: px(p0.fontWeight),
  };
}

function structuralDeviation(refS, oursS) {
  const A = metrics(refS), B = metrics(oursS);
  const per = {};
  let sum = 0, n = 0, worst = { k: null, d: 0 };
  for (const k of Object.keys(A)) {
    const a = A[k], b = B[k];
    if (a === 0 && b === 0) continue;
    const d = +((Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1)) * 100).toFixed(2);
    per[k] = { ref: a, ours: b, dev: d };
    sum += d; n++;
    if (d > worst.d) worst = { k, d };
  }
  // Appearance equality checks that are not numeric.
  const eq = {};
  for (const k of ['fontFamily', 'textTransform', 'display', 'flexDirection', 'justifyContent', 'alignItems', 'textAlign']) {
    const a = (refS.appearance || {})[k], b = (oursS.appearance || {})[k];
    if (a !== undefined) eq[k] = { ref: a, ours: b, same: a === b };
  }
  return { mean: n ? +(sum / n).toFixed(2) : 100, worst, per, eq };
}

/* ------------------------------------------------------------------ pair */

function pairSections(ref, ours, classes) {
  const R = ref.sections.filter((s) => s.inFlow && s.box.h >= 40 && s.chars > 0);
  const O = ours.sections.filter((s) => s.inFlow && s.box.h >= 40);
  const rows = [];
  if (classes && classes.length) {
    classes.forEach((c, i) => {
      if (c.class === 'DELETED') return;
      const r = c.refIdx != null ? R.find((s) => s.i === c.refIdx) : null;
      rows.push({ id: c.id, class: c.class, ref: r || null, ours: O[i] || null });
    });
  } else {
    const n = Math.max(R.length, O.length);
    for (let i = 0; i < n; i++) {
      rows.push({ id: (R[i] || O[i]).label, class: 'FIDELITY', ref: R[i] || null, ours: O[i] || null });
    }
  }
  return rows;
}

/* ------------------------------------------------------------------- run */

async function diffOne(route, bp, classes, tokens) {
  const rp = path.join('.harness', 'ref', `${slug(route)}-${bp}`, 'sections.json');
  const op = path.join('.harness', 'ours', `${slug(route)}-${bp}`, 'sections.json');
  if (!fs.existsSync(rp) || !fs.existsSync(op)) {
    console.log(`diff ${route} @${bp}: SKIP (capture missing: ${!fs.existsSync(rp) ? 'ref' : 'ours'})`);
    return [];
  }
  const ref = readJSON(rp), ours = readJSON(op);
  const rows = [];
  for (const pair of pairSections(ref, ours, classes[route])) {
    const row = { route, bp, section: pair.id, class: pair.class };
    if (pair.class === 'NOVEL' || !pair.ref) {
      const c = pair.ours ? conformance(pair.ours, tokens) : { status: 'FAIL', violations: null, note: 'section not rendered' };
      row.metric = 'token violations';
      row.value = c.violations === null ? c.note || c.status : c.violations;
      row.threshold = TOKEN_THRESHOLD;
      row.status = c.status === 'n/a' ? 'N/A' : c.violations === 0 ? 'PASS' : 'FAIL';
      row.sample = c.sample;
    } else if (pair.class === 'ADAPTED') {
      if (!pair.ours) { row.metric = 'struct dev %'; row.value = 100; row.threshold = STRUCT_THRESHOLD; row.status = 'FAIL'; row.note = 'not built'; }
      else {
        const d = structuralDeviation(pair.ref, pair.ours);
        row.metric = 'struct dev %'; row.value = d.mean; row.threshold = STRUCT_THRESHOLD;
        row.status = d.mean < STRUCT_THRESHOLD ? 'PASS' : 'FAIL';
        row.worst = d.worst; row.mismatched = Object.entries(d.eq).filter(([, v]) => !v.same).map(([k]) => k);
      }
    } else {
      const outPng = path.join('.harness', 'diff', `${slug(route)}-${bp}`, `${pair.id}.png`);
      const d = await pixelDiff(pair.ref && pair.ref.shot, pair.ours && pair.ours.shot, outPng);
      row.metric = 'divergent px %'; row.value = d.pct; row.threshold = THRESHOLD;
      row.status = d.pct < THRESHOLD ? 'PASS' : 'FAIL';
      if (d.note) row.note = d.note;
    }
    rows.push(row);
  }
  writeJSON(path.join('.harness', 'diff', `${slug(route)}-${bp}.json`), rows);
  const fails = rows.filter((r) => r.status === 'FAIL').length;
  console.log(`diff ${route} @${bp}: ${rows.length} sections, ${fails} over threshold -> .harness/diff/${slug(route)}-${bp}.json`);
  return rows;
}

const classes = loadClasses();
const tokens = loadTokens();
const jobs = all
  ? Object.keys(ROUTE_MAP).flatMap((r) => BP_SET.map((bp) => ({ route: r, bp })))
  : [{ route: arg('--route', '/'), bp: Number(arg('--bp', 1440)) }];

let rows = [];
for (const j of jobs) rows = rows.concat(await diffOne(j.route, j.bp, classes, tokens));

const rank = [...rows].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
const fmt = (r) => `| ${r.route} | ${r.section} | ${r.bp} | ${r.class} | ${r.metric} | ${r.value} | ${r.threshold} | ${r.status} |`;
const head = '| route | section | breakpoint | class | metric | value | threshold | status |\n|---|---|---|---|---|---|---|---|';
ensure('docs');
fs.writeFileSync('docs/divergence.md',
  `# Divergence table\n\nGenerated ${new Date().toISOString()} by \`harness/diff.mjs\`. Ranked by divergence, worst first.\n` +
  `Thresholds: FIDELITY < ${THRESHOLD}% divergent pixel area, ADAPTED < ${STRUCT_THRESHOLD}% structural deviation, NOVEL = ${TOKEN_THRESHOLD} token violations.\n\n` +
  `${head}\n${rank.map(fmt).join('\n')}\n`);

console.log('\nTOP 10 (worst first)');
console.log(head);
console.log(rank.slice(0, 10).map(fmt).join('\n'));
console.log(`\nTOTAL ${rows.length} rows, ${rows.filter((r) => r.status === 'FAIL').length} FAIL, ${rows.filter((r) => r.status === 'N/A').length} N/A -> docs/divergence.md`);
