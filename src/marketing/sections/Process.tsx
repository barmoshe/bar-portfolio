import { useEffect, useRef, useState } from 'react';
import { useLang } from '../LangContext';

/**
 * Process — three step cards stacked vertically. Each card's status
 * pill morphs TODO → DOING → DONE as the user scrolls past it. No
 * GSAP `pin` (iOS Safari pin-jumping is well-documented in 2025);
 * we use an IntersectionObserver to toggle per-card status.
 */
type StepStatus = 'todo' | 'doing' | 'done';

export default function Process() {
  const { t } = useLang();
  const { method, board } = t;
  const stepsRef = useRef<Array<HTMLLIElement | null>>([]);
  const [statuses, setStatuses] = useState<StepStatus[]>(
    () => method.steps.map(() => 'todo' as StepStatus),
  );

  useEffect(() => {
    const compute = () => {
      // The active "DOING" step is the one whose top is closest to
      // — but not past — a trigger line at 40% of the viewport height.
      // Everything above that is DONE; everything below is TODO.
      const triggerY = window.innerHeight * 0.4;
      const tops = stepsRef.current.map((el) => {
        if (!el) return Number.POSITIVE_INFINITY;
        return el.getBoundingClientRect().top;
      });
      let active = -1;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= triggerY) active = i;
      }
      setStatuses((prev) => {
        const next = prev.slice();
        let changed = false;
        for (let i = 0; i < next.length; i++) {
          const v: StepStatus =
            i < active ? 'done' : i === active ? 'doing' : 'todo';
          if (next[i] !== v) {
            next[i] = v;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [method.steps]);

  return (
    <section
      className="mp-section mp-method"
      id="method"
      aria-labelledby="method-headline"
    >
      <header className="mp-h">
        <span className="mp-h__num" aria-hidden="true">{method.number}</span>
        <span className="mp-h__kicker">{board.columns.process}</span>
        <h2 id="method-headline" className="mp-h__title">
          {method.title}
        </h2>
      </header>

      <p className="mp-standfirst" style={{ marginBlockEnd: 20 }}>
        {method.standfirst}
      </p>

      <ol className="mp-steps">
        {method.steps.map((s, i) => {
          const status = statuses[i];
          const pillCls =
            status === 'done'  ? 'mp-status--done'  :
            status === 'doing' ? 'mp-status--doing' :
                                 'mp-status--todo';
          const pillLabel =
            status === 'done'  ? board.status.done  :
            status === 'doing' ? board.status.doing :
                                 board.status.todo;
          return (
            <li
              className={`mp-step mp-step--${i + 1}`}
              key={s.num}
              ref={(el) => { stepsRef.current[i] = el; }}
              data-status={status}
            >
              <span className="mp-step__num" aria-hidden="true">{s.num}</span>
              <span
                className={`mp-status mp-step__pill ${pillCls}`}
                aria-hidden="true"
              >
                {pillLabel}
              </span>
              <h3 className="mp-step__title">{s.title}</h3>
              <p className="mp-step__text">{s.body}</p>
            </li>
          );
        })}
      </ol>

      <figure className="mp-pull">
        <blockquote>{method.pullQuote.quote}</blockquote>
        <figcaption>— {method.pullQuote.cite}</figcaption>
      </figure>
    </section>
  );
}
