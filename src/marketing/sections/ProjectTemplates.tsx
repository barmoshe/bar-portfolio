import { useLang } from '../LangContext';
import { scrollToIntake } from '../scrollToIntake';

/**
 * BACKLOG column — 10 ticket cards the visitor can pick from. Picking
 * one sets the template (parent state) and scrolls to the Intake form.
 * No drag-and-drop; the kanban metaphor lives in the column ribbon +
 * pill state rather than in horizontal columns (mobile-first decision).
 */
type Props = {
  selected: string;
  onPick: (slug: string) => void;
};

export default function ProjectTemplates({ selected, onPick }: Props) {
  const { t } = useLang();
  const { contents, board } = t;

  const handlePick = (slug: string) => {
    onPick(slug);
    scrollToIntake();
  };

  return (
    <section
      className="mp-section mp-contents"
      id="contents"
      aria-labelledby="contents-headline"
    >
      <div className="mp-column">
        <header className="mp-column__header">
          <h2 id="contents-headline" className="mp-column__title">
            {board.columns.backlog}
          </h2>
          <span className="mp-column__count">
            {contents.items.length}
          </span>
        </header>

        <p className="mp-standfirst" style={{ marginBlockEnd: 16 }}>
          {contents.standfirst}
        </p>

        <ol className="mp-toc" aria-label={contents.title}>
          {contents.items.map((item, i) => {
            const isSelected = selected === item.slug;
            const num = String(i + 1).padStart(2, '0');
            return (
              <li className="mp-toc__row" key={item.slug}>
                <button
                  type="button"
                  className="mp-toc__btn"
                  data-selected={isSelected || undefined}
                  aria-pressed={isSelected}
                  onClick={() => handlePick(item.slug)}
                >
                  <span className="mp-toc__num" aria-hidden="true">{num}</span>
                  <span className="mp-toc__body">
                    <span className="mp-toc__title">{item.title}</span>
                    <span className="mp-toc__summary">{item.summary}</span>
                  </span>
                  <span className="mp-toc__cta" aria-hidden="true">→</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
