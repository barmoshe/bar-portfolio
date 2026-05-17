import { useLang } from '../LangContext';
import SectionHeading from '../components/SectionHeading';
import RunningFoot from '../components/RunningFoot';
import { scrollToIntake } from '../scrollToIntake';

type Props = {
  selected: string;
  onPick: (slug: string) => void;
};

export default function ProjectTemplates({ selected, onPick }: Props) {
  const { t } = useLang();
  const { contents } = t;

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
      <SectionHeading
        number={contents.number}
        kicker={contents.kicker}
        title={contents.title}
        id="contents-headline"
      />

      <p className="mp-standfirst">{contents.standfirst}</p>

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
                <span className="mp-toc__cta" aria-hidden="true">
                  {isSelected ? contents.pickedLabel : '←'}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <RunningFoot sectionNumber={contents.number} />
    </section>
  );
}
