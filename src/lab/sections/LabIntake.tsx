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

type FormState = {
  idea: string;
  whoFor: string;
  reference: string;
  contactMethod: ContactMethodKey;
  contactValue: string;
};

const INITIAL: FormState = {
  idea: '',
  whoFor: '',
  reference: '',
  contactMethod: 'whatsapp',
  contactValue: '',
};

type Props = { selectedTemplate: string };

export default function LabIntake({ selectedTemplate }: Props) {
  const { t } = useLang();
  const { brief, contents, board } = t;

  const [form, setForm] = useState<FormState>(INITIAL);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState('');
  const ideaRef = useRef<HTMLTextAreaElement | null>(null);

  // Resolve the picked template -> matching item (with its promptHint).
  const pickedItem = useMemo(
    () => contents.items.find((i) => i.slug === selectedTemplate),
    [contents.items, selectedTemplate],
  );

  // When a template is picked from above, gently focus the idea field so
  // the user lands on the right thing after the scroll. Don't auto-fill.
  useEffect(() => {
    if (!selectedTemplate) return;
    ideaRef.current?.focus({ preventScroll: true });
  }, [selectedTemplate]);

  const onField = (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const onMethodChange = (next: ContactMethodKey) => {
    setForm((f) => ({ ...f, contactMethod: next, contactValue: '' }));
  };

  const ideaInvalid = showErrors && form.idea.trim().length === 0;
  const contactInvalid = showErrors && form.contactValue.trim().length === 0;

  const ideaPlaceholder = pickedItem?.promptHint ?? brief.fields.idea.placeholder;
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

  const buildBriefBody = (): string => {
    const lines: string[] = [];
    lines.push(brief.briefHeading, '');
    if (pickedItem) {
      lines.push(`${brief.briefSections.type}: ${pickedItem.title}`);
    }
    lines.push(`${brief.briefSections.idea}: ${form.idea.trim()}`);
    if (form.whoFor.trim()) {
      lines.push(`${brief.briefSections.whoFor}: ${form.whoFor.trim()}`);
    }
    if (form.reference.trim()) {
      lines.push(`${brief.briefSections.reference}: ${form.reference.trim()}`);
    }
    lines.push('', brief.briefFooter);
    return lines.join('\n');
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ideaOk = form.idea.trim().length > 0;
    const contactOk = form.contactValue.trim().length > 0;
    if (!ideaOk || !contactOk) {
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

  const showPicked = Boolean(pickedItem);

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

      <div className="lab-intake__grid">
        <form
          className="lab-intake__form mp-card"
          onSubmit={onSubmit}
          noValidate
          aria-describedby="lab-intake-status"
        >
          {showPicked ? (
            <p className="lab-intake__picked">
              <span className="mp-status mp-status--selected mp-status--inline">
                {brief.templatePickedPrefix}
              </span>{' '}
              <strong>{pickedItem!.title}</strong>
            </p>
          ) : null}

          <div className="lab-intake__field">
            <label className="lab-intake__label" htmlFor="lab-idea">
              {brief.fields.idea.label}{' '}
              <span className="lab-intake__req" aria-hidden="true">*</span>
            </label>
            <p className="lab-intake__hint">{brief.fields.idea.hint}</p>
            <textarea
              id="lab-idea"
              ref={ideaRef}
              className="lab-intake__input lab-intake__textarea"
              data-lab-focus
              value={form.idea}
              onChange={onField('idea')}
              placeholder={ideaPlaceholder}
              rows={3}
              required
              aria-required="true"
              aria-invalid={ideaInvalid || undefined}
              data-invalid={ideaInvalid || undefined}
            />
          </div>

          <div className="lab-intake__field">
            <label className="lab-intake__label" htmlFor="lab-whofor">
              {brief.fields.whoFor.label}
            </label>
            <input
              id="lab-whofor"
              className="lab-intake__input"
              type="text"
              value={form.whoFor}
              onChange={onField('whoFor')}
              placeholder={brief.fields.whoFor.placeholder}
            />
          </div>

          <div className="lab-intake__field">
            <label className="lab-intake__label" htmlFor="lab-reference">
              {brief.fields.reference.label}
            </label>
            <input
              id="lab-reference"
              className="lab-intake__input"
              type="url"
              inputMode="url"
              value={form.reference}
              onChange={onField('reference')}
              placeholder={brief.fields.reference.placeholder}
            />
          </div>

          <fieldset className="lab-intake__field lab-intake__methods">
            <legend className="lab-intake__label">
              {brief.fields.contactMethod.label}
            </legend>
            <div className="lab-intake__methods-row" role="radiogroup">
              <label className="lab-intake__method">
                <input
                  type="radio"
                  name="lab-contact-method"
                  value="whatsapp"
                  checked={form.contactMethod === 'whatsapp'}
                  onChange={() => onMethodChange('whatsapp')}
                />
                <span>{brief.fields.contactMethod.whatsapp}</span>
              </label>
              <label className="lab-intake__method">
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

          <div className="lab-intake__field">
            <label className="lab-intake__label" htmlFor="lab-contact">
              {contactLabel}{' '}
              <span className="lab-intake__req" aria-hidden="true">*</span>
            </label>
            <input
              id="lab-contact"
              className="lab-intake__input"
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

          <button
            type="submit"
            className="mp-cta mp-cta--primary mp-cta--block"
          >
            ✦ {brief.submit}
          </button>

          <p className="lab-intake__hint" style={{ marginBlockStart: 12 }}>
            {brief.submitHint}
          </p>

          <p className="lab-intake__mail-fallback">
            <button
              type="button"
              className="lab-intake__link-btn"
              onClick={onMailFallback}
            >
              {brief.mailFallback}
            </button>
          </p>

          <p
            id="lab-intake-status"
            className="lab-intake__status"
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        </form>

        <aside
          className="lab-intake__preview mp-card"
          aria-label={brief.previewHeading}
        >
          <header className="lab-intake__preview-head">
            <span className="mp-status mp-status--doing mp-status--inline">
              ● {board.status.doing}
            </span>
            <span className="lab-intake__preview-title">
              {brief.previewHeading}
            </span>
          </header>

          <div className="lab-intake__preview-body" aria-live="polite">
            {form.idea.trim() ? (
              <p className="lab-intake__preview-line">{form.idea.trim()}</p>
            ) : (
              <p className="lab-intake__preview-line lab-intake__preview-line--ghost">
                {brief.previewEmpty}
              </p>
            )}
            {form.whoFor.trim() ? (
              <p className="lab-intake__preview-line">
                {brief.previewFor}: {form.whoFor.trim()}
              </p>
            ) : null}
            {form.reference.trim() ? (
              <p className="lab-intake__preview-line">
                {brief.previewLike}: {form.reference.trim()}
              </p>
            ) : null}
          </div>

          <footer className="lab-intake__preview-foot">
            {sendingVia}
          </footer>
        </aside>
      </div>
    </section>
  );
}
