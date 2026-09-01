/**
 * Dump the reference's body copy per section — the comparison corpus for the Prompt 3
 * lexical gate, and the character-count budget for the length rule.
 *
 * One pass per route at 1440 only. Nothing else is scraped.
 * Writes .harness/reftext/<route>.json
 */
import path from 'node:path';
import { REFERENCE, ROUTE_MAP, SECTION_SELECTOR } from './config.mjs';
import { openBrowser, newPageAt, gotoStable, writeJSON, slug } from './lib.mjs';

const OUT = '.harness/reftext';

const browser = await openBrowser();
const routes = Object.entries(ROUTE_MAP).filter(([, m]) => m.refPath);

for (const [route, m] of routes) {
  const page = await newPageAt(browser, 1440);
  await gotoStable(page, REFERENCE + m.refPath);
  const data = await page.evaluate((sel) => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    // Duda inlines JSON-LD and widget config as text inside sections; strip it.
    const isJunk = (t) => !t || t.length < 2 || /^[{[]|@context|SSRRuntime|waitForDeferred|initiateWidget|function\s*\(/.test(t);
    return [...document.querySelectorAll(sel)].map((el, i) => {
      const grab = (q) => [...el.querySelectorAll(q)].map((n) => clean(n.textContent)).filter((t) => !isJunk(t));
      const headings = [...el.querySelectorAll('h1,h2,h3,h4')].map((h) => ({
        tag: h.tagName, text: clean(h.textContent), chars: clean(h.textContent).length,
      })).filter((h) => !isJunk(h.text));
      const paras = grab('p').filter((t) => t.length > 1);
      const items = grab('li');
      const ctas = [...el.querySelectorAll('a,button')].map((a) => clean(a.textContent))
        .filter((t) => t && t.length < 40 && !isJunk(t));
      const body = [...paras, ...items].join(' ');
      return {
        i,
        headings, paras, items, ctas: [...new Set(ctas)].slice(0, 12),
        chars: { headings: headings.reduce((a, h) => a + h.chars, 0), body: body.length,
          paras: paras.map((p) => p.length), items: items.length },
        body,
      };
    }).filter((s) => s.headings.length || s.paras.length || s.items.length);
  }, SECTION_SELECTOR);
  const f = writeJSON(path.join(OUT, `${slug(route)}.json`), { route, refPath: m.refPath, sections: data });
  console.log(`reftext ${route}: ${data.length} sections, ${data.reduce((a, s) => a + s.chars.body, 0)} body chars -> ${f}`);
  await page.context().close();
}
await browser.close();
