# Pre-launch blockers

Nothing on this list may reach the public internet unresolved. Opened at the merged
Prompt 5 turn; **finalised at the merged Prompt 10 + 11 acceptance sweep**, which is the
last turn of the chain.

This build is **local only**, on port 3100. There is no deploy target, no domain, no env
file, no third-party key, no analytics and no backend (D-15, D-18).

---

## 1. Every business fact on the site is FICTIONAL

They are ground truth for the build and must be replaced before launch. All of them live in
`lib/business.ts` — one file, one edit. Every one is named individually below because a
"replace the placeholders" instruction with no list is how one of them survives to
production.

| # | fact | placeholder value | note |
|---|---|---|---|
| 1 | **Business name** | **Titan Garage Door Repairs** | Invented. Appears in the header wordmark, the footer, the CTA band heading, every page title, and JSON-LD `name`. |
| 2 | Tagline | The door gets fixed right, and a person picks up the phone. | Invented; JSON-LD `description`. |
| 3 | **Phone, display** | **(405) 555-0142** | 555-01XX is the reserved range — it **cannot ring anyone**. Rendered in the header, the drawer, the mobile call bar, the hero CTA, the CTA band, the footer, the `/contact` card, the form placeholder and the privacy policy. |
| 4 | Phone, `tel:` href | `tel:+14055550142` | The only string that may follow `tel:`. |
| 5 | Phone, E.164 | +1-405-555-0142 | JSON-LD `telephone`. Expected to differ in form from the display string — that is the schema requirement, not a NAP inconsistency. |
| 6 | **Street address** | **4820 Kestrel Lane** | **Does not exist and will not geocode.** Never pass it to a geocoder (D-07). |
| 7 | City / region / postcode | Oklahoma City, OK 73120 | |
| 8 | Map coordinates | 35.5760, -97.5680 | Real Oklahoma City coordinates. Both maps are embedded by these coordinates **only**, keyless, and the fake address is displayed as text beside them (D-07). |
| 9 | Hours | 7 days, 07:00–19:00 | Single block, no split hours, no "24/7", no after-hours or emergency claim (D-06). Also in JSON-LD `openingHoursSpecification`. |
| 10 | Service-area sentence | Serving the Oklahoma City metro and the surrounding communities. | The only survivor of the deleted locations page (D-02). |
| 11 | Site URL | https://titangaragedoorrepairs.site | `metadataBase`, every canonical, `robots.txt` host, `sitemap.xml`, JSON-LD `url` and `image`. |

**When these are replaced:** re-verify the JSON-LD by hand (item 7 below), and re-run the
NAP sweep — `rg -n "405.?555|4820 Kestrel|73120" app components lib content` should return
hits in `lib/business.ts` and nowhere else.

## 2. Facts never invented, and still needed

Every row of `docs/facts-needed.md` is a claim the site deliberately does not make because
nobody supplied it. **Ten `TODO(fact)` strings render in the shipped markup** — three claim
chips on the home `trust-row`, four inline in the `/about` story, three badge chips in
`/about` `credentials` — plus `TODO(fact): logo asset` as a source comment (KD-04).

Each must be **filled with a real fact or removed entirely**. Filling one with a plausible
value is the single failure this whole chain was built to avoid.

Open categories: F-01 logo asset · F-02 licensing, bonding, insurance · F-03 year founded ·
F-04 crew size · F-05 manufacturer certifications · F-06 warranty terms · F-07 response-time
claim · F-08 real testimonials with written permission · F-09 review counts and star ratings ·
F-10 jobs-completed and years-in-business counters · F-11 real photography · F-12 contact-form
submission target.

## 3. Assets — every image and the logo are placeholders

Per **KD-03** and **KD-04**: 30 REPLACE slots and 11 OURS-NEW slots render as generated SVG
placeholders (dominant-colour fill, slot ID, pixel dimensions), and the wordmark is **type
set in Mohave**, not a logo file.

- `docs/asset-prompts.md` carries the Nano Banana Pro prompt for every slot and for the
  logo lockup, with the applied seed-260721 hues named. Nothing has been generated.
- **Real photography of actual work, vehicles and technicians (F-11) is still required**
  before launch. Generated stand-ins are themselves a pre-launch item, not a resolution:
  they are honest illustration, not evidence of work performed.
- The favicon is a placeholder SVG.

## 4. Testimonials — real or removed

The home `testimonials` band ships three literal `[TESTIMONIAL PLACEHOLDER]` blocks at
realistic length. Before launch each is either replaced with a **real customer quote held
with written permission**, or the band is deleted. There is no third option, and no
`Review` or `AggregateRating` JSON-LD may be added — fabricated review markup is a legal
problem, not a content gap (D-13).

## 5. Privacy policy — requires legal review

`app/privacy/page.tsx` opens with
`<!-- UNREVIEWED TEMPLATE — requires legal review before launch -->` and must not go public
without that review. It describes what the site actually does — a phone-callback form, no
email collection, no analytics, no advertising cookies — and makes **no GDPR or CCPA
compliance claim**, by design (D-16). If any tracker, chat widget or analytics tag is added
later, the policy is wrong the moment it is added.

## 6. Contact form — no submission target

`components/sections/ContactForm.tsx` is marked `// STUB: no submission target` (D-05,
F-12). It validates client-side, shows a "we'll call you back" state and `console.warn`s a
stub notice. **It sends nothing, anywhere.** A real submission target — which must not be
email (D-03) — is required before the form can be shown to a customer, along with whatever
privacy-policy amendment that target implies.

## 7. JSON-LD — re-verify after the facts are real

The `LocalBusiness` block in `app/layout.tsx` is built from `lib/business.ts` and currently
carries: `name`, `description`, `url`, `telephone`, `image`, `address`, `geo`,
`openingHoursSpecification`. It deliberately carries **no** `email` (D-03), **no**
`aggregateRating` and **no** `review` (D-13), **no** `priceRange` (D-12) and **no**
`areaServed` city array (D-02). After the real facts land, re-validate the block and
re-confirm those five absences — an SEO tool will suggest adding every one of them.

## 8. Never measured — the two gates A-4 dropped

Recorded in the exact wording the amendment requires.

- **Performance never measured.** Lighthouse on all five routes was dropped from Prompt 11.
  No LCP, CLS, TBT, INP or bundle-weight figure exists for this build, at any breakpoint.
  Nothing in the acceptance sweep substitutes for it.
- **Keyboard access is spec-verified only, never hand-tested.** The manual keyboard-only
  pass in gate 8 was dropped. The paths through the nav, the drawer, the form, the FAQ
  accordion and the map bypass are specified in `docs/behavior/` and implemented to those
  specs, and a programmatic tab-order and focus-ring walk was run at the acceptance sweep —
  but **no human has driven them**.

## 9. Also outstanding at the end of the chain

- **`/contact` and `/` keyboard focus enters the map iframe** and cannot be escaped by
  keyboard alone once inside it. The "Skip the map" bypass link before it is the mitigation
  (D-19) and it works, but this is the interaction most likely to fail a hand-tested pass.
- **The reference archive** is saved at `reference/raw/` — five pages plus the sitemap and
  ten stylesheets, fetched at this turn. It is the only remaining way to re-measure this
  build against its reference if `nextlevelok.com` goes behind a bot wall. Do not delete it,
  and do not publish it.
- **Colour divergence from the reference is permanent and intentional** (A-8, KD-07). It is
  excluded from every diff and every threshold. Nobody should later "fix" it.
