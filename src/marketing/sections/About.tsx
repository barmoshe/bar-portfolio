import { useEffect, useRef } from 'react';
import { useLang } from '../LangContext';

/**
 * About - bio sticker card with a "BUILDING" pill in the corner +
 * three stat sub-tickets in a micro-grid. Stat numbers animate from
 * zero on entry (rAF, single loop for all three, IO-gated).
 */
function parseNumericPrefix(s: string): { value: number; suffix: string } | null {
  const m = s.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { value: parseFloat(m[1]), suffix: m[2] };
}

export default function About() {
  const { t } = useLang();
  const { about } = t;
  const statsRef = useRef<HTMLDListElement | null>(null);
  const valueRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const root = statsRef.current;
    if (!root) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      about.stats.forEach((s, i) => {
        const el = valueRefs.current[i];
        if (el) el.textContent = s.value;
      });
      return;
    }

    if (typeof IntersectionObserver === 'undefined') return;
    let raf = 0;
    let started = false;

    const targets = about.stats.map((s, i) => {
      const el = valueRefs.current[i];
      const parsed = parseNumericPrefix(s.value);
      return { el, parsed, full: s.value };
    });

    const animate = (start: number, duration = 900) => {
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        targets.forEach((tgt) => {
          if (!tgt.el) return;
          if (tgt.parsed) {
            const v = tgt.parsed.value * eased;
            const display = tgt.parsed.value % 1 === 0
              ? Math.round(v).toString()
              : v.toFixed(1);
            tgt.el.textContent = display + tgt.parsed.suffix;
          } else {
            tgt.el.textContent = tgt.full;
          }
        });
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate(performance.now());
        }
      },
      { threshold: 0.4 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [about.stats]);

  return (
    <section
      className="mp-section mp-about"
      id="about"
      aria-labelledby="about-headline"
    >
      <header className="mp-h">
        <span className="mp-h__num" aria-hidden="true">{about.number}</span>
        <span className="mp-h__kicker">{about.kicker}</span>
        <h2 id="about-headline" className="mp-h__title">
          {about.title}
        </h2>
      </header>

      <div className="mp-about__body">
        {about.paragraphs.map((p, i) => (
          <p className="mp-about__p" key={i}>
            {p}
          </p>
        ))}
      </div>

      <dl className="mp-about__stats" ref={statsRef}>
        {about.stats.map((s, i) => (
          <div className="mp-about__stat" key={s.label}>
            <dt
              className="mp-about__stat-value"
              ref={(el) => { valueRefs.current[i] = el; }}
            >
              {/* JS-driven content; initial render shows full value as a
                  fallback for SSR / no-JS / reduced-motion paths. */}
              {s.value}
            </dt>
            <dd className="mp-about__stat-label">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
