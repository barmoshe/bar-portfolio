import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';
import RunningFoot from '../components/RunningFoot';

export default function About() {
  const { t } = useLang();
  const { about, build } = t;

  return (
    <section
      className="mp-section mp-about mp-buildlog"
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
        {about.stats.map((s, i) => (
          <div className="mp-about__stat" key={s.label}>
            <dt className="mp-about__stat-value">{s.value}</dt>
            <dd className="mp-about__stat-label">
              <span className="mp-about__stat-comment" aria-hidden="true">
                {build.statsComments[i] ?? `// ${s.label}`}
              </span>
              <span className="visually-hidden">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <RunningFoot sectionNumber={about.number} />
    </section>
  );
}
