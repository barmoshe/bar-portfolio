import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useLang } from '../LangContext';
import { buildMailtoHref, buildWhatsAppHref } from '../../marketing/contact';
import { INTAKE_ID } from '../scrollToIntake';
import type { ContactMethodKey } from '../i18n';

/**
 * LabIntake — "Crafting Recipe" form.
 *
 * The brief intake is laid out as a crafting grid (Minecraft / Stardew
 * Valley metaphor). Each slot is a field. The output panel renders the
 * assembled brief as a "forged item card" whose rarity colour escalates
 * with completeness: common → uncommon → rare → epic → legendary (with
 * a vibe chip selected). The 3/3 essentials counter doubles as the
 * progress bar; the submit pulses when legendary.
 */

type FormState = {
  what: string;
  who: string;
  reference: string;
  contactMethod: ContactMethodKey;
  contactValue: string;
};

const INITIAL: FormState = {
  what: '',
  who: '',
  reference: '',
  contactMethod: 'whatsapp',
  contactValue: '',
};

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

type Props = { selectedTemplate: string };

export default function LabIntake({ selectedTemplate }: Props) {
  const { t } = useLang();
  const { brief, contents, board } = t;
  const { craft } = brief;

  const [form, setForm] = useState<FormState>(INITIAL);
  const [vibes, setVibes] = useState<Set<string>>(() => new Set());
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState('');
  const whatRef = useRef<HTMLTextAreaElement | null>(null);

  const pickedItem = useMemo(
    () => contents.items.find((i) => i.slug === selectedTemplate),
    [contents.items, selectedTemplate],
  );

  // When a template is picked above, focus the "what" slot.
  useEffect(() => {
    if (!selectedTemplate) return;
    whatRef.current?.focus({ preventScroll: true });
    // A new template invalidates the previously picked vibes.
    setVibes(new Set());
  }, [selectedTemplate]);

  const onField = (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const onMethodChange = (next: ContactMethodKey) => {
    setForm((f) => ({ ...f, contactMethod: next, contactValue: '' }));
  };

  const toggleVibe = (id: string) => {
    setVibes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Essentials = what + who + contactValue. Three slots.
  const filledEssentials = useMemo(() => {
    let n = 0;
    if (form.what.trim()) n += 1;
    if (form.who.trim()) n += 1;
    if (form.contactValue.trim()) n += 1;
    return n;
  }, [form.what, form.who, form.contactValue]);

  const allEssentialsFilled = filledEssentials === 3;
  const hasVibe = vibes.size > 0;

  const rarity: Rarity = useMemo(() => {
    if (allEssentialsFilled && hasVibe) return 'legendary';
    if (allEssentialsFilled) return 'epic';
    if (filledEssentials === 2) return 'rare';
    if (filledEssentials === 1) return 'uncommon';
    return 'common';
  }, [filledEssentials, allEssentialsFilled, hasVibe]);

  const rarityLabel: string = useMemo(() => {
    switch (rarity) {
      case 'legendary': return craft.rarity.legendary;
      case 'epic':      return craft.rarity.legendary; // share gold with legendary visually
      case 'rare':      return craft.rarity.rare;
      case 'uncommon':  return craft.rarity.uncommon;
      default:          return craft.rarity.common;
    }
  }, [rarity, craft.rarity]);

  const whatInvalid = showErrors && !form.what.trim();
  const whoInvalid = showErrors && !form.who.trim();
  const contactInvalid = showErrors && !form.contactValue.trim();

  const whatPlaceholder =
    pickedItem?.slotHints.what ?? brief.fields.idea.placeholder;
  const whoPlaceholder =
    pickedItem?.slotHints.who ?? brief.fields.whoFor.placeholder;
  const referencePlaceholder =
    pickedItem?.slotHints.reference ?? brief.fields.reference.placeholder;

  const contactLabel =
    form.contactMethod === 'whatsapp'
      ? brief.fields.contactValue.labelWhatsapp
      : brief.fields.contactValue.labelEmail;
  const contactPlaceholder =
    form.contactMethod === 'whatsapp'
      ? brief.fields.contactValue.placeholderWhatsapp
      : brief.fields.contactValue.placeholderEmail;
  const sendingVia =
    form.contactMethod === 'whatsapp'
      ? brief.previewSendVia.whatsapp
      : brief.previewSendVia.email;

  const selectedVibeLabels = useMemo(() => {
    if (!pickedItem) return [] as string[];
    return pickedItem.vibeChips
      .filter((c) => vibes.has(c.id))
      .map((c) => c.label);
  }, [pickedItem, vibes]);

  const counterText = useMemo(() => {
    if (allEssentialsFilled) return craft.essentialsAll;
    return craft.essentialsCount
      .replace('{n}', String(filledEssentials))
      .replace('{total}', '3');
  }, [filledEssentials, allEssentialsFilled, craft.essentialsAll, craft.essentialsCount]);

  const buildBriefBody = (): string => {
    const lines: string[] = [];
    lines.push(brief.briefHeading, '');
    if (pickedItem) {
      lines.push(`${brief.briefSections.type}: ${pickedItem.title}`);
    }
    lines.push(`${brief.briefSections.idea}: ${form.what.trim()}`);
    lines.push(`${brief.briefSections.whoFor}: ${form.who.trim()}`);
    if (form.reference.trim()) {
      lines.push(`${brief.briefSections.reference}: ${form.reference.trim()}`);
    }
    if (selectedVibeLabels.length) {
      lines.push(`${brief.briefSections.vibe}: ${selectedVibeLabels.join(', ')}`);
    }
    lines.push('', brief.briefFooter);
    return lines.join('\n');
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!allEssentialsFilled) {
      setShowErrors(true);
      setStatus(brief.liveError);
      return;
    }
    const body = buildBriefBody();
    const href =
      form.contactMethod === 'whatsapp'
        ? buildWhatsAppHref(body)
        : buildMailtoHref(brief.mailSubject, body);
    setStatus(brief.liveSuccess);
    if (form.contactMethod === 'whatsapp') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  const onMailFallback = () => {
    const body = buildBriefBody();
    window.location.href = buildMailtoHref(brief.mailSubject, body);
  };

  const submitLabel = allEssentialsFilled ? craft.submitReady : craft.submit;

  return (
    <section
      className="mp-section mp-brief mp-brief--lab"
      id={INTAKE_ID}
      aria-labelledby="brief-headline"
    >
      <header className="mp-h">
        <span className="mp-h__num" aria-hidden="true">{brief.number}</span>
        <span className="mp-h__kicker">{board.columns.process}</span>
        <h2 id="brief-headline" className="mp-h__title">
          {brief.title}
        </h2>
      </header>

      <p className="mp-standfirst" style={{ marginBlockEnd: 20 }}>
        {brief.standfirst}
      </p>

      <div className="lab-craft">
        <form
          className="lab-craft__grid"
          onSubmit={onSubmit}
          noValidate
          aria-label={craft.gridLabel}
          aria-describedby="lab-craft-status"
          data-rarity={rarity}
        >
          {/* Cell: WHAT (idea) — top-start, spans 2 cols on wide screens */}
          <div className="lab-craft__slot lab-craft__slot--what" data-essential="true">
            <label className="lab-craft__label" htmlFor="lab-what">
              <span className="lab-craft__slot-icon" aria-hidden="true">✦</span>
              {craft.slotLabels.what}
              <span className="lab-craft__req" aria-hidden="true">*</span>
            </label>
            <textarea
              id="lab-what"
              ref={whatRef}
              className="lab-craft__input lab-craft__input--textarea"
              data-lab-focus
              value={form.what}
              onChange={onField('what')}
              placeholder={whatPlaceholder}
              rows={2}
              required
              aria-required="true"
              aria-invalid={whatInvalid || undefined}
              data-invalid={whatInvalid || undefined}
            />
          </div>

          {/* Cell: TYPE (template chip) — center top */}
          <div
            className="lab-craft__slot lab-craft__slot--type"
            aria-label={brief.templatePickedPrefix}
          >
            {pickedItem ? (
              <span className="lab-craft__type-chip">
                <span className="lab-craft__type-mini" aria-hidden="true">⬡</span>
                {pickedItem.title}
              </span>
            ) : (
              <span className="lab-craft__type-empty">
                {craft.pickTemplateFirst}
              </span>
            )}
          </div>

          {/* Cell: WHO */}
          <div className="lab-craft__slot lab-craft__slot--who" data-essential="true">
            <label className="lab-craft__label" htmlFor="lab-who">
              <span className="lab-craft__slot-icon" aria-hidden="true">◉</span>
              {craft.slotLabels.who}
              <span className="lab-craft__req" aria-hidden="true">*</span>
            </label>
            <input
              id="lab-who"
              className="lab-craft__input"
              type="text"
              value={form.who}
              onChange={onField('who')}
              placeholder={whoPlaceholder}
              required
              aria-required="true"
              aria-invalid={whoInvalid || undefined}
              data-invalid={whoInvalid || undefined}
            />
          </div>

          {/* Cell: VIBE chips */}
          <div className="lab-craft__slot lab-craft__slot--vibe">
            <span className="lab-craft__label" id="lab-vibe-label">
              <span className="lab-craft__slot-icon" aria-hidden="true">✺</span>
              {craft.slotLabels.vibe}
            </span>
            {pickedItem ? (
              <>
                <p className="lab-craft__hint">{craft.vibeHint}</p>
                <div
                  className="lab-craft__chips"
                  role="group"
                  aria-labelledby="lab-vibe-label"
                >
                  {pickedItem.vibeChips.map((chip) => {
                    const active = vibes.has(chip.id);
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        className="lab-craft__chip"
                        data-active={active || undefined}
                        aria-pressed={active}
                        onClick={() => toggleVibe(chip.id)}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="lab-craft__hint">{craft.pickTemplateFirst}</p>
            )}
          </div>

          {/* Cell: RARITY indicator (center middle) */}
          <div
            className="lab-craft__slot lab-craft__slot--rarity"
            data-rarity={rarity}
            aria-live="polite"
          >
            <span className="lab-craft__rarity-stars" aria-hidden="true">
              {rarity === 'legendary' ? '★★★★★'
                : rarity === 'epic'      ? '★★★★☆'
                : rarity === 'rare'      ? '★★★☆☆'
                : rarity === 'uncommon'  ? '★★☆☆☆'
                                         : '★☆☆☆☆'}
            </span>
            <span className="lab-craft__rarity-label">{rarityLabel}</span>
            <span className="lab-craft__rarity-counter">{counterText}</span>
          </div>

          {/* Cell: REFERENCE */}
          <div className="lab-craft__slot lab-craft__slot--ref">
            <label className="lab-craft__label" htmlFor="lab-ref">
              <span className="lab-craft__slot-icon" aria-hidden="true">⌘</span>
              {craft.slotLabels.reference}
            </label>
            <input
              id="lab-ref"
              className="lab-craft__input"
              type="text"
              value={form.reference}
              onChange={onField('reference')}
              placeholder={referencePlaceholder}
            />
          </div>

          {/* Cell: CONTACT */}
          <div className="lab-craft__slot lab-craft__slot--contact" data-essential="true">
            <label className="lab-craft__label" htmlFor="lab-contact">
              <span className="lab-craft__slot-icon" aria-hidden="true">✉</span>
              {contactLabel}
              <span className="lab-craft__req" aria-hidden="true">*</span>
            </label>
            <input
              id="lab-contact"
              className="lab-craft__input"
              type={form.contactMethod === 'email' ? 'email' : 'tel'}
              inputMode={form.contactMethod === 'email' ? 'email' : 'tel'}
              value={form.contactValue}
              onChange={onField('contactValue')}
              placeholder={contactPlaceholder}
              required
              aria-required="true"
              aria-invalid={contactInvalid || undefined}
              data-invalid={contactInvalid || undefined}
            />
          </div>

          {/* Cell: METHOD (radio) */}
          <fieldset className="lab-craft__slot lab-craft__slot--method">
            <legend className="lab-craft__label">
              <span className="lab-craft__slot-icon" aria-hidden="true">⇆</span>
              {brief.fields.contactMethod.label}
            </legend>
            <div className="lab-craft__methods" role="radiogroup">
              <label className="lab-craft__method">
                <input
                  type="radio"
                  name="lab-contact-method"
                  value="whatsapp"
                  checked={form.contactMethod === 'whatsapp'}
                  onChange={() => onMethodChange('whatsapp')}
                />
                <span>{brief.fields.contactMethod.whatsapp}</span>
              </label>
              <label className="lab-craft__method">
                <input
                  type="radio"
                  name="lab-contact-method"
                  value="email"
                  checked={form.contactMethod === 'email'}
                  onChange={() => onMethodChange('email')}
                />
                <span>{brief.fields.contactMethod.email}</span>
              </label>
            </div>
          </fieldset>

          {/* Cell: SUBMIT */}
          <div className="lab-craft__slot lab-craft__slot--submit">
            <button
              type="submit"
              className="mp-cta mp-cta--primary mp-cta--block lab-craft__submit"
              data-ready={allEssentialsFilled || undefined}
              data-legendary={rarity === 'legendary' || undefined}
            >
              {submitLabel}
            </button>
            <p
              id="lab-craft-status"
              className="lab-craft__status"
              role="status"
              aria-live="polite"
            >
              {status}
            </p>
            <button
              type="button"
              className="lab-craft__link-btn"
              onClick={onMailFallback}
            >
              {brief.mailFallback}
            </button>
          </div>
        </form>

        <aside
          className="lab-craft__output mp-card"
          data-rarity={rarity}
          aria-label={craft.outputHeading}
        >
          <header className="lab-craft__output-head">
            <span className="lab-craft__output-rarity" data-rarity={rarity}>
              ◆ {rarityLabel}
            </span>
            <span className="lab-craft__output-title">
              {craft.outputHeading}
            </span>
          </header>

          <div className="lab-craft__output-body" aria-live="polite">
            {pickedItem ? (
              <p className="lab-craft__output-type">
                <strong>{pickedItem.title}</strong>
              </p>
            ) : null}
            {form.what.trim() ? (
              <p className="lab-craft__output-line">{form.what.trim()}</p>
            ) : (
              <p className="lab-craft__output-line lab-craft__output-line--ghost">
                {craft.outputEmpty}
              </p>
            )}
            {form.who.trim() ? (
              <p className="lab-craft__output-line">
                {brief.previewFor}: {form.who.trim()}
              </p>
            ) : null}
            {form.reference.trim() ? (
              <p className="lab-craft__output-line">
                {brief.previewLike}: {form.reference.trim()}
              </p>
            ) : null}
            {selectedVibeLabels.length ? (
              <p className="lab-craft__output-vibes">
                {selectedVibeLabels.map((v) => (
                  <span key={v} className="lab-craft__output-vibe">{v}</span>
                ))}
              </p>
            ) : null}
          </div>

          <footer className="lab-craft__output-foot">
            {sendingVia}
          </footer>
        </aside>
      </div>
    </section>
  );
}
