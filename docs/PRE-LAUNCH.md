# Pre-launch blockers

Nothing on this list may reach the public internet unresolved. Opened at the merged
Prompt 5 turn; Prompt 11 adds the acceptance-sweep entries.

## 1. Every business fact on the site is FICTIONAL

They are ground truth for the build and must be replaced before launch. All of them live in
`lib/business.ts` — one file, one edit.

| fact | placeholder value | note |
|---|---|---|
| Business name | Titan Garage Door Repairs | |
| Tagline | The door gets fixed right, and a person picks up the phone. | |
| Phone (display) | (405) 555-0142 | 555-01XX is the reserved range; it cannot ring anyone |
| Phone (`tel:`) | `tel:+14055550142` | rendered in the header, drawer, call bar, footer |
| Phone (E.164, JSON-LD) | +1-405-555-0142 | |
| Street address | 4820 Kestrel Lane | **does not exist and will not geocode** |
| City / region / postcode | Oklahoma City, OK 73120 | |
| Map coordinates | 35.5760,-97.5680 | real OKC coordinates; the map is embedded by these ONLY (D-07) |
| Hours | 7 days, 07:00-19:00 | single block, no split hours, no emergency claim |
| Service area sentence | Serving the Oklahoma City metro and the surrounding communities. | the only survivor of the deleted locations page (D-02) |
| Site URL | https://titangaragedoorrepairs.site | used for canonical metadata and JSON-LD `url` |

## 2. Facts never invented, still needed

Every `TODO(fact)` in `docs/facts-needed.md` is a claim the site does not make because
nobody supplied it: credentials, licence and insurance status, years in business, crew
size, review counts, prices, warranty terms, response times. The trust-row chips and the
`/about` credentials block render at the correct dimensions with placeholder content and
must be filled or removed.

## 3. Assets

Per KD-03 and KD-04: 30 REPLACE slots and 11 OURS-NEW slots are generated SVG placeholders,
and the wordmark is type set in Mohave rather than a logo file. Prompt 10 writes the
generation prompts; drop-in is the terminal step of the run.

## 4. Legal

`/privacy` carries `<!-- UNREVIEWED TEMPLATE — requires legal review before launch -->` and
must not go public without that review. It makes no GDPR or CCPA compliance claim, by
design (D-16).

## 5. Never measured (A-4 dropped these gates)

- **Performance was never measured.** Lighthouse on all five routes was dropped from
  Prompt 11 as a separate turn. No LCP, CLS, TBT or bundle-weight figure exists for this
  build.
- **Keyboard access is spec-verified only, never hand-tested.** The manual keyboard-only
  pass in gate 8 was dropped. The keyboard paths through the nav, the drawer, the form, the
  accordion and the map bypass are specified in `docs/behavior/` and are implemented to
  those specs, but no human has driven them.
