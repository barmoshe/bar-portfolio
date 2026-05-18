import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';
import RunningFoot from '../components/RunningFoot';

export default function FAQ() {
  const { t } = useLang();
  const { qa } = t;

  return (
    <section
      className="mp-section mp-qa"
      id="qa"
      aria-labelledby="qa-headline"
    >
      <SectionHeading
        number={qa.number}
        kicker={qa.kicker}
        title={qa.title}
        id="qa-headline"
      />

      <ul className="mp-qa-list">
        {qa.items.map((it) => (
          <li className="mp-qa__row" key={it.q}>
            <details className="mp-qa__row-details">
              <summary className="mp-qa__q">
                <span className="mp-qa__q-text">{it.q}</span>
                <span className="mp-qa__q-toggle" aria-hidden="true">+</span>
              </summary>
              <p className="mp-qa__a">{it.a}</p>
            </details>
          </li>
        ))}
      </ul>

      <RunningFoot sectionNumber={qa.number} />
    </section>
  );
}
