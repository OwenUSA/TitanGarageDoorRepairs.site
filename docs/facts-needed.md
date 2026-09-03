# Facts needed

Every `TODO(fact):` in the codebase, collected. Nothing here may be guessed — D-17.
These are not build blockers; they are built around, at the correct dimensions, and they
populate `docs/PRE-LAUNCH.md` at Prompt 11.

Opened at Prompt 2. Prompts 3, 6, and 7 append as they hit slots.

| id | fact needed | where it surfaces | why it cannot be invented |
|---|---|---|---|
| F-01 | **Logo asset** — wordmark + icon lockup | `logo-header`, `logo-footer`, `favicon` | D-09. Until a file exists the wordmark is set in Mohave at the measured slot size. Prompt 10 writes the generation prompt for it. |
| F-02 | Licensing / bonding / insurance status | `/` trust-row chips, `/about` credentials | D-14. Fabricated credentials are a legal problem, not a content gap. |
| F-03 | Year founded | `/about` story | D-14, D-17. |
| F-04 | Team size / technician count | `/about` story, credentials | D-14, D-17. |
| F-05 | Manufacturer certifications or trade affiliations | `/about` credentials chips (3 slots at 265×100) | D-14. The reference's equivalent strip is eleven other companies' trademarks. |
| F-06 | Warranty terms | `/services` service blocks | D-12, D-14. No warranty claim ships without the real terms. |
| F-07 | Response-time or dispatch-window claim | `/` hero, `/services` | D-14. Also the proposition is deliberately *not* speed. |
| F-08 | Real customer testimonials with written permission | `/` testimonials | D-13. Section ships with `[TESTIMONIAL PLACEHOLDER]` blocks; no names, no quotes, no `Review` or `AggregateRating` JSON-LD. |
| F-09 | Review counts / star ratings | `/` testimonials | D-13. |
| F-10 | Jobs-completed or years-in-business counters | `/` trust-row | D-14. |
| F-11 | Real photography of actual work, vehicles, and technicians | all 30 REPLACE slots in `assets/INVENTORY.md` | D-09. Generated stand-ins arrive at Prompt 10 and are themselves flagged in PRE-LAUNCH. |
| F-12 | Contact-form submission target | `/contact` form | D-05, D-18. No backend in this build; the form is a `// STUB: no submission target`. |

## Supplied as ground truth in `CLAUDE.md`

These are **not** in the table above because they are supplied as ground truth in
`CLAUDE.md`. Phone, address, and coordinates were updated to real, verified values on
2026-09-03 (per `../domains-table.md`) and are resolved; business name, tagline, hours,
and the service-area sentence remain deliberate fiction/template text and still must be
replaced before this site faces the public — see `docs/PRE-LAUNCH.md` for the full
breakdown:

- Business name — Titan Garage Door Repairs (still fictional, must-replace-before-public)
- Phone — (850) 955-3844 — **real, resolved**
- Address — 1204 N Monroe St, Tallahassee, FL 32303 — **real, resolved**
- Map coordinates — 30.4548, -84.2808 — **real, resolved** (geocoded from the real
  address via the US Census geocoder; the map is embedded by coordinates only, per D-07,
  as a stability choice rather than a fiction workaround)
- Hours — 7 days, 07:00–19:00 (still template, must-replace-before-public)
- Service area sentence — Serving Tallahassee and the surrounding communities. (wording
  updated for the real city; confirm final phrasing before launch)

## Added at the merged Prompt 5 turn

| # | TODO(fact) | where it surfaces |
|---|---|---|
| — | ~~`TODO(fact): logo asset`~~ **SUPPLIED** | Logo handed back and dropped in: `public/placeholders/logo-header.png`, `logo-footer.png`, `favicon.png`. KD-04 closed. |

No other fact was needed to build the shell. Every value it renders — name, phone, address,
coordinates, hours, service area — comes from `lib/business.ts` and is in CONSTANTS.

## Added at the merged Prompt 6+7 build wave

Every one of these renders as a literal `TODO(fact)` string in the shipped markup. None was
guessed, and none is placeheld with a plausible-looking value — a fabricated credential is
a legal problem, not a content gap (D-13, D-14, D-17).

| # | TODO(fact) | route | section | how it renders now |
|---|---|---|---|---|
| 1 | `TODO(fact)` (unspecified fourth claim chip) | `/` | `trust-row` | claim chip at the reference's chip dimensions |
| 2 | `TODO(fact): certification` | `/` | `trust-row` | claim chip |
| 3 | `TODO(fact): insured` | `/` | `trust-row` | claim chip |
| 4 | `TODO(fact): year the shop opened` | `/about` | `story` | inline, at the end of the first paragraph |
| 5 | `TODO(fact): number of technicians on the crew` | `/about` | `story` | inline, second paragraph |
| 6 | `TODO(fact): licensing, bonding and insurance details` | `/about` | `story` | inline, second paragraph |
| 7 | `TODO(fact): manufacturer certifications held` | `/about` | `story` | inline, second paragraph |
| 8 | `TODO(fact): license number` | `/about` | `credentials` | badge chip at the `about-credentials-1` slot dimensions |
| 9 | `TODO(fact): insurance carrier` | `/about` | `credentials` | badge chip, `about-credentials-2` |
| 10 | `TODO(fact): certifications` | `/about` | `credentials` | badge chip, `about-credentials-3` |

Still open from earlier turns: none — `TODO(fact): logo asset` (KD-04) was closed by the asset drop-in.

**Deliberately still absent, and not to be invented to close a metric:** years in business,
jobs completed, review counts, star ratings, named customers or quotes (the home
`testimonials` band ships three literal `[TESTIMONIAL PLACEHOLDER]` blocks per D-13, and
carries no `Review` or `AggregateRating` JSON-LD at all), prices or price bands (D-12),
response times, warranty terms, service radius in miles, and any "24/7" or after-hours
claim (D-06). The `/contact` callback-window select offers plain time bands — Morning,
Midday, Afternoon, Early evening — precisely because "within X hours" would be a response
-time claim we cannot make.
