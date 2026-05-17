import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';

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

      <dl className="mp-qa-list">
        {qa.items.map((it, i) => (
          <div className="mp-qa__row" key={it.q}>
            <dt className="mp-qa__q">
              <span className="mp-qa__q-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{it.q}</span>
            </dt>
            <dd className="mp-qa__a">{it.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
