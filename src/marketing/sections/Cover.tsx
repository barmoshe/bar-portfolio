import { useLang } from '../LangContext';
import KineticHeadline from '../components/KineticHeadline';
import BloomCta from '../components/BloomCta';
import { INTAKE_ID } from '../scrollToIntake';

export default function Cover() {
  const { t } = useLang();
  const { cover } = t;

  return (
    <section className="mp-cover" id="top" aria-labelledby="cover-headline">
      <div className="mp-cover__inner">
        <p className="mp-cover__kicker" aria-hidden="true">
          {cover.issueLine}
        </p>

        <KineticHeadline
          as="h1"
          id="cover-headline"
          className="mp-cover__h"
          lines={cover.headlineLines}
        />

        <p className="mp-cover__standfirst">{cover.standfirst}</p>

        <div className="mp-cover__actions">
          <BloomCta
            href={`#${INTAKE_ID}`}
            scrollTargetId={INTAKE_ID}
          >
            {cover.ctaStart}
          </BloomCta>
          <a className="mp-cover__second" href="#contents">
            {cover.ctaBrowse}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
