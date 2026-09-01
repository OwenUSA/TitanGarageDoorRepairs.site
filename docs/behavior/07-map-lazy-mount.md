# 07 — Map lazy mount

Reference evidence: one map, on `/contact` only, a ~300px-tall Mapbox / OpenStreetMap embed
(section 7). **We ship two** — home (zoom ~13) and `/contact` (zoom ~15) — as keyless Google
coordinate embeds (D-07, D-08). The home instance is NOVEL; the `/contact` instance is
ADAPTED against their section 7 on structural metrics only, since the provider differs
(KD-05).

`<BusinessMap>` is a **shared component owned by the lead** (A-6). No section agent edits it.

## mechanism

A fixed-aspect wrapper that is painted from first render, holding a poster placeholder;
the `<iframe>` is inserted into it only once the wrapper has come near the viewport.

```
wrapper: position: relative; aspect-ratio: 16 / 9;  (16 / 10 below 768)
iframe:  position: absolute; inset: 0; width: 100%; height: 100%; border: 0;
```

`aspect-ratio` on the wrapper — **not** a percentage-padding hack, and **not** a bare
`height` on the iframe. The wrapper's box is therefore known before the iframe exists, at
every width, so mounting the iframe cannot move a single pixel of the page. This is the
whole reason the component exists: an iframe that appears and pushes the footer down is a
layout shift on the page whose only job is telling somebody where we are.

Mount trigger is a single `IntersectionObserver` with `rootMargin: '200px 0px'`, which
disconnects itself the first time it fires. **Not** a scroll listener (the profile found
zero on the reference and they are the expensive way to ask this question), and not a
`setTimeout`.

`loading="lazy"` is set on the iframe as well. The two are not redundant: `loading="lazy"`
is the browser's own heuristic and still fetches earlier than we want on a long page, while
the observer controls when the element exists at all. The observer is the mechanism; the
attribute is the backstop for the no-JS case — which is also why the `<noscript>` fallback
below matters.

URL, built in `lib/business.ts` from `MAP_COORDS` and **never** from the address string
(D-07 — the address is fictional and will not geocode):

```
https://www.google.com/maps?q=35.5760,-97.5680&z=<zoom>&output=embed
```

`zoom` is a prop: 13 on home, 15 on `/contact`. Keyless, so no `.env` and no third-party
key (D-18).

Directions link, rendered as a real anchor **outside** the iframe so it works with the frame
never mounted:

```
https://www.google.com/maps/dir/?api=1&destination=35.5760,-97.5680
```

The fake address is displayed as **text** beside the map, never passed to a geocoder.

`<noscript>`: render the poster and the directions link. Do not render the iframe inside
`<noscript>` — it would load unconditionally for every no-JS visitor and defeat the point.

## ratio

| layer | property | duration | easing |
|---|---|---|---|
| iframe fade-in on `load` | `opacity` 0 → 1 | **0.30s** | `ease-out` |
| poster fade-out | `opacity` 1 → 0 | 0.30s | `ease-out` |

The two cross-fade over the same 300ms, so the poster is still at ~50% when the map is at
~50% and there is no flash of the wrapper's background between them. 300ms is longer than
the site's other transitions on purpose: this is a photographic-weight change over a large
area, and at 180ms a full-width tile swap reads as a glitch rather than as loading.

`rootMargin: 200px` — roughly one thumb-flick of runway at 390. Enough that the tiles are
usually painted by the time the section is on screen, small enough that a visitor who never
scrolls past the services block never requests a single tile from Google. Not `0px`: the map
would then start loading only once it is already being looked at.

Aspect ratios: **16/9 at 768 and above, 16/10 below**. The reference's own map is 300px tall
in a ~707px column at 768, which is 2.36:1; ours is deliberately taller at mobile because a
16/9 map at 358px wide is 201px tall and shows about four streets.

## failure mode

- **Rendering the iframe on first paint.** Three Google requests, a second document, and its
  own scripting on a page whose LCP is a hero image. The map is the least important thing
  on either route.
- **`height: 300px` on the iframe with no wrapper.** Matches the reference at one width and
  is wrong at the other two, and gives the browser nothing to reserve before mount.
- **Percentage-padding aspect hack.** Works, but the padding is a function of the *parent's*
  width, so it silently breaks the first time the map is placed in a grid column instead of
  a full-width band — which is exactly what `/contact` does (map beside the form).
- **Mounting on `window.scroll`.** Fires hundreds of times, forces layout on every read, and
  reintroduces the scroll listener the reference does not have.
- **Passing the address to the embed** (`?q=4820+Kestrel+Lane...`). It does not exist, so
  Google either drops the pin somewhere plausible-but-wrong or shows an error card. Coords
  only — this is D-07 and it is not negotiable.
- **A `title`-less iframe.** An unlabelled frame is announced as "frame" and is a WCAG 4.1.2
  failure. It is also a trivially avoidable one.
- **Letting the observer stay connected.** It keeps firing for the life of the page for no
  benefit; disconnect on first intersection.

## trigger

- **Mount**: first `IntersectionObserver` entry with `isIntersecting`, then `disconnect()`.
  Once per mount, never repeating. It never unmounts on scroll-away — tearing the iframe
  down and rebuilding it costs the same requests again.
- **Fade**: the iframe's own `load` event, not a timer. A timer that fires before the tiles
  arrive cross-fades to an empty grey frame.
- **Client-side route change**: the component unmounts with its route, so navigating
  `/` → `/contact` creates a fresh instance and a fresh observer. Nothing is cached between
  routes and nothing leaks: the observer is disconnected in the effect's cleanup as well as
  on first fire.
- **Re-entry**: scrolling back up does nothing; the iframe is already mounted and the
  observer is gone.
- **`prefers-reduced-motion`**: does not suppress the mount. The map still loads; only the
  cross-fade changes.

## accessibility

- `<iframe title="Map showing the location of Titan Garage Door Repairs" loading="lazy">` —
  the title comes from `contactMap.mapTitle` in `content/copy.ts`, not invented at the call
  site, so both instances say the same thing.
- The iframe is a keyboard trap risk: Google's embed is focusable and swallows arrow keys.
  A **skip-the-map** link immediately before it (visually hidden until focused) jumps past
  the frame, so the keyboard path through `/contact` reaches the form without panning a map
  (D-19 requires a map bypass).
- The address is real text next to the map, not only a pin, so it is readable by a screen
  reader and selectable for copying.
- "Get directions" is a real `<a>` with a descriptive accessible name
  (`contactMap.directions`), reachable whether or not the iframe ever mounts, and carries
  the 44px minimum target height.
- The poster placeholder is `alt=""` decoration (KD-03); the map's information is carried by
  the address text and the directions link, not by the image.
- No geolocation prompt, no cookie, no key, no analytics parameter on either URL (D-15).
- Contrast: the caption and address beside the map use `body-on-surface` (20.99:1) and
  `muted-on-surface` (`--color-neutral-600`, 4.58:1) — never `--color-neutral-600` on the
  `--color-neutral-200` alt band, which is 4.11:1 and fails AA for body text.
