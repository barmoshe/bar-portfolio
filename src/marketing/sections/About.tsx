import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';
import RunningFoot from '../components/RunningFoot';

export default function About() {
  const { t } = useLang();
  const { about } = t;

  return (
    <section
      className="mp-section mp-about"
      id="about"
      aria-labelledby="about-headline"
    >
      <SectionHeading
        number={about.number}
        kicker={about.kicker}
        title={about.title}
        id="about-headline"
      />

      <div className="mp-about__body">
        {about.paragraphs.map((p, i) => (
          <p className="mp-about__p" key={i}>
            {p}
          </p>
        ))}
      </div>

      <dl className="mp-about__stats">
        {about.stats.map((s) => (
          <div className="mp-about__stat" key={s.label}>
            <dt className="mp-about__stat-value">{s.value}</dt>
            <dd className="mp-about__stat-label">{s.label}</dd>
          </div>
        ))}
      </dl>

      <RunningFoot sectionNumber={about.number} />
    </section>
  );
}
