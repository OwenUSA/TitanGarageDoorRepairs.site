'use client';

/**
 * <BusinessMap> — the ONE map component, used twice (D-08): home at zoom 13,
 * /contact at zoom 15. Shared shell file, owned by the lead; FROZEN after
 * Prompt 5 (A-6).
 *
 * Spec, with the reasoning for the aspect wrapper, the observer, and the
 * keyboard bypass: docs/behavior/07-map-lazy-mount.md
 *
 * D-07: the address is fictional and will not geocode. The embed is built from
 * MAP_COORDS only, in lib/business.ts. Never pass `addressLine` to a geocoder.
 */

import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { contactMap } from '@/content/copy';
import { addressLine, directionsUrl, mapEmbedUrl } from '@/lib/business';

type Props = {
  /** ~13 on the home band, ~15 on /contact (D-08). */
  zoom: number;
  /** Placeholder poster slot id, e.g. `home-map-poster` (KD-03). */
  poster: string;
  /** Rendered as text beside the map. Off on the home band, on for /contact. */
  showAddress?: boolean;
  id?: string;
};

export default function BusinessMap({ zoom, poster, showAddress = true, id }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    /* One observer, 200px of runway, disconnected on first fire. NOT a scroll
       listener — the reference has none and they are the expensive way to ask
       this question. */
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const skipId = `${id ?? 'map'}-after`;

  return (
    <div>
      {/* D-19 requires a map bypass: the embed is focusable and swallows arrow
          keys, so the keyboard path needs a way past it. */}
      <a className="t-skip" href={`#${skipId}`}>
        Skip the map
      </a>

      {/* The wrapper has its box before the iframe exists, at every width, so a
          late mount cannot shift a single pixel of layout. */}
      <div className="t-map" ref={wrapRef}>
        <img
          className="t-map__poster"
          src={`/placeholders/${poster}.jpg`}
          alt=""
          aria-hidden="true"
          style={{ opacity: loaded ? 0 : 1 }}
        />
        {mounted ? (
          <iframe
            className="t-map__frame"
            src={mapEmbedUrl(zoom)}
            title={contactMap.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0 }}
          />
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-xs)',
          marginTop: 'var(--spacing-s)',
        }}
      >
        {showAddress ? <p className="t-muted">{addressLine}</p> : <span />}
        <a
          className="t-map__directions"
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span>{contactMap.directions}</span>
          <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>

      <span id={skipId} tabIndex={-1} />
    </div>
  );
}
