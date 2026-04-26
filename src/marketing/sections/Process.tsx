import { useLang } from '../LangContext';

export default function Process() {
  const { t } = useLang();
  const { process } = t;

  return (
    <section className="mp-section mp-section--alt" id="process" aria-labelledby="process-headline">
      <div className="mp-section__inner">
        <span className="mp-eyebrow">{process.eyebrow}</span>
        <h2 className="mp-h2" id="process-headline">
          {process.headlineLead}
          <mark>{process.headlineMark}</mark>
        </h2>
        <p className="mp-lead">{process.lead}</p>

        <ol className="mp-process" aria-label={process.stepsLabel}>
          {process.steps.map((s) => (
            <li className="mp-process__step" key={s.num}>
              <span className="mp-process__num" aria-hidden="true">{s.num}</span>
              <h3 className="mp-process__title">{s.title}</h3>
              <p className="mp-process__body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
