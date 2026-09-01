# 05 — FAQ accordion

Reference evidence: home section 16, `frequently-asked-questions`, 818px @1440 / 983px @390,
**8 Q&A pairs**, 20 nodes carrying `aria-expanded`, plus `FAQPage` JSON-LD. Per Prompt 3's
structural move #3 this block **relocates to `/services`** and appears nowhere else
(`docs/sections.md`, `/services` `faq`, ADAPTED). Copy is `servicesFaq` in
`content/copy.ts`: generic garage-door technical content only — nothing about response
time, pricing, warranty, or credentials.

## mechanism

A list of eight items. Each item is a `<h3>` containing a `<button type="button"
aria-expanded aria-controls>`, followed by a panel `<div id role="region" aria-labelledby>`.

Open/close animates **`grid-template-rows: 0fr → 1fr`** on a wrapper whose only child is
`min-height: 0; overflow: hidden`. The panel's natural height is never measured, never read
back, and never written to the DOM.

**Do not** use `max-height: 0 → 999px`. It is the standard wrong answer and it is wrong in
three separate ways: the transition timing is a function of the *declared* maximum rather
than the actual content, so a two-line answer opens in a fraction of the duration and an
eight-line answer opens at a different apparent speed; the close always lags because the
first N pixels of the collapse are empty space; and any answer that outgrows the guessed
maximum is silently clipped.

**Do not** use `height: 0 → auto` with a JS-measured pixel height either. It works, but it
forces a synchronous layout read on every open, and it has to be re-measured on resize and
after fonts load or the panel is the wrong height on first paint.

**Do not** use `<details>`/`<summary>`. It is a tempting free win, but the disclosure
triangle, the `display` behaviour of `<summary>`, and Safari's handling of a `<summary>` that
contains a heading all diverge from the reference's markup, and `<details>` cannot be
animated open without the same height problem.

**Do not** use `display: none` for the closed state — it kills the exit transition and
removes the panel from the a11y tree in a way that fights `aria-controls`. The closed state
is `grid-template-rows: 0fr` plus `visibility: hidden` delayed by the transition duration,
matching the drawer's construction.

Open state is single-select or multi-select? **Multi-select.** Each item is independent; no
item closes when another opens. The reference exposes 8 independent `aria-expanded` nodes
rather than a radio group, and a single-select accordion loses the reader's place when they
open the next question while comparing two answers.

Default state: **all closed**, on every breakpoint. Do not open the first item by default —
it makes the section 1.5 items tall on load and desynchronises the structural capture from
the reference's collapsed baseline.

## ratio

| layer | property | duration | easing | delay |
|---|---|---|---|---|
| panel | `grid-template-rows` | **0.26s** | `cubic-bezier(0.22, 1, 0.36, 1)` | 0 |
| panel body | `opacity` 0 → 1 | 0.18s | `ease-out` | **0.08s** |
| chevron | `transform: rotate(0 → 180deg)` | 0.26s | `cubic-bezier(0.22, 1, 0.36, 1)` | 0 |
| question | `color` | 0.18s | `ease-out` | 0 |

The panel body's opacity starts 80ms into the 260ms open, so the answer fades in over the
last two-thirds of the reveal instead of sliding into view fully opaque. That is what stops
a tall answer from reading as a wall of text arriving all at once.

260ms, not 400: eight items means the user may open several in a row, and a duration that is
comfortable once is tiresome by the fourth. It is also long enough for the chevron rotation
to be legible; below ~200ms a 180° rotation reads as a flicker.

Closing runs the same 260ms with `cubic-bezier(0.4, 0, 1, 1)` and the body opacity drops in
0.10s with no delay, so the text is gone before the box finishes collapsing and nothing is
clipped mid-glyph.

Chevron rotates 180°, not 90°: a chevron that ends up pointing sideways is ambiguous about
which item it belongs to in a stacked list.

## failure mode

- `max-height` (see mechanism) — variable apparent speed and a clipping hazard.
- Animating the whole item's `height` rather than the panel wrapper's rows: the question
  itself moves during the transition, so the click target slides out from under the pointer
  and a fast second click lands on the next question.
- Single-select accordion with an auto-close: opening question 7 closes question 3 above it,
  the page shortens, and everything below jumps up under the reader — the worst version of
  scroll displacement, caused by the site rather than the user.
- Putting the `<button>` around the `<h3>` instead of inside it: the heading disappears from
  the document outline and screen-reader heading navigation cannot reach the eight
  questions.
- Transitioning `all`, which picks up the panel's inherited `--fg` custom property.
- Emitting `FAQPage` JSON-LD whose answers do not match the rendered text, or emitting it
  for content that makes a claim we cannot support. The rendered copy is the source; the
  JSON-LD is generated from the same `servicesFaq` object or it is not emitted at all.

## trigger

- **Toggle**: click or `Enter`/`Space` on the question button (native `<button>` semantics —
  do not add key handlers). Repeating, idempotent per item.
- **Deep link**: if `location.hash` matches an item id on mount, that item opens
  **without transition** (`data-instant` for one frame) and the browser's native anchor
  scroll lands correctly, because the panel is already at its final height. Animating it
  open after the scroll leaves the target off-screen by the panel's height.
- **Client-side route change**: state is component-local `useState`, and the component
  unmounts with the route, so every arrival at `/services` starts all-closed. Do not persist
  open state to `sessionStorage` — a returning user has no memory of which question they
  opened and a pre-opened item looks like a rendering bug.
- **Re-entry**: clicking during a transition reverses it from the current computed
  `grid-template-rows`; no debounce, no queue, no `isAnimating` lock.
- **Resize**: nothing re-runs. Because no height was ever measured, there is nothing to
  invalidate — this is the main practical reason for the `0fr → 1fr` mechanism.

## accessibility

- `<h3><button type="button" aria-expanded="false" aria-controls="faq-panel-3">…</button></h3>`.
  The heading is the wrapper and the button is the interactive element, so the eight
  questions remain reachable by screen-reader heading navigation.
- Panel: `<div id="faq-panel-3" role="region" aria-labelledby="faq-q-3">`.
- `aria-expanded` is the **only** state announcement. Do not add `aria-hidden` on the closed
  panel: the delayed `visibility: hidden` already removes it from the a11y tree, and the two
  mechanisms together produce a panel that is hidden while its controlling button claims it
  is expanded during the transition.
- No `aria-live` — a disclosure is not a live region, and announcing eight panels as they
  open is noise.
- Question buttons are full-width with at least 44px of height plus 16px of vertical
  padding, so the target is the whole row and not just the text.
- Focus stays on the question button when it is toggled. Do not move focus into the opened
  panel: the user asked to reveal the answer, not to jump to it.
- The chevron is `aria-hidden="true"`. Open state is conveyed by `aria-expanded`, and
  visually by both the rotation and the question's colour change — never by colour alone.
- Contrast: questions use `heading-on-surface` (`--color-primary-deep` on `--color-surface`,
  17.95:1); answers use `body-on-surface` (20.99:1); the item divider is
  `--color-border`, decorative only, so nothing depends on perceiving it.
- `@media (prefers-reduced-motion: reduce)`: the rows transition drops to 0.01s and the
  chevron rotates instantly; the body's opacity fade is kept at 0.15s with no delay, because
  a cross-fade is not vestibular motion and it keeps the appearance of the answer from being
  a hard flash.
