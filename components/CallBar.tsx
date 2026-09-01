/**
 * Mobile sticky call bar — NOVEL (docs/sections.md, shell::callbar).
 *
 * The reference has a fixed 390x80 promo bar at the same position; ours is a
 * dedicated `tel:` bar per D-04. Spec, with the reasoning for `fixed` over
 * `sticky` and for the absence of any scroll behaviour:
 *   docs/behavior/03-mobile-call-bar.md
 *
 * Visibility is a media query, not a JS width check — a JS check disagrees with
 * the server on first paint and the bar flashes.
 *
 * FROZEN after Prompt 5 (A-6).
 */

import { Phone } from 'lucide-react';
import { callBar } from '@/content/copy';
import { business, callAriaLabel } from '@/lib/business';

export default function CallBar() {
  return (
    <div className="t-callbar" data-section="callbar">
      <a className="t-callbar__link" href={business.phoneHref} aria-label={callAriaLabel}>
        <span className="t-callbar__label">
          <Phone
            size={20}
            strokeWidth={2}
            aria-hidden="true"
            style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 8 }}
          />
          {callBar.label} — {business.phoneDisplay}
        </span>
        <span className="t-callbar__sub">{callBar.sub}</span>
      </a>
    </div>
  );
}
