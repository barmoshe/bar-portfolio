import { useLang } from '../LangContext';

/**
 * Process - three step cards stacked vertically. Status pills are
 * static (Step 1 = DONE, Step 2 = DOING, Step 3 = TODO), painting a
 * project mid-flight using all three kanban states.
 */
type StepStatus = 'done' | 'doing' | 'todo';

const STATIC_STATUSES: StepStatus[] = ['done', 'doing', 'todo'];

export default function Process() {
  const { t } = useLang();
  const { method, board } = t;

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
          const status: StepStatus = STATIC_STATUSES[i] ?? 'todo';
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
        <figcaption>- {method.pullQuote.cite}</figcaption>
      </figure>
    </section>
  );
}
