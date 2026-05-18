import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';
import RunningFoot from '../components/RunningFoot';

export default function Process() {
  const { t } = useLang();
  const { method } = t;

  return (
    <section
      className="mp-section mp-method"
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

      <ol className="mp-steps">
        {method.steps.map((s, i) => (
          <li className={`mp-step mp-step--${i + 1}`} key={s.num}>
            <span className="mp-step__num" aria-hidden="true">{s.num}</span>
            <h3 className="mp-step__title">{s.title}</h3>
            <p className="mp-step__text">{s.body}</p>
          </li>
        ))}
      </ol>

      <figure className="mp-pull">
        <blockquote>{method.pullQuote.quote}</blockquote>
        <figcaption>— {method.pullQuote.cite}</figcaption>
      </figure>

      <RunningFoot sectionNumber={method.number} />
    </section>
  );
}
