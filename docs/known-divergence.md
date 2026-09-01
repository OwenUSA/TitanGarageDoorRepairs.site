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

## KD-07 — Colour is terminal after Prompt 9

*(placeholder — Prompt 9 fills this in: winning seed, all five candidate seeds, and the
rule that colour divergence from the reference is permanently excluded from every diff
and every threshold thereafter.)*
