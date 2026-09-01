# 03 — Mobile sticky call bar

Reference evidence: a fixed bottom bar, **390×80 at 390** (`.harness/ref/home-390`, section
index 25, `{x:0, y:8659, w:390, h:80}`), absent at 1440. Theirs is a promo / CTA bar; **ours
is a dedicated `tel:` bar** (D-04, KD-05). Classified **NOVEL** in `docs/sections.md` —
token conformance, not pixel diff.

## mechanism

`position: fixed; left: 0; right: 0; bottom: 0; z-index: 60`, height 80px at 390, a single
full-width `<a href="tel:+14055550142">` filling it.

**Not** `position: sticky`. A sticky element is bounded by its containing block, so a sticky
call bar unsticks and scrolls away as soon as its parent's bottom edge passes — which on
`/privacy` is the moment the reader reaches the end of the policy. `fixed` is correct here
even though `sticky` was correct for the header, and the reason differs in each case: the
header must stay in flow to keep page height honest; the call bar must leave flow to stay on
screen for the whole document.

**Do not** animate it in on scroll, and **do not** hide it on scroll-down / reveal it on
scroll-up. The reference has zero scroll-linked motion (`continuous: 0`), and a call button
that disappears while the customer is scrolling toward it is the worst defect this site
could ship. It is painted from first render and never moves.

The document reserves its space with `padding-bottom: var(--callbar-h)` on `<body>` below
768, so the bar never covers the last row of the footer. `env(safe-area-inset-bottom)` is
added to both the bar's padding and that reservation so it clears the iOS home indicator.

Visibility is a media query, not JavaScript: `display: flex` below 768, `display: none` at
768 and above, where the header tel CTA is visible instead. No `useState`, no
`window.matchMedia`, no hydration mismatch.

## ratio

| property | duration | easing |
|---|---|---|
| `background-color` on `:active` | 0.12s | `ease-out` |
| `background-color` on `:hover` | 0.18s | `ease-out` |

120ms on press, not 180: a press response has to land inside the same perceptual event as
the tap, and anything past ~150ms reads as the button responding to something else. There is
no transform on press — a call bar that scales under the thumb changes the hit area during
the tap.

Geometry: **80px tall** (reference-measured), minus safe area, label centred. The touch
target is the whole 390×80 bar, 1.8× the WCAG 2.2 §2.5.8 minimum in both axes. Two lines of
type: `callBar.label` ("Tap to call") at `--text-body`, weight 700, and `callBar.sub`
("A technician answers") at `--text-micro`, so the bar states the proposition — a person
answers — rather than only the action.

Colour: `--color-accent` fill with `--color-surface` label — the same pair as the header CTA
(`cta-label`, 5.86:1), so the conversion target is one colour site-wide and the render-truth
CTA-primacy check has a consistent target to rank.

## failure mode

- **Sticky instead of fixed** — unsticks at the end of its containing block; see mechanism.
- **Hide-on-scroll-down** — invented motion, and it hides the phone number exactly when the
  user is hunting for it.
- **A slide-up entrance after N pixels of scroll** — the bar is the primary CTA below 768,
  so delaying it leaves the first screen with no visible call target, and it is
  scroll-linked behaviour the reference does not have.
- **Forgetting the body padding reservation** — the bar covers the final footer row, which
  on this site is the site-links list, and the last link becomes unreachable.
- **`bottom: 0` without `env(safe-area-inset-bottom)`** — on an iPhone the label sits under
  the home indicator and the bottom ~34px of the tap target is swallowed by the system
  gesture area.
- **Rendering it conditionally from a JS width check** — server and client disagree on first
  paint, React logs a hydration mismatch, and the bar flashes.

## trigger

- **Always visible below 768px.** No trigger, no scroll dependency, no timer, no dismiss
  affordance. It is not a promo bar and must not be dismissible; a dismissed call bar is a
  lost call.
- **Client-side route change**: rendered once in `app/layout.tsx`, outside the route
  segment, so it is never remounted and never re-animates between routes.
- **Drawer open**: the drawer backdrop is `z-index: 80` and the panel `z-index: 90`, both
  above the bar's `60`, so the bar is covered rather than floating over the menu. It also
  sits inside the subtree that receives `inert` while the drawer is open, so it is not
  reachable by keyboard from behind the panel.
- **Activation**: a plain `tel:` navigation. No `preventDefault`, no analytics hook (D-15),
  no confirmation dialog.

## accessibility

- A real `<a href="tel:+14055550142">` with visible text. Not a `<button>` whose `onClick`
  sets `location.href` — that is invisible to assistive tech as a phone link and dead
  without JS.
- `aria-label` gives the full spoken form, built from `lib/business.ts`; the visible label
  stays short.
- The phone icon is `aria-hidden="true"`; the accessible name comes from the text.
- The focus ring must be visible **against the accent fill**: the two-layer ring — a
  `--color-surface` inner halo (5.86:1 against the fill) plus the `--color-focus` outer ring
  (13.24:1 against the page) — is what makes that work with one token.
- Contrast: `--color-surface` on `--color-accent` = **5.86:1**, gated as `cta-label`.
- Tap target 390×80; the global `a[href^="tel:"] { min-height: 44px }` (A-14) is a floor,
  not the mechanism.
- `prefers-reduced-motion: reduce`: hover and press colour transitions drop to 0.01s.
  Nothing else changes, because nothing else moves.
