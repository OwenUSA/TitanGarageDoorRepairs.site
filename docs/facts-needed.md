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

## Fictional-by-design, and separately tracked

These are **not** in the table above because they are supplied as ground truth in
`CLAUDE.md` and are deliberate fiction. They still must be replaced before this site
faces the public, and they are listed again in `docs/PRE-LAUNCH.md`:

- Business name — Titan Garage Door Repairs
- Phone — (405) 555-0142, in the 555-01XX reserved range, cannot ring anyone
- Address — 4820 Kestrel Lane, Oklahoma City, OK 73120, does not exist
- Map coordinates — 35.5760, -97.5680 (real OKC coords; the map is embedded by
  coordinates only, per D-07, and the fake address is never sent to a geocoder)
- Hours — 7 days, 07:00–19:00
- Service area sentence — Serving the Oklahoma City metro and the surrounding communities.
