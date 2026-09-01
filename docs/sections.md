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

**Status: reclassified by Prompt 3 (copy shipped).** The copy in `content/copy.ts` is
written and gated, so every section whose *information content* changed has been moved
FIDELITY -> ADAPTED below, with the reason on the row. **Nine sections moved.** Two
FIDELITY sections survive, and they survive only because their content really is
structurally equivalent — a link list and a repeated CTA band.

Do not grind a pixel diff on an ADAPTED row. If a FIDELITY row will not close and the
residual is words, the class is wrong: move it here first, then re-measure structurally.

Row format (do not reorder columns — the parser depends on them):

`| route | id | our section | ref page | ref# | class | reason |`

## Shared shell (owned by the lead, Prompt 5)

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| shell | header | Fixed header: logo, 5-route nav, tel CTA | / | -1 | ADAPTED | Same fixed bar, same heights (177/96/224). Their mega-nav is 7 items with 19-item sub-menus; ours is five flat routes with no sub-menus (D-01), and no Locations item (D-02). Different information, same geometry. |
| shell | drawer | Mobile hamburger drawer | / | — | ADAPTED | Off-canvas right panel, 265px, overlay behind. Ours holds five links, theirs holds a nested tree. Spec in `docs/behavior/`. |
| shell | callbar | Mobile sticky call bar | / | — | NOVEL | They have a fixed bottom bar; ours is a dedicated `tel:` bar per D-04. Different element, different purpose — measured on tokens. |
| shell | footer-nap | Footer NAP: name, address, phone, hours, SERVICE_AREA sentence | / | 20 | ADAPTED | Their column is a serving-area list plus "24/7 Emergency". Ours is one SERVICE_AREA sentence (D-02) and 7:00–19:00 seven days (D-06). |
| shell | footer-links | Footer site links | / | 21 | **ADAPTED** | *Was FIDELITY.* Their four links are service pages; ours are the five fixed routes (D-01), one of which is Privacy, which they do not have. Different item count and different destinations = different information (-8.8%). |

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
| / | svc-a | Service feature A — image + heading + copy + CTA | / | 10 | **ADAPTED** | *Was FIDELITY.* Prompt 3 item 4: their block is named for a product line ("Residential and Commercial Roof Installation"); ours is named for a symptom ("It will not close, or it bounces straight back up"). The heading answers a different question, so the information changed, not just the wording. Structure and volume are unchanged (+8.9%). |
| / | svc-b | Service feature B — image right | / | 11 | **ADAPTED** | *Was FIDELITY.* Same reason as svc-a — regrouped by symptom (+3.0%). |
| / | svc-c | Service feature C — image left | / | 12 | **ADAPTED** | *Was FIDELITY.* Same reason as svc-a — regrouped by symptom (-9.5%). |
| / | intro | Intro copy band — H2 + two paragraphs | / | 8 | **ADAPTED** | *Was FIDELITY.* Their two paragraphs are an awards-and-credentials pitch. Ours carries the proposition — who answers the phone and what happens on the call — and every award claim is gone under D-14. Different information, same volume (-7.5%). |
| / | projects | Recent work — 8-image grid | / | 14 | FIDELITY | **Held.** The section is a heading plus an 8-item grid; the item count, grid geometry, and copy volume are all equivalent (-8.8%, 31 vs 34 chars). Placeholder-blocked until Prompt 10 — measured with the placeholder area excluded, KD-03. |
| / | testimonials | Testimonials | / | 15 | ADAPTED | `[TESTIMONIAL PLACEHOLDER]` blocks at realistic length, no names, no stars, no `Review`/`AggregateRating` JSON-LD (D-13). Their block carries real quotes and a review CTA. |
| / | map | Service-area map, zoom ~13, directions link | — | — | NOVEL | Required by D-08, no counterpart on their home page. Coords-only keyless embed (D-07). Token conformance only. |
| / | cta-band | "Learn more about" CTA band | / | 19 | FIDELITY | **Held.** Two short headings plus one paragraph and a CTA, repeated identically on every route. Same structure, same volume (-3.4%), no information claim in it beyond the business name. |
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
| /about | cta-band | CTA band | /about | 11 | FIDELITY | **Held.** Shared band, identical to the home instance. |
| /about | logos | *(reference section)* | /about | 10 | DELETED | Third-party marks (D-09). |

## `/services`

Reference page: `/roof-replacement` — their per-service template. We do **not** clone the
per-service routes (D-01); the eight services live in-page with anchors.

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| /services | hero | Services hero + anchor row | /roof-replacement | 6 | ADAPTED | Theirs embeds a 5-field lead form with an email field in the hero. Ours drops the form (D-03/D-05) and carries an anchor row to the eight services instead. |
| /services | list | Eight service blocks, in-page anchors | /roof-replacement | 8 | ADAPTED | Grouped by symptom, not by door type or system (Prompt 3 item 4). No prices (D-12). Each block links `tel:` and `/contact`, never a per-service route. |
| /services | faq | FAQ accordion, 8 items | / (relocated) | 16 | ADAPTED | Relocated from their home page (structural move #3). Generic garage-door technical content only — nothing about response time, pricing, warranty, or credentials. |
| /services | cta-band | CTA band | /roof-replacement | 10 | FIDELITY | **Held.** Shared band. |
| /services | logos | *(reference section)* | /roof-replacement | 9 | DELETED | Third-party marks (D-09). |

## `/contact`

| route | id | our section | ref page | ref# | class | reason |
|---|---|---|---|---|---|---|
| /contact | title | Page title band | /contact | 6 | ADAPTED | Our copy. |
| /contact | form | Callback form: name, phone, service, callback window, message | /contact | 9 | ADAPTED | Theirs has an email field and reCAPTCHA. Ours has neither (D-03, D-15), has no backend, and shows a "we'll call you back" state (D-05). Same field count band, different fields. |
| /contact | nap-card | Phone card + hours block | /contact | — | NOVEL | Split out of their footer into a page-level card. Token conformance. |
| /contact | map | Map, zoom ~15, beside the form, directions link | /contact | 7 | ADAPTED | They embed Mapbox/OpenStreetMap at 300px. Ours is a keyless Google coords embed (D-07), lazy, titled, aspect-ratio wrapped. Same slot, different provider — structural metrics only. |
| /contact | cta-band | CTA band | /contact | 13 | FIDELITY | **Held.** Shared band. |
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

---

## Machine-readable contract - the table `diff.mjs` actually parses

The shared harness reads this file with a fixed column order:

`| route | ref section id | our section id | CLASS | reason |`

**The human tables above use a different order and match ZERO rows.** That silently
defaults every section to FIDELITY - the failure mode CLAUDE.md names as the most
expensive one on this build, and the same class of bug as the Prompt 1 harness defect.
Rather than reorder forty documented rows, the contract is restated below in the order the
parser expects. **The two must agree: if you change a class above, change it here in the
same edit.**

Two further things the parser needs that the human tables do not carry:

1. **The ref column is the reference's own section id**, not the ordinal `ref#` recorded
   above. Those ids come from the canonical (1440) capture,
   `.harness/cap/ref/<route>-1440/meta.json`, and `slugOf()` strips the leading `sNN-`
   before lookup - so `s19-e4ad708c` is written here as `e4ad708c`. Without this column the
   alias map is empty, identity pairing (PASS 1) never fires, and every deliberately moved
   or dropped band mispairs on page progress.
2. **Our components must declare the same id** in `data-section`, or PASS 1 has nothing to
   match. The shell already does (`header`, `footer-nap`, `footer-links`, `callbar`); the
   Prompt 6-7 wave must do the same for every section it builds.

Shell rows are repeated per route because the parser keys on `route::id`. Rows named
`ref-*` are reference bands that are states rather than sections on our side (their top
strip, the contact modal, the two off-canvas drawer bands) or unnamed spacer strips; they
are marked DELETED so they stop being scored as missing sections.

Known gaps, deliberately left rather than faked:

- `/services::faq` is relocated from the reference's **home** page. The harness pairs
  within a route, so it has no same-route counterpart and will report UNPAIRED. Measure it
  structurally by hand against home `090e14dc` or floor it; do not chase the UNPAIRED.
- `/privacy` has no reference page at all. Every row is NOVEL and measured once (A-9).
- The `stub` rows are the Prompt 5 scaffold band and are deleted by the build wave.

| route | ref | id | class | reason |
|---|---|---|---|---|
| / | ac810934 | header | ADAPTED | fixed bar, same heights 177/96/224; flat 5-route nav, no mega-nav |
| / |  | drawer | ADAPTED | off-canvas right panel; hidden when closed, so never captured as a band |
| / |  | callbar | NOVEL | dedicated tel: bar (D-04); theirs is a promo bar |
| / | e4ad708c | footer-nap | ADAPTED | one SERVICE_AREA sentence (D-02) and 07:00-19:00 seven days (D-06) |
| / | c52c188e | footer-links | ADAPTED | five fixed routes incl. Privacy, which they do not have |
| / |  | stub | NOVEL | Prompt 5 scaffold band; deleted by the Prompt 6-7 wave |
| /about | ac810934 | header | ADAPTED | fixed bar, same heights 177/96/224; flat 5-route nav, no mega-nav |
| /about |  | drawer | ADAPTED | off-canvas right panel; hidden when closed, so never captured as a band |
| /about |  | callbar | NOVEL | dedicated tel: bar (D-04); theirs is a promo bar |
| /about | e4ad708c | footer-nap | ADAPTED | one SERVICE_AREA sentence (D-02) and 07:00-19:00 seven days (D-06) |
| /about | c52c188e | footer-links | ADAPTED | five fixed routes incl. Privacy, which they do not have |
| /about |  | stub | NOVEL | Prompt 5 scaffold band; deleted by the Prompt 6-7 wave |
| /services | ac810934 | header | ADAPTED | fixed bar, same heights 177/96/224; flat 5-route nav, no mega-nav |
| /services |  | drawer | ADAPTED | off-canvas right panel; hidden when closed, so never captured as a band |
| /services |  | callbar | NOVEL | dedicated tel: bar (D-04); theirs is a promo bar |
| /services | e4ad708c | footer-nap | ADAPTED | one SERVICE_AREA sentence (D-02) and 07:00-19:00 seven days (D-06) |
| /services | c52c188e | footer-links | ADAPTED | five fixed routes incl. Privacy, which they do not have |
| /services |  | stub | NOVEL | Prompt 5 scaffold band; deleted by the Prompt 6-7 wave |
| /contact | ac810934 | header | ADAPTED | fixed bar, same heights 177/96/224; flat 5-route nav, no mega-nav |
| /contact |  | drawer | ADAPTED | off-canvas right panel; hidden when closed, so never captured as a band |
| /contact |  | callbar | NOVEL | dedicated tel: bar (D-04); theirs is a promo bar |
| /contact | e4ad708c | footer-nap | ADAPTED | one SERVICE_AREA sentence (D-02) and 07:00-19:00 seven days (D-06) |
| /contact | c52c188e | footer-links | ADAPTED | five fixed routes incl. Privacy, which they do not have |
| /contact |  | stub | NOVEL | Prompt 5 scaffold band; deleted by the Prompt 6-7 wave |
| /privacy |  | header | ADAPTED | fixed bar, same heights 177/96/224; flat 5-route nav, no mega-nav |
| /privacy |  | drawer | ADAPTED | off-canvas right panel; hidden when closed, so never captured as a band |
| /privacy |  | callbar | NOVEL | dedicated tel: bar (D-04); theirs is a promo bar |
| /privacy |  | footer-nap | ADAPTED | one SERVICE_AREA sentence (D-02) and 07:00-19:00 seven days (D-06) |
| /privacy |  | footer-links | ADAPTED | five fixed routes incl. Privacy, which they do not have |
| /privacy |  | stub | NOVEL | Prompt 5 scaffold band; deleted by the Prompt 6-7 wave |
| / | bb7ac507 | ref-topbar | DELETED | their fixed top strip, captured as a band; state, not a section |
| / | 4a1fde56 | ref-modal | DELETED | contact modal overlay (D-05, KD-05) |
| / | 63a049320d35b55b4ef2a373 | ref-drawer-a | DELETED | their off-canvas drawer body; ours is one element |
| / | 6406026c90e1521f6ecb0ec9 | ref-drawer-b | DELETED | their off-canvas drawer tail |
| / | 21379086 | logos | DELETED | 11 third-party marks (D-09) |
| / | 6c5257e3 | ref-spacer | DELETED | 85px unnamed strip between the logo band and the CTA band |
| /about | bb7ac507 | ref-topbar | DELETED | their fixed top strip, captured as a band; state, not a section |
| /about | 4a1fde56 | ref-modal | DELETED | contact modal overlay (D-05, KD-05) |
| /about | 63a049320d35b55b4ef2a373 | ref-drawer-a | DELETED | their off-canvas drawer body; ours is one element |
| /about | 6406026c90e1521f6ecb0ec9 | ref-drawer-b | DELETED | their off-canvas drawer tail |
| /about | 21379086 | logos | DELETED | 11 third-party marks (D-09) |
| /about | 6c5257e3 | ref-spacer | DELETED | 85px unnamed strip between the logo band and the CTA band |
| /services | bb7ac507 | ref-topbar | DELETED | their fixed top strip, captured as a band; state, not a section |
| /services | 4a1fde56 | ref-modal | DELETED | contact modal overlay (D-05, KD-05) |
| /services | 63a049320d35b55b4ef2a373 | ref-drawer-a | DELETED | their off-canvas drawer body; ours is one element |
| /services | 6406026c90e1521f6ecb0ec9 | ref-drawer-b | DELETED | their off-canvas drawer tail |
| /services | 21379086 | logos | DELETED | 11 third-party marks (D-09) |
| /services | 6c5257e3 | ref-spacer | DELETED | 85px unnamed strip between the logo band and the CTA band |
| /contact | bb7ac507 | ref-topbar | DELETED | their fixed top strip, captured as a band; state, not a section |
| /contact | 4a1fde56 | ref-modal | DELETED | contact modal overlay (D-05, KD-05) |
| /contact | 63a049320d35b55b4ef2a373 | ref-drawer-a | DELETED | their off-canvas drawer body; ours is one element |
| /contact | 6406026c90e1521f6ecb0ec9 | ref-drawer-b | DELETED | their off-canvas drawer tail |
| /contact | 21379086 | logos | DELETED | 11 third-party marks (D-09) |
| /contact | 6c5257e3 | ref-spacer | DELETED | 85px unnamed strip between the logo band and the CTA band |
| / | 81f74bc3-roofing-done-right | hero | ADAPTED | ref 7 - proposition changes to a person picks up the phone |
| / | dfeef600-elevate-your-roof-with-next-level | intro | ADAPTED | ref 8 - awards pitch replaced by the proposition |
| / | 9794f2c3-why-choose-us | trust-row | ADAPTED | ref 9 - every chip of theirs is an invented fact for us (D-14) |
| / | 4166deaa-residential-and-commercial-roof-in | svc-a | ADAPTED | ref 10 - regrouped by symptom |
| / | 16d2fa52-specialized-exterior-services | svc-b | ADAPTED | ref 11 - regrouped by symptom |
| / | 7e95da6d-specialty-roof-repairs | svc-c | ADAPTED | ref 12 - regrouped by symptom |
| / | fc6ce0ef | discounts | DELETED | ref 13 - invents credentials and discounts (D-14/D-06) |
| / | 62d22b2f-recent-projects | projects | FIDELITY | ref 14 - held; placeholder-blocked, KD-03 |
| / | 307b2389-here-s-what-our-satisfied-customer | testimonials | ADAPTED | ref 15 - placeholder blocks, no names, no Review JSON-LD (D-13) |
| / | 090e14dc-frequently-asked-questions | faq-home | DELETED | ref 16 - relocated to /services (structural move 3) |
| / | 59b59a73-recent-blog-posts | blog | DELETED | ref 17 - no blog route (D-01) |
| / | 9328cbef-learn-more-about | cta-band | FIDELITY | ref 19 - held; shared band |
| / |  | map | NOVEL | required by D-08, no counterpart on their home page |
| /about | d753ccbe-about | title | ADAPTED | ref 6 - 90px band, our route name and lede |
| /about | 4e9af3f4-about-next-level-roofing | story | ADAPTED | ref 8 - no founding year, headcount or certifications (D-17) |
| /about | 560bf22b-about | what-we-do | ADAPTED | ref 9 - eight garage-door services, not their 83-item tree |
| /about | db4a2c84 | ref-thin | DELETED | 37px unnamed strip |
| /about | 9328cbef-learn-more-about | cta-band | FIDELITY | ref 11 - held; shared band |
| /about |  | credentials | NOVEL | replaces the dropped logo strip; every claim TODO(fact) |
| /services | 6f224353-roof-replacement | hero | ADAPTED | ref 6 - their inline 5-field email form dropped (D-03/D-05) |
| /services | 8b7b08bc-transform-your-property-with-a-new | list | ADAPTED | ref 8 - eight in-page services grouped by symptom, no prices (D-12) |
| /services | 9cf8ab9a | ref-thin | DELETED | 37px unnamed strip |
| /services | 9328cbef-learn-more-about | cta-band | FIDELITY | ref 10 - held; shared band |
| /services |  | faq | ADAPTED | relocated from home ref 16; cross-page, so no same-route counterpart to pair against |
| /contact | 687131be-contact | title | ADAPTED | ref 6 - our copy |
| /contact | 63d93a8b83aac101be57176d | map | ADAPTED | ref 7 - their 300px Mapbox embed; ours is a keyless Google coords embed (D-07) |
| /contact | 1d3f8083-send-us-a-message | form | ADAPTED | ref 9 - no email field, no reCAPTCHA, no backend (D-03/D-05/D-15) |
| /contact | 6c8ab89e | ref-thin | DELETED | 37px unnamed strip |
| /contact | 9328cbef-learn-more-about | cta-band | FIDELITY | ref 13 - held; shared band |
| /contact |  | nap-card | NOVEL | split out of their footer into a page-level card |
| /privacy |  | title | NOVEL | no reference page exists |
| /privacy |  | body | NOVEL | generated per D-16 |
| /privacy |  | contact | NOVEL | phone and postal only (D-03) |
