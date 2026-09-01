import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { UA, BP_HEIGHT, SECTION_SELECTOR } from './config.mjs';

export const HARNESS_DIR = '.harness';
export const ensure = (d) => { fs.mkdirSync(d, { recursive: true }); return d; };
export const writeJSON = (p, o) => { ensure(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(o, null, 1)); return p; };
export const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
export const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-'));

export async function openBrowser({ headed = false } = {}) {
  return chromium.launch({ headless: !headed, args: ['--force-color-profile=srgb', '--disable-lcd-text'] });
}

export async function newPageAt(browser, width) {
  const ctx = await browser.newContext({
    viewport: { width, height: BP_HEIGHT[width] || 900 },
    userAgent: UA,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    colorScheme: 'light',
  });
  const page = await ctx.newPage();
  page.on('console', () => {});
  return page;
}

/** Navigate, settle lazy content, freeze animation, return HTTP status. */
export async function gotoStable(page, url, { settle = true } = {}) {
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  const status = resp ? resp.status() : 0;
  try { await page.waitForLoadState('networkidle', { timeout: 30000 }); } catch {}
  if (settle) {
    await page.evaluate(async () => {
      const step = () => new Promise((r) => requestAnimationFrame(r));
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += Math.max(120, window.innerHeight / 3)) { window.scrollTo(0, y); await step(); }
      window.scrollTo(0, 0);
      await step();
    });
    try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
    await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
  }
  await page.addStyleTag({
    content: '*,*::before,*::after{animation-play-state:paused!important;animation-delay:-1ms!important;' +
      'animation-duration:1ms!important;transition-duration:0ms!important;transition-delay:0ms!important;' +
      'scroll-behavior:auto!important;caret-color:transparent!important}',
  });
  return status;
}

/* ---------------------------------------------------------------- in-page */

const PAGE_FNS = [
  'function _box(el){const r=el.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y+window.scrollY),w:Math.round(r.width),h:Math.round(r.height)}}',
  'function _appearance(el){const s=getComputedStyle(el);return{',
  ' color:s.color,backgroundColor:s.backgroundColor,backgroundImage:s.backgroundImage.slice(0,240),',
  ' fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,letterSpacing:s.letterSpacing,',
  ' lineHeight:s.lineHeight,textTransform:s.textTransform,opacity:s.opacity,',
  ' borderTopWidth:s.borderTopWidth,borderBottomWidth:s.borderBottomWidth,borderLeftWidth:s.borderLeftWidth,',
  ' borderRightWidth:s.borderRightWidth,borderTopColor:s.borderTopColor,borderRadius:s.borderRadius,',
  ' boxShadow:s.boxShadow,paddingTop:s.paddingTop,paddingBottom:s.paddingBottom,paddingLeft:s.paddingLeft,',
  ' paddingRight:s.paddingRight,marginTop:s.marginTop,marginBottom:s.marginBottom,display:s.display,',
  ' position:s.position,zIndex:s.zIndex,overflow:s.overflow,flexDirection:s.flexDirection,',
  ' justifyContent:s.justifyContent,alignItems:s.alignItems,gap:s.gap,',
  ' gridTemplateColumns:s.gridTemplateColumns,textAlign:s.textAlign};}',
  'function _label(el,i){const h=el.querySelector("h1,h2,h3");',
  ' const t=(h?h.textContent:el.textContent||"").trim().replace(/\\s+/g," ").slice(0,60);',
  ' const s=t?t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40):"untitled";',
  ' return String(i+1).padStart(2,"0")+"-"+s;}',
].join('\n');

/** Per-section geometry + appearance + inner grid + headings. */
export async function extractSections(page, selector = SECTION_SELECTOR) {
  return page.evaluate(
    ({ sel, fns }) => {
      // eslint-disable-next-line no-eval
      eval(fns);
      const out = [];
      const overlayOf = (el) => {
        let n = el.parentElement, depth = 0;
        while (n && depth++ < 40) {
          const s = getComputedStyle(n);
          if (s.position === 'fixed' || s.position === 'sticky') {
            return { pos: s.position, z: s.zIndex, cls: (n.className || '').toString().slice(0, 60) };
          }
          n = n.parentElement;
        }
        return null;
      };
      const push = (el, i, kind) => {
        const b = _box(el);
        if (b.h < 8) return;
        const overlay = overlayOf(el);
        const widthRatio = +(b.w / window.innerWidth).toFixed(3);
        const headings = [...el.querySelectorAll('h1,h2,h3')].slice(0, 6).map((h) => ({
          tag: h.tagName,
          text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 140),
          chars: h.textContent.trim().length,
          spanCount: h.querySelectorAll('span,[class*=char],[class*=word]').length,
          lines: Math.max(1, Math.round(h.getBoundingClientRect().height / (parseFloat(getComputedStyle(h).lineHeight) || 1))),
          outerHTML: h.outerHTML.slice(0, 800),
          appearance: _appearance(h),
        }));
        const kids = [...el.children].flatMap((c) =>
          c.children.length && c.getBoundingClientRect().height > 20 ? [...c.children] : [c]);
        const grid = kids.slice(0, 24).map((c) => {
          const cb = _box(c);
          return { tag: c.tagName, w: cb.w, h: cb.h, dx: cb.x - b.x, dy: cb.y - b.y };
        });
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        const para = [...el.querySelectorAll('p')].slice(0, 8).map((p) => ({
          chars: p.textContent.trim().length, appearance: _appearance(p),
        }));
        out.push({
          i, kind, id: el.id || null, label: _label(el, i),
          cls: (el.className || '').toString().slice(0, 120),
          overlay, widthRatio, inFlow: !overlay && widthRatio >= 0.9,
          box: b, appearance: _appearance(el), grid, headings, para,
          counts: {
            img: el.querySelectorAll('img').length,
            svg: el.querySelectorAll('svg').length,
            a: el.querySelectorAll('a').length,
            tel: el.querySelectorAll('a[href^="tel:"]').length,
            button: el.querySelectorAll('button,[role=button],[class*=btn],[class*=button]').length,
            iframe: el.querySelectorAll('iframe').length,
            li: el.querySelectorAll('li').length,
            p: el.querySelectorAll('p').length,
            input: el.querySelectorAll('input,select,textarea').length,
          },
          chars: text.length,
          textHead: text.slice(0, 220),
        });
      };
      const header = document.querySelector('header, .dmHeader, [class*="header"]');
      if (header) push(header, -1, 'header');
      [...document.querySelectorAll(sel)].forEach((el, i) => push(el, i, 'section'));
      const footer = document.querySelector('footer, .dmFooter');
      if (footer) push(footer, 999, 'footer');
      return out;
    },
    { sel: selector, fns: PAGE_FNS },
  );
}

/** Page-level profile: height, CSS breakpoints, motion, state, lists, images. */
export async function extractProfile(page) {
  return page.evaluate(({ fns, sel }) => {
    // eslint-disable-next-line no-eval
    eval(fns);
    const cssBreakpoints = new Set();
    let ruleCount = 0, sheetsBlocked = 0;
    for (const sheet of document.styleSheets) {
      let rules; try { rules = sheet.cssRules; } catch { sheetsBlocked++; continue; }
      const walk = (rs) => {
        for (const r of rs) {
          ruleCount++;
          if (r.type === CSSRule.MEDIA_RULE) {
            cssBreakpoints.add(r.conditionText || r.media.mediaText);
            if (r.cssRules) walk(r.cssRules);
          } else if (r.cssRules) walk(r.cssRules);
        }
      };
      walk(rules || []);
    }
    const src = [...document.scripts].map((s) => s.src).filter(Boolean);
    const inline = [...document.scripts].filter((s) => !s.src).map((s) => s.textContent).join('\n');
    const has = (re) => re.test(inline) || src.some((u) => re.test(u));
    const all = [...document.querySelectorAll('*')];
    const sticky = all.filter((e) => {
      const p = getComputedStyle(e).position;
      return p === 'sticky' || p === 'fixed';
    }).slice(0, 40).map((e) => ({
      tag: e.tagName, cls: (e.className || '').toString().slice(0, 70),
      pos: getComputedStyle(e).position, z: getComputedStyle(e).zIndex, box: _box(e),
    }));
    const animated = all.filter((e) => {
      const s = getComputedStyle(e);
      return (s.transitionDuration !== '0s' && s.transitionProperty !== 'none') || s.animationName !== 'none';
    }).length;
    const fontFaces = [];
    for (const sh of document.styleSheets) {
      let rs; try { rs = sh.cssRules; } catch { continue; }
      for (const r of rs || []) {
        if (r.type === CSSRule.FONT_FACE_RULE) {
          fontFaces.push(r.style.getPropertyValue('font-family') + ' :: ' + (r.style.getPropertyValue('src') || '').slice(0, 200));
        }
      }
    }
    return {
      url: location.href,
      title: document.title,
      height: document.documentElement.scrollHeight,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      sectionCount: document.querySelectorAll(sel).length,
      cssBreakpoints: [...cssBreakpoints].sort(),
      ruleCount, sheetsBlocked,
      fonts: [...new Set([...document.querySelectorAll('h1,h2,h3,p,a,button,body')].map((e) => getComputedStyle(e).fontFamily))],
      fontFaces: fontFaces.slice(0, 40),
      motion: {
        animatedElements: animated,
        scrollLinkedLibs: has(/scrollTrigger|gsap|lenis|locomotive|scrollmagic|\baos\b|wow\.js|parallax/i),
        intersectionObserver: has(/IntersectionObserver/),
        scrollListeners: has(/addEventListener\(\s*['"]scroll/),
        rafLoops: has(/requestAnimationFrame/),
        libs: src.filter((u) => /gsap|lenis|locomotive|swiper|slick|aos|framer|three|barba/i.test(u)).slice(0, 12),
      },
      state: {
        navToggle: document.querySelectorAll('[class*=hamburger],[class*=burger],[aria-label*="menu" i],[class*=mobileMenu]').length,
        forms: [...document.querySelectorAll('form')].map((f) => ({
          action: f.getAttribute('action'),
          fields: [...f.querySelectorAll('input,select,textarea')].map((i) => ({
            tag: i.tagName, type: i.type || null, name: i.name || null, required: !!i.required,
          })),
        })),
        accordions: document.querySelectorAll('[class*=accordion],details,[aria-expanded]').length,
        tabs: document.querySelectorAll('[role=tab],[class*="tab-"]').length,
        carousels: document.querySelectorAll('[class*=carousel],[class*=slider],.swiper,.slick-slider').length,
        telLinks: document.querySelectorAll('a[href^="tel:"]').length,
        mailto: document.querySelectorAll('a[href^="mailto:"]').length,
        iframes: [...document.querySelectorAll('iframe')].map((f) => (f.src || f.dataset.src || '').slice(0, 140)),
        sticky,
      },
      lists: [...document.querySelectorAll('ul,ol,[class*=grid]')]
        .map((l) => ({ cls: (l.className || '').toString().slice(0, 60), items: l.children.length }))
        .filter((l) => l.items > 2).slice(0, 30),
      images: [...document.querySelectorAll('img')].slice(0, 80).map((im) => ({
        src: (im.currentSrc || im.src || '').slice(0, 200),
        nw: im.naturalWidth, nh: im.naturalHeight,
        rw: Math.round(im.getBoundingClientRect().width), rh: Math.round(im.getBoundingClientRect().height),
        fit: getComputedStyle(im).objectFit, alt: (im.alt || '').slice(0, 60),
      })),
      auth: /log ?in|sign ?in|password/i.test(document.body.innerText.slice(0, 5000)),
      geo: /navigator\.geolocation/.test(inline),
      fetchAfterLoad: has(/fetch\(|XMLHttpRequest/),
    };
  }, { fns: PAGE_FNS, sel: SECTION_SELECTOR });
}

/** Capture interactive states as their own references. */
export async function captureStates(page, outDir, bp) {
  ensure(outDir);
  const states = [];
  const snap = async (name) => {
    const f = path.join(outDir, `state-${name}.png`);
    await page.screenshot({ path: f, animations: 'disabled', caret: 'hide' });
    states.push({ name, file: f });
  };
  await page.evaluate(() => window.scrollTo(0, 0));
  await snap('header-at-top');
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
  await snap('header-engaged');
  await page.evaluate(() => window.scrollTo(0, 0));
  if (bp < 768) {
    const toggle = await page.$('[class*=hamburger], [class*=burger], [aria-label*="menu" i], [class*=mobileMenu] button');
    if (toggle) {
      try {
        await toggle.click({ timeout: 4000 });
        await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
        await snap('nav-open');
        await page.keyboard.press('Escape');
        await page.evaluate(() => new Promise((r) => setTimeout(r, 400)));
        await snap('nav-closed');
      } catch { states.push({ name: 'nav-open', file: null, note: 'toggle not clickable' }); }
    } else states.push({ name: 'nav-open', file: null, note: 'no toggle found' });
  }
  return states;
}

/** Screenshot a section by its recorded box. Section-relative by construction. */
export async function shotSection(page, box, file) {
  ensure(path.dirname(file));
  const dim = page.viewportSize();
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  const clip = {
    x: Math.max(0, Math.min(box.x, dim.width - 1)),
    y: Math.max(0, Math.min(box.y, Math.max(0, full - 1))),
    width: Math.max(1, Math.min(box.w, dim.width - Math.max(0, box.x))),
    height: Math.max(1, Math.min(box.h, full - Math.max(0, box.y))),
  };
  await page.screenshot({ path: file, clip, fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css' });
  return file;
}
