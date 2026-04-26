import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangContext';
import { mailtoHref, whatsappHref } from './contact';

export default function StickyCTA() {
  const { t } = useLang();
  const { sticky } = t;
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;
        if (y > 200 && dy > 4) setHidden(true);
        else if (dy < -4) setHidden(false);
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="mp-sticky"
      data-hidden={hidden || undefined}
      role="region"
      aria-label={sticky.region}
    >
      <a
        className="mp-cta mp-cta--primary"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span aria-hidden="true">💬</span> {sticky.whatsapp}
      </a>
      <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
        <span aria-hidden="true">✉</span> {sticky.mail}
      </a>
    </div>
  );
}
