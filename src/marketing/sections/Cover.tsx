import { useLang } from '../LangContext';
import { INTAKE_ID } from '../scrollToIntake';

/**
 * STRIPPED — plain semantic HTML. The redesign should turn this
 * into the hero. See DESIGN_BRIEF.md for what's expected.
 *
 * Copy is locked: do not change `cover.*` strings.
 */
export default function Cover() {
  const { t } = useLang();
  const { cover } = t;

  return (
    <section id="top" aria-labelledby="cover-headline">
      <p>{cover.issueLine}</p>

      <h1 id="cover-headline">
        {cover.headlineLines.map((line, i) => (
          <span key={i} style={{ display: 'block' }}>{line}</span>
        ))}
      </h1>

      <p>{cover.standfirst}</p>

      <p>
        <a href={`#${INTAKE_ID}`}>{cover.ctaStart} →</a>
      </p>
      <p>
        <a href="#contents">{cover.ctaBrowse} ↓</a>
      </p>
    </section>
  );
}
