import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';
import Pipeline from '../components/Pipeline';
import BuildLine from '../components/BuildLine';
import RunningFoot from '../components/RunningFoot';

export default function Process() {
  const { t } = useLang();
  const { method, build } = t;

  return (
    <section
      className="mp-section mp-method mp-buildlog"
      id="method"
      aria-labelledby="method-headline"
    >
      <SectionHeading
        number={method.number}
        kicker={method.kicker}
        title={method.title}
        id="method-headline"
      />

      <p className="mp-standfirst">{method.standfirst}</p>

      <Pipeline stages={build.pipeline.stages} caption={build.pipeline.caption} />

      <ol className="mp-steps">
        {method.steps.map((s, i) => {
          const line = build.buildLines[i];
          return (
            <li className="mp-step" key={s.num}>
              <span className="mp-step__num" aria-hidden="true">{s.num}</span>
              <div className="mp-step__body">
                <h3 className="mp-step__title">{s.title}</h3>
                {line ? (
                  <ul className="mp-step__build" aria-hidden="true">
                    <BuildLine
                      label={line.label}
                      status={line.status}
                      state={line.state}
                    />
                  </ul>
                ) : null}
                <p className="mp-step__text">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <figure className="mp-pull">
        <blockquote>{method.pullQuote.quote}</blockquote>
        <figcaption>— {method.pullQuote.cite}</figcaption>
      </figure>

      <RunningFoot sectionNumber={method.number} />
    </section>
  );
}
