/**
 * Asset inventory of the reference.
 *
 * Reads every asset slot from four independent sources so nothing is missed:
 *   1. the network log (every image/font/media/video response, with bytes served)
 *   2. <img> / <source> / srcset / currentSrc / <video> / <picture>
 *   3. CSS url() on any element (background-image, mask, border-image, list-style)
 *   4. <link rel=preload|preconnect> and every @font-face src
 *
 * Records the highest resolution ACTUALLY SERVED (from currentSrc + the srcset
 * candidate table + the network log), not the thumbnail.
 *
 * Dominant color is sampled by screenshotting the slot's rect on the rendered page
 * and averaging it. Crops are written OUTSIDE the repo (os.tmpdir()) and deleted at
 * the end of the run: none of the reference's imagery is downloaded into this repo,
 * not even temporarily (D-09).
 *
 * Usage: node harness/assets.mjs [--keep-crops]
 * Writes .harness/assets/<route>-<bp>.json and .harness/assets/slots.json
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { REFERENCE, BP_SET, ROUTE_MAP, SECTION_SELECTOR } from './config.mjs';
import { openBrowser, newPageAt, gotoStable, writeJSON, ensure, slug } from './lib.mjs';

const KEEP = process.argv.includes('--keep-crops');
const CROPS = path.join(os.tmpdir(), 'titan-ref-crops');   // outside the repo, on purpose
const OUT = '.harness/assets';
ensure(OUT); ensure(CROPS);

const isAsset = (ct = '', url = '') =>
  /image|font|video|model|octet-stream/.test(ct) || /\.(png|jpe?g|webp|avif|gif|svg|woff2?|ttf|otf|eot|mp4|webm|glb|gltf)(\?|$)/i.test(url);

async function inventory(browser, route, bp) {
  const m = ROUTE_MAP[route];
  if (!m || !m.refPath) return { route, bp, novel: true, slots: [], network: [] };
  const page = await newPageAt(browser, bp);
  const network = [];
  page.on('response', async (r) => {
    try {
      const ct = r.headers()['content-type'] || '';
      const url = r.url();
      if (!isAsset(ct, url)) return;
      const len = Number(r.headers()['content-length'] || 0);
      network.push({ url, ct, status: r.status(), bytes: len, from: r.request().resourceType() });
    } catch {}
  });

  await gotoStable(page, REFERENCE + m.refPath);

  const dom = await page.evaluate((sel) => {
    const sections = [...document.querySelectorAll(sel)];
    const sectionOf = (el) => {
      const i = sections.findIndex((s) => s.contains(el));
      return i < 0 ? null : i;
    };
    const rect = (el) => { const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
    const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 1 && r.height > 1; };

    // 1. <img>, incl. srcset candidate table
    const imgs = [...document.querySelectorAll('img')].map((im, n) => ({
      kind: 'img', n, section: sectionOf(im), rect: rect(im), visible: visible(im),
      currentSrc: im.currentSrc || im.src || '', srcset: im.getAttribute('srcset') || '',
      sizes: im.getAttribute('sizes') || '',
      natural: { w: im.naturalWidth, h: im.naturalHeight },
      fit: getComputedStyle(im).objectFit, pos: getComputedStyle(im).objectPosition,
      loading: im.loading, alt: (im.alt || '').slice(0, 90),
      radius: getComputedStyle(im).borderRadius,
    }));

    // 2. <picture>/<source> and <video>
    const sources = [...document.querySelectorAll('source')].map((s, n) => ({
      kind: 'source', n, parent: s.parentElement && s.parentElement.tagName,
      srcset: s.getAttribute('srcset') || s.getAttribute('src') || '', type: s.type, media: s.media,
    }));
    const videos = [...document.querySelectorAll('video')].map((v, n) => ({
      kind: 'video', n, section: sectionOf(v), rect: rect(v),
      src: v.currentSrc || v.src || '', poster: v.poster || '', autoplay: v.autoplay, loop: v.loop, muted: v.muted,
    }));

    // 3. CSS url() on any element
    const cssUrls = [];
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      for (const prop of ['backgroundImage', 'maskImage', 'borderImageSource', 'listStyleImage']) {
        const v = s[prop];
        if (!v || v === 'none') continue;
        for (const mm of v.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
          if (!visible(el)) continue;
          cssUrls.push({ kind: 'css', prop, url: mm[2], section: sectionOf(el), rect: rect(el),
            size: s.backgroundSize, pos: s.backgroundPosition, repeat: s.backgroundRepeat,
            tag: el.tagName, cls: (el.className || '').toString().slice(0, 60) });
        }
      }
    }

    // 4. preload / preconnect / font-face
    const links = [...document.querySelectorAll('link')].map((l) => ({
      rel: l.rel, as: l.getAttribute('as'), href: l.href, type: l.type,
    })).filter((l) => /preload|prefetch|preconnect|icon|apple-touch/.test(l.rel));
    const fontFaces = [];
    for (const sh of document.styleSheets) {
      let rs; try { rs = sh.cssRules; } catch { continue; }
      for (const r of rs || []) {
        if (r.type === CSSRule.FONT_FACE_RULE) {
          fontFaces.push({
            family: r.style.getPropertyValue('font-family').replace(/["']/g, ''),
            weight: r.style.getPropertyValue('font-weight'),
            style: r.style.getPropertyValue('font-style'),
            display: r.style.getPropertyValue('font-display'),
            src: r.style.getPropertyValue('src'),
          });
        }
      }
    }

    // inline SVG / icon fonts
    const svgs = [...document.querySelectorAll('svg')].filter(visible).map((s, n) => ({
      kind: 'svg', n, section: sectionOf(s), rect: rect(s),
      stroke: getComputedStyle(s).stroke, strokeWidth: s.getAttribute('stroke-width') || getComputedStyle(s).strokeWidth,
      viewBox: s.getAttribute('viewBox'), childTags: [...s.children].map((c) => c.tagName).slice(0, 5),
    }));
    const iconFontEls = [...document.querySelectorAll('i,span')].filter((e) => {
      const f = getComputedStyle(e).fontFamily.toLowerCase();
      return /icon|fontawesome|material|glyph/.test(f);
    }).length;

    return { imgs, sources, videos, cssUrls, links, fontFaces, svgs, iconFontEls,
      sectionCount: sections.length };
  }, SECTION_SELECTOR);

  // Dominant colour, sampled from the rendered page (never from their asset file).
  const slots = [];
  const sample = async (rec, id) => {
    if (!rec.rect || rec.rect.w < 4 || rec.rect.h < 4) return null;
    const f = path.join(CROPS, `${slug(route)}-${bp}-${id}.png`);
    try {
      const full = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.screenshot({
        path: f, fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css',
        clip: { x: Math.max(0, rec.rect.x), y: Math.max(0, Math.min(rec.rect.y, full - 1)),
          width: Math.max(1, Math.min(rec.rect.w, bp - Math.max(0, rec.rect.x))),
          height: Math.max(1, Math.min(rec.rect.h, full - Math.max(0, rec.rect.y))) },
      });
      const st = await sharp(f).stats();
      const [r, g, b] = st.channels.slice(0, 3).map((c) => Math.round(c.mean));
      const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
      return { hex, rgb: [r, g, b] };
    } catch { return null; }
  };

  for (const im of dom.imgs) {
    if (!im.visible) continue;
    const id = `img${im.n}`;
    slots.push({ ...im, id, dominant: await sample(im, id) });
  }
  for (const v of dom.videos) {
    const id = `video${v.n}`;
    slots.push({ ...v, id, dominant: await sample(v, id) });
  }
  for (const [n, c] of dom.cssUrls.entries()) {
    if (/^data:/.test(c.url)) { slots.push({ ...c, id: `css${n}`, dataUri: true }); continue; }
    const id = `css${n}`;
    slots.push({ ...c, id, dominant: await sample(c, id) });
  }

  const rec = { route, bp, url: REFERENCE + m.refPath, slots, svgs: dom.svgs,
    iconFontEls: dom.iconFontEls, sources: dom.sources, links: dom.links,
    fontFaces: dom.fontFaces, network };
  writeJSON(path.join(OUT, `${slug(route)}-${bp}.json`), rec);
  console.log(`assets ${route} @${bp}: img=${dom.imgs.length} css-url=${dom.cssUrls.length} video=${dom.videos.length} svg=${dom.svgs.length} fontface=${dom.fontFaces.length} network=${network.length}`);
  await page.context().close();
  return rec;
}

const browser = await openBrowser();
const jobs = Object.keys(ROUTE_MAP).flatMap((r) => BP_SET.map((bp) => ({ r, bp })));
const all = [];
let i = 0;
async function worker() { while (i < jobs.length) { const j = jobs[i++]; all.push(await inventory(browser, j.r, j.bp)); } }
await Promise.all([worker(), worker()]);   // MAX_AGENTS = 2
await browser.close();

writeJSON(path.join(OUT, 'slots.json'), { generated: new Date().toISOString(), records: all });
if (!KEEP) fs.rmSync(CROPS, { recursive: true, force: true });
console.log(`SUMMARY assets: ${all.length} passes -> ${OUT}/slots.json ; crops ${KEEP ? 'kept at ' + CROPS : 'deleted (nothing of theirs kept)'}`);
