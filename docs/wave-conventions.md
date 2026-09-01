# Prompt 6+7 wave — build conventions (READ FIRST, then `docs/ref-geometry.md`)

These are derived from the shared comparator's actual source. They are not style
preferences: every one of them moves a BLOCKING field in `diff.mjs`.

## 1. The section element itself is what gets measured

`structuralDiff()` scores the computed style of the element carrying `data-section`,
plus its box, plus two descendant counts. Nothing else.

BLOCKING numeric: `box.w`, `box.h`, `paddingTop/Right/Bottom/Left`, `fontSize`,
`fontWeight`, `letterSpacing`, `lineHeight`, `cards`, `buttons`.
BLOCKING categorical: `fontFamily`, `display`, `textAlign`, `borderRadius`,
`shadowGeometry`, `gridTemplateColumns`, `gap`, `flexDirection`, `textTransform`,
`borderStyle`, `overflow`.

ADVISORY, never chase (A-12): `innerCols`, `innerRows`, `innerCount`, `position`.

### The rules that follow

- **PADDING ZERO on the section element.** Every reference section computes
  `0/0/0/0`. `.t-section` puts 80px of padding-block on whatever carries it, so
  **never put `t-section` on the `<section data-section>`**. Structure is always:

  ```tsx
  <section data-section="svc-a">           {/* no padding, no flex, no grid */}
    <div className="t-section">            {/* the vertical rhythm lives here */}
      <div className="t-container"> ... </div>
    </div>
  </section>
  ```

- **Keep the section element `display:block`.** No `flex`, no `grid`, no `gap` on it —
  the reference computes `display:block`, `gap:normal`, `gridTemplateColumns:none`,
  `flexDirection:row`. Put layout on the inner div.
- **No `overflow:hidden`, no `border-radius`, no `box-shadow`, no border on the section
  element.** The reference computes `visible / 0px / none / none`.
- **Do not override `font-size`, `font-weight`, `line-height` or `letter-spacing` on the
  section element.** They must inherit 16 / 400 / 24px / normal. Type classes go on the
  headings and paragraphs inside.
- **`text-align`**: the reference computes `start` on every section EXCEPT
  `cta-band` (`9328cbef-learn-more-about`), which computes `left`. Only the CTA band sets
  `text-align: left` on its section element.

### The two descendant counts

```js
cards:   document.querySelectorAll('[class*=card],article')
buttons: document.querySelectorAll('a[href^="tel:"], button, [class*=btn], [class*=button]')
```
(visible ones only, inside the section)

- **`cards` is 0 on EVERY reference section on all four routes.** So: never use
  `.t-card`, never use any class name containing `card`, and never use `<article>`
  inside a `data-section` subtree. Use `<div className="panel">` in your CSS module.
- **`buttons` must match the reference count** in `docs/ref-geometry.md`. `.t-btn`
  matches `[class*=btn]`, and every `tel:` link counts whether or not it has a class.
  If a section's target is 0 buttons, link with a plain `<a>` and no `btn` in the class
  name. If the target is 2, ship exactly two.

## 2. Height is the single biggest lever

`box.h` is one field of 23 and is usually the largest single residual. Target the
reference height for your section at each of 390 / 768 / 1440 from
`docs/ref-geometry.md`. Where the copy will not fill the band, set an explicit
`min-height` on the inner wrapper at that breakpoint. Do **not** rewrite copy to close a
height metric — copy is frozen in `content/copy.ts`.

## 3. Styling: CSS Modules only

`app/globals.css` is FROZEN (A-6). You may not touch it, `app/layout.tsx`, `lib/`,
`components/SiteHeader.tsx`, `SiteFooter.tsx`, `CallBar.tsx`, `BusinessMap.tsx`, or
`harness.config.mjs`. If you need a change in any of them, **stop and report it** — the
lead makes it once.

Write `components/sections/<Name>.tsx` and `components/sections/<Name>.module.css`.

**Every colour, font-size, font-weight, radius, shadow and spacing value in your module
must be `var(--token)` from the `@theme static` block in `app/globals.css`.** No hex, no
raw px for spacing or type. Geometry that is not a token — percentages, `fr` units,
`aspect-ratio`, `min-height` targets taken from `ref-geometry.md`, `max-width` — is fine
as a literal, because token conformance only scores colour, font-size, weight, radius and
shadow.

Reuse the shell vocabulary wherever it fits: `t-container`, `t-container--text`,
`t-section`, `t-band--alt`, `t-band--dark`, `t-band--gradient`, `t-h1/h2/h3`, `t-lede`,
`t-quote`, `t-small`, `t-micro`, `t-eyebrow`, `t-muted`, `t-tight`, `t-btn`,
`t-btn--call`, `t-btn--ghost`, `t-btn--wide`, `t-chip`, `t-rule`, `t-field`, `t-error`,
`t-success`, `t-visually-hidden`.

Bands set `--fg` / `--fg-muted`. Read those, never hard-code a text colour on a band.

## 4. Content and facts

- Copy comes from `content/copy.ts`. Never rewrite it, never inline a sentence.
- Business facts come from `lib/business.ts`. A hard-coded phone number or address
  anywhere else is a bug.
- No email, ever: no `mailto:`, no `type="email"`, no `@` in copy, no envelope icon, no
  newsletter or subscribe block (D-03).
- No invented facts. `TODO(fact):` chips stay literal, and every one you emit gets
  appended to `docs/facts-needed.md`.
- Icons: `lucide-react` only, stroke width 2 (KD-02).
- Images: `/placeholders/<slot>.svg` (and `-m` where a mobile crop exists), dimensions in
  `assets/INVENTORY.md`. Always `width`/`height` attributes so nothing shifts.

## 5. Accessibility, non-negotiable (D-19, A-13, A-14)

- One `<h1>` per route, in the page's title/hero band. Everything else `h2`/`h3`, in order.
- Every `tel:` link uses `business.phoneHref` and gets `aria-label={callAriaLabel}`.
- Interactive targets 44px minimum at 390. `a[href^="tel:"]` already gets
  `min-height:44px` globally.
- `prefers-reduced-motion` is already handled globally; do not add an animation that
  bypasses it.
- **cta-primacy**: `rendertruth.mjs` ranks the `tel:` CTA against *interactive elements
  only*. If it fails, the fix is the CTA or the other buttons — **never dim a heading or
  body copy** to satisfy it.

## 6. Declaring the section

`data-section="<id>"` must be the exact id from the machine-readable table at the bottom
of `docs/sections.md`. Identity pairing does not fire without it, and the row then
mispairs on page progress.

## 7. Measuring your own work

Site root as cwd, dev server already up on 3100:

```bash
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/diff.mjs --route /about
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/contrast.mjs --route /about
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/rendertruth.mjs --route /about
```

Never background the dev server with `&` in the same chain as a gate run — it drops the
chain back to the previous cwd and you silently measure another site.

`ITERATION_CAP = 1` for structural residuals: build, diff, ONE fix attempt, then floor it
and report the residual plus your best hypothesis. Reverting your own regression is not a
second attempt. Render-truth and contrast failures are defects, not divergences — fix them
however many attempts it takes (A-13).

Return the report table and nothing else:

```
route | section | breakpoint | class | metric | value | threshold | status
```
