import { useRef, type KeyboardEvent } from 'react';
import { useLang } from '../LangContext';
import { LANGS, type Lang } from '../i18n';

/**
 * EN/HE segmented pill. Two buttons in a single `role="group"`, with
 * `aria-pressed` on each so screen readers announce the active option.
 * Left/Right arrow keys cycle between the two; Enter/Space activates
 * (handled natively by <button>). A visually-hidden live region speaks
 * the change announcement after a flip.
 *
 * Labels are each language's endonym ("English" / "עברית") per WCAG
 * 2.2 (3.1.2 Language of Parts) — the HE label is wrapped in a
 * span with `lang="he"` so AT pronounces it correctly even when the
 * surrounding page is in EN.
 */

const OTHER: Record<Lang, Lang> = { en: 'he', he: 'en' };

export default function LangToggle() {
  const { lang, setLang, t } = useLang();
  const refs = useRef<Record<Lang, HTMLButtonElement | null>>({ en: null, he: null });

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
      onKeyDown={onKeyDown}
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
