# Asset generation prompts — Nano Banana Pro

**Prompt 10, under OVERRIDE 2 and amendment A-10. TEXT ONLY.** Nothing in this file has
been generated, sourced, or downloaded. The owner runs these prompts through **Nano Banana
Pro** and hands the files back; drop-in is the terminal step of the whole chain
(OVERRIDE 3), after which every affected section is re-diffed.

Written at the merged Prompt 10 + 11 turn. Slot IDs, dimensions, aspect ratios and
`object-fit` values come from `assets/INVENTORY.md`, which measured them off the rendered
reference. The **subject matter is ours** — garage doors, not roofs. The **art direction**
is the reference's. The **palette is ours**, from Prompt 5 + 9, and it is named explicitly
in every prompt below.

---

## The palette every prompt must be art-directed to

Seed **260721**, teal + rust. This is *not* the reference's blue/red ramp, and an image
generated against the reference's colours will come back wrong for this site. Every prompt
below names its hues inline; this table is the authority, and it is the applied
`app/globals.css` `@theme` set, not the extracted reference ramp.

| role | token | hex | how it should appear in a photograph |
|---|---|---|---|
| primary | `--color-primary` | **`#1494ae`** teal | painted metal, a door panel, workwear, a tool case, cool reflected light |
| primary deep | `--color-primary-deep` | **`#011a20`** near-black teal | shadow, garage interior depth, the dark end of every ramp |
| accent | `--color-accent` | **`#b83704`** rust orange | the single warm note: a warning label, a spring cone, low sun on a panel edge |
| accent deep | `--color-accent-deep` | **`#852604`** deep rust | the shadow side of any accent object |
| surface | `--color-surface` | `#ffffff` | white door panel, overcast highlight |
| neutral 200 | `--color-neutral-200` | `#def7ff` pale tinted | cool haze, distant concrete, glazing |
| neutral 400 | `--color-neutral-400` | `#6ea3b1` | mid-tone cool grey-teal — driveways, siding |
| neutral 600 | `--color-neutral-600` | `#497d8b` | deeper cool grey-teal |
| neutral 900 | `--color-neutral-900` | `#000001` | true black, used sparingly |

**Standing colour instruction — append to every image prompt:**

> Colour-grade the whole frame to a cool teal-and-rust palette: shadows and dark midtones
> toward deep teal-black `#011a20`, cool structural surfaces toward teal `#1494ae`, cool
> mid-greys toward `#6ea3b1` and `#497d8b`, pale cool highlights toward `#def7ff`. Exactly
> one warm accent per frame, a rust orange `#b83704` falling to `#852604` in shadow,
> occupying no more than about 10% of the frame. No blue-and-red corporate contrast, no
> teal-and-orange blockbuster grade, no oversaturation.

## Standing art-direction instruction — append to every image prompt

Taken from the reference's own photographic character: daylight trade photography,
mid-distance, moderate depth, no studio look.

> Real photography, not a render and not an illustration. Overcast or early-morning
> daylight, soft and directional, no hard midday sun, no flash. Moderate depth of field:
> the subject is sharp and the background falls off gently — roughly f/4 on a 35mm frame at
> the stated framing. Natural fine grain, as from an ISO 400 daylight exposure. No HDR
> halos, no heavy clarity, no vignette. Straight verticals, camera level, architectural
> lines not converging.

## Standing prohibition — append to every image prompt

> No readable text of any kind anywhere in the frame. No brand names, no logos, no
> manufacturer marks, no signage, no vehicle livery, no licence plates — frame them out or
> leave the vehicle out entirely. No identifiable human faces: people appear from behind, in
> profile with the face out of frame, or as hands and forearms only. No certification
> badges, no award seals, no star ratings, no price tags, no phone numbers. Nothing that
> reads as a credential or a claim.

**Why that last block is not optional.** D-09 keeps other companies' marks off this site,
D-13 forbids fabricated reviews, and **D-14 forbids fabricated credentials**. An image
generator will happily paint a plausible "Certified · Licensed · Insured" seal onto a van
door, and that is a fabricated credential regardless of who typed the prompt.

---

## How to read each entry

- **Dimensions per breakpoint** are exact output pixel sizes, given as plain text. Do not
  use an aspect-ratio flag — generate at the stated pixel size, or generate larger and
  downscale, but deliver the exact pixels listed.
- A **second crop** appears only where the slot's aspect ratio actually changes across
  390 / 768 / 1440 by more than a 1.15 ratio spread — the same rule the placeholder
  generator used. Where there is no second crop, one image serves all three widths and
  `object-fit` does the rest.
- `object-fit` is what the CSS does with the delivered file. `cover` means the edges are
  expendable and the subject must sit inside a safe centre; `contain` means the whole frame
  is shown and nothing may be cropped.

---

# 1 — Logo (resolves `TODO(fact): logo asset` — F-01, KD-04)

**Slot IDs** `logo-header`, `logo-footer`, `favicon` · **route** all · **section** header,
footer-nap, head

| slot | 390 | 768 | 1440 | aspect | object-fit |
|---|---|---|---|---|---|
| `logo-header` | 190 × 76 px | 180 × 72 px | 250 × 100 px | 2.50 | contain |
| `logo-footer` | 198 × 79 px | 188 × 75 px | 171 × 68 px | 2.51 | contain |
| `favicon` | 32 × 32 px | 32 × 32 px | 32 × 32 px | 1.00 | contain |

Deliver **one master lockup** at 1000 × 400 px on a transparent background, a **reversed
master** at the same size, and the **icon alone** at 512 × 512 px. Every slot above is a
downscale of those three.

> A flat vector wordmark-and-icon lockup for a garage door repair company called **Titan
> Garage Door Repairs**. Horizontal lockup: icon on the left, wordmark on the right,
> optically centred on the cap height, the icon occupying roughly the left quarter of the
> 2.5:1 frame.
>
> **Wordmark:** the words "TITAN GARAGE DOOR REPAIRS" set in **Mohave** — a semi-condensed
> geometric display sans with tall, narrow capitals and flat terminals — or the closest
> available match. "TITAN" on the first line at the largest size; "GARAGE DOOR REPAIRS" on
> a second line beneath it at roughly 40% of that size, letter-spaced wider, left-aligned
> with the first line. Uppercase throughout. No italic, no outline, no bevel, no drop
> shadow, no gradient on the type.
>
> **Icon:** a single geometric mark reading as a sectional garage door — a rounded-corner
> square divided into four equal horizontal panels, the topmost panel shorter than the
> rest, drawn as flat filled shapes rather than outlines. No house, no roof, no van, no
> spanner, no shield, no ribbon, no swoosh.
>
> **Colour:** icon in teal `#1494ae` with its lowest panel in rust `#b83704`; "TITAN" in
> deep teal-black `#011a20`; "GARAGE DOOR REPAIRS" in `#497d8b`. The reversed variant sets
> the wordmark in white `#ffffff` and keeps the icon teal `#1494ae` with the rust panel
> unchanged, for the dark footer band.
>
> Flat vector, hard edges, transparent background. No photographic texture, no 3D, no
> mock-up on a wall or a van, no reflection, no shadow. The mark must stay legible when the
> whole lockup is 32 pixels tall.
>
> **Favicon:** the icon alone, square, no wordmark, transparent background, panel divisions
> thickened so they survive at 32 × 32 and 16 × 16 pixels.
>
> Output sizes: master lockup **1000 × 400 pixels**; reversed master lockup **1000 × 400
> pixels**; icon alone **512 × 512 pixels**.

---

# 2 — `home-hero-bg`

**route** `/` · **section** `hero` · **object-fit** `cover`, position `50% 0%`

| bp | dimensions | aspect |
|---|---|---|
| 390 | **390 × 1000 pixels** | 0.39 — tall portrait |
| 768 | **768 × 1004 pixels** | 0.76 — portrait |
| 1440 | **1440 × 820 pixels** | 1.76 — landscape |

The aspect flips from tall portrait to landscape, so this slot takes **two crops**. The
band carries a scrim (`#011a20` → `#852604`, 90% opacity) over the whole image with the H1,
lede and both CTAs on top of it, so the frame needs an uncomplicated field for type and
must not fight the scrim.

**Crop A — landscape, for 1440:**

> A wide daylight photograph of the front of an ordinary two-car suburban house, framed
> square-on to a closed double-width sectional garage door that fills the right two-thirds
> of the frame. The door is a plain long-panel steel door in off-white `#ffffff` cooling to
> `#def7ff` in shade, with clean horizontal panel seams running across the frame. A concrete
> driveway in cool grey-teal `#6ea3b1` runs toward the camera along the bottom edge. The
> left third is open and uncluttered — driveway and a plain wall in shadow — because heading
> type sits there. A technician in rust-orange `#b83704` workwear stands at the left edge of
> the door with his back to the camera, one hand on the door edge, face not visible.
> Early-morning overcast light, no sun flare, no sky above the roof line.
>
> Output size: **1440 × 820 pixels**.

**Crop B — portrait, for 390 and 768:**

> The same scene and the same house, recomposed vertically. The closed off-white sectional
> door fills the lower two-thirds of the frame with its horizontal panel seams running edge
> to edge; the wall and eave above are plain and in shadow, deep teal-black `#011a20`,
> leaving a clear upper third for type. The technician in rust-orange `#b83704` workwear
> stands at the lower left with his back to camera, face not visible. Same overcast morning
> light, same cool grade.
>
> Output sizes: **390 × 1000 pixels** and **768 × 1004 pixels** — the wider one showing
> slightly more driveway along the bottom.

*(Append the three standing blocks: colour, art direction, prohibition.)*

---

# 3 — `home-trust-img`

**route** `/` · **section** `trust-row` · **object-fit** `cover`, corner radius 30 px

| bp | dimensions | aspect |
|---|---|---|
| 390 | **311 × 227 pixels** | 1.37 |
| 768 | **311 × 227 pixels** | 1.37 |
| 1440 | **360 × 223 pixels** | 1.61 |

Ratio spread 1.18 → **second crop** at 1440's wider ratio. The 30 px radius is applied by
CSS; deliver square corners and do not draw the radius into the file.

> A close, waist-level photograph of a technician's hands and forearms working on the
> torsion spring bar above a garage door opening: one gloved hand steadying the shaft, a
> winding bar in the other. Rust-orange `#b83704` glove cuffs are the only warm note. The
> spring, bracket and shaft are cool grey-teal metal, `#6ea3b1` on the lit edges falling to
> `#011a20` in the garage interior behind. Face and torso out of frame entirely. Shallow
> depth of field: the spring bracket sharp, the interior soft.
>
> Output sizes: **360 × 223 pixels** (wide crop) and **311 × 227 pixels** (tighter crop,
> same subject, slightly more headroom above the shaft).

*(Append the three standing blocks.)*

---

# 4 — `home-svc-a-img`

**route** `/` · **section** `svc-a`, image left · **object-fit** `cover`, radius 25 px

| bp | dimensions | aspect |
|---|---|---|
| 390 | **327 × 236 pixels** | 1.39 |
| 768 | **337 × 243 pixels** | 1.39 |
| 1440 | **659 × 400 pixels** | 1.65 |

Ratio spread 1.19 → **second crop**. The section copy is the "it will not close, or it
bounces straight back up" symptom block, so the subject is a safety sensor and a door
mid-travel.

> A photograph looking into an open residential garage from just outside, the sectional
> door stopped halfway up so the horizontal panel edges cut across the upper frame. At floor
> level on the near jamb, a small photo-eye safety sensor on its bracket is sharp in the
> foreground with a single rust-orange `#b83704` indicator lens. The garage interior behind
> falls away into deep teal-black `#011a20`. Concrete floor in cool grey-teal `#6ea3b1`. No
> people in frame.
>
> Output sizes: **659 × 400 pixels** and **337 × 243 pixels**.

*(Append the three standing blocks.)*

---

# 5 — `home-svc-b-img`

**route** `/` · **section** `svc-b`, image right · **object-fit** `cover`, radius 25 px

| bp | dimensions | aspect |
|---|---|---|
| 390 | **327 × 218 pixels** | 1.50 |
| 768 | **337 × 224 pixels** | 1.50 |
| 1440 | **659 × 400 pixels** | 1.65 |

Ratio spread 1.10 → **one crop only**; `cover` absorbs the rest.

> A photograph taken from inside a garage looking up at a ceiling-mounted chain-drive opener
> unit, the rail running away from the camera toward the door with the trolley visible on
> it. The opener housing is cool grey `#497d8b`; a rust-orange `#b83704` emergency-release
> cord hangs from the trolley into the middle of the frame, the only warm element. Daylight
> comes from the open door behind the camera, so the rail is lit along its top edge and the
> joists above fall to `#011a20`. No people, no text on the housing.
>
> Output size: **659 × 400 pixels**.

*(Append the three standing blocks.)*

---

# 6 — `home-svc-c-img`

**route** `/` · **section** `svc-c`, image left · **object-fit** `cover`, radius 25 px

| bp | dimensions | aspect |
|---|---|---|
| 390 | **327 × 217 pixels** | 1.51 |
| 768 | **337 × 224 pixels** | 1.50 |
| 1440 | **659 × 400 pixels** | 1.65 |

Ratio spread 1.10 → **one crop only**.

> A tight three-quarter photograph of a garage door roller sitting in its track, taken from
> inside the garage at the height of the second panel. The steel track curves away out of
> focus toward the upper left; the roller, its stem and the hinge plate are sharp, cool
> grey-teal metal `#6ea3b1` with `#1494ae` in the reflections. One rust-orange `#b83704`
> bracket bolt head sits just off centre. The garage interior behind is `#011a20` and out of
> focus. No people, no packaging, no text.
>
> Output size: **659 × 400 pixels**.

*(Append the three standing blocks.)*

---

# 7 — `home-project-1` … `home-project-8`

**route** `/` · **section** `projects`, slider · **object-fit** `cover`

| bp | dimensions | aspect |
|---|---|---|
| 390 | **252 × 200 pixels** | 1.26 |
| 768 | **194 × 200 pixels** | 0.97 — near square |
| 1440 | **378 × 300 pixels** | 1.26 |

Ratio spread 1.30 → **two crops per tile**: the 1.26 landscape, and a near-square 0.97 for
the 768 tile. Eight tiles, eight distinct doors, shot as one consistent set — same light,
same distance, same height — so the row reads as one job book rather than eight stock
photos. **No captions are written for these**; see the exclusions at the foot of this file.

Base prompt, then the eight variations:

> A square-on daylight photograph of one closed residential garage door, filling the frame
> from just inside the trim on both sides, shot from about eight metres back at door centre
> height so the panel seams run perfectly horizontal. A strip of driveway in cool grey-teal
> `#6ea3b1` along the bottom edge and a strip of wall above. Overcast morning light. No
> people, no vehicles, no house number, no text.

| tile | door |
|---|---|
| 1 | White `#ffffff` long-panel steel double door, four rows of panels, no windows |
| 2 | Pale cool-grey `#def7ff` short-panel steel double door with a top row of four square windows |
| 3 | Teal-painted `#1494ae` flush modern double door, no seams beyond the panel lines |
| 4 | Dark `#011a20` carriage-house style double door with vertical strapping, no lettering on the hardware |
| 5 | White `#ffffff` single-width door on a narrower opening, three panel rows |
| 6 | Cool grey-teal `#497d8b` insulated steel double door with a long row of frosted windows |
| 7 | Commercial roll-up steel shutter, ribbed, `#6ea3b1`, in a plain masonry opening |
| 8 | White `#ffffff` double door photographed half open, showing the track and the top panel tilted into the horizontal |

> Output sizes, for each of the eight: **378 × 300 pixels** (landscape) and **194 × 200
> pixels** (near-square recrop of the same frame, tighter on the door).

*(Append the three standing blocks.)*

---

# 8 — `home-map-poster`

**route** `/` · **section** `map` · **object-fit** `cover` · OURS-NEW

| bp | dimensions | aspect |
|---|---|---|
| 390 | **359 × 300 pixels** | 1.20 |
| 768 | **707 × 300 pixels** | 2.36 |
| 1440 | **1325 × 360 pixels** | 3.68 |

Ratio spread 3.08 → **two crops**. This is the still that sits *behind* the lazily mounted
Google embed (`docs/behavior/07-map-lazy-mount.md`), visible for a fraction of a second and
behind the iframe after that. It must not look like a map, or it will read as a broken one.

> An abstract flat-graphic band — not a photograph, not a map. A field of deep teal-black
> `#011a20` crossed by thin `#497d8b` lines suggesting a street grid at a very shallow angle,
> fading toward both short edges into `#011a20`. A single soft rust-orange `#b83704` circular
> glow, about 6% of the frame width, at the optical centre. No labels, no place names, no
> road numbers, no compass, no pin icon, and no cartographic styling that would read as a
> real map of a real place. Flat, no photographic texture, no grain.
>
> Output sizes: **1325 × 360 pixels** (wide band) and **359 × 300 pixels** (near-square, the
> same graphic recomposed rather than cropped).

*(Append the colour block. The art-direction and prohibition blocks do not apply — this one
is deliberately not a photograph.)*

---

# 9 — `about-story-img`

**route** `/about` · **section** `story` · **object-fit** `contain`

| bp | dimensions | aspect |
|---|---|---|
| 390 | **359 × 192 pixels** | 1.87 |
| 768 | **707 × 378 pixels** | 1.87 |
| 1440 | **395 × 211 pixels** | 1.87 |

Aspect is constant → **one crop**, delivered at the largest size. `object-fit: contain`
means **nothing may be cropped** — compose to the full frame.

> A wide daylight photograph of a small garage door service van parked at the kerb with its
> side doors open and a technician, seen from behind, lifting a coil of cable and a winding
> bar out of the load space. The van is plain cool grey-teal `#497d8b` with **no livery, no
> lettering, no phone number and no licence plate visible** — park it so the plate is out of
> frame. The technician's workwear carries the single rust-orange `#b83704` note. Suburban
> street behind, soft, in `#6ea3b1` and `#def7ff`. Overcast light. Face not visible.
>
> Output size: **707 × 378 pixels**.

*(Append the three standing blocks.)*

---

# 10 — `services-hero-bg`

**route** `/services` · **section** `hero` · **object-fit** `cover`

| bp | dimensions | aspect |
|---|---|---|
| 390 | **390 × 758 pixels** | 0.51 — portrait |
| 768 | **768 × 846 pixels** | 0.91 — near square |
| 1440 | **1440 × 676 pixels** | 2.13 — wide landscape |

Aspect flips → **two crops**. Same scrim treatment as the home hero, so the same rule
applies: an uncomplicated field for type, and nothing that fights `#011a20` → `#852604`.

**Crop A — wide landscape, 1440:**

> A wide daylight photograph of three adjacent commercial roll-up doors in a plain masonry
> service bay, shot square-on from about twelve metres. The left door is fully closed, the
> middle one is halfway up showing the ribbed curtain rolling into its barrel, the right one
> is open onto a dark interior in `#011a20`. Ribbed steel curtains in cool grey-teal
> `#6ea3b1` and `#497d8b`. Concrete apron across the bottom third. One rust-orange `#b83704`
> bollard at the right edge. No people, no signage, no bay numbers, no vehicles.
>
> Output size: **1440 × 676 pixels**.

**Crop B — portrait and near-square, 390 and 768:**

> The same service bay recomposed vertically on the single half-open middle roll-up door:
> the ribbed curtain fills the lower two-thirds, and the barrel with the dark opening above
> it fills the upper third in `#011a20` so heading type has a clear field. The rust-orange
> `#b83704` bollard sits at the lower right corner. Same overcast light, same grade.
>
> Output sizes: **390 × 758 pixels** and **768 × 846 pixels**.

*(Append the three standing blocks.)*

---

# 11 — `services-item-1` … `services-item-8`

**route** `/services` · **section** `list` · **object-fit** `cover`, radius 25 px · OURS-NEW

| bp | dimensions | aspect |
|---|---|---|
| 390 | **327 × 218 pixels** | 1.50 |
| 768 | **337 × 224 pixels** | 1.50 |
| 1440 | **659 × 400 pixels** | 1.65 |

Ratio spread 1.10 → **one crop each**. Eight images, one per service, in the order the page
lists them. Shoot them as one consistent set — same light, same working distance — so the
list does not read as eight unrelated stock photos.

Base prompt:

> A close daylight working photograph, subject sharp and the garage interior falling off
> into deep teal-black `#011a20` behind it. Cool grey-teal metal `#6ea3b1` and `#497d8b`
> throughout, exactly one rust-orange `#b83704` element per frame. Where a person appears it
> is hands and forearms only, face and torso out of frame.

| item | service | subject |
|---|---|---|
| 1 | spring repair and replacement | A torsion spring on its shaft above the door opening, winding bar engaged in the cone, gloved hands only |
| 2 | opener repair and installation | The head unit of a ceiling opener with its cover off, gears and drive visible, a hand steadying it |
| 3 | cable / roller / track repair | A frayed lift cable running off its drum at the end of the torsion shaft, drum sharp, hands out of frame |
| 4 | panel replacement | A single door panel standing upright on a driveway beside the opening it is going into, seen edge-on, no people |
| 5 | off-track and misaligned door correction | A door panel visibly out of its vertical track, the roller clear of the rail, the track bent slightly outward |
| 6 | new residential door installation | A new white `#ffffff` sectional door part-installed, the lowest two panel rows in place and the opening open above them |
| 7 | commercial and roll-up doors | A ribbed steel roll-up curtain and its barrel above a loading opening, seen from below at an angle |
| 8 | annual maintenance and tune-up | A hand applying lubricant to a hinge and roller stem on a closed door's third panel, oil can in frame with no label on it |

> Output size, for each of the eight: **659 × 400 pixels**.

*(Append the three standing blocks.)*

---

# 12 — `contact-map-poster`

**route** `/contact` · **section** `map` · **object-fit** `cover` · OURS-NEW

| bp | dimensions | aspect |
|---|---|---|
| 390 | **359 × 300 pixels** | 1.20 |
| 768 | **707 × 300 pixels** | 2.36 |
| 1440 | **636 × 300 pixels** | 2.12 |

Ratio spread 1.97 → **two crops**. Identical treatment to `home-map-poster`; use the same
graphic so the two pages agree, recomposed to these sizes.

> The same abstract flat-graphic band as `home-map-poster`: deep teal-black `#011a20`
> crossed by thin `#497d8b` street-grid lines at a shallow angle, one soft rust-orange
> `#b83704` circular glow at the optical centre, no labels, no place names, no pin icon, no
> cartographic styling. Recomposed rather than cropped for each output size.
>
> Output sizes: **707 × 300 pixels** and **359 × 300 pixels**.

*(Append the colour block only.)*

---

# 13 — `home-cta-media`

**route** all four routes that render the shared band · **section** `cta-band` ·
**object-fit** `cover`

| bp | dimensions | aspect |
|---|---|---|
| 390 | **359 × 298 pixels** | 1.21 |
| 768 | **339 × 298 pixels** | 1.14 |
| 1440 | **636 × 298 pixels** | 2.13 |

Ratio spread 1.87 → **two crops**. This is a **still poster only — there is no video in this
build** (`assets/INVENTORY.md`: `<video>` count is 0 on all four reference pages at all
three widths). It sits on the gradient band `#011a20` → `#852604`, so it has to hold up
against a saturated warm background: keep the image cool and let the band supply the warmth.

> A calm mid-distance daylight photograph of a technician, seen from behind and slightly to
> one side, standing at the open door of a garage with a closed sectional door beside him,
> writing on a clipboard. Face not visible at any angle. Workwear in cool grey-teal `#497d8b`
> with a single rust-orange `#b83704` detail. The garage interior behind is `#011a20`; the
> driveway is `#6ea3b1`. Nothing written on the clipboard is legible — it reads as texture,
> not text.
>
> Output sizes: **636 × 298 pixels** (wide) and **359 × 298 pixels** (tighter, same subject).

*(Append the three standing blocks.)*

---

# Slots deliberately NOT written, and why

This section is as load-bearing as the prompts above. A generator will produce any of these
happily and convincingly, and every one would be a fabricated fact shipped as an image —
exactly what D-13 and D-14 exist to prevent. **They resolve as facts, not as images.**

| slot / element | route · section | why no prompt was written |
|---|---|---|
| `about-credentials-1`, `-2`, `-3` (179 × 100 / 147 × 147 / 265 × 100 px) | `/about` · `credentials` | **D-14.** These are the badge chips standing where the reference puts eleven manufacturer and trade marks. A generated "licensed · bonded · insured" seal, a fabricated certification badge, or an invented association crest is a fabricated credential no matter how it was produced. They stay `TODO(fact):` chips at the measured dimensions — F-02 and F-05, facts-needed rows 8, 9 and 10 — until the real licence number, the real insurance carrier and the real certifications exist. |
| The claim chips on the home `trust-row` | `/` · `trust-row` | **D-14.** Same reason. The reference's six chips are "24/7 Emergency", "Financing Available", "We Price Match", "Since 2013", a manufacturer certification and "Warranties Available" — six facts we do not have. Three of ours render as literal `TODO(fact)` strings and no image will be generated to stand in for them. |
| Testimonial portraits, customer photos | `/` · `testimonials` | **D-13.** The band ships three literal `[TESTIMONIAL PLACEHOLDER]` blocks with no names and no quotes, and the site carries no `Review` or `AggregateRating` JSON-LD at all. A generated portrait of a "customer" is a fabricated review with a face on it. The 60 px lucide icon already in the band is the only graphic there. |
| Star-rating graphics, review-count badges, jobs-completed counters | `/` · `trust-row`, `testimonials` | **D-13, D-14.** F-09 and F-10. Not content gaps — claims. |
| Any van livery, uniform logo, licence plate or house number | every photographic slot | **D-09** and the standing prohibition. Written into every prompt above as an explicit exclusion rather than left to the generator's judgement, because the generator's default is to invent one. |
| The 11 partner badge marks, the coupon image, the 5 blog stock images, the reference favicon | deleted reference slots | Never built. `assets/INVENTORY.md` inventories them under "Deleted reference slots" so nobody re-adds them by reading the reference again. |

---

# Delivery checklist for the drop-in turn

1. Files land in `public/assets/<slot-id>.<ext>`; an `-m` suffix marks the second crop,
   matching the placeholder naming already in `public/placeholders/`.
2. `assets/INVENTORY.md` status moves `PLACEHOLDER` → `ACQUIRED`, per row.
3. `docs/known-divergence.md` **KD-03** closes for every row that received a file, and
   **KD-04** closes when the logo lands.
4. Every affected section is re-diffed at all three breakpoints and `rendertruth.mjs` is
   re-run. A real photograph changes the painted tones behind overlaid text, which is
   precisely the defect class that gate exists to catch — placeholders are flat fills and
   cannot fail it; photographs can.
5. `docs/facts-needed.md` **F-01 closes. F-02, F-05, F-09 and F-10 do not** — no image in
   this file resolves them.
