// STUB: no submission target
'use client';

/**
 * `/contact` callback form — ADAPTED, ref `1d3f8083-send-us-a-message` (ref# 9).
 *
 * D-05, in full: five fields — name, phone, service needed, preferred callback
 * window, message. There is NO email field, no `type="email"`, no `mailto:`,
 * no newsletter and no reCAPTCHA; the reference form carries an email field and
 * a reCAPTCHA and both are deliberately gone (D-03, D-15).
 *
 * There is no backend and no action. Validation is client-side only, in plain
 * React state — no react-hook-form and no zod, per the dependency allowlist.
 * On a valid submit the fields are replaced in place by a "we'll call you back"
 * state and a stub notice is written to the console.
 *
 * Phone: ten digits, permissive paste (everything non-numeric is stripped
 * before validating), formatted on blur. No libphonenumber and no country
 * selector — one country.
 *
 * A11y (D-19): real <label for>, never placeholder-only; aria-invalid and
 * aria-describedby wired per field; one polite live region announces both the
 * error summary and the success state; the whole path is keyboard operable and
 * every control clears 44px at 390.
 */

import { useId, useState } from 'react';
import { contactForm } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';
import styles from './ContactForm.module.css';

type Errors = { name?: string; phone?: string; service?: string };

/** Permissive paste: keep the digits, drop everything else, then count. */
const digitsOf = (v: string) => v.replace(/\D/g, '');

/** Ten digits -> (405) 555-0142. Anything else comes back untouched, so the
    blur handler can never destroy what the user actually typed. */
function formatPhone(v: string) {
  const d = digitsOf(v);
  if (d.length !== 10) return v;
  return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
}

export default function ContactForm() {
  const uid = useId();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [callWindow, setCallWindow] = useState<string>(contactForm.windowOptions[0]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = contactForm.errors.name;
    if (digitsOf(phone).length !== 10) e.phone = contactForm.errors.phone;
    if (!service) e.service = contactForm.errors.service;
    return e;
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const keys = Object.keys(e);
    if (keys.length) {
      // Send the user to the first thing that is wrong. The live region
      // announces the count; the field itself carries the sentence.
      document.getElementById(uid + '-' + keys[0])?.focus();
      return;
    }
    // STUB: there is no submission target. Nothing leaves the browser.
    console.warn(
      '[STUB] Callback request not submitted: this build has no backend and no ' +
        'submission target (D-05/D-18). Nothing was sent anywhere.',
    );
    setSent(true);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <section className={styles.form} data-section="form">
      <div className={`t-section ${styles.inner}`}>
        <div className="t-container">
          <div className={styles.head}>
            <h2 className="t-h2 t-tight">{contactForm.heading}</h2>
            <p className={`t-muted ${styles.sub}`}>{contactForm.sub}</p>
          </div>

          {/* One polite region for the whole form: an error summary on a failed
              submit, the confirmation on a successful one. */}
          <p className="t-visually-hidden" role="status" aria-live="polite">
            {sent
              ? contactForm.success
              : errorCount
                ? errorCount + (errorCount === 1 ? ' field needs' : ' fields need') + ' attention.'
                : ''}
          </p>

          {sent ? (
            <div className={styles.done}>
              <p className="t-success">{contactForm.success}</p>
              <p className={`t-small t-muted ${styles.doneNote}`}>{contactForm.successNote}</p>
              <a className={styles.call} href={business.phoneHref} aria-label={callAriaLabel}>
                {business.phoneDisplay}
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className={styles.grid}>
                <div data-state={errors.name ? 'invalid' : undefined}>
                  <label className={styles.label} htmlFor={uid + '-name'}>
                    {contactForm.fields.name}
                  </label>
                  <input
                    className="t-field"
                    id={uid + '-name'}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={contactForm.placeholders.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? uid + '-name-err' : undefined}
                  />
                  {errors.name ? (
                    <span className={`t-error ${styles.err}`} id={uid + '-name-err'}>
                      {errors.name}
                    </span>
                  ) : null}
                </div>

                <div data-state={errors.phone ? 'invalid' : undefined}>
                  <label className={styles.label} htmlFor={uid + '-phone'}>
                    {contactForm.fields.phone}
                  </label>
                  <input
                    className="t-field"
                    id={uid + '-phone'}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={contactForm.placeholders.phone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={(e) => setPhone(formatPhone(e.target.value))}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? uid + '-phone-err' : undefined}
                  />
                  {errors.phone ? (
                    <span className={`t-error ${styles.err}`} id={uid + '-phone-err'}>
                      {errors.phone}
                    </span>
                  ) : null}
                </div>

                <div data-state={errors.service ? 'invalid' : undefined}>
                  <label className={styles.label} htmlFor={uid + '-service'}>
                    {contactForm.fields.service}
                  </label>
                  <select
                    className="t-field"
                    id={uid + '-service'}
                    name="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    aria-invalid={errors.service ? true : undefined}
                    aria-describedby={errors.service ? uid + '-service-err' : undefined}
                  >
                    <option value="">—</option>
                    {contactForm.serviceOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {errors.service ? (
                    <span className={`t-error ${styles.err}`} id={uid + '-service-err'}>
                      {errors.service}
                    </span>
                  ) : null}
                </div>

                <div>
                  <label className={styles.label} htmlFor={uid + '-window'}>
                    {contactForm.fields.window}
                  </label>
                  {/* Plain time bands only. A "within X minutes" option would be a
                      response-time claim, and D-17 forbids inventing one. */}
                  <select
                    className="t-field"
                    id={uid + '-window'}
                    name="window"
                    value={callWindow}
                    onChange={(e) => setCallWindow(e.target.value)}
                  >
                    {contactForm.windowOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.wide}>
                  <label className={styles.label} htmlFor={uid + '-message'}>
                    {contactForm.fields.message}
                  </label>
                  <textarea
                    className={`t-field ${styles.msg}`}
                    id={uid + '-message'}
                    name="message"
                    rows={3}
                    placeholder={contactForm.placeholders.message}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.foot}>
                <button className="t-btn t-btn--call" type="submit">
                  {contactForm.submit}
                </button>
                <a className={styles.call} href={business.phoneHref} aria-label={callAriaLabel}>
                  {business.phoneDisplay}
                </a>
              </div>

              <p className={`t-small t-muted ${styles.note}`}>{contactForm.privacyNote}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
