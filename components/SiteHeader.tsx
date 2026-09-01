'use client';

/**
 * Shared shell — header, primary nav, header call CTA, and the mobile drawer.
 *
 * FROZEN after Prompt 5 (A-6). A section agent that needs a change here stops
 * and hands it back to the lead.
 *
 * Behaviour is specified, with the reasoning, in:
 *   docs/behavior/01-mobile-nav-drawer.md
 *   docs/behavior/02-sticky-header.md
 *
 * Two things this component deliberately does NOT do, both measured rather than
 * assumed (docs/profile.md §3, headerDistinctStates: 1, scrollListeners: false):
 *   - it does not listen for scroll;
 *   - it has no engaged/shrunk state.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { nav, footerLinks } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';

/** Five routes. No Locations (D-02), no per-service routes (D-01). */
const ROUTES = [
  ...nav.items,
  { label: 'Privacy', href: '/privacy' },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  const close = useCallback(() => setOpen(false), []);

  /* Body scroll lock: position:fixed with the scroll offset preserved, NOT
     overflow:hidden — iOS Safari ignores overflow:hidden on <body> and the page
     scrolls behind the open panel. */
  useEffect(() => {
    const body = document.body;
    if (open) {
      scrollYRef.current = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = '0';
      body.style.right = '0';
      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        window.scrollTo(0, scrollYRef.current);
      };
    }
    return undefined;
  }, [open]);

  /* Everything outside the panel is `inert` while the drawer is open: one
     declaration removes it from the tab order AND from screen-reader
     navigation. It cannot be applied from CSS, so it is set imperatively over
     the four subtrees that exist outside the panel. */
  useEffect(() => {
    if (!open) return undefined;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('.t-header__inner, #main, footer, .t-callbar'),
    );
    targets.forEach((el) => {
      el.inert = true;
    });
    return () => {
      targets.forEach((el) => {
        el.inert = false;
      });
    };
  }, [open]);

  /* Escape closes; focus is trapped while open and returned to the toggle. */
  useEffect(() => {
    if (!open) return undefined;
    const panel = drawerRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      toggleRef.current?.focus();
    };
  }, [open, close]);

  /* A client-side route change closes the drawer WITHOUT a transition. A 320ms
     exit playing over a page that has already swapped reads as a bug. */
  useEffect(() => {
    if (!open) return;
    setInstant(true);
    setOpen(false);
    const id = window.setTimeout(() => setInstant(false), 50);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* Above the drawer tier there is no drawer. Resizing past it while open must
     also release the scroll lock, or the body stays position:fixed on a desktop
     layout that has no panel to close. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const current = (href: string) => (pathname === href ? 'page' : undefined);

  return (
    <>
      <div data-drawer-open={open} data-drawer-instant={instant}>
        <header className="t-header" data-section="header">
          <div className="t-container t-header__inner">
            <Link href="/" className="t-logo" aria-label={`${business.name}, home`}>
              {/* KD-04 — the wordmark is type set in Mohave until a logo asset
                  is handed over. TODO(fact): logo asset. */}
              <span className="t-logo__mark">{business.name}</span>
              <span className="t-logo__sub">{business.hours.display}</span>
            </Link>

            <nav className="t-nav" aria-label="Primary">
              {ROUTES.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="t-nav__link"
                  aria-current={current(r.href)}
                >
                  {r.label}
                </Link>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-s)' }}>
              <a
                className="t-btn t-btn--call t-header__cta"
                href={business.phoneHref}
                aria-label={callAriaLabel}
              >
                <Phone size={20} strokeWidth={2} aria-hidden="true" />
                <span>{business.phoneDisplay}</span>
              </a>

              <button
                ref={toggleRef}
                type="button"
                className="t-burger"
                aria-expanded={open}
                aria-controls="site-drawer"
                aria-label={open ? nav.menuClose : nav.menuOpen}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <X size={30} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Menu size={30} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Backdrop finishes at 200ms while the panel is still arriving at
            320ms — the page is already dimmed when the panel lands. */}
        <div className="t-backdrop" aria-hidden="true" onClick={close} />

        <div
          ref={drawerRef}
          id="site-drawer"
          className="t-drawer"
          data-drawer=""
          role="dialog"
          aria-modal="true"
          aria-label={footerLinks.heading}
        >
          <button
            type="button"
            className="t-burger"
            onClick={close}
            aria-label={nav.menuClose}
            style={{ alignSelf: 'flex-end', background: 'transparent', color: 'inherit' }}
          >
            <X size={30} strokeWidth={2} aria-hidden="true" />
          </button>

          <nav aria-label="Site" style={{ display: 'grid', gap: 'var(--spacing-3xs)' }}>
            {ROUTES.map((r, i) => (
              <Link
                key={r.href}
                href={r.href}
                className="t-drawer__link"
                aria-current={current(r.href)}
                onClick={close}
                style={{ '--i': i } as CSSProperties}
              >
                {r.label}
              </Link>
            ))}
          </nav>

          <a
            className="t-btn t-btn--call"
            href={business.phoneHref}
            aria-label={callAriaLabel}
            style={{ marginTop: 'var(--spacing-m)' }}
          >
            <Phone size={20} strokeWidth={2} aria-hidden="true" />
            <span>{business.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </>
  );
}
