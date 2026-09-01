# 08 — Scroll reveal: there is none

**The Prompt 1 profile found no scroll choreography on the reference. This spec therefore
specifies the no-motion baseline instead of inventing a reveal.** Nothing in this file is a
feature to build; every clause is a prohibition with the evidence attached.

## the measurement that settles it

`harness/motion.mjs`, rAF-sampled at 3px per frame over the full home page at both widths —
2112 frames and ~530 samples at 1440, 2752 frames and ~690 samples at 390. Verdict at both:
**TIME-DRIVEN — discrete state changes only. No scroll choreography.**

| signal | value | what it rules out |
|---|---|---|
| `continuous` | **0** | Not one watched element changes `transform` or `opacity` as a continuous function of `scrollY`. No parallax, no scrub, no progress-linked anything. |
| `headerDistinctStates` | **1** | The header never enters a second state. See spec 02. |
| `varying` | 2 | Two elements change state once, discretely. Those are CSS transitions, not scroll animation. |
| `animatedElements` | 13 of ~2000 | All hover, on buttons and cards. See spec 04. |
| `intersectionObserver` | **false** | They do not observe intersection at all. |
| `scrollListeners` | **false** | Nothing is listening for scroll. |
| `libs` | **[]** | No GSAP, ScrollTrigger, Lenis, Locomotive, ScrollMagic, AOS, Swiper, Framer. |

Appendix A requires the profile to state explicitly whether `framer-motion` is justified.
It is **not**. The trace ran once, proved the negative, and is archived at
`.harness/motion/home-{390,1440}.json`. Do not re-run it per section — it is the single
largest artifact this harness can produce, and it would be produced to re-confirm a zero.

## mechanism — the no-motion baseline

Sections are **painted in their final state on first render**. No opacity ramp, no
`translateY`, no stagger, no `will-change`, no `animation-timeline: view()`, no
`@starting-style` entrance, no `data-inview` attribute, and no `IntersectionObserver`
anywhere on the site except the one in spec 07, whose job is deferring a network request
rather than animating anything.

Concretely, the following must not appear in any section component:

- `opacity: 0` as an initial state on anything that is not a `<dialog>`-like overlay, a
  drawer panel, or the map poster cross-fade.
- `transform: translateY(...)` as an initial state on a section, heading, card, or list
  item.
- `animation-delay` computed from an item index.
- `useEffect` + `IntersectionObserver` + `setState(true)` to add a `.is-visible` class.
- `@keyframes fadeInUp` in any form, including copied from another site in this programme.

The single global transition allowance is `scroll-behavior: smooth` on `:root` for in-page
anchor navigation — `/services` has an anchor row to eight in-page blocks and `#main` is a
skip-link target — wrapped in
`@media (prefers-reduced-motion: no-preference)`, with
`scroll-margin-top: var(--header-h)` on every anchor target so the sticky header does not
cover the landing heading.

## ratio

There are no numbers, because there is nothing timed. This is the point of the spec.

The only durations on the whole site are the ones enumerated in specs 01–07: drawer
0.32 / 0.20 / 0.18s, header hovers 0.18s, call bar 0.18 / 0.12s, cards 0.22 / 0.18 / 0.09s,
accordion 0.26 / 0.18s, form 0.12 / 0.16 / 0.24s, map cross-fade 0.30s. Every one is a CSS
transition on a discrete state change, and every one is triggered by the user rather than by
scroll position. If a duration appears anywhere else in the codebase, it is a defect against
this spec.

## failure mode

The tempting version is the house style of every 2020s marketing site: sections fading up
40px as they enter the viewport, cards staggered 60ms apart. It is wrong here on four
counts, in increasing order of cost.

1. **It is not in the reference.** The clone target's motion budget is 13 hover
   transitions. Adding entrance choreography is designing a different site.
2. **It fights the customer.** Someone with a garage door stuck half-open is scrolling fast
   to find a phone number. Content that is invisible until it has finished animating is
   content they scroll straight past, and on a slow device the reveal lags the scroll enough
   that the page reads as broken.
3. **It corrupts the measurement.** Every section capture would have to wait for an
   animation whose end is not deterministic. `capture.mjs` freezes animations before
   screenshotting, which means the harness would capture the **pre-reveal** state — sections
   at `opacity: 0` — and report ~100% divergence on content that is actually correct. With
   `ITERATION_CAP = 1` there is no second attempt to discover that the instrument, not the
   build, produced the number.
4. **It is a per-section leak.** One agent in a 4-wide wave adding `fadeInUp` to its own
   section produces a page where two of nine bands animate and seven do not, which looks
   like a bug rather than like restraint. This spec exists so that any such diff is
   rejected on sight rather than argued about.

The second tempting version is CSS scroll-driven animations (`animation-timeline: view()`),
on the grounds that they are declarative, cheap, and need no JS. Same verdict for reasons
1–3; being cheap to implement is not an argument that the reference has it.

## trigger

None. There is no scroll listener, no `IntersectionObserver` for reveal purposes, no rAF
loop, and no timer anywhere in the site's own code.

- **Scroll**: observed by nothing.
- **Client-side route change**: nothing to reset, because nothing holds reveal state. A
  route change paints the new route complete on its first frame, which is also the fastest
  possible perceived navigation.
- **Re-entry / back navigation**: a restored scroll position lands on fully-painted content.
  With a reveal, it lands on a blank band that animates in after the browser has already
  restored the position, which is the most disorienting version of this pattern.

## accessibility

- The baseline **is** the reduced-motion state. There is nothing to strip under
  `prefers-reduced-motion: reduce` at the section level, which is the strongest form of
  compliance with D-19: not "we honour the preference" but "there is no motion to honour it
  about".
- No content is hidden behind an animation, so nothing depends on JS running, on an observer
  firing, or on an animation completing. A screen reader, a text browser, a print
  stylesheet, and a crawler all see the same complete document.
- `scroll-behavior: smooth` is scoped inside `@media (prefers-reduced-motion:
  no-preference)`, so a user who asks for reduced motion gets instant anchor jumps.
- Because sections never start at `opacity: 0`, there is no window during which visible text
  fails contrast against its background — a real failure mode of fade-up reveals that
  contrast audits never catch, because they sample the settled state.
- The one place motion remains load-bearing for comprehension is the drawer (spec 01), and
  it keeps a 0.01s transform under reduced motion precisely so that the transition events
  that drive its focus and `inert` bookkeeping still fire.
