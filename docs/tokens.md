# Design tokens — the Prompt 5 set

The authoritative copy is the `@theme static { … }` block at the top of
`app/globals.css`. `diff.mjs` parses that block for NOVEL token conformance, and A-6
forbids any section agent from introducing a value that is not in it. **This file is the
summary and the rationale; the CSS is the source.**

Structure extracted from `https://www.nextlevelok.com` (painted-area-weighted over `/`,
`/contact`, `/roof-replacement`). Hue randomised at token-write time per A-7 — see
`docs/known-divergence.md` KD-07 for the seeds and the AA gate.

## Colour — 15 tokens

| token | value | role |
|---|---|---|
| `--color-primary` | `oklch(61.57% 0.1062 216.68)` `#1494ae` | structural brand teal; eyebrow on dark, icon strokes |
| `--color-primary-deep` | `oklch(20.10% 0.0342 215.52)` `#011a20` | the dark band: footer, hero scrim, gradient start |
| `--color-accent` | `oklch(52.48% 0.1729 37.14)` `#b83704` | **the call-now CTA fill.** Highest chroma on every page |
| `--color-accent-deep` | `oklch(41.46% 0.1353 36.99)` `#852604` | CTA hover/press, gradient end, eyebrow on light |
| `--color-surface` | `oklch(100% 0 89.88)` `#ffffff` | page ground |
| `--color-neutral-200` | `oklch(96.04% 0.0283 218.94)` `#def7ff` | light alt band |
| `--color-neutral-400` | `oklch(68.34% 0.0595 216.13)` `#6ea3b1` | **decorative hairlines only.** Never gated, never load-bearing |
| `--color-neutral-600` | `oklch(55.88% 0.0596 216.99)` `#497d8b` | muted text on surface; control edges |
| `--color-neutral-900` | `oklch(3.04% 0.0210 264.05)` `#000001` | body text |
| `--color-border` | = neutral-400 | decorative dividers |
| `--color-border-strong` | = neutral-600 | input and control edges, gated at 3:1 |
| `--color-focus` | `oklch(31.98% 0.1036 37.20)` `#5c1802` | focus ring outer layer |
| `--color-error` | `#b3261e` | **semantic, exempt from rotation** |
| `--color-success` | `#1e7a3c` | **semantic, exempt from rotation** |
| `--color-warning` | `#a15c00` | **semantic, exempt from rotation** |

Two derived values that are not tokens because they are compositions:

- `--gradient-band: linear-gradient(118deg, primary-deep, accent-deep)` — the CTA band and
  hero scrim. Gated as a **gradient** on its worst interpolated stop, never as two flat
  rows.
- The focus ring is **two layers**: `outline: 3px solid var(--color-focus)` at
  `outline-offset: 2px` plus `box-shadow: 0 0 0 2px var(--color-surface)`. That is the only
  construction holding 3:1 against both a white page (13.24:1) and a saturated accent
  button (5.86:1) with one token.

Band contract: every band sets `--fg` and `--fg-muted`, and every text rule reads them. A
band cannot forget to recolour its own contents, which is the class of defect that put a
1.16:1 CTA on all five of Forge's routes.

| band | background | `--fg` | `--fg-muted` |
|---|---|---|---|
| page | surface | neutral-900 | neutral-600 |
| `.t-band--alt` | neutral-200 | neutral-900 | **neutral-900** (grey is 4.11:1 here — see KD-07) |
| `.t-band--dark` | primary-deep | surface | neutral-200 |
| `.t-band--gradient` | gradient band | surface | neutral-200 |

## Type — 13 sizes, 2 weights, 2 families

Measured at 1440 and 390. **Two tiers, switching at 768**, matching the reference's own
`(max-width: 767px)` / `(min-width: 768px)` split. `-m` suffix = mobile tier.

| token | desktop | mobile | reference |
|---|---|---|---|
| `--text-h1` / `--text-h1-m` | 48px | 40px | 48 / 40 |
| `--text-h2` / `--text-h2-m` | 40px | 30px | 40 / 30 |
| `--text-h3` / `--text-h3-m` | 24px | 22px | 24 / 22 |
| `--text-quote` / `--text-quote-m` | 25px | 20px | 25 / 20 |
| `--text-lede` / `--text-lede-m` | 20px | 18px | 20 / 18 |
| `--text-body` | 16px | 16px | 16 |
| `--text-small` | 15px | 15px | 15 |
| `--text-micro` | 12px | 12px | 12 |

**Deliberately not `clamp()`.** NOVEL conformance compares the *computed* font-size against
this set; a fluid scale computes an arbitrary px value at every width and would report a
violation at every breakpoint that is not an endpoint. Stepped tiers keep every rendered
size a token.

- Weights: `--font-weight-normal: 400`, `--font-weight-bold: 700`. The reference uses
  exactly these two — H1/H2 are 400, H3 is 700.
- Families: `--font-display` = Mohave, `--font-body` = Lato, both via `next/font/google`,
  both OFL. **Not substitutions** — see KD-01; there is no font floor on this build.
- Line-height: body `24px` (1.5 at 16px, the reference's value); headings compute `normal`,
  as the reference's do.
- Letter-spacing: `normal` everywhere except `.t-tight` at `-0.012em`, which is the
  reference's FAQ heading (-0.48px at 40px / -0.44px at 30px).

## Radius — 7 values

`--radius-2 / -4 / -5 / -8 / -10 / -16 / -round`. Reference frequencies: 10px ×27 (the
dominant value — buttons, cards, inputs), 4px ×10, 50% ×9, 16px ×8, 5px ×6, 8px ×2, 2px ×2.

## Shadow — 4 values

`--shadow-card` `rgba(0,0,0,.25) 0 3px 11px 0` is the reference's own most common shadow
(10 occurrences); `--shadow-drawer` is their `3px 3px 11px` variant (7 occurrences);
`--shadow-card-hover` and `--shadow-header` are derived, holding the colour and alpha
constant and moving only the geometry.

Declared in **`getComputedStyle`'s serialisation order** — colour first, spread explicit.
Written the human way (`0 3px 11px rgba(…)`), every rendered shadow reads as a token
violation even when the value is identical.

## Spacing — 14 steps

`hair 2 · 3xs 4 · 2xs 7 · xs 8 · s 12 · m 16 · ml 20 · l 24 · xl 32 · 2xl 40 · 3xl 48 ·
4xl 64 · 5xl 80 · 6xl 96`. Reference gap frequencies: 24px (dominant, 45+23 occurrences),
20, 16, 8, 7, 4, 2.

## Layout constants — outside `@theme` on purpose

They are geometry, not design tokens; inside the theme block `diff.mjs` would try to
conform computed values against them.

| constant | value | evidence |
|---|---|---|
| `--container-w` | `92%` | 92% of 390 = 358.8 (measured **359**), of 768 = 706.6 (**707**), of 1440 = 1324.8 (**1325**). The gutter is 4% a side, not a fixed px — this reproduces all three measured widths exactly. |
| `--container-max` | `1325px` | measured outer container at 1440 |
| `--container-text` | `960px` | measured text column at 1440 (~958); their CSS carries a literal `960px` |
| `--header-h` | 177 / 96 / 224px | measured at 390 / 768 / 1440 |
| `--callbar-h` | `80px` | their fixed bottom bar at 390 is 390×80 |
| `--drawer-w` | `min(265px, 86vw)` | their `.hamburger-drawer` is 265px, right-hand, off-canvas |
| `--section-y` | 40 / 64 / 80px | tiered section rhythm |

Motion constants — `--ease-out-quint`, `--ease-in`, `--dur-fast .12s`, `--dur-hover .18s`,
`--dur-panel .32s` — are specified with their reasoning in `docs/behavior/`. Every duration
on the site is one of these; a duration appearing anywhere else is a defect against
`docs/behavior/08-scroll-reveal.md`.

## Breakpoints

`BP_SET = 390 / 768 / 1440` is what is measured. The CSS carries a fourth tier at **1025**
(the reference's own `(min-width: 1025px)`), which is where the inline nav replaces the
hamburger and the header goes 96px → 224px. It is recorded here and in `docs/profile.md`,
and it is **not** a capture axis (cost rule).
