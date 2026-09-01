# 02 — Sticky header transition

**There is no transition. That is the spec, and it is measured, not assumed.**

Reference evidence, `harness/motion.mjs` at 390 and 1440 (2752 / 2112 frames, 3px per
frame, full page): `headerDistinctStates: 1`. The header is sampled at every scroll
position on the longest page on the site and it never enters a second state — it does not
shrink, it does not recolor, it does not gain a shadow, it does not translate, it does not
change opacity. `continuous: 0` and `scrollListeners: false` independently confirm there is
nothing listening for scroll at all. Their header is a static fixed bar whose measured
height is **177px @390 · 96px @768 · 224px @1440**, `z-index: 13`.

The captured states `header-at-top` and `header-engaged`
(`.harness/profile/home-{390,1440}/`) are identical in every appearance field. That is the
evidence; do not re-derive it.

## mechanism

`position: sticky; top: 0; z-index: 40` on `<header>`, height fixed per tier by
`--header-h`. **Not** `position: fixed`.

`fixed` is what the reference uses, and it is the wrong choice for us for two reasons.
First, it removes the header from flow, so every page needs a compensating
`padding-top: var(--header-h)` on `<main>` that has to be kept in sync with three
breakpoint values, and the two drift. Second, and decisively: `fixed` makes
`document.documentElement.scrollHeight` and every section's `docTop` disagree with the
reference's by exactly the header height, and `diff.mjs` normalises section midpoints by
page height — so a fixed header quietly biases the pairing on every route. `sticky` occupies
flow, keeps the document height honest, and paints identically.

**Do not add** any of: a `scroll` listener, an `IntersectionObserver` sentinel above the
header, a `data-scrolled` attribute, a shrink-on-scroll height transition, a
shadow-on-scroll, or a hide-on-scroll-down / show-on-scroll-up pattern. Each of those is a
state the reference does not have, and A-6 freezes the shell after Prompt 5 — adding one
means every ADAPTED section on every route is measured against a header geometry the
reference never produces.

The one dynamic value the header carries is `--header-h`, and it changes only with the
viewport tier, in plain media queries:

```
            <768    768-1024   >=1025
--header-h  177px     96px      224px
```

## ratio

No durations, because there is no state change. The only timed values in the header are the
hover transitions that the profile *did* find (`animatedElements: 13`, all hover):

| element | property | duration | easing |
|---|---|---|---|
| nav link underline | `transform: scaleX()` | 0.18s | `ease-out` |
| nav link colour | `color` | 0.18s | `ease-out` |
| header tel CTA | `background-color` | 0.18s | `ease-out` |

180ms is below the ~200ms threshold at which a hover response starts to feel like it is
lagging the pointer, and above the ~100ms at which it reads as an instant snap. The
underline scales from `transform-origin: left` so it draws in the reading direction.

`z-index: 40` sits above page content and **below** the drawer panel (`z-index: 90`) and its
backdrop (`z-index: 80`), mirroring the reference's 13 vs 101 / 6 ordering without importing
their arbitrary numbers.

## failure mode

The tempting version is the one every modern site ships: a 224px header that shrinks to
80px with a shadow after 100px of scroll. It is wrong here for three separate reasons.

1. **It is not in the reference.** The clone target is a static bar; adding choreography is
   inventing design, not cloning it.
2. **It reads wrong on this site specifically.** A shrinking header animates the phone
   number — the single conversion target — while the user is scrolling toward it. Motion
   under a moving thumb is how a mis-tap happens.
3. **It breaks measurement.** A header that changes height mid-scroll changes where every
   section below it sits, so a full-page capture of any section below the engage point is
   offset by the delta, and `ITERATION_CAP = 1` means there is no second pass to notice.

The second tempting version is `position: fixed` with a hand-maintained spacer div. See
mechanism; it desynchronises page height from the reference's.

## trigger

Nothing. There is no trigger, because there is no state.

- **Scroll**: no listener, no observer, no rAF loop.
- **Client-side route change**: the header is rendered once in `app/layout.tsx` and is not
  remounted between routes, so nothing re-runs. The only per-route change is which nav link
  carries `aria-current="page"`, derived from `usePathname()` during render — no effect, no
  transition.
- **Re-entry**: not applicable.

## accessibility

- `<header>` (implicit `banner` landmark) containing `<nav aria-label="Primary">`.
- The current route's link carries `aria-current="page"`; the styling that marks it must not
  be colour alone — it also carries the persistent underline, so it is perceivable without
  colour vision.
- A `Skip to content` link (`nav.skipToContent`) is the **first focusable element in the
  document**, visually hidden until `:focus-visible`, jumping to `#main`. With a 224px
  sticky header, `#main` also needs `scroll-margin-top: var(--header-h)` or the skip target
  lands underneath the bar.
- The header tel CTA is a real `<a href="tel:...">` with visible text, not an icon-only
  control, and inherits the global `a[href^="tel:"] { min-height: 44px }` rule (A-14).
- `sticky` keeps the header inside the flow, so reading order matches visual order and no
  `aria-hidden` juggling is needed when the drawer opens (the drawer spec applies `inert`
  to `.header-inner`, which is inside this landmark).
- `prefers-reduced-motion: reduce` zeroes the three hover transitions above. There is
  nothing else to reduce.
