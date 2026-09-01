# Sections — the contract

Route × section × class. This file is the source of truth for how every section is
measured, and `harness/diff.mjs` parses the tables below directly. Column `ref#` is the
reference section index recorded by the harness (`.harness/ref/<route>-<bp>/sections.json`);
`—` means no counterpart.

Classes:

- **FIDELITY** — same purpose, structurally equivalent content. Pixel diff, `< 2%`.
- **ADAPTED** — section retained, content deliberately swapped. Structural metrics, `< 5%`.
- **NOVEL** — no counterpart. Token conformance, `0` violations.
- **DELETED** — removed per D-02 or D-01. Not built, not measured.

**Draft status.** This is the Prompt 1 draft. Prompt 3 writes the copy and then moves
every section whose *information content* changed from FIDELITY to ADAPTED, in this file,
with the reason. Expect the FIDELITY count to fall. Do not grind a diff on a section whose
residual is words.

Row format (do not reorder columns — the parser depends on them):

`| route | id | our section | ref page | ref# | class | reason |`

## Shared shell (owned by the lead, Prompt 5)

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| shell | header | Fixed header: logo, 5-route nav, tel CTA | / | -1 | ADAPTED | Same fixed bar, same heights (177/96/224). Their mega-nav is 7 items with 19-item sub-menus; ours is five flat routes with no sub-menus (D-01), and no Locations item (D-02). Different information, same geometry. |
| shell | drawer | Mobile hamburger drawer | / | — | ADAPTED | Off-canvas right panel, 265px, overlay behind. Ours holds five links, theirs holds a nested tree. Spec in `docs/behavior/`. |
| shell | callbar | Mobile sticky call bar | / | — | NOVEL | They have a fixed bottom bar; ours is a dedicated `tel:` bar per D-04. Different element, different purpose — measured on tokens. |
| shell | footer-nap | Footer NAP: name, address, phone, hours, SERVICE_AREA sentence | / | 20 | ADAPTED | Their column is a serving-area list plus "24/7 Emergency". Ours is one SERVICE_AREA sentence (D-02) and 7:00–19:00 seven days (D-06). |
| shell | footer-links | Footer site links | / | 21 | FIDELITY | Link list, same structure and count band. Reclassify if Prompt 3's labels change the line count. |

## `/` — home

Reference order: hero · intro · why-us · svc A · svc B · svc C · discounts · projects ·
testimonials · FAQ · blog · logo strip · CTA band · footer.

Our order (structural gate, Prompt 3 item 1 — **three moves**): why-us rises above the
intro band; the intro band drops below the three service blocks; the FAQ leaves the home
page entirely and lands on `/services`.

**Dropped (Prompt 3 item 2 — three, two required):** discounts band (ref 13) invents
credentials and discount terms we may not claim (D-14); blog posts (ref 17) has no route
(D-01); partner logo strip (ref 18) is eleven other companies' marks (D-09).

**Added (two):** the map section, which D-08 makes mandatory on the home page, and the
mobile sticky call bar.

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| / | hero | Hero: H1, lede, tel CTA + callback CTA, full-bleed image | / | 7 | ADAPTED | Proposition category changes from speed/emergency to "a real person answers the phone" (Prompt 3 item 3). Same box, same CTA pair, same ±10% copy volume. |
| / | trust-row | Why choose us — claim chips | / | 9 | ADAPTED | Their six chips are 24/7 emergency, financing, military discount. Every one is an invented fact for us, so ours are `TODO(fact):` chips at the same dimensions (D-14). Also moved up one slot. |
| / | svc-a | Service feature A — image + heading + copy + CTA | / | 10 | FIDELITY | Image-left feature block, identical structure and copy volume. Garage-door subject, garage-door words, same slots. |
| / | svc-b | Service feature B — image right | / | 11 | FIDELITY | Mirror of A. |
| / | svc-c | Service feature C — image left | / | 12 | FIDELITY | Mirror of A. |
| / | intro | Intro copy band — H2 + two paragraphs | / | 8 | FIDELITY | Same purpose, same block volume; moved from slot 2 to slot 6. Position is not a class change; content equivalence is. |
| / | projects | Recent work — 8-image grid | / | 14 | FIDELITY | Same 8-item count and grid geometry. Placeholder-blocked until Prompt 10 — measured with the placeholder area excluded, and it is a known floor, not a fixable divergence. |
| / | testimonials | Testimonials | / | 15 | ADAPTED | `[TESTIMONIAL PLACEHOLDER]` blocks at realistic length, no names, no stars, no `Review`/`AggregateRating` JSON-LD (D-13). Their block carries real quotes and a review CTA. |
| / | map | Service-area map, zoom ~13, directions link | — | — | NOVEL | Required by D-08, no counterpart on their home page. Coords-only keyless embed (D-07). Token conformance only. |
| / | cta-band | "Learn more about" CTA band | / | 19 | FIDELITY | Repeated band, same structure, our copy. |
| / | discounts | *(reference section)* | / | 13 | DELETED | Invents credentials, discounts, and "24/7 emergency" (D-06, D-14). |
| / | blog | *(reference section)* | / | 17 | DELETED | No blog route (D-01). |
| / | logos | *(reference section)* | / | 18 | DELETED | Eleven third-party brand marks (D-09). |

## `/about`

Reference tail (logo strip, CTA band, footer) is shared; only the page body differs.

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| /about | title | Page title band | /about | 6 | ADAPTED | 90px band, our route name and our lede. |
| /about | story | Story: copy + photo slot | /about | 8 | ADAPTED | No founding year, no headcount, no certifications — `TODO(fact):` for each (D-17), placeholder photo per `assets/INVENTORY.md`. Their block is a company history. |
| /about | what-we-do | What we handle — list block | /about | 9 | ADAPTED | Their 83-item list is their full service tree. Ours is the eight garage-door services, grouped by symptom per Prompt 3 item 4. Different item count is a deliberate information change. |
| /about | credentials | Credentials / team — placeholder chips | — | — | NOVEL | Replaces the dropped logo strip. Every claim is `TODO(fact):` at the right dimensions. |
| /about | cta-band | CTA band | /about | 11 | FIDELITY | Shared band. |
| /about | logos | *(reference section)* | /about | 10 | DELETED | Third-party marks (D-09). |

## `/services`

Reference page: `/roof-replacement` — their per-service template. We do **not** clone the
per-service routes (D-01); the eight services live in-page with anchors.

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| /services | hero | Services hero + anchor row | /roof-replacement | 6 | ADAPTED | Theirs embeds a 5-field lead form with an email field in the hero. Ours drops the form (D-03/D-05) and carries an anchor row to the eight services instead. |
| /services | list | Eight service blocks, in-page anchors | /roof-replacement | 8 | ADAPTED | Grouped by symptom, not by door type or system (Prompt 3 item 4). No prices (D-12). Each block links `tel:` and `/contact`, never a per-service route. |
| /services | faq | FAQ accordion, 8 items | / | 16 | ADAPTED | Relocated from their home page (structural move #3). Generic garage-door technical content only — nothing about response time, pricing, warranty, or credentials. |
| /services | cta-band | CTA band | /roof-replacement | 10 | FIDELITY | Shared band. |
| /services | logos | *(reference section)* | /roof-replacement | 9 | DELETED | Third-party marks (D-09). |

## `/contact`

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| /contact | title | Page title band | /contact | 6 | ADAPTED | Our copy. |
| /contact | form | Callback form: name, phone, service, callback window, message | /contact | 9 | ADAPTED | Theirs has an email field and reCAPTCHA. Ours has neither (D-03, D-15), has no backend, and shows a "we'll call you back" state (D-05). Same field count band, different fields. |
| /contact | nap-card | Phone card + hours block | /contact | — | NOVEL | Split out of their footer into a page-level card. Token conformance. |
| /contact | map | Map, zoom ~15, beside the form, directions link | /contact | 7 | ADAPTED | They embed Mapbox/OpenStreetMap at 300px. Ours is a keyless Google coords embed (D-07), lazy, titled, aspect-ratio wrapped. Same slot, different provider — structural metrics only. |
| /contact | cta-band | CTA band | /contact | 13 | FIDELITY | Shared band. |
| /contact | logos | *(reference section)* | /contact | 12 | DELETED | Third-party marks (D-09). |

## `/privacy`

No counterpart anywhere on the reference — it has no privacy page. Entire route is NOVEL
and measured by token conformance at zero violations. Long-form type must resolve to the
Prompt 5 scale, not browser defaults.

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| /privacy | title | Page title band | — | — | NOVEL | Uses the shell band, but no reference page exists to diff against. |
| /privacy | body | Policy body, long-form | — | — | NOVEL | Generated per D-16: phone-callback form, no email collection, no analytics, no cookies beyond framework. `<!-- UNREVIEWED TEMPLATE -->` at the top. No GDPR/CCPA claims. |
| /privacy | contact | Contact section — phone + postal address only | — | — | NOVEL | No email anywhere (D-03). |

## Deleted, site-wide

| what | why |
|---|---|
| `/serving-area` page (ref, 6338–9611px, 16 blocks) | D-02. Route, nav item, footer column, sitemap entry, and every internal anchor. |
| `areaServed` city array in JSON-LD | D-02. |
| Mega-nav sub-menus (19 / 7 / 5 / 3 items) | D-01 — five routes, no per-service or per-city routes. |
| Blog (`/blog` + 5 posts) | D-01. |
| `/faqs`, `/reviews` as routes | D-01. Their content patterns survive as the `/services` FAQ and the home testimonials. |
| Partner/brand logo strip (11 marks, every page) | D-09. |
| Discounts band | D-14 / D-06. |
| reCAPTCHA, chat widget, contact modal, fixed promo bar | D-15, D-05. |
| Email field in both reference forms; any `mailto:` | D-03. |
