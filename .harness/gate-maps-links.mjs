import { chromium } from 'playwright';
const base = 'http://localhost:3100';
const routes = ['/', '/about', '/services', '/contact', '/privacy'];
const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

// --- gate 6: maps ---
for (const r of ['/', '/contact']) {
  await page.goto(base + r, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  const frames = await page.$$eval('iframe', (els) => els.map((e) => ({
    src: e.getAttribute('src'), title: e.getAttribute('title'), loading: e.getAttribute('loading'),
  })));
  const dirs = await page.$$eval('a[href*="maps/dir"]', (els) => els.map((e) => e.href));
  console.log('MAP', r, JSON.stringify(frames), 'directions:', JSON.stringify(dirs));
}

// --- gate 7: internal link crawl ---
const seen = new Map();
const anchors = new Set();
for (const r of routes.concat(['/nope-404'])) {
  await page.goto(base + r, { waitUntil: 'domcontentloaded' });
  const links = await page.$$eval('a[href]', (els) => els.map((e) => ({ href: e.getAttribute('href'), abs: e.href })));
  for (const l of links) {
    if (l.href.startsWith('#')) anchors.add(r + ' -> ' + l.href);
    else if (l.abs.startsWith(base)) seen.set(new URL(l.abs).pathname, (seen.get(new URL(l.abs).pathname) || 0) + 1);
  }
  // in-page anchor targets must exist
  const bad = await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="#"]'))
    .map((a) => a.getAttribute('href'))
    .filter((h) => h !== '#' && !document.querySelector(h.replace(/^#/, '#')))
  );
  if (bad.length) console.log('DEAD ANCHOR', r, bad);
}
const statuses = [];
for (const p of [...seen.keys()]) {
  const res = await page.request.get(base + p);
  statuses.push(`${p} ${res.status()} (${seen.get(p)} links)`);
}
console.log('CRAWL', JSON.stringify(statuses, null, 0));
const orphans = routes.filter((r) => !seen.has(r));
console.log('ORPHANS', JSON.stringify(orphans));

// --- gate 9: reduced motion ---
const rm = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
await rm.goto(base + '/', { waitUntil: 'networkidle' });
const moving = await rm.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const d = (s) => s.split(',').map((x) => parseFloat(x) || 0);
    const td = Math.max(...d(cs.transitionDuration), ...d(cs.animationDuration));
    if (td > 0.05) out.push(el.tagName + '.' + String(el.className).slice(0, 40) + ' ' + cs.transitionDuration + '/' + cs.animationDuration);
  }
  return out.slice(0, 10);
});
console.log('REDUCED-MOTION residual animations:', moving.length, JSON.stringify(moving));

// --- gate 8 support: keyboard order/focus visibility ---
await page.goto(base + '/contact', { waitUntil: 'networkidle' });
const order = [];
for (let i = 0; i < 14; i++) {
  await page.keyboard.press('Tab');
  order.push(await page.evaluate(() => {
    const a = document.activeElement;
    const cs = getComputedStyle(a);
    return `${a.tagName}${a.id ? '#' + a.id : ''}:${(a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 22)} [outline ${cs.outlineWidth}]`;
  }));
}
console.log('TABORDER', JSON.stringify(order, null, 0));
await b.close();
