# 06 — Form field focus, error and success states

Reference evidence: `/contact` section 9 carries a 5-field form (text, **email**, tel,
textarea, submit) plus three reCAPTCHA iframes; `/roof-replacement` embeds a second one in
its hero. **We ship neither the email field nor the captcha** (D-03, D-15), and there is no
backend (D-05). Our fields, per D-05: name, phone, service needed (`<select>`), preferred
callback window, message. The component carries `// STUB: no submission target` as its first
line.

## mechanism

Plain React state — one object, one `onChange`, one `errors` record. **No** `react-hook-form`
and **no** `zod`: five fields and no backend do not justify either, and both are off the
Appendix A allowlist.

**Validation timing is the load-bearing decision.** Validate a field on `blur` **only after
it has been touched**, and thereafter on every `change`. Do **not** validate on `change`
before first blur — that paints "Enter a valid phone number" while the user is typing the
third digit of a ten-digit number, which reads as the form arguing with them. Do **not**
validate only on submit either: the user then discovers three errors at once, after
committing.

Field state is a `data-state` attribute on the wrapper — `data-state="idle|invalid|valid"` —
and the CSS keys on **that same attribute**. Not on a class in one place and an attribute in
the other. (Forge shipped a 1.16:1 secondary CTA on all five routes because its dark-surface
rules keyed on a class while the markup used a data attribute; the same mismatch here would
paint a red border with no red message, or a valid-looking field that is rejected on
submit.)

Do **not** rely on `:invalid` / `:user-invalid` alone. `:invalid` matches before the user has
touched anything, so an empty required field is styled as an error on first paint;
`:user-invalid` fixes that but has no way to express our phone rule, and the state must be
mirrored into `aria-invalid` for assistive tech anyway.

Phone handling per the allowlist note: ten digits, **formatted on blur**, permissive paste.
Strip everything that is not a digit, accept a leading `1`, reject on length. Do not mask
during typing — a live mask fights backspace and mid-string edits.

`<select>` for "service needed", populated from the eight services; a real `<select>`, not a
custom listbox. Native is keyboard-complete, works with the platform picker on iOS, and has
no focus-management surface to get wrong.

Submit: `preventDefault()`, run the whole validator, focus the **first** invalid field if
any, otherwise swap the form for the success panel and `console.warn` the stub notice. There
is no network request, no `fetch`, no `action`, and no email anywhere in the payload or the
markup.

## ratio

| state | property | duration | easing |
|---|---|---|---|
| focus ring | `outline-color`, `box-shadow` | **0.12s** | `ease-out` |
| border colour, idle → invalid | `border-color` | 0.16s | `ease-out` |
| error message in | `opacity` + `translateY(-4px → 0)` | 0.16s | `ease-out` |
| success panel in | `opacity` 0 → 1 | 0.24s | `ease-out` |
| submit button hover | `background-color` | 0.18s | `ease-out` |

**120ms on focus, and no transition on the ring's geometry.** A focus ring that grows into
place is a focus ring that is not yet visible when a fast tabber has already moved on;
transition the colour, never the width or the offset.

The error message travels 4px, not 12px. It appears directly under a field the user is
looking at; a large travel pulls the eye downward past it. 160ms is fast enough that the
message is settled before the eye finishes saccading to it.

The success panel is a cross-fade at 240ms with **no** height animation. The panel is sized
to at least the form's height so the page does not jump when the form is replaced.

Geometry: inputs are 52px tall (16px type, 14px vertical padding, 1px border) with 10px
radius — `--radius`, the reference's dominant value, 27 occurrences. Label above the field,
never a placeholder-as-label. Error message reserves its line height at all times so
revealing it never reflows the fields below.

## failure mode

- **Validate-on-keystroke from the first character**: the field is red for the entire time
  the user is filling it in and green only at the end. It reads as hostile, and on the phone
  field it is red for nine of the ten digits.
- **Placeholder as label**: the label vanishes the moment the user types, so nobody can
  check what they entered, and placeholder text is grey-on-white at a contrast that fails
  AA. Our placeholders (`contactForm.placeholders`) are examples, and every field has a real
  `<label>`.
- **Removing the outline and drawing focus with `border-color` alone**: a 1px border colour
  change is not a 3:1 focus indicator, and it is invisible on the field that already has an
  error border.
- **Colour-only error state**: a red border with no message and no icon fails 1.4.1. The
  message text is the state.
- **`alert()` or a toast on submit**: a toast disappears before a screen reader announces
  it, and it is unreachable by keyboard afterwards. The success panel replaces the form
  in-place and is focusable.
- **An `<input type="email">` sneaking in** because it is the habitual second field. It is
  a build failure under D-03, and the email sweep is run before every done report.
- **Auto-scrolling to the first error**: focusing it already scrolls it into view; doing both
  double-scrolls past it.

## trigger

- **Focus ring**: `:focus-visible`, never `:focus`. `:focus` paints a ring after a mouse
  click on a text input, which is noise.
- **Validation**: `onBlur` once touched, then `onChange`. Per field, repeating.
- **Submit**: `onSubmit` on the `<form>` (so `Enter` in any text field submits, as expected),
  never `onClick` on the button.
- **Success state**: entered once per mount. The panel offers "Send another" which resets
  state to pristine and returns focus to the first field.
- **Client-side route change**: the form is route-local; navigating away unmounts it and
  discards state. Do **not** persist a draft to `localStorage` — that stores a customer's
  name and phone number on a shared device, and D-15 forbids storage we did not declare in
  the privacy policy.
- **Re-entry into an invalid field**: the error persists until the field's value passes;
  the message does not re-animate on every keystroke (it animates on state change only, not
  on every render).

## accessibility

- Every field: `<label for>` bound to a real `id`. No `aria-label` substitutes, no
  placeholder-only labelling.
- Invalid field: `aria-invalid="true"` **and** `aria-describedby` pointing at the error
  message's `id`. Both, together; `aria-invalid` alone announces "invalid" without saying
  why.
- The error message element is present in the DOM at all times with `role="alert"` applied
  **only while it holds text**, so a newly-appearing message is announced without the empty
  container being announced on load.
- The submit button is never `disabled` while the form is invalid. A disabled button is not
  focusable, gives no reason for its state, and leaves a keyboard user with nothing to
  press; submit-then-report is the accessible pattern.
- On failed submit: focus moves to the first invalid field, and a summary line above the
  form reports the count in `role="alert"`.
- Success panel: `role="status"` (polite), containing the "we will call you back" copy and
  the phone number as a `tel:` link, so the user's next action is available without
  navigating.
- Contrast: labels and values `body-on-surface` (20.99:1); the error message
  `error-on-surface` (`--color-error`, 6.54:1) with an icon, not colour alone; success
  `success-on-surface` (5.38:1); input borders `input-edge-on-surface`
  (`--color-border-strong`, 4.58:1 — above the 3:1 UI minimum); focus the shared two-layer
  ring at 13.24:1 against the page.
- The `<select>` is native, so the platform provides its own accessible picker.
- Tap targets: 52px-tall fields and a 52px submit button clear WCAG 2.2 §2.5.8 at 390.
- `@media (prefers-reduced-motion: reduce)`: the error message's translate is removed and
  every transition above drops to 0.01s except the success cross-fade, which is kept at
  0.15s — an instant swap of the entire form is the one place here where motion aids
  comprehension.
