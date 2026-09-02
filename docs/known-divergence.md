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

## KD-04 — CLOSED. A logo file was handed back (asset drop-in, OVERRIDE 3)

The owner supplied a logo. `logo-header.png` / `logo-footer.png` / `favicon.png`
are now real assets and the header renders the lockup instead of Mohave type.
See `assets/INVENTORY.md` § "Asset drop-in". The original text of this entry
is kept below for the record.

### (superseded) The wordmark is type, not a file

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

## KD-12 — `/contact::map` is the embed and nothing else, and its heading moved

Opened at the merged Prompt 6+7 wave. **This is the one fix attempt (A-2) for that section,
spent and closed.**

The band first measured **567 / 735 / 1091** against the reference's **214 / 365 / 300**.
Two structural causes, both fixed in the single attempt:

1. Our band carried a heading, a paragraph and a `tel:` CTA. **The reference band contains
   the embed and nothing else** — at 1440 it is a 1440x300 strip. Those three moved into the
   adjacent `nap-card` band, which is NOVEL and therefore has no height target for them to
   break. **No copy was rewritten; it was relocated.** `contactMap.heading` and
   `contactMap.body` still render, verbatim, one band further down.
2. `<BusinessMap>`'s wrapper is `aspect-ratio: 16/10` (16/9 above 768). Across a 1325px
   container that computes a 745px-tall map. The reference embeds a fixed-height strip, so
   the aspect ratio is overridden to an explicit per-breakpoint height in
   `ContactMap.module.css` — **not** in the shell file. The shell component is shared by two
   slots at two zoom levels (A-6); the slot decides its own height, the component does not.

| bp | before | after | box.h after | threshold | status |
|---|---|---|---|---|---|
| 390 | 5.97 | **4.88** | 244 vs 214 | 5 | PASS |
| 768 | 6.90 | **4.18** | 362 vs 672 (mispaired, see below) | 5 | PASS |
| 1440 | 6.63 | **4.39** | **297 vs 300** | 5 | PASS |

The residual is the `buttons` field, same shape as KD-10 inverted: the reference band
computes 4 at 390 and 5 at 1440 — their embed ships its own zoom and fullscreen controls as
real DOM buttons — and ours computes 0, because a Google `output=embed` iframe keeps its
controls inside the iframe where the probe cannot see them. **Unclosable by construction.
Floor.** At 768 the reference row is its 384px-wide off-canvas drawer band rather than the
map, so that row is a pairing artifact; it passes anyway and is not worth chasing.

## KD-13 — `/about::what-we-do` at 390 pairs against a 26px unnamed strip

**Floored, not fixed. A mispairing, not a defect.**

| bp | value | threshold | status |
|---|---|---|---|
| 390 | 8.64 | 5 | FAIL — floored |
| 768 | — | 5 | UNPAIRED |
| 1440 | **0.47** | 5 | PASS |

At 1440 the row is 0.47% — the section is essentially exact against
`560bf22b-about`. At 390 the harness pairs it against `s12-0c6cf26f`, a **26px** unnamed
reference strip, and reports `box.h ref=26 ours=2031 (98.72%)` plus `textAlign ref=left
ours=start`. A 26px strip is not a services list; the reference's `/about` page splits into
a different band sequence at 390 (its `560bf22b` band is 2424px there and lands at a
different normalised progress), and the identity alias resolves to the wrong neighbour.

**Best hypothesis:** the row is unmeasurable at 390 rather than divergent. The evidence is
that the same component, same markup, same CSS, scores 0.47 at 1440 — a section cannot be
98% wrong at one width and 0.5% wrong at another by anything the markup did. Chasing it
would mean shortening a 2031px eight-service list to 26px, which would be destroying real
content to satisfy an artifact. **Do not reopen.**

## KD-14 — the gates run against `next start`, never `next dev`

Written down because it cost a full capture sweep to find and would cost the next turn the
same.

Running the harness against `next dev` produced, on the same clean codebase: 500s on
`/_next/*` chunk requests, `pageerror: Invalid or unexpected token`, and between 1 and 5
console errors on **every** capture — which then poison the diff, because a section that
failed to hydrate has the wrong box.

**Cause:** the harness writes its PNGs, JSON and traces into `.harness/`, which is *inside
the project root*, so Next's dev file watcher sees every capture as a source change and
recompiles. The log showed `✓ Compiled in ~200ms` on a loop with nobody editing anything.
Chunk hashes rotate mid-page-load and the browser fetches a hash that no longer exists.

**Rule:** `pnpm build` then `pnpm start`, and only then run gates. The same sweep, against
the production server, reported `"errors":0` on all fifteen captures. This is also strictly
more faithful — the acceptance gate is supposed to measure what ships, not what HMR is
holding in memory.

Verify before believing any gate: the route's `<title>` **and** a `200` on the stylesheet
the page actually references. An implausibly small "N scored" (we saw `0 scored, 0 FAIL`
once) means the page was caught mid-recompile, not that the gate passed.

---

# FINALISED AT THE MERGED PROMPT 10 + 11 ACCEPTANCE SWEEP

Everything below closes the file. The chain ends here; no further iteration is authorised
on any row in this document.

## KD-15 — the complete list of permanent floors, and what each one is

One table, so the next reader does not have to reconstruct it from fourteen sections. Every
row is a **decision or a construction limit**, never a defect, and none may be reopened.

| # | floor | where | cause | class |
|---|---|---|---|---|
| KD-01 | none — **there is NO font-substitution floor on this build** | all type | Mohave and Lato are both SIL OFL and are TAKEN from their open upstream, not substituted. D-11's rule is conditional on the reference self-hosting a *licensed* face; that condition is not met. Manufacturing a substitution would have invented a permanent floor we do not have to carry, and cost real fidelity on every heading. | not a floor |
| KD-02 | stroked icons against their filled ones | 5 icon sites | `lucide-react` per the allowlist, matched on size and stroke width, not glyph. Less filled area means a small permanent pixel residual wherever an icon sits. | licensing |
| KD-03 | 30 REPLACE + 11 OURS-NEW image slots are placeholders | all routes | OVERRIDE 3 — the real files arrive after acceptance. Measured with the placeholder area excluded. | sequencing |
| KD-04 | ~~the wordmark is type, not a file~~ **CLOSED** | header, footer, favicon | Logo supplied and dropped in; header/footer/favicon now ship the real lockup. | resolved |
| KD-05 | their third-party runtime, which we do not ship | all routes | reCAPTCHA, chat widget, contact modal, promo bar, partner strip, blog, coupon band, Leaflet embed — all deliberately absent under D-15, D-05, D-03, D-01, D-09 and D-07. Section geometry moves where they sat. | decision |
| KD-06 | their CTA text colour fails AA and ours does not | CTA anchors | Theirs computes `color: rgb(0,0,238)` on `rgb(197,23,22)`. D-19 forbids cloning it. | accessibility |
| **KD-07** | **colour, entirely** | **every section, every route, permanently** | The palette is randomised at token-write time from seed **260721**. **Colour divergence from the reference is intentional and is permanently excluded from every diff, every threshold and every future iteration** (A-8). The structural comparator strips resolved colour, background-colour, border-colour, gradient stops and shadow colour before scoring; the non-colour parts of borders and shadows — widths, offsets, blur, spread, radii — are kept. | **excluded by amendment** |
| KD-08 | `header`, `footer-nap`, `footer-links` structural residuals | shared shell, every route | Type and rhythm inside bands whose *information* differs by decision (D-01, D-02, D-06). One fix attempt spent and recorded. | ADAPTED trap |
| KD-09 | the harness parses a second, machine-readable table | `docs/sections.md` | The shared package's contract format differs from the human table's column order. Two mappings are genuinely absent: `/services::faq`, relocated cross-page and UNPAIRED forever, and `/privacy`, which has no reference page at all. | instrument |
| KD-10 | the shared `cta-band` residual — restated below | 4 routes x 3 bp | one field of twenty-three | **D-04** |
| KD-11 | section padding lives on an inner element | every section | Every reference section computes `padding: 0` on the scored element and puts its rhythm on an inner builder div. Measured, not stylistic. | instrument |
| KD-12 | `/contact::map` residual — restated below | `/contact` | their embed ships its own controls | construction |
| KD-13 | `/about::what-we-do` at 390 — restated below | `/about` @390 | mispairing | **unmeasurable** |
| KD-14 | gates run against `pnpm build` + `pnpm start`, never `next dev` | the harness | `.harness/` sits inside the project root, so the dev watcher recompiles mid-capture. Held at this turn: **all 15 production captures reported `errors: 0`.** | instrument |

### KD-10 restated, because the field IS the number

The shared CTA band **carries one `tel:` link that the reference band does not.** The
comparator's `buttons` field counts
`a[href^="tel:"], button, [class*=btn], [class*=button]`. Their
`9328cbef-learn-more-about` band computes **0** — their two calls to action are plain
anchors to other pages. Ours is a call band, and **D-04 makes every rendered phone number a
dialable `tel:` link**, so ours computes **1**.

One field of twenty-three at 100% is **4.35%**, and **that one field is the entire
residual.** Every other blocking field on the band — box width and height, all four
paddings, font size, weight, line-height, letter-spacing, family, display, text-align,
radius, shadow geometry, grid columns, gap, flex direction, text-transform, border style,
overflow, cards — reads **0** at all three breakpoints on all four routes that render it.

| bp | value | threshold | status |
|---|---|---|---|
| 390 | 4.35 | 5 | PASS |
| 768 | 4.35 | 5 | PASS |
| 1440 | 4.35 | 5 | PASS |

Removing the `tel:` link would close it and would break D-04. **Do not close it.** Any
regression on this band shows up as a value *above* 4.35 and nothing else; 4.35 exactly is
the floor.

### KD-12 restated — `/contact::map`

The band is the embed and nothing else, and its heading was **relocated, not rewritten**,
into the adjacent NOVEL `nap-card`. Its one fix attempt is spent and recorded above. The
residual is the `buttons` field with KD-10's sign inverted: the reference band computes 4 at
390 and 5 at 1440, because their embed ships its own zoom and fullscreen controls as real
DOM buttons, and ours computes **0**, because a Google `output=embed` iframe keeps its
controls inside the iframe where the probe cannot reach them. **Unclosable by
construction.** Final: 4.88 / 4.18 / 4.39 against a threshold of 5, all PASS, with `box.h`
at 1440 reading **297 against their 300**.

### KD-13 restated — `/about::what-we-do` at 390 is UNMEASURABLE, not divergent

| bp | value | threshold | status |
|---|---|---|---|
| 390 | 8.64 | 5 | **unmeasurable — floored** |
| 768 | — | 5 | UNPAIRED |
| 1440 | **0.47** | 5 | PASS |

At 1440 the section is essentially exact against `560bf22b-about`. At 390 the harness pairs
it against `s12-0c6cf26f`, a **26-pixel unnamed reference strip**, and reports
`box.h ref=26 ours=2031 (98.72%)`. **The same component, the same markup and the same CSS
score 0.47 at 1440.** A section cannot be 98% wrong at one width and 0.5% wrong at another
by anything the markup did — the row is unmeasurable at 390, not divergent. Closing it would
mean shortening a 2031px eight-service list to 26px, destroying real content to satisfy an
artifact. **Do not reopen.**

## KD-16 — page-height rows are composites of decisions already taken

`diff.mjs` emits a whole-page height row per route per breakpoint. Eight of them exceed 5%,
and they are **not section defects** — each is the arithmetic sum of bands this chain
deliberately deleted or added.

| route | 390 | 768 | 1440 | cause |
|---|---|---|---|---|
| `/` | 12.34 (8330 vs 9503) | 2.71 | 9.42 | Three home bands deleted: the discounts band (D-14), the blog band (D-01) and the eleven-mark partner strip (D-09). We are *shorter* by roughly what they occupied. |
| `/about` | 10.54 | 6.86 | **0.23** | At 1440 the page is 2982 against their 2989 — seven pixels. The 390 delta is the same restack that produces KD-13. |
| `/services` | 14.92 | 6.86 | 25.38 | We are *taller*: eight in-page service blocks grouped by symptom, plus the FAQ relocated from their home page, against their single product page. Structural move 3, taken deliberately in Prompt 3. |
| `/contact` | 12.09 | 20.56 | 10.52 | Their reCAPTCHA (three iframes plus a badge), their contact modal and their email field are all absent (D-15, D-05, D-03), and our NOVEL `nap-card` band is added. |
| `/privacy` | 60.11 | 62.56 | 59.92 | **Meaningless.** `/privacy` has no reference page, so the harness falls back to the reference *home* page (refH 7442 / 9503 / 7524). Same artifact as KD-09. |

**No page-height row is actionable.** Closing one would mean re-adding a deleted band or
padding a page to hit a target height.

## KD-17 — the `/privacy` structural rows are paired against the reference home page

Four rows on `/privacy` — `s14-090e14dc-frequently-asked-questions`,
`s15-59b59a73-recent-blog-posts`, `s17-6c5257e3` and `s19-e4ad708c` — report FIDELITY
structural deviations between 5.47 and 10.34. **`/privacy` has no counterpart page.**
`harness.config.mjs` cannot list it in `routeMap`, so the harness falls back to the
reference home page and pairs our privacy sections against a FAQ band, a blog band, an 85px
spacer and their footer NAP.

The rows that actually govern `/privacy` are its **token-conformance rows, and every one
reads 0 violations** (A-9: NOVEL collapses to a single pass and has no breakpoint
dimension). Same class as KD-09. **Artifact. Not measured, not measurable, not reopened.**

## KD-18 — two raw colour values live in the token file outside `@theme`, deliberately

The palette-conformance gate found exactly two literal colours in `app/globals.css` outside
the `@theme static` block, and **zero** anywhere else in `app/`, `components/`, `lib/` or
`content/`:

- `rgba(0, 0, 0, 0.4)` — the drawer backdrop scrim. This is the **reference's own measured
  overlay alpha**.
- `rgba(255, 255, 255, 0.12)` — the `aria-current="page"` highlight on a drawer link,
  against the dark drawer.

Both are **achromatic alpha overlays, not palette entries**: they carry no hue, they rotate
with nothing, and promoting them to `@theme` tokens at the final gate would add two entries
to the set that `diff.mjs` then conforms every computed value against, for no gain.
Recorded as a named exception rather than minted as tokens.

**The winning seed is 260721.** The five candidate seeds are **260721, 274299, 955554,
300175 and 579843**, from `masterSeed` **3203** — full table and gate results in KD-07.

## KD-19 — one animation survives `prefers-reduced-motion: reduce`, by specification

The reduced-motion sweep at 1440 found exactly one element still transitioning above 50ms
under `reducedMotion: reduce`: `.t-backdrop`, at `0.15s linear` on `opacity`.

This is **not a miss.** `docs/behavior/01-mobile-nav-drawer.md` specifies it: under reduced
motion the panel transform drops to 0.01s, the link stagger and translate are removed
entirely, and *only the backdrop opacity still transitions, at 0.15s linear* — because a
hard cut with no opacity change is disorienting, and a 0.01s transform keeps the transition
events firing so the close-and-cleanup logic is identical in both modes. An opacity
cross-fade is not motion. Everything else in the document is clamped to 0.01s by the
blanket rule.

## KD-20 — instrument changes made at this turn, recorded so the next site inherits them

Three, all in service of the acceptance sweep, none of them affecting the product:

1. **`content/copy.ts` gained a `routes` projection.** The shared `similarity.mjs` reads
   `copy.routes[route].sections[]` with `refSection` in `sNN` form plus a class; this file
   was written to the legacy per-site shape and crashed the gate. The projection holds no
   copy of its own — every string still has exactly one home — so the two cannot drift.
   Same defect class as KD-09.
2. **Every `ref` index in `content/copy.ts` was repointed** to the shared harness's
   segmentation of the reference page, verified row by row against each band's heading and
   character count. The old numbers came from the superseded per-site harness and were
   pairing the `/about`, `/services` and `/contact` sections against an 86-character button
   strip — which made the whole length column read as a copywriting failure when it was a
   pairing failure. **No copy was changed**, only the index each row names.
3. **One guard added to `../_shared/harness/src/similarity.mjs`**: a route with no reference
   page — a NOVEL route such as `/privacy` — previously crashed the entire gate on
   `ref.byRoute[route].map(...)`. It now emits those rows with a null `refChars` instead.
   `node test/selftest.mjs` in the package reports **13 passed, 0 failed** after the change.

Also at this turn, and not an instrument change: **`reference/raw/` was created** — five
reference pages, the sitemap and ten stylesheets, saved with one `curl` each while
`nextlevelok.com` is still reachable. Three sibling sites in this programme lost their
references to bot walls mid-build and can never be re-measured against them. This one can.

## KD-21 — the NAP defect the acceptance sweep found, and fixed

Recorded because it is the one real defect gate 4 caught, and because the shape of it
recurs.

The footer rendered **two different hours strings**: `business.hours.display`
(`Open 7 days, 7:00 AM – 7:00 PM`, en dash) in the header sub-line and the footer NAP block,
and a second copy in `content/copy.ts` as `footerNap.hours` that had drifted to a **hyphen**.
`content/copy.ts` also carried **three literal copies of the phone number** — two `callCta`
strings and a form placeholder.

Two sources for one fact is precisely what the NAP gate exists to catch. Fixed at this turn:
the hours column now reads `business.hours.display`, the duplicated `footerNap.hours` and
`footerNap.phoneNote` are deleted, and the remaining phone strings are interpolated from
`business.phoneDisplay`. **`lib/business.ts` is now the only file in the repository
containing a NAP literal.** Post-fix sweep, all five routes: exactly one form of the phone,
one of the address and one of the hours string on each.

Not a floor — a closed defect. Listed here so that a future edit reintroducing a literal is
recognised as a regression rather than a convenience.
