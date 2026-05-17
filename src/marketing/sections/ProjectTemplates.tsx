import { useLang } from '../LangContext';
import { scrollToIntake } from '../scrollToIntake';

type Props = {
  selected: string;
  onPick: (slug: string) => void;
};

export default function ProjectTemplates({ selected, onPick }: Props) {
  const { t } = useLang();
  const { templates } = t;

  const handlePick = (slug: string) => {
    onPick(slug);
    scrollToIntake();
  };

  return (
    <section
      className="mp-section mp-section--wide"
      id="templates"
      aria-labelledby="templates-headline"
    >
      <span className="mp-eyebrow">{templates.eyebrow}</span>
      <h2 className="mp-h2" id="templates-headline">
        {templates.headlineLead}
        <mark>{templates.headlineMark}</mark>
      </h2>
      <p className="mp-lead">{templates.lead}</p>

      <div className="mp-templates">
        {templates.items.map((tpl) => {
          const isSelected = selected === tpl.slug;
          return (
            <button
              key={tpl.slug}
              type="button"
              className="mp-template"
              data-selected={isSelected || undefined}
              aria-pressed={isSelected}
              onClick={() => handlePick(tpl.slug)}
            >
              <h3 className="mp-template__title">{tpl.title}</h3>
              <p className="mp-template__summary">{tpl.summary}</p>
              {tpl.fits.length > 0 ? (
                <p className="mp-template__fits">
                  <span className="mp-template__fits-label">
                    {templates.fitChipLabel}:
                  </span>{' '}
                  {tpl.fits.join(' · ')}
                </p>
              ) : null}
              <span className="mp-template__cta" aria-hidden="true">
                {isSelected ? templates.pickedLabel : templates.pickHint}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
