/**
 * Prompt 3 lexical gate. Runs again unchanged at Prompt 11.
 *
 *   PASS requires, per section:
 *     - zero shared 5-grams with the reference's body copy (checked against the mapped
 *       reference section AND against the whole reference corpus)
 *     - trigram Jaccard overlap <= 0.15 after stopword and industry-allowlist removal
 *
 *   Also reports the length rule (+/-10% of the reference slot's character count),
 *   which is a separate, non-lexical gate.
 *
 * Reference corpus: .harness/reftext/<route>.json (harness/reftext.mjs).
 * Ours: content/copy.ts, imported directly (node strips the types).
 *
 * Usage: node scripts/similarity.mjs [--route /] [--verbose]
 */
import fs from 'node:fs';
import path from 'node:path';
import { copy } from '../content/copy.ts';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const only = arg('--route', null);
const verbose = argv.includes('--verbose');

export const TRIGRAM_MAX = 0.15;
export const FIVEGRAM_MAX = 0;

/** Exempt: avoiding these produces copy no customer searches for. */
const ALLOWLIST = [
  'garage door', 'torsion spring', 'extension spring', 'opener', 'cable', 'roller',
  'track', 'panel', 'off-track', 'off track', 'remote', 'keypad', 'sensor',
  'weather seal', 'residential', 'commercial', 'same-day', 'same day', 'free estimate',
  'repair', 'installation', 'replacement',
];

const STOPWORDS = new Set(`a an and are as at be been but by can could did do does for from
had has have he her his how i if in into is it its me my no not of on or our out over own
she so than that the their them then there these they this those to too up us was we were
what when where which who why will with would you your yours it's we're don't you're
that's here s t re ll ve m d`.split(/\s+/).filter(Boolean));

const words = (s) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9']+/g, ' ').trim().split(/\s+/).filter(Boolean);

/** Verbatim-phrase tokens: stopwords KEPT — this is the copy-paste detector. */
const rawTokens = (s) => words(s);

/** Similarity tokens: allowlist phrases and stopwords removed. */
function filteredTokens(s) {
  let t = ' ' + s.toLowerCase().replace(/[‘’]/g, "'") + ' ';
  for (const phrase of [...ALLOWLIST].sort((a, b) => b.length - a.length)) {
    t = t.split(phrase).join(' ');
  }
  return words(t).filter((w) => !STOPWORDS.has(w) && w.length > 2);
}

const ngrams = (toks, n) => {
  const out = new Set();
  for (let i = 0; i + n <= toks.length; i++) out.add(toks.slice(i, i + n).join(' '));
  return out;
};

const jaccard = (A, B) => {
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return +(inter / (A.size + B.size - inter)).toFixed(4);
};

const shared = (A, B) => [...A].filter((x) => B.has(x));

/* ---------------------------------------------------------------- our copy */

function flatten(node, out = []) {
  if (node == null) return out;
  if (typeof node === 'string') { if (node.trim()) out.push(node); return out; }
  if (Array.isArray(node)) { for (const v of node) flatten(v, out); return out; }
  if (typeof node === 'object') { for (const v of Object.values(node)) flatten(v, out); return out; }
  return out;
}

/* ---------------------------------------------------------- reference corpus */

const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-'));
const REF = {};
for (const f of fs.existsSync('.harness/reftext') ? fs.readdirSync('.harness/reftext') : []) {
  if (!f.endsWith('.json') || f === 'meta.json') continue;
  REF[f.replace('.json', '')] = JSON.parse(fs.readFileSync(path.join('.harness/reftext', f), 'utf8'));
}
if (!Object.keys(REF).length) {
  console.error('No reference corpus. Run: node harness/reftext.mjs');
  process.exit(2);
}

/** Duda renders accordion answers as both <p> and <li>, and repeats the footer inside
 *  some sections. Dedupe, or the length budget doubles for no layout reason. */
const uniq = (arr) => [...new Set(arr.map((s) => s.trim()).filter(Boolean))];

const refSectionText = (route, i) => {
  const doc = REF[slug(route)];
  if (!doc) return null;
  const s = doc.sections.find((x) => x.i === i);
  if (!s) return null;
  const heads = s.headings.map((h) => h.text);
  // Accordion <li> wrappers repeat their own heading + answer verbatim. Drop any item
  // already contained in the heading/paragraph text, or the budget double-counts.
  const squash = (t) => t.replace(/\s+/g, '');
  const headBlob = squash(heads.join(' '));
  const paraBlob = squash(s.paras.join(' '));
  const items = s.items.filter((it) => {
    const q = squash(it);
    if (headBlob.includes(q) || paraBlob.includes(q)) return false;
    // Accordion item = its own heading immediately followed by its own answer.
    for (const h of heads) {
      const hs = squash(h);
      if (hs && q.startsWith(hs) && paraBlob.includes(q.slice(hs.length))) return false;
    }
    return true;
  });
  return uniq([...heads, ...s.paras, ...items, ...s.ctas]).join(' ');
};

/** Reference <title> and <meta description>, kept out of the section corpus and
 *  gated separately — duplicate metadata is the most detectable form of copying. */
const REF_META = fs.existsSync('.harness/reftext/meta.json')
  ? JSON.parse(fs.readFileSync('.harness/reftext/meta.json', 'utf8')).meta
  : [];
const REF_META_TEXT = REF_META.map((m) => `${m.title} ${m.description}`).join(' ');
const REF_META_5 = ngrams(rawTokens(REF_META_TEXT), 5);
const REF_META_3 = ngrams(filteredTokens(REF_META_TEXT), 3);

const SITE_TEXT = Object.values(REF)
  .flatMap((d) => d.sections.flatMap((s) => [...s.headings.map((h) => h.text), ...s.paras, ...s.items, ...s.ctas]))
  .join(' ');
const SITE_5 = ngrams(rawTokens(SITE_TEXT), 5);

/* -------------------------------------------------------------- self-test */

/** Prove the instrument can fail before trusting a pass.
 *  --selftest feeds the reference's own copy back in: identical text must score
 *  1.0 trigram and a large 5-gram count, and a different section must score low. */
if (argv.includes('--selftest')) {
  const t = (r, i) => refSectionText(r, i);
  const cases = [
    ['home sec8 vs itself (expect trigram 1.0, 5-gram > 0)', t('/', 8), t('/', 8)],
    ['home sec8 vs home sec16 (expect low)', t('/', 8), t('/', 16)],
    ['home sec10 vs home sec11 (sibling service blocks)', t('/', 10), t('/', 11)],
  ];
  for (const [label, a, b] of cases) {
    const tri = jaccard(ngrams(filteredTokens(a), 3), ngrams(filteredTokens(b), 3));
    const five = shared(ngrams(rawTokens(a), 5), ngrams(rawTokens(b), 5)).length;
    console.log(`selftest | ${label} -> trigram=${tri} 5-gram=${five}`);
  }
  const identical = jaccard(ngrams(filteredTokens(t('/', 8)), 3), ngrams(filteredTokens(t('/', 8)), 3));
  console.log(identical === 1 ? 'selftest OK: identical text scores 1.0' : `selftest BROKEN: identical text scored ${identical}`);
  process.exit(identical === 1 ? 0 : 3);
}

/* --------------------------------------------------------------------- run */

const rows = [];
for (const sec of copy.sections) {
  if (only && sec.route !== only) continue;
  const ourStrings = flatten(sec.copy);
  const ourText = ourStrings.join(' ');
  const ourChars = ourStrings.reduce((a, s) => a + s.length, 0);

  const refText = sec.ref == null ? null : refSectionText(sec.refRoute ?? sec.route, sec.ref);
  const row = {
    route: sec.route, section: sec.id, ref: sec.ref ?? '—',
    ourChars, refChars: refText ? refText.length : '—',
  };

  // Verbatim 5-grams: against the mapped section and against the whole site.
  const our5 = ngrams(rawTokens(ourText), 5);
  const sec5 = refText ? shared(our5, ngrams(rawTokens(refText), 5)) : [];
  const site5 = shared(our5, SITE_5);
  row.fiveGram = site5.length;
  row.fiveGramSample = site5.slice(0, 3);

  if (refText) {
    const A = ngrams(filteredTokens(ourText), 3);
    const B = ngrams(filteredTokens(refText), 3);
    row.trigram = jaccard(A, B);
    row.sharedTrigrams = shared(A, B).slice(0, 5);
    const budget = refText.length;
    row.lenDelta = budget ? +(((ourChars - budget) / budget) * 100).toFixed(1) : 0;
  } else {
    row.trigram = 0;        // NOVEL: no counterpart, nothing to overlap with
    row.lenDelta = null;
    row.novel = true;
  }

  row.status = row.fiveGram > FIVEGRAM_MAX || row.trigram > TRIGRAM_MAX ? 'FAIL' : 'PASS';
  row.secFiveGram = sec5.length;
  rows.push(row);
}

/* ------------------------------------------------------------------ report */

const pad = (s, n) => String(s).padEnd(n);
const head = '| route | section | ref# | 5-gram | trigram | max | our chars | ref chars | len Δ% | status |';
console.log(head);
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  console.log(`| ${r.route} | ${r.section} | ${r.ref} | ${r.fiveGram} | ${r.novel ? 'n/a' : r.trigram} | ${TRIGRAM_MAX} | ${r.ourChars} | ${r.refChars} | ${r.lenDelta ?? 'n/a'} | ${r.status} |`);
}

/* metadata gate — same rules, separate table */
const metaRows = [];
for (const [route, m] of Object.entries(copy.meta)) {
  const text = `${m.title} ${m.description}`;
  const five = shared(ngrams(rawTokens(text), 5), REF_META_5).length
    + shared(ngrams(rawTokens(text), 5), SITE_5).length;
  const tri = jaccard(ngrams(filteredTokens(text), 3), REF_META_3);
  metaRows.push({ route, titleLen: m.title.length, descLen: m.description.length, five, tri,
    status: five > FIVEGRAM_MAX || tri > TRIGRAM_MAX ? 'FAIL' : 'PASS' });
}
console.log('');
console.log('| route | title chars | desc chars | 5-gram | trigram vs ref meta | status |');
console.log('|---|---|---|---|---|---|');
for (const r of metaRows) console.log(`| ${r.route} | ${r.titleLen} | ${r.descLen} | ${r.five} | ${r.tri} | ${r.status} |`);
const dupTitles = new Set(Object.values(copy.meta).map((m) => m.title)).size !== Object.keys(copy.meta).length;
const dupDescs = new Set(Object.values(copy.meta).map((m) => m.description)).size !== Object.keys(copy.meta).length;
console.log(`META GATE   : ${metaRows.filter((r) => r.status === 'PASS').length}/${metaRows.length} pass; internal duplicates: ${dupTitles || dupDescs ? 'YES - FAIL' : 'none'}`);

const fails = [...rows.filter((r) => r.status === 'FAIL'), ...metaRows.filter((r) => r.status === 'FAIL')];
const lenFails = rows.filter((r) => r.lenDelta != null && Math.abs(r.lenDelta) > 10);
console.log(`\nLEXICAL GATE: ${rows.length - fails.length}/${rows.length} pass (5-gram <= ${FIVEGRAM_MAX}, trigram <= ${TRIGRAM_MAX})`);
console.log(`LENGTH RULE : ${rows.length - lenFails.length}/${rows.length} within +/-10%`);

if (fails.length) {
  console.log('\nLEXICAL FAILURES');
  for (const r of fails) {
    console.log(`  ${pad(r.route + ' ' + (r.section ?? 'meta'), 26)} 5-gram=${r.fiveGram ?? r.five} ${JSON.stringify(r.fiveGramSample ?? [])} trigram=${r.trigram ?? r.tri} shared=${JSON.stringify(r.sharedTrigrams ?? [])}`);
  }
}
if (lenFails.length) {
  console.log('\nLENGTH DEVIATIONS (> +/-10%)');
  for (const r of lenFails) console.log(`  ${pad(r.route + ' ' + r.section, 26)} ours=${r.ourChars} ref=${r.refChars} delta=${r.lenDelta}%`);
}
if (verbose) {
  console.log('\nMETA');
  for (const [route, m] of Object.entries(copy.meta)) {
    console.log(`  ${pad(route, 10)} title(${m.title.length}) ${m.title}`);
    console.log(`  ${pad('', 10)} desc(${m.description.length}) ${m.description}`);
  }
}

process.exitCode = fails.length ? 1 : 0;
