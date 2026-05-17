import { useEffect, useRef, useState } from 'react';
import { useLang } from './LangContext';
import { whatsappHref } from './contact';
import { INTAKE_ID, scrollToIntake } from './scrollToIntake';

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

  // Two CTAs pointing at a form already on screen would be noise.
  useEffect(() => {
    const target = document.getElementById(INTAKE_ID);
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
    scrollToIntake();
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
        href={`#${INTAKE_ID}`}
        onClick={onPrimary}
      >
        {sticky.primary}
      </a>
      <a
        className="mp-cta mp-cta--secondary"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
      >
        {sticky.whatsapp}
      </a>
    </div>
  );
}
