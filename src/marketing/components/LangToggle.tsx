import { useRef, type KeyboardEvent } from 'react';
import { useLang } from '../LangContext';
import { LANGS, type Lang } from '../i18n';

// Each button carries its own `lang` attribute (its endonym per WCAG
// 3.1.2 Language of Parts) so AT pronounces "עברית" correctly even
// when the surrounding page is English, and vice versa. Arrow keys
// live on the buttons rather than the wrapping group so the wrapper
// stays a non-interactive role="group" (jsx-a11y enforces this).

const OTHER: Record<Lang, Lang> = { en: 'he', he: 'en' };

export default function LangToggle() {
  const { lang, setLang, t } = useLang();
  const refs = useRef<Record<Lang, HTMLButtonElement | null>>({ en: null, he: null });

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = OTHER[lang];
    setLang(next);
    requestAnimationFrame(() => refs.current[next]?.focus());
  };

  const labels: Record<Lang, string> = {
    en: t.masthead.langEnLabel,
    he: t.masthead.langHeLabel,
  };

  return (
    <div
      className="mp-bar__lang"
      role="group"
      aria-label={t.masthead.langGroupLabel}
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            ref={(el) => { refs.current[code] = el; }}
            type="button"
            className={
              'mp-bar__lang-btn' + (active ? ' mp-bar__lang-btn--active' : '')
            }
            aria-pressed={active}
            tabIndex={active ? 0 : -1}
            lang={code}
            onClick={() => setLang(code)}
            onKeyDown={onButtonKeyDown}
          >
            {labels[code]}
          </button>
        );
      })}
      <span className="visually-hidden" aria-live="polite">
        {t.masthead.langSwitchedTo}
      </span>
    </div>
  );
}
