# Behavior specs — Prompt 4

One file per non-obvious interaction, written from the Prompt 1 state captures
(`.harness/profile/home-{390,1440}/`) and the rAF motion trace
(`.harness/motion/home-{390,1440}.json`). **Prompt 4 implements nothing.** Prompt 5 wires
the shell ones (drawer, header, call bar, focus); Prompts 6-7 wire the section ones.

Anatomy, identical in every file:

1. **mechanism** — the exact CSS property or API, and what NOT to use where there is a
   plausible wrong choice.
2. **ratio** — the numbers, and what they produce perceptually.
3. **failure mode** — the tempting-but-wrong version, and why it reads wrong.
4. **trigger** — what fires it, once or repeating, re-entry, and client-side route change.
5. **accessibility** — labels, hidden state, focus, reduced motion.

Governing facts from `docs/profile.md` §3, which constrain every file here:

- `continuous: 0` — nothing on the reference changes transform or opacity as a function of
  scrollY. There is **no scroll choreography** to clone.
- `headerDistinctStates: 1` — the fixed header never shrinks, recolors, or transforms.
- `libs: []` — no GSAP, ScrollTrigger, Lenis, Locomotive, ScrollMagic, AOS, Swiper,
  Framer. No `IntersectionObserver`, no scroll listeners.
- `animatedElements: 13` of ~2000 — hover transitions on buttons and cards, nothing else.

`framer-motion` is therefore **not** justified (Appendix A requires the profile to say so
explicitly). CSS transitions plus one `IntersectionObserver` for map lazy-mount cover the
entire site. Every duration below is a CSS transition, not a JS animation.

| # | file | owner |
|---|---|---|
| 1 | `01-mobile-nav-drawer.md` | lead, Prompt 5 |
| 2 | `02-sticky-header.md` | lead, Prompt 5 |
| 3 | `03-mobile-call-bar.md` | lead, Prompt 5 |
| 4 | `04-service-card-hover-press.md` | section agents, Prompts 6-7 |
| 5 | `05-faq-accordion.md` | `/services` agent, Prompt 7 |
| 6 | `06-form-states.md` | `/contact` agent, Prompt 7 |
| 7 | `07-map-lazy-mount.md` | lead, Prompt 5 (component) / Prompt 6 (home slot) |
| 8 | `08-scroll-reveal.md` | **nobody — this spec forbids the feature** |
