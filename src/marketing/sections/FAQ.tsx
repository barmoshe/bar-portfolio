import { useLang } from '../LangContext';

export default function FAQ() {
  const { t } = useLang();
  const { qa, board } = t;

  return (
    <section
      className="mp-section mp-qa"
      id="qa"
      aria-labelledby="qa-headline"
    >
      <header className="mp-h">
        <span className="mp-h__num" aria-hidden="true">{qa.number}</span>
        <span className="mp-h__kicker">{board.columns.faq}</span>
        <h2 id="qa-headline" className="mp-h__title">
          {qa.title}
        </h2>
      </header>

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
    </section>
  );
}
