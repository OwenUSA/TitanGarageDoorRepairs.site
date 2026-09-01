# RESUME — Titan build wave, killed mid-flight

**Cause:** account session limit (HTTP 429), reset 7:20pm America/Caracas. It killed the
lead and its in-flight builders at once. Nothing was rolled back and nothing is broken:
`npx tsc --noEmit` exits 0 on everything below.

## Chain position
Merged PROMPT 6+7 build wave, partially complete. Prompts 0-4+5+9 are committed (`c9a069c`);
tokens, palette (seed 260721, teal `#1494ae` + rust `#b83704`) and the shell are FROZEN.

## Built — 19 section components, typecheck clean, NOT yet fully measured
```
home     HomeHero HomeIntro HomeServiceA HomeServiceB HomeServiceC
         HomeTrustRow HomeTestimonials HomeProjects HomeMap CtaBand   (10 wired)
about    AboutTitle AboutStory AboutWhatWeDo AboutCredentials          (5 wired)
services ServicesHero ServicesList ServicesFaq                         (4 wired)
privacy  (1 wired)
contact  ContactTitle ContactMap exist but app/contact/page.tsx wires NOTHING
```

## Not started
**`/contact` is the only outstanding unit.** The lead was dispatching it into a free
builder slot at the moment of the kill. It needs the D-05 form: name, phone, service
needed (select), preferred callback window, message. NO email field, no `type="email"`,
no mailto, no newsletter. No backend — client-side validation only; on submit show a
"we'll call you back" state and `console.warn` a stub notice. `// STUB: no submission
target` at the top of the file. Phone validates ten digits, formatted on blur, permissive
paste. Keyboard-operable, visible error states, errors announced via `aria-live`. Plus the
phone card, hours block, map at zoom ~15 and the directions link.

## Measurement status
`.harness/` holds capture + diff + contrast + rendertruth output from DURING the wave, so
those numbers are mid-flight, not final. Re-run all three gates after `/contact` lands:

```bash
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/contrast.mjs
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/rendertruth.mjs
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/diff.mjs
```

Titan's reference (nextlevelok.com) is one of only TWO still reachable in this programme,
so real structural numbers are available here. Do not waste that.

## Traps already paid for — do not re-learn
- After ANY rebuild: kill the port holder, restart, and verify BOTH the page title AND
  that the referenced stylesheet returns 200 before believing a gate.
- Never background the dev server with `&` in the same command chain as a gate run: the
  chain drops back to the previous cwd and the gate reports ANOTHER SITE'S numbers.
- `cta-primacy` ranks the tel: CTA among INTERACTIVE elements only. If it fails, fix the
  CTA or the other buttons — NEVER dim headings or body copy.
- A `position: fixed` call bar is painted once into a full-page screenshot at the original
  viewport bottom; the shared harness handles this, do not reintroduce a local copy.
- `docs/sections.md` carries a human table AND a machine-readable twin. Edit both together
  or the contract silently stops resolving (KD-09).
