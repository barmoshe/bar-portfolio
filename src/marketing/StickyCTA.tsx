import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangContext';
import { whatsappHref } from './contact';

export default function StickyCTA() {
  const { t } = useLang();
  const { sticky } = t;
  const [hiddenScroll, setHiddenScroll] = useState(false);
  const [hiddenIntake, setHiddenIntake] = useState(false);
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
        if (y > 200 && dy > 4) setHiddenScroll(true);
        else if (dy < -4) setHiddenScroll(false);
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide the sticky bar while the intake form is on screen — two CTAs
  // pointing at a form you're already looking at is noise.
  useEffect(() => {
    const target = document.getElementById('intake');
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setHiddenIntake(entry.isIntersecting));
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0.05 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const onPrimary = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('intake');
    if (!target) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const firstField = target.querySelector<HTMLElement>('textarea, input');
    firstField?.focus({ preventScroll: true });
  };

  const hidden = hiddenScroll || hiddenIntake;

  return (
    <div
      className="mp-sticky"
      data-hidden={hidden || undefined}
      role="region"
      aria-label={sticky.region}
    >
      <a
        className="mp-cta mp-cta--primary"
        href="#intake"
        onClick={onPrimary}
      >
        <span aria-hidden="true">→</span> {sticky.primary}
      </a>
      <a
        className="mp-cta mp-cta--secondary"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span aria-hidden="true">💬</span> {sticky.whatsapp}
      </a>
    </div>
  );
}
