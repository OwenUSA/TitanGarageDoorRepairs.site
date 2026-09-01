# Known divergence — permanent floors

Everything here is a **decision or a licensing constraint, not a defect**. Check this
file before starting any fix. Never spend an iteration closing one of these, and never
report one as a failure. Sections blocked by a row below are measured with the blocked
area excluded and reported separately.

Opened at Prompt 2. Prompt 9 appends the palette record; Prompt 11 finalises.

---

## KD-01 — Typography: Mohave and Lato are TAKEN, not substituted

**Status: no font floor exists on this build.** This is a deviation from the working
assumption going in, so the evidence is written out in full.

The brief anticipated that the reference self-hosts a licensed display face and that
D-11 would force a substitution with a permanent text-metric floor. It self-hosts the
files, but the **families are not licensed** — both are SIL Open Font License, verified
in one step each:

| family | role | check | result |
|---|---|---|---|
| Mohave | display / headings | `google/fonts` → `ofl/mohave/METADATA.pb` | `license: "OFL"`, designer Gumpita Rahayu, added 2020-01-23 |
| Lato | body | `google/fonts` → `ofl/lato/METADATA.pb` | `license: "OFL"`, designer Łukasz Dziedzic, added 2010-12-15 |

Both resolve through `next/font/google` (`fonts.googleapis.com/css2?family=…` returns
200 for each). We therefore load the **same two families the reference renders**, from
their open upstream, and **no file is lifted from `cdn.hibuwebsites.com`** — D-09 and
D-11 are both satisfied. Acquisition lives in `lib/fonts.ts`; Prompt 5 wires it into the
root layout.

D-11's substitution rule is conditional — *"if the reference self-hosts a **licensed**
font"*. That condition is not met, so manufacturing a substitution would have invented a
permanent floor we do not have to carry, and would have cost real fidelity on every
heading on all five routes.

**Substitute on standby.** If Mohave ever has to be dropped, the replacement is
**Archivo Narrow** (OFL, `next/font/google`) — the closest open condensed-display match
to Mohave's semi-condensed geometric skeleton. It is *not* in use. If it ever is, the
resulting text-metric delta becomes a permanent floor at that moment, recorded here, and
never iterated against.

## KD-02 — Icons are stroked, the reference's are filled

The reference draws icons as **filled** SVG paths plus an **Ionicons** webfont
(`ionicons.ttf`, 110 KB, 33 elements). We ship neither: `lucide-react` per the allowlist,
matched on **size and stroke width, not glyph** — 30 / 60 / 24 / 100 px at stroke 2,
mapped in `assets/INVENTORY.md`.

A stroked icon has less filled area than a solid one, so every section carrying an icon
holds a small permanent pixel residual. **Floor. Do not iterate.** Affected sections:
home `trust-row` (6 × 60px), home `testimonials` (60px), `/services` `faq` (8 × 24px),
shell `drawer` (30px), shared `cta-band` (100px).

## KD-03 — Every photographic slot is a placeholder until after acceptance

30 REPLACE slots and 11 OURS-NEW slots render as generated SVG from
`public/placeholders/` — dominant-colour fill, slot ID, pixel dimensions. Per OVERRIDE 3
the real files arrive **after** Prompt 11 acceptance: Prompt 10 writes the generation
prompts, the owner runs them, and drop-in is the terminal step.

Until then, every section below is **placeholder-blocked**. Measure it with the
placeholder area excluded and report it as a floor, never as a fixable divergence:

| route | section | slots |
|---|---|---|
| all | header, footer-nap | `logo-header`, `logo-footer`, `favicon` |
| all | cta-band | `home-cta-media` (poster only — no video in this build) |
| `/` | hero | `home-hero-bg` |
| `/` | trust-row | `home-trust-img` |
| `/` | svc-a / svc-b / svc-c | `home-svc-{a,b,c}-img` |
| `/` | projects | `home-project-1..8` |
| `/` | map | `home-map-poster` |
| `/about` | story | `about-story-img` |
| `/about` | credentials | `about-credentials-1..3` |
| `/services` | hero | `services-hero-bg` |
| `/services` | list | `services-item-1..8` |
| `/contact` | map | `contact-map-poster` |

## KD-04 — The wordmark is type, not a file

No logo asset exists. Until one is handed over, the wordmark is **set in Mohave** at the
measured slot dimensions (250×100 @1440, 180×72 @768, 190×76 @390, ar 2.50). Logged as
`TODO(fact): logo asset` in `docs/facts-needed.md`. The header and footer logo slots
therefore cannot close on pixel diff, by construction.

## KD-05 — Third-party runtime the reference has and we do not

Not divergence to fix; deliberate omissions under D-15, D-05, D-03, and D-09. They
change section geometry in places, and that is expected:

| theirs | ours | authority |
|---|---|---|
| Google reCAPTCHA, 3 iframes + badge | none | D-15 |
| Fixed chat/CTA widget (`aside.ae-module`) | none | D-15 |
| Contact modal overlay (z 20, full viewport) | none | D-05 |
| Fixed bottom promo bar (390×80) | our mobile `tel:` call bar instead | D-04 |
| 11-mark partner logo strip, every page | deleted | D-09 |
| Blog section + 5 stock images | deleted | D-01 |
| Discounts / coupon band | deleted | D-14, D-06 |
| Leaflet/OpenStreetMap embed on `/contact` | keyless Google coords embed, two maps | D-07, D-08 |
| Email field in both forms; Ionicons webfont | neither | D-03; allowlist |

## KD-06 — Reference contrast defect we are not cloning

Reference CTA anchors compute `color: rgb(0, 0, 238)` — the UA default link blue — on
their `rgb(197, 23, 22)` red fill. That fails WCAG AA badly. Ours is AA per D-19, so the
CTA's resolved text colour will differ from the reference on every page. Intentional.

## KD-07 — Colour: the palette is randomised, and colour is terminal

Written at the merged Prompt 5 + 9 turn. Per amendment A-7 the palette is randomised **at
token-write time**, so this site is built in its final colours from the first component
onward. There is no recolour pass, no candidate crop render, no contact sheet, and no
geometry/typography regression table — there is no recolour for a regression table to
prove innocent.

### The extracted reference ramp (structure), and what happened to it

Painted-area-weighted extraction from `nextlevelok.com` over `/`, `/contact` and
`/roof-replacement`. Every **L** and every **C** below is held EXACTLY; only **H** moved.

| token | reference | L | C | H | ours (seed 260721) |
|---|---|---|---|---|---|
| `primary` | `rgb(27,139,215)` `#1b8bd7` | 0.6158 | 0.1476 | 245.4 | `#1494ae` |
| `primaryDeep` | `rgb(1,24,40)` `#011828` | 0.1998 | 0.0444 | 240.8 | `#011a20` |
| `accent` (their CTA) | `rgb(197,23,22)` `#c51716` | 0.5252 | 0.2041 | 28.2 | `#b83704` |
| `accentDeep` | `#8e1010` (derived) | 0.4141 | 0.1587 | 27.8 | `#852604` |
| `neutral0` | `#ffffff` | 1.0000 | 0 | — | `#ffffff` |
| `neutral200` | `#f2f2f2` | 0.9612 | 0 | — | `#def7ff` |
| `neutral400` | `#999999` | 0.6830 | 0 | — | `#6ea3b1` |
| `neutral600` | `#747474` | 0.5590 | 0 | — | `#497d8b` |
| `neutral900` | `#000000` | 0.0000 | 0 | — | `#000001` |

Neutrals carry a **C 0.059** tint of the primary hue (inside the mandated 3-6% band); pure
grey reads cheap beside a tinted ramp. `neutral400` is DECORATIVE only and is not gated;
`neutral600` doubles as `border-strong` and is gated at 3:1.

### The five candidates, and the winner

`masterSeed` **3203** (was 3100 — see the collision note below). 9 rolls, 4 rejected,
5 survivors. Reproduce any of them exactly with
`node ../_shared/harness/src/palette.mjs --seed <n>`.

| seed | scheme | primary H | accent H | neutral C | CTA contrast | CTA chroma | |
|---|---|---|---|---|---|---|---|
| **260721** | complementary (+180) | **217** | **37** | 0.059 | **5.86** | 0.1729 | **WINNER** |
| 274299 | triadic (-120) | 267 | 147 | 0.056 | 5.01 | 0.1539 | |
| 955554 | analogous (-30) | 161 | 131 | 0.047 | 5.13 | 0.1418 | |
| 300175 | split-complementary (+150) | 115 | 265 | 0.050 | 5.67 | 0.2049 | |
| 579843 | complementary (+180) | 69 | 249 | 0.040 | 5.41 | 0.1414 | |

Selection is the rule from OVERRIDE 1 / A-7, applied programmatically: the survivor whose
**call-now CTA has the highest contrast against its background** wins, ties to the lowest
seed. 5.86:1 was the highest and there was no tie. The four rejected rolls failed on the
same gate the survivors passed — every fg/bg pair actually in use at AA, CTA highest
contrast and highest chroma, semantic hues held, focus ring 3:1, neutral ramp monotonic.

**Identity: teal + rust.** Primary hue 217 (`#1494ae`) with a rust accent at hue 37
(`#b83704`). This is deliberately distinct from the other sites in the programme — Atlas is
plum/crimson (seed 500656) and Forge is a green/dark ramp (seed 1005) — so the three do not
read as one template recoloured.

**Why `masterSeed` moved from 3100 to 3203.** At 3100 the winner was seed 909540: primary
hue 353, accent hue 323 — a plum/magenta ramp that collides directly with Atlas. Re-rolled
per instruction. Worth recording, because it is structural rather than bad luck: the
selection rule maximises white-on-accent contrast, and at a fixed OKLCH L and C the lowest
relative luminance sits around hue 300-360, so the auto-selector is biased toward
magenta/red accents. Steering was done on the **masterSeed** only; the selection rule
itself was not touched.

### Gate result — every pair actually in use

24 pairs, defined in `harness.config.mjs -> pairsInUse` and mirrored by
`app/globals.css -> @theme`. All 24 PASS. Full table in the Prompt 5 report; the two
tightest are `input-edge-on-alt` at 4.11:1 (a 3:1 UI pair) and `muted-on-surface` at
4.58:1 (a 4.5 text pair).

One pair is modelled as a **gradient**, not as two flat rows: the CTA band / hero scrim
runs `primaryDeep -> accentDeep`, is sampled at 5 interpolated OKLCH points, and is gated
on the **worst** stop (9.23:1 for `--color-surface`). Flat-modelling a ramp is exactly how
Atlas shipped a CTA whose label was painted in its own background colour while its audit
reported 23/23 pairs passing.

One pair was **removed** rather than gated: muted grey on the light alt band. `neutral600`
on `neutral200` is **4.23:1 in the reference's own ramp**, so no hue rotation can rescue
it. On the alt band, secondary text is `neutral900` at normal weight and never grey. That
is a design decision, recorded here so nobody reintroduces it.

### The rule this creates

**Colour divergence from the reference is intentional and is permanently excluded from
every diff, every threshold, and every future iteration.** Per A-8 the structural
comparator strips resolved colour, background-colour, border-colour, gradient stops and
shadow colour before scoring; the non-colour parts of borders and shadows (widths, offsets,
blur, spread, radii) are kept. Any FIDELITY section that is a solid-colour band would read
100% divergent forever once recoloured — such a section is measured structurally instead,
and which treatment it got is written on its row.

Geometry and typography did not move at this turn: the palette was written before any
component existed, so there is nothing for a recolour to have disturbed.

## KD-08 — Shell structural floors, measured at the merged Prompt 5 turn

The shared shell was built, measured, given its **one** fix attempt (A-2), and floored.
Colour is excluded from every number below (A-8); the advisory fields `innerCount`,
`innerRows`, `innerCols` and `position` are reported but do not contribute (A-12).

| section | ref id | 390 | 768 | 1440 | threshold | status |
|---|---|---|---|---|---|---|
| `header` | `ac810934` | 4.47 (home) / 7.87 | 8.83 / 11.41 (`/about`) | 6.62 | 5 | floored |
| `footer-nap` | `e4ad708c` | 13.25 | 13.35 | **13.12** (was 14.54) | 5 | floored |
| `footer-links` | `c52c188e` | 17.62 | 19.40 | 17.47 | 5 | floored |
| `callbar` | — | UNPAIRED | UNPAIRED | UNPAIRED | — | NOVEL, no counterpart |
| `stub` (scaffold) | — | 0 token violations | | | 0 | PASS |

**The one attempt, and what it bought.** The NAP band measured 271px at 1440 against the
reference's 178px: the section rhythm (`--section-y`, 80px at the desktop tier) is right
for a content band and far too tall for a three-column footer strip. Pinning
`[data-section="footer-nap"]` to `--spacing-xl` block padding above 1025 took the band to
~178px and the deviation from 14.54% to 13.12%. **That was attempt 1 of 1. Floored.**

**Best hypothesis for the residual**, offered so the wave does not re-derive it. Band
heights are already close — header 178/97/225 against their 177/96/220, footer-links
129 against 127 at 1440 and 185 against 175 at 390 — and the advisory row on
`footer-links` reads *"none diverge"*, so the inner grid agrees too. What is left is
almost entirely **type and rhythm inside the band**: their footer sets Lato at 15px/700
with 33px and 36px line-heights and their own vertical gaps, ours sets the Prompt 5 scale
(16px body, 22px `--text-h3-m` headings, 24px line-height, 24px gaps). The information in
the band is different by decision — one SERVICE_AREA sentence instead of a city list, five
routes instead of four service pages, no "24/7 Emergency" claim — so closing the type
metrics would mean fitting our copy to their column, which is the ADAPTED trap
`process.md` names. **Do not iterate on these three rows.**

The `position ref=static ours=sticky` advisory on the header is `docs/behavior/02` working
as designed: their header is `fixed`, ours is `sticky` so page height stays comparable.
Advisory, deliberate, and permanently excluded.

## KD-09 — The contract table the harness parses is a SECOND table

`docs/sections.md` shipped its human tables in the column order
`route | id | our section | ref page | ref# | class | reason`. The shared harness parses
`route | ref section id | our section id | CLASS | reason`, and it also needs the
reference's **section id** (`e4ad708c`), not the ordinal `ref#`.

Measured effect before the fix: **zero rows matched**, so every section defaulted to
FIDELITY and the diff reported 80 failures, including page-height rows on `/privacy`
scored against the reference's home page. After appending a machine-readable table in the
parser's order with the canonical ids filled in: **87 rows, 149 class keys, 62 aliases**,
and the failure count fell to 50 — almost all of which are page-height rows that exist
only because the routes are still Prompt 5 stubs.

The two tables must be edited together. This is written here rather than fixed in the
shared package because the package's format is the one four other sites already use;
sharing the instrument means this site conforms to it (A-11).

Two mappings are genuinely absent rather than wrong, and are floors for the wave:

- `/services::faq` is relocated from the reference's **home** page. The harness pairs
  within a route, so it will report UNPAIRED forever. Measure it by hand against home
  `090e14dc-frequently-asked-questions` or floor it; do not chase it.
- `/privacy` has no reference page at all, so its page-height row is meaningless. Every
  `/privacy` section is NOVEL and measured once by token conformance (A-9).

## KD-10 — The shared CTA band carries one `tel:` link the reference does not

Opened at the merged Prompt 6+7 wave, by the lead, on the section the lead owns.

The comparator's `buttons` field counts
`a[href^="tel:"], button, [class*=btn], [class*=button]`. The reference's
`9328cbef-learn-more-about` band computes **0** — their two calls to action are plain
anchors to other pages. Ours is a call band: D-04 makes every rendered phone number a
dialable `tel:` link, and this band exists to be called from. So ours computes **1**.

One field of twenty-three at 100% is **4.35%** of the deviation, and that is the *entire*
residual: every other blocking field on this band — box width and height, all four
paddings, font size, weight, line-height, letter-spacing, family, display, text-align,
radius, shadow geometry, grid columns, gap, flex direction, text-transform, border style,
overflow, cards — reads 0 at all three breakpoints, on all four routes that render it.

| bp | value | threshold | status |
|---|---|---|---|
| 390 | 4.35 | 5 | PASS |
| 768 | 4.35 | 5 | PASS |
| 1440 | 4.35 | 5 | PASS |

**Floor, not a defect.** Removing the `tel:` link would close it and would break D-04.
Do not close it, and do not spend an iteration on the band while 4.35 is the whole number:
any regression on this band shows up as a value above 4.35 and nothing else.

**The one fix attempt (A-2), spent and recorded.** The band first measured 460px at 768
against the reference's 359 — the lede-sized body wrapped to ten lines in a 378px column
while the media slot was still held at its 1440 height of 298. The body dropped to the
16/24 body face, the media took its own 768 slot height (231), the grid went to `1fr 40%`
and the inner padding tightened one step. 5.30 -> 4.35, i.e. `box.h` went to zero.
**That was attempt 1 of 1. Floored at the `buttons` field.**

## KD-11 — Section padding lives on an inner element, and this is measured, not stylistic

Recorded so no later turn "tidies" it back.

Every reference section computes `padding: 0` on the element the comparator scores, and
puts its rhythm on an inner builder div. `.t-section` in the frozen shell applies
`padding-block: var(--section-y)` — 40 / 64 / 80px. Putting `t-section` on the element that
carries `data-section` therefore moves **two** blocking fields (`padTop`, `padBottom`) to
100% each: **8.7% of deviation before anything real is measured**, on every section of
every route. The Prompt 5 scaffold band shipped that way and measured 271px against a
reference band of 316.

The wave convention, written up in `docs/wave-conventions.md` §1, is:

```tsx
<section data-section="id">      {/* padding 0, display block, inherited type */}
  <div className="t-section">    {/* the rhythm */}
    <div className="t-container"> ... </div>
  </div>
</section>
```

Same class of trap, same file: `cards` counts `[class*=card],article` and is **0 on every
reference section on all four routes**, so `.t-card` and `<article>` are banned inside a
`data-section` subtree; and `buttons` counts any `tel:` link regardless of class.
