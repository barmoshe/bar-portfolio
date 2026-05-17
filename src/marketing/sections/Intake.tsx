import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLang } from '../LangContext';
import { buildWhatsAppHref, mailtoHref } from '../contact';

type ContactMethod = 'whatsapp' | 'email';

type FormState = {
  template: string;
  idea: string;
  audience: string;
  problem: string;
  features: string[];
  references: string;
  timeline: string;
  budget: string;
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
};

const INITIAL: FormState = {
  template: '',
  idea: '',
  audience: '',
  problem: '',
  features: [],
  references: '',
  timeline: '',
  budget: '',
  name: '',
  contactMethod: 'whatsapp',
  contactValue: '',
};

type Props = {
  selectedTemplate: string;
};

export default function Intake({ selectedTemplate }: Props) {
  const { t } = useLang();
  const { intake, templates } = t;
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<string>('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Templates section pre-selects template via parent state. Only the
  // `template` field is touched — other inputs the user typed are kept.
  useEffect(() => {
    if (selectedTemplate && selectedTemplate !== form.template) {
      setForm((f) => ({ ...f, template: selectedTemplate }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleFeature = (id: string) => {
    setForm((f) => ({
      ...f,
      features: f.features.includes(id)
        ? f.features.filter((x) => x !== id)
        : [...f.features, id],
    }));
  };

  const templateTitle = (slug: string): string => {
    const found = templates.items.find((it) => it.slug === slug);
    return found ? `${found.emoji} ${found.title}` : '—';
  };

  const featureLabels = (ids: string[]): string =>
    intake.features
      .filter((f) => ids.includes(f.id))
      .map((f) => `• ${f.label}`)
      .join('\n');

  const timelineLabel = (id: string): string =>
    intake.timelines.find((it) => it.id === id)?.label ?? '—';

  const budgetLabel = (id: string): string =>
    intake.budgets.find((it) => it.id === id)?.label ?? '—';

  const buildBrief = (): string => {
    const lines: string[] = [];
    lines.push(intake.briefHeading);
    lines.push('');
    lines.push('🎯 *סוג הפרויקט*');
    lines.push(templateTitle(form.template));
    lines.push('');
    lines.push('💡 *הרעיון*');
    lines.push(form.idea.trim());
    if (form.audience.trim()) {
      lines.push('');
      lines.push('👤 *המשתמש*');
      lines.push(form.audience.trim());
    }
    if (form.problem.trim()) {
      lines.push('');
      lines.push('🔧 *הבעיה שזה פותר*');
      lines.push(form.problem.trim());
    }
    if (form.features.length > 0) {
      lines.push('');
      lines.push("⭐ *פיצ'רים חשובים*");
      lines.push(featureLabels(form.features));
    }
    if (form.references.trim()) {
      lines.push('');
      lines.push('🎨 *השראה / דוגמאות*');
      lines.push(form.references.trim());
    }
    if (form.timeline) {
      lines.push('');
      lines.push('⏱ *לוח זמנים*');
      lines.push(timelineLabel(form.timeline));
    }
    if (form.budget) {
      lines.push('');
      lines.push('💰 *תקציב משוער*');
      lines.push(budgetLabel(form.budget));
    }
    lines.push('');
    lines.push('— —');
    const contactKind =
      form.contactMethod === 'whatsapp'
        ? intake.fields.contactMethod.whatsapp
        : intake.fields.contactMethod.email;
    lines.push(`שם: ${form.name.trim()}`);
    lines.push(`יצירת קשר (${contactKind}): ${form.contactValue.trim()}`);
    lines.push('');
    lines.push(intake.briefFooter);
    return lines.join('\n');
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const node = formRef.current;
    if (!node) return;
    if (!node.checkValidity()) {
      setStatus(intake.liveError);
      const firstInvalid = node.querySelector<HTMLElement>(':invalid');
      firstInvalid?.focus();
      return;
    }
    const brief = buildBrief();
    const href = buildWhatsAppHref(brief);
    window.open(href, '_blank', 'noopener,noreferrer');
    setStatus(intake.liveSuccess);
  };

  const mailHref = (): string => {
    const subject = encodeURIComponent('פנייה חדשה מהאתר');
    const body = encodeURIComponent(buildBrief());
    // Reuse existing email recipient from mailtoHref by parsing it once.
    const recipient = mailtoHref.split('?')[0];
    return `${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      className="mp-section mp-section--wide"
      id="intake"
      aria-labelledby="intake-headline"
    >
      <span className="mp-eyebrow">{intake.eyebrow}</span>
      <h2 className="mp-h2" id="intake-headline">
        {intake.headlineLead}
        <mark>{intake.headlineMark}</mark>
      </h2>
      <p className="mp-lead">{intake.lead}</p>

      <form
        ref={formRef}
        className="mp-intake"
        onSubmit={onSubmit}
        noValidate
        aria-describedby="intake-required-hint"
      >
        <p className="mp-intake__hint" id="intake-required-hint">
          {intake.requiredHint}
        </p>

        {/* ── Required block ───────────────────────────────────── */}
        <div className="mp-intake__block mp-intake__block--required">
          <fieldset
            className="mp-field mp-field--group"
            aria-invalid={submitAttempted && !form.template}
          >
            <legend className="mp-field__label">
              {intake.fields.template.label}{' '}
              <span className="mp-field__required" aria-hidden="true">
                *
              </span>
            </legend>
            <p className="mp-field__hint">{intake.fields.template.placeholder}</p>
            <div className="mp-chip-group" role="radiogroup">
              {templates.items.map((tpl) => {
                const checked = form.template === tpl.slug;
                return (
                  <label
                    key={tpl.slug}
                    className="mp-chip mp-chip--radio"
                    data-selected={checked || undefined}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={tpl.slug}
                      checked={checked}
                      onChange={() => update('template', tpl.slug)}
                      required
                    />
                    <span aria-hidden="true">{tpl.emoji}</span>
                    <span>{tpl.title}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mp-field">
            <label className="mp-field__label" htmlFor="intake-idea">
              {intake.fields.idea.label}{' '}
              <span className="mp-field__required" aria-hidden="true">
                *
              </span>
            </label>
            <p className="mp-field__hint" id="intake-idea-hint">
              {intake.fields.idea.hint}
            </p>
            <textarea
              id="intake-idea"
              className="mp-textarea"
              value={form.idea}
              onChange={(e) => update('idea', e.target.value)}
              placeholder={intake.fields.idea.placeholder}
              rows={3}
              required
              aria-required="true"
              aria-describedby="intake-idea-hint"
              aria-invalid={submitAttempted && !form.idea.trim()}
            />
          </div>

          <div className="mp-field">
            <label className="mp-field__label" htmlFor="intake-name">
              {intake.fields.name.label}{' '}
              <span className="mp-field__required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="intake-name"
              className="mp-input"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder={intake.fields.name.placeholder}
              autoComplete="given-name"
              required
              aria-required="true"
              aria-invalid={submitAttempted && !form.name.trim()}
            />
          </div>

          <fieldset className="mp-field mp-field--group">
            <legend className="mp-field__label">
              {intake.fields.contactMethod.label}{' '}
              <span className="mp-field__required" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="mp-chip-group mp-chip-group--inline" role="radiogroup">
              <label
                className="mp-chip mp-chip--radio"
                data-selected={form.contactMethod === 'whatsapp' || undefined}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value="whatsapp"
                  checked={form.contactMethod === 'whatsapp'}
                  onChange={() => update('contactMethod', 'whatsapp')}
                />
                <span aria-hidden="true">💬</span>
                <span>{intake.fields.contactMethod.whatsapp}</span>
              </label>
              <label
                className="mp-chip mp-chip--radio"
                data-selected={form.contactMethod === 'email' || undefined}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={form.contactMethod === 'email'}
                  onChange={() => update('contactMethod', 'email')}
                />
                <span aria-hidden="true">✉</span>
                <span>{intake.fields.contactMethod.email}</span>
              </label>
            </div>
          </fieldset>

          <div className="mp-field">
            <label className="mp-field__label" htmlFor="intake-contact-value">
              {form.contactMethod === 'whatsapp'
                ? intake.fields.contactValue.labelWhatsapp
                : intake.fields.contactValue.labelEmail}{' '}
              <span className="mp-field__required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="intake-contact-value"
              className="mp-input"
              type={form.contactMethod === 'email' ? 'email' : 'tel'}
              inputMode={form.contactMethod === 'email' ? 'email' : 'tel'}
              dir="ltr"
              value={form.contactValue}
              onChange={(e) => update('contactValue', e.target.value)}
              placeholder={
                form.contactMethod === 'email'
                  ? intake.fields.contactValue.placeholderEmail
                  : intake.fields.contactValue.placeholderWhatsapp
              }
              autoComplete={form.contactMethod === 'email' ? 'email' : 'tel'}
              required
              aria-required="true"
              aria-invalid={submitAttempted && !form.contactValue.trim()}
            />
          </div>
        </div>

        {/* ── Optional block ───────────────────────────────────── */}
        <h3 className="mp-intake__optional-heading">{intake.optionalHeading}</h3>

        <div className="mp-intake__block">
          <div className="mp-field">
            <label className="mp-field__label" htmlFor="intake-audience">
              {intake.fields.audience.label}
            </label>
            <input
              id="intake-audience"
              className="mp-input"
              type="text"
              value={form.audience}
              onChange={(e) => update('audience', e.target.value)}
              placeholder={intake.fields.audience.placeholder}
            />
          </div>

          <div className="mp-field">
            <label className="mp-field__label" htmlFor="intake-problem">
              {intake.fields.problem.label}
            </label>
            <textarea
              id="intake-problem"
              className="mp-textarea"
              value={form.problem}
              onChange={(e) => update('problem', e.target.value)}
              placeholder={intake.fields.problem.placeholder}
              rows={2}
            />
          </div>

          <fieldset className="mp-field mp-field--group">
            <legend className="mp-field__label">{intake.fields.features.label}</legend>
            <p className="mp-field__hint">{intake.fields.features.hint}</p>
            <div className="mp-chip-group" role="group">
              {intake.features.map((feat) => {
                const checked = form.features.includes(feat.id);
                return (
                  <button
                    key={feat.id}
                    type="button"
                    className="mp-chip mp-chip--toggle"
                    aria-pressed={checked}
                    data-selected={checked || undefined}
                    onClick={() => toggleFeature(feat.id)}
                  >
                    <span aria-hidden="true">{checked ? '✓' : '+'}</span>
                    <span>{feat.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mp-field">
            <label className="mp-field__label" htmlFor="intake-references">
              {intake.fields.references.label}
            </label>
            <textarea
              id="intake-references"
              className="mp-textarea"
              value={form.references}
              onChange={(e) => update('references', e.target.value)}
              placeholder={intake.fields.references.placeholder}
              rows={2}
            />
          </div>

          <fieldset className="mp-field mp-field--group">
            <legend className="mp-field__label">{intake.fields.timeline.label}</legend>
            <div className="mp-chip-group mp-chip-group--inline" role="radiogroup">
              {intake.timelines.map((tl) => {
                const checked = form.timeline === tl.id;
                return (
                  <label
                    key={tl.id}
                    className="mp-chip mp-chip--radio"
                    data-selected={checked || undefined}
                  >
                    <input
                      type="radio"
                      name="timeline"
                      value={tl.id}
                      checked={checked}
                      onChange={() => update('timeline', tl.id)}
                    />
                    <span>{tl.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mp-field mp-field--group">
            <legend className="mp-field__label">{intake.fields.budget.label}</legend>
            <p className="mp-field__hint">{intake.fields.budget.hint}</p>
            <div className="mp-chip-group mp-chip-group--inline" role="radiogroup">
              {intake.budgets.map((b) => {
                const checked = form.budget === b.id;
                return (
                  <label
                    key={b.id}
                    className="mp-chip mp-chip--radio"
                    data-selected={checked || undefined}
                  >
                    <input
                      type="radio"
                      name="budget"
                      value={b.id}
                      checked={checked}
                      onChange={() => update('budget', b.id)}
                    />
                    <span>{b.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="mp-intake__actions">
          <button type="submit" className="mp-cta mp-cta--primary">
            <span aria-hidden="true">💬</span> {intake.submit}
          </button>
          <p className="mp-intake__action-hint">{intake.submitHint}</p>
          <a className="mp-intake__mail-fallback" href={mailHref()}>
            {intake.mailFallback}
          </a>
        </div>

        <div
          className="mp-live-region"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status}
        </div>
      </form>
    </section>
  );
}
