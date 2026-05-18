import { useLang } from '../LangContext';

export default function About() {
  const { t } = useLang();
  const { about } = t;

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
    </section>
  );
}
