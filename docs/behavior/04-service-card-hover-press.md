# 04 — Service card hover and press

Reference evidence: `animatedElements: 13` out of roughly 2000 nodes, and the motion trace
attributes all of them to **hover transitions on buttons and cards**. Nothing else on the
reference moves. The affected sections here are home `svc-a` / `svc-b` / `svc-c`, home
`trust-row` chips, home `projects` tiles, `/about` `what-we-do` items, and the eight
`/services` `list` blocks.

## mechanism

Two properties only: `box-shadow` and `transform: translate3d(0, -2px, 0)` on the card, plus
`background-color` on the CTA inside it. Compositor-friendly, no layout.

**Do not** transition `top`, `margin-top`, `border-width`, `padding`, `width`, `height`, or
`filter: brightness()`.

- `top` / `margin-top` reflow the card and everything after it in the grid row.
- Growing `border-width` on hover shifts the card's content box by the delta, so the heading
  jumps 1px as the pointer arrives.
- `filter: brightness()` promotes the whole subtree — including the placeholder image and
  the text — to its own layer and softens the type on Windows.

The hover state is gated on `@media (hover: hover) and (pointer: fine)`. Without that gate,
a touch device latches the `:hover` state after a tap and the card stays lifted until the
user taps elsewhere — the classic sticky-hover bug, and on a phone-driven site most
sessions are touch.

Press is `:active`, on both pointer and touch, and it **reverses** the lift
(`translate3d(0, 0, 0)`) rather than pushing further down. The card returns to the surface
under the finger, which is what a physical press does.

Whole-card link: the heading contains the single real `<a>`, and the card is made clickable
with a `::after` overlay pinned to the card's padding box
(`position: absolute; inset: 0; content: ''`). **Not** an `<a>` wrapped around the entire
card, which puts the image, the paragraph and the inner CTA inside one enormous accessible
name, and **not** an `onClick` on the `<div>`, which is not keyboard reachable and has no
href to middle-click.

## ratio

| property | duration | easing |
|---|---|---|
| `box-shadow` | 0.22s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `transform` | 0.22s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| CTA `background-color` | 0.18s | `ease-out` |
| `:active` transform | 0.09s | `ease-out` |

Resting shadow `var(--shadow-card)` = `0 3px 11px rgba(0,0,0,.25)` — the reference's own
value, its most common shadow (10 occurrences). Hover shadow `var(--shadow-card-hover)` =
`0 10px 24px rgba(0,0,0,.25)`: same colour and same alpha, larger offset and blur. Holding
the alpha constant and moving only the geometry is what reads as the card rising rather than
as the card darkening.

**-2px, not -8px.** The lift is a confirmation that the card is a target, not an event. At
-8px with a 24px blur the card visibly detaches, and in a three-across grid the neighbouring
cards look sunken by comparison. 2px is roughly the smallest displacement that is reliably
perceptible at 1× and it is invisible in a screenshot diff, which matters because these
sections are measured against a static reference capture.

220ms in and 160ms out (asymmetric): arriving slower than leaving reads as weight; leaving
slowly reads as lag.

Press at 90ms because it must resolve inside the tap.

## failure mode

The tempting version is a 1.03 scale plus a colour wash on the image. It reads wrong for
three reasons:

1. `transform: scale()` on a card containing text resamples every glyph for the duration of
   the transition; body copy at 16px visibly blurs and re-sharpens.
2. Scaling a card in a grid makes it overlap its neighbours' hit areas, so the pointer can
   sit inside two cards' bounding boxes at once and the hover state flickers between them.
3. On the `projects` grid it scales a **placeholder** (KD-03), which advertises the
   placeholder rather than the layout.

The second tempting version is transitioning `all`. It picks up `transform` and
`box-shadow`, which is what was wanted, and also `color`, `border-color`, `background`, and
any custom property that changes — including the `--fg` / `--fg-muted` pair the dark bands
set — so entering a dark band mid-transition cross-fades the text colour. Name the
properties.

## trigger

- **Hover**: `:hover` inside `@media (hover: hover) and (pointer: fine)`. Repeating,
  stateless, no JS.
- **Focus**: `:focus-within` gets the same shadow and lift as hover, so a keyboard user sees
  the same affordance a mouse user does. Note `:focus-within`, not `:focus` — the focusable
  node is the heading link inside the card, not the card.
- **Press**: `:active`. Fires on touch as well as mouse.
- **Client-side route change**: nothing to reset. These are pure CSS pseudo-class states
  with no JS and no retained state, so a route change cannot strand a card mid-lift.
- **Re-entry**: leaving and re-entering during a transition interpolates from the current
  computed transform; no jump, nothing to debounce.

## accessibility

- One focusable element per card: the heading link. The `::after` overlay is decorative and
  carries no `tabindex`.
- The accessible name is the heading text. If a card also shows a "Learn more" affordance it
  is `aria-hidden="true"` decoration, because a second link to the same destination is a
  duplicate tab stop with a non-descriptive name.
- Hover and focus must never be the **only** cue that a card is interactive: the heading is
  underlined on hover and focus, and the resting state already carries the shadow.
- The lift is `transform`, so it never changes the hit area — the tap target is the same
  size before, during, and after.
- Card CTA contrast: `cta-label` (`--color-surface` on `--color-accent`, 5.86:1) at rest and
  `cta-label-hover` (on `--color-accent-deep`, 9.23:1) on hover. The hover state must not be
  a lighter tint of the accent; that is the direction that fails AA.
- Focus ring is the shared two-layer ring, drawn with `outline` — never suppressed by
  `overflow: hidden` on the card, so the card clips its image with a wrapper rather than
  clipping itself.
- `@media (prefers-reduced-motion: reduce)`: `transform` transitions drop to 0.01s and the
  translate is removed entirely, so the card changes shadow only. The shadow is retained
  deliberately — it is the affordance, and reduced motion is not reduced feedback.
