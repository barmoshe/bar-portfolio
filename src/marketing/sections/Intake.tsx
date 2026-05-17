import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLang } from '../LangContext';
import { buildMailtoHref, buildWhatsAppHref } from '../contact';
import { INTAKE_ID } from '../scrollToIntake';

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

  // Preserve other user input when a template card is re-picked.
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

  const brief = useMemo(() => {
    const lookup = <T extends { id?: string; slug?: string }>(
      list: readonly T[],
      id: string,
    ): T | undefined => list.find((it) => it.id === id || it.slug === id);

    const tpl = lookup(templates.items, form.template);
    const templateLabel = tpl ? `${tpl.emoji} ${tpl.title}` : '—';
    const timelineLabel = lookup(intake.timelines, form.timeline)?.label ?? '';
    const budgetLabel = lookup(intake.budgets, form.budget)?.label ?? '';
    const featureLines = intake.features
      .filter((f) => form.features.includes(f.id))
      .map((f) => `• ${f.label}`)
      .join('\n');
    const contactKind =
      form.contactMethod === 'whatsapp'
        ? intake.fields.contactMethod.whatsapp
        : intake.fields.contactMethod.email;
    const s = intake.briefSections;

    const blocks: string[][] = [
      [intake.briefHeading],
      [s.type, templateLabel],
      [s.idea, form.idea.trim()],
    ];
    if (form.audience.trim()) blocks.push([s.audience, form.audience.trim()]);
    if (form.problem.trim()) blocks.push([s.problem, form.problem.trim()]);
    if (featureLines) blocks.push([s.features, featureLines]);
    if (form.references.trim()) blocks.push([s.references, form.references.trim()]);
    if (timelineLabel) blocks.push([s.timeline, timelineLabel]);
    if (budgetLabel) blocks.push([s.budget, budgetLabel]);
    blocks.push([
      '— —',
      `שם: ${form.name.trim()}`,
      `יצירת קשר (${contactKind}): ${form.contactValue.trim()}`,
    ]);
    blocks.push([intake.briefFooter]);
    return blocks.map((b) => b.join('\n')).join('\n\n');
  }, [form, intake, templates]);

  const mailHref = useMemo(
    () => buildMailtoHref(intake.mailSubject, brief),
    [intake.mailSubject, brief],
  );

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
    window.open(buildWhatsAppHref(brief), '_blank', 'noopener,noreferrer');
    setStatus(intake.liveSuccess);
  };

  return (
    <section
      className="mp-section mp-section--wide"
      id={INTAKE_ID}
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

        <h3 className="mp-intake__optional-heading">{intake.optionalHeading}</h3>

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

        <div className="mp-intake__actions">
          <button type="submit" className="mp-cta mp-cta--primary">
            <span aria-hidden="true">💬</span> {intake.submit}
          </button>
          <p className="mp-intake__action-hint">{intake.submitHint}</p>
          <a className="mp-intake__mail-fallback" href={mailHref}>
            {intake.mailFallback}
          </a>
        </div>

        <div
          className="visually-hidden"
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
