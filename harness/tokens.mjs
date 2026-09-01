/**
 * Token conformance (NOVEL sections, TOKEN_THRESHOLD = 0).
 * Reads the token set from app/tokens.css (Prompt 5). Until that file exists the
 * check reports n/a rather than a false pass.
 */
import fs from 'node:fs';

export const TOKEN_FILE = 'app/tokens.css';

export function loadTokens(file = TOKEN_FILE) {
  if (!fs.existsSync(file)) return null;
  const css = fs.readFileSync(file, 'utf8');
  const set = new Set();
  const map = {};
  for (const m of css.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const name = m[1].trim();
    const value = m[2].trim();
    map[name] = value;
    set.add(norm(value));
  }
  return { set, map, count: Object.keys(map).length };
}

export const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, ' ');

const CHECKED = ['color', 'backgroundColor', 'fontSize', 'fontWeight', 'letterSpacing',
  'lineHeight', 'borderRadius', 'boxShadow', 'gap', 'paddingTop', 'paddingLeft'];

/** Count values in a captured section that resolve to no token. */
export function conformance(section, tokens) {
  if (!tokens) return { status: 'n/a', violations: null, note: 'app/tokens.css not present (Prompt 5 pending)' };
  const violations = [];
  const check = (where, ap) => {
    for (const k of CHECKED) {
      const v = ap[k];
      if (!v || v === 'none' || v === 'normal' || v === 'rgba(0, 0, 0, 0)' || v === '0px' || v === 'auto') continue;
      // A value conforms if it is exactly a token value, or a multiple-free match of one.
      if (!tokens.set.has(norm(v))) violations.push(`${where}.${k}=${v}`);
    }
  };
  check('section', section.appearance);
  (section.headings || []).forEach((h, i) => check(`h${i}`, h.appearance));
  (section.para || []).forEach((p, i) => check(`p${i}`, p.appearance));
  return { status: violations.length ? 'FAIL' : 'PASS', violations: violations.length, sample: violations.slice(0, 8) };
}
