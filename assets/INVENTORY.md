# Asset inventory

Source: `harness/assets.mjs`, 15 passes (4 routes × 390/768/1440), reading four
independent channels so nothing is missed — the network log (97 distinct asset
responses), `<img>` / `<source>` / `srcset` / `currentSrc` / `<video>`, CSS `url()` on
every visible element, and `<link rel=preload>` plus every `@font-face` rule. Raw
records: `.harness/assets/*.json`.

Dominant colour is sampled by screenshotting the slot's rect **on the rendered reference
page** and averaging it. Those crops are written to the OS temp dir, outside this repo,
and deleted at the end of the run. **No reference photo, logo, badge, or font file has
been downloaded into this repo, not even temporarily** (D-09).

- **No video anywhere.** `<video>` count is 0 on all four pages at all three widths. The
  CTA band mounts a click-to-play wrapper (`.vidWrapper`, 220×184) over a static poster
  image; we ship the poster slot only. No video in this build.
- **No `srcset`.** Duda serves one URL per `<img>` and swaps variants by URL suffix
  (`-200w` / `-300w` / `-640w` / `-1920w` / `-2880w`). "Highest served" below is the
  widest variant seen in the network log for that stem, not the thumbnail.
- **`next/image` remote patterns: none.** Everything local.

## Provenance summary

| provenance | what | count |
|---|---|---|
| **TAKE** | Mohave (display) + Lato (body), both SIL OFL, via `next/font/google` | 2 families |
| **TAKE** | UI icons — `lucide-react`, matched on size and stroke width, not glyph | 5 icon sizes |
| **REPLACE** | every reference photograph, their logo/wordmark, 11 partner badge marks, 5 stock blog images, their favicon, their Ionicons webfont | 30 slots |

### TAKE — fonts, license verified in one step

| family | role | license | evidence | how we load it |
|---|---|---|---|---|
| **Mohave** | display / all headings | **SIL OFL** | `google/fonts` → `ofl/mohave/METADATA.pb` → `license: "OFL"` | `next/font/google` |
| **Lato** | body, buttons, nav | **SIL OFL** | `google/fonts` → `ofl/lato/METADATA.pb` → `license: "OFL"` | `next/font/google` |

The reference self-hosts both from `cdn.hibuwebsites.com`. We do not touch those files —
we load the same families from their open-licensed upstream. See
`docs/known-divergence.md` for the full reasoning and for the substitute held on standby.

Also loaded by the reference but carrying no rendered text we clone, so not acquired:
Poppins (testimonial card body), Be Vietnam, Kumbh Sans, Questrial, Open Sans,
Schibsted Grotesk, Source Sans Pro — 18 `@font-face` rules in total.

### TAKE — icons

The reference mixes inline filled SVG paths with an **Ionicons** webfont
(`fonts/ionicons.ttf`, 110,019 B, 33 elements using it). We take neither file. Per the
allowlist we use `lucide-react` and match **size and stroke width, not the glyph**:

| where | ref section | rendered size | ref style | ours |
|---|---|---|---|---|
| mobile drawer | 3 | 30×30 | filled path, `viewBox 0 0 100 100` | lucide 30px, stroke 2 |
| trust row | 9 | 60×60 | filled path | lucide 60px, stroke 2 |
| testimonials | 15 | 60×60 | filled, multi-path | lucide 60px, stroke 2 |
| FAQ accordion chevron | 16 | 24×24 | filled, `viewBox 0 0 1152 1792` | lucide 24px, stroke 2 |
| CTA band | 19 | 100×100 | filled | lucide 100px, stroke 2 |

Reference icons are **filled**; lucide is **stroked**. That is a deliberate, recorded
appearance difference, not a divergence to iterate on — logged in
`docs/known-divergence.md`.

## REPLACE — slot table

`ar` = aspect ratio at 1440. `fit` = `object-fit` (or `background-size` for CSS slots).
Status is `PLACEHOLDER` on every row: Prompt 10 writes the generation prompts and the
files arrive after acceptance (OVERRIDE 3).

### Shared shell

| slot ID | route | section | 390 | 768 | 1440 | ar | fit | dominant | provenance | status |
|---|---|---|---|---|---|---|---|---|---|---|
| `logo-header` | all | header | 190×76 | 180×72 | 250×100 | 2.50 | contain | `#3c5b76` | REPLACE | PLACEHOLDER — wordmark set in Mohave; `TODO(fact): logo asset` |
| `logo-footer` | all | footer-nap | 198×79 | 188×75 | 171×68 | 2.51 | contain | `#3c5b76` | REPLACE | PLACEHOLDER |
| `favicon` | all | head | 32×32 | 32×32 | 32×32 | 1.00 | contain | `#3c5b76` | REPLACE | PLACEHOLDER — theirs is `site_favicon_16_*.ico` |
| `home-cta-media` | all | cta-band | 359×298 | 339×298 | 636×298 | 2.13 | cover | `#6f655a` | REPLACE | PLACEHOLDER — **video poster only**, no video |

### `/` home

| slot ID | section | 390 | 768 | 1440 | ar | fit | dominant | highest served | status |
|---|---|---|---|---|---|---|---|---|---|
| `home-hero-bg` | hero | 390×1000 | 768×1004 | 1440×820 | 1.76 | cover, `50% 0%` | `#69666b` | 1920w | PLACEHOLDER — **aspect flips 0.39 → 0.76 → 1.76**, portrait crop generated |
| `home-trust-img` | trust-row | 311×227 | 311×227 | 360×223 | 1.61 | cover, radius 30px | `#8c8c88` | 432w | PLACEHOLDER |
| `home-svc-a-img` | svc-a | 327×236 | 337×243 | 659×400 | 1.65 | cover, radius 25px | `#7d8380` | 474×342 | PLACEHOLDER |
| `home-svc-b-img` | svc-b | 327×218 | 337×224 | 659×400 | 1.65 | cover, radius 25px | `#9c9e89` | 1200×800 | PLACEHOLDER |
| `home-svc-c-img` | svc-c | 327×217 | 337×224 | 659×400 | 1.65 | cover, radius 25px | `#9c938d` | 1920×1275 | PLACEHOLDER |
| `home-project-1` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#6d6e6e` | 640w | PLACEHOLDER |
| `home-project-2` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#9e9996` | 640w | PLACEHOLDER |
| `home-project-3` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#b8b8b7` | 2304w | PLACEHOLDER |
| `home-project-4` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#8f8f8e` | 1920w | PLACEHOLDER |
| `home-project-5` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#7f8285` | 1920w | PLACEHOLDER — off-screen slider item, colour inherited |
| `home-project-6` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#8a8781` | 1920w | PLACEHOLDER — off-screen slider item, colour inherited |
| `home-project-7` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#6d6e6e` | 640w | PLACEHOLDER — off-screen slider item, colour inherited |
| `home-project-8` | projects | 252×200 | 194×200 | 378×300 | 1.26 | cover | `#9e9996` | 640w | PLACEHOLDER — off-screen slider item, colour inherited |
| `home-map-poster` | map | 359×300 | 707×300 | 1325×360 | 3.68 | cover | `#dfe3d8` | — | OURS-NEW — static poster behind the lazy map iframe (D-08) |

### `/about`

| slot ID | section | 390 | 768 | 1440 | ar | fit | dominant | status |
|---|---|---|---|---|---|---|---|---|
| `about-story-img` | story | 359×192 | 707×378 | 395×211 | 1.87 | contain | `#cadded` | PLACEHOLDER — the reference renders its own logo in this slot; ours is a photo slot |
| `about-credentials-1..3` | credentials | 179×100 | 147×147 | 265×100 | 2.65 | contain | `#e8eaee` | PLACEHOLDER — `TODO(fact)` chips at badge-strip dimensions (D-14) |

### `/services` (reference page `/roof-replacement`)

| slot ID | section | 390 | 768 | 1440 | ar | fit | dominant | highest served | status |
|---|---|---|---|---|---|---|---|---|---|
| `services-hero-bg` | hero | 390×758 | 768×846 | 1440×676 | 2.13 | cover | `#86716b` | 1920w | PLACEHOLDER — **aspect flips 0.51 → 0.91 → 2.13**, portrait crop generated |
| `services-item-1..8` | list | 327×218 | 337×224 | 659×400 | 1.65 | cover, radius 25px | `#8b8b87` | — | OURS-NEW — inherits the home service-feature geometry from the section vocabulary |

### `/contact`

| slot ID | section | 390 | 768 | 1440 | ar | fit | dominant | status |
|---|---|---|---|---|---|---|---|---|
| `contact-map-poster` | map | 359×300 | 707×300 | 636×300 | 2.12 | cover | `#dfe3d8` | OURS-NEW — poster behind the lazy iframe |

The reference's `/contact` map is a Leaflet/OpenStreetMap embed whose only image assets
are the library's own `marker-icon.png` (25×41) and `earth_thumb.png` (30×30). We take
neither — ours is a keyless Google coords embed per D-07 with a lucide pin.

### `/privacy`

No image slots. NOVEL route, text only.

## Deleted reference slots — inventoried, never built

Recorded so nobody re-adds them by reading the reference again.

| ref slot | section | 1440 | why it is gone |
|---|---|---|---|
| 11 × partner badge marks (`certainteedlogo`, `tamko-logo-content`, `holcim-elevate`, `images`, 7 × `gallery-superior-plumbing-*`) | logo strip, every page | 1325×100 band, 265×100 each | D-09 — eleven other companies' trademarks |
| 5 × stock blog images (`RSshutterstock_*`) | blog posts | 428×190, ar 2.25 | D-01 — no blog route; also licensed stock |
| `coupon-image-next-level-roofing` | discounts band | 691×524 | D-14 — invented discount and credential claims |
| `site_favicon_16_*.ico` | head | 16×16 | D-09 — their mark |
| `fonts/ionicons.ttf` | icons | 110,019 B | replaced by `lucide-react` |

## Placeholders

`node scripts/placeholders.mjs` → **32 slots, 50 files** in `public/placeholders/`, plus
`manifest.json`. Each file is dominant-colour fill, slot ID, and pixel dimensions as
text — nothing else. No external placeholder service, no network dependency, no runtime
cost.

A second `-m.svg` file is generated **only where the aspect ratio actually changes across
390/768/1440** (ratio spread > 1.15) — the same rule Prompt 10 uses to decide whether a
slot needs a second crop. 18 slots need one; `home-hero-bg` and `services-hero-bg` are
the two that matter, flipping from tall portrait on a phone to landscape on desktop.

Placeholder slots are a **known, tracked gap** — `docs/known-divergence.md` lists them as
permanent floors until the generated files arrive. Never spend an iteration closing one.

---

## Asset drop-in — OVERRIDE 3, terminal step

Owner handed back a logo and six photographs. What landed, and what is still a
placeholder floor.

### DELIVERED

| slot ID | file | source | note |
|---|---|---|---|
| `logo-header` | `logo-header.png` 1037×300 | supplied logo, recomposed | icon + wordmark cut from the square mockup and set as a horizontal lockup; flat `--color-primary-deep` `rgb(1,26,32)`, alpha carries the artwork, no white card |
| `logo-footer` | `logo-footer.png` 1037×300 | same | white lockup for the `--color-primary-deep` NAP band |
| `favicon` | `favicon.png` 512×512 | same | house/G icon only, centred on a transparent square |
| `home-hero-bg` | `home-hero-bg.jpg` 1376×784 · `-m.jpg` 896×1184 | supplied | both crops supplied; ratios match the slot's 1.76 / portrait flip |
| `services-hero-bg` | `services-hero-bg.jpg` 1504×704 | supplied | `-m.jpg` 780×1516 **derived** by centre-crop — no portrait crop was handed back |
| `home-trust-img` | `home-trust-img.jpg` 720×446 · `-m.jpg` 622×454 | supplied 1408×768 | recropped to the slot's 1.61 / 1.37 |
| `home-svc-b-img` | `home-svc-b-img.jpg` 1328×800 | supplied | 1.66 vs slot 1.65 |
| `home-svc-c-img` | `home-svc-c-img.jpg` 1328×800 | supplied | 1.66 vs slot 1.65 |
| `home-project-1..8` | `home-project-N.jpg` 756×600 · `-m.jpg` 388×400 | one supplied photo | **all eight slots carry the same photograph** — only one project image was handed back |

Originals kept out of `public/` at `assets/source/`: `logo-original.jpg`,
`home-project-source.jpg`. They are not served.

### STILL PLACEHOLDER — unchanged floors

`home-svc-a-img`, `home-cta-media`, `about-story-img`, `about-credentials-1..3`,
`services-item-1..8`, `home-map-poster`, `contact-map-poster`. Prompts for all of
them are already written in `docs/asset-prompts.md`.

### Two things the owner should look at

- Eight identical project thumbnails read as a rendering bug rather than a
  gallery. Seven more photos, or drop the slider to one.
- The `/services` mobile hero is a centre-crop of the desktop landscape, so it
  is much tighter than the composition that was designed. A real portrait crop
  would be better.
