# 01 — Mobile nav drawer

Reference evidence: `.hamburger-drawer.layout-drawer`, fixed, `z-index: 101`, **265px wide,
right-hand side, parked off-canvas at x = viewport width** (captured at 390 as
`{x:390,w:265}`, at 768 as `{x:768,w:384}`, at 1440 as `{x:1440,w:432}` — the panel is
`min(265px, 40vw)` in their CSS and only the 390 figure is the one we clone).
`.layout-drawer-overlay` sits at `z-index: 6`. Their drawer holds a nested 7-item mega-nav;
**ours holds five flat routes and no sub-menus** (D-01), and no Locations item (D-02).

## mechanism

Fixed panel, `transform: translate3d(100%, 0, 0)` closed → `translate3d(0, 0, 0)` open, plus
a separate full-viewport backdrop element transitioning `opacity` 0 → 1. Compositor
properties only.

**Do not use** `max-height`, `width`, `right`, `left`, `margin-right`, or a
`display: none` ⇄ `display: block` toggle. `max-height` and the offset properties are
layout-triggering; `display` is not animatable at all.

Closed state is `transform: translate3d(100%,0,0); visibility: hidden;` with
`transition: transform .32s var(--ease-out-quint), visibility 0s linear .32s`. The delayed
`visibility` step is what removes the panel from the a11y tree and from hit-testing **after**
the exit transition finishes, instead of snapping it away at frame 0. `visibility` is used
rather than `display` precisely because it is transitionable with a delay.

Body scroll lock: on open, read `window.scrollY`, then set
`document.body.style.position = 'fixed'; top = '-' + y + 'px'; left = 0; right = 0;`. On
close, clear those and `window.scrollTo(0, y)`.

**Do not use** `overflow: hidden` on `<body>`: iOS Safari ignores it and the page scrolls
behind the open panel, which on a phone-call-driven site means the customer's thumb moves
the page instead of the menu.

Panel width `265px`, capped `min(265px, 86vw)` so it cannot exceed the viewport on a 320px
device. The panel itself scrolls internally (`overflow-y: auto`;
`overscroll-behavior: contain`) so a flick inside it never chains to the locked body.

## ratio

| layer | duration | easing | delay |
|---|---|---|---|
| panel `transform` | **0.32s** | `cubic-bezier(0.22, 1, 0.36, 1)` | 0ms |
| backdrop `opacity` | **0.20s** | `linear` | 0ms |
| link `opacity`/`translateY(6px)` | 0.18s | `ease-out` | **0.08s + 0.03s × index** |

The backdrop finishes at 200ms while the panel is still arriving at 320ms. That 120ms
overlap is the whole effect: the page is already dimmed when the panel lands, so the panel
reads as arriving **over** a page that has receded, not as pushing it. The quintic ease-out
puts ~80% of the panel's travel in the first 40% of its duration, so it reads as fast and
settles rather than as slow and linear. Links stagger from 80ms — after the panel is
committed — at 30ms apart; five links finish at 80 + 4×30 + 180 = 380ms, i.e. 60ms after the
panel, which is short enough to read as one gesture.

On exit every layer runs at **0.22s** with `cubic-bezier(0.4, 0, 1, 1)` and no stagger.
Closing is an undo, not a performance; a staggered exit makes a dismissal feel slow.

## failure mode

- Animating `max-height` (or `height: 0 → auto` via a measured pixel height): every frame
  reflows the five links, so the text visibly re-wraps and the tap targets move under the
  thumb mid-transition.
- `display: none` on close: the exit transition never runs, the panel snaps shut, and the
  backdrop is left fading out over nothing.
- Animating `right: -265px → 0`: paints and lays out every frame; janky on the low-end
  Android that a repair customer is most likely holding.
- Backdrop and panel on the same duration: they arrive together, the dimming reads as part
  of the panel rather than as the page receding, and the whole thing feels flat.
- `overflow: hidden` on `<body>` as the lock (see mechanism).
- Forgetting to restore `scrollY`: closing the drawer teleports the user to the top of the
  page, which on `/services` is eight service blocks away from where they were.

## trigger

- **Open**: click/tap on the hamburger button. Repeating — the toggle is idempotent per
  state, never a queue.
- **Close**: the same button (now labelled Close menu), `Escape` on `keydown`, a click on
  the backdrop, a click on any link inside, and a `usePathname()` change.
- **Client-side route change**: an effect keyed on `usePathname()` closes the drawer
  **without** transition on the first frame of the new route (set a `data-instant`
  attribute that zeroes the durations for one frame, then remove it). A 320ms exit playing
  over a page that has already swapped reads as a rendering bug.
- **Re-entry**: opening while an exit transition is mid-flight simply reverses it; because
  both directions animate the same `transform`, the browser interpolates from the current
  computed value and there is no jump.
- **Breakpoint change**: the drawer is only mounted below 1025px (matching the reference's
  `(min-width: 1025px)` tier). Resizing above it while open forces the closed state and
  releases the scroll lock in the same effect, or the body stays `position: fixed` on a
  desktop layout that has no drawer.

## accessibility

- Toggle is a `<button type="button">` with `aria-expanded="false|true"` and
  `aria-controls="site-drawer"`, and an `aria-label` that swaps between `nav.menuOpen`
  ("Open menu") and `nav.menuClose` ("Close menu") from `content/copy.ts`. The icon is
  `aria-hidden`.
- Panel is `<nav id="site-drawer" aria-label="Site">` inside a container that is
  `visibility: hidden` when closed, so its links are out of the tab order and out of the
  accessibility tree without needing `aria-hidden` bookkeeping.
- Focus is **trapped** while open: focus moves to the panel's close button on open, `Tab`
  and `Shift+Tab` wrap between the first and last focusable node, and on close focus
  **returns to the hamburger toggle**, never to `<body>`.
- The rest of the tree (`header > .header-inner`, `main`, `footer`) gets the `inert`
  attribute while the drawer is open, which removes it from both the tab order and screen
  reader navigation in one declaration.
- Backdrop is a `<div aria-hidden="true">`, not a button; `Escape` and the visible close
  button are the accessible dismissals.
- `@media (prefers-reduced-motion: reduce)`: panel transform drops to **0.01s**, the link
  stagger and translate are removed entirely, and only the backdrop `opacity` still
  transitions (0.15s linear). The panel still *moves*, in one frame — a hard cut with no
  opacity change is disorienting; a 0.01s transform keeps the transition events firing so
  the close/cleanup logic is identical in both modes.
- Minimum 44×44 hit area on the toggle and on every drawer link (WCAG 2.2 §2.5.8).
