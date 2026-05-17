import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';

export default function Proof() {
  const { t } = useLang();
  const { letters } = t;

  return (
    <section
      className="mp-section mp-letters"
      id="letters"
      aria-labelledby="letters-headline"
    >
      <SectionHeading
        number={letters.number}
        kicker={letters.kicker}
        title={letters.title}
        id="letters-headline"
      />

      <p className="mp-standfirst">{letters.standfirst}</p>

      <ul className="mp-letter-list">
        {letters.items.map((it) => (
          <li className="mp-letter" key={it.id}>
            <blockquote className="mp-letter__quote">{it.quote}</blockquote>
            <p className="mp-letter__cite">
              <span className="mp-letter__name">{it.name}</span>
              <span className="mp-letter__role">{it.role}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
