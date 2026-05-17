import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLang } from '../LangContext';
import { buildMailtoHref, buildWhatsAppHref } from '../contact';
import { INTAKE_ID } from '../scrollToIntake';
import SectionHeading from '../components/SectionHeading';

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
  const { brief, contents } = t;
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

  const builtBrief = useMemo(() => {
    const lookup = <T extends { id?: string; slug?: string }>(
      list: readonly T[],
      id: string,
    ): T | undefined => list.find((it) => it.id === id || it.slug === id);

    const tpl = lookup(contents.items, form.template);
    const templateLabel = tpl ? tpl.title : '—';
    const timelineLabel = lookup(brief.timelines, form.timeline)?.label ?? '';
    const budgetLabel = lookup(brief.budgets, form.budget)?.label ?? '';
    const featureLines = brief.features
      .filter((f) => form.features.includes(f.id))
      .map((f) => `• ${f.label}`)
      .join('\n');
    const contactKind =
      form.contactMethod === 'whatsapp'
        ? brief.fields.contactMethod.whatsapp
        : brief.fields.contactMethod.email;
    const s = brief.briefSections;

    const blocks: string[][] = [
      [brief.briefHeading],
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
    blocks.push([brief.briefFooter]);
    return blocks.map((b) => b.join('\n')).join('\n\n');
  }, [form, brief, contents]);

  const mailHref = useMemo(
    () => buildMailtoHref(brief.mailSubject, builtBrief),
    [brief.mailSubject, builtBrief],
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const node = formRef.current;
    if (!node) return;
    if (!node.checkValidity()) {
      setStatus(brief.liveError);
      const firstInvalid = node.querySelector<HTMLElement>(':invalid');
      firstInvalid?.focus();
      return;
    }
    window.open(buildWhatsAppHref(builtBrief), '_blank', 'noopener,noreferrer');
    setStatus(brief.liveSuccess);
  };

  return (
    <section
      className="mp-section mp-brief"
      id={INTAKE_ID}
      aria-labelledby="brief-headline"
    >
      <SectionHeading
        number={brief.number}
        kicker={brief.kicker}
        title={brief.title}
        id="brief-headline"
      />

      <p className="mp-standfirst">{brief.standfirst}</p>

      <form
        ref={formRef}
        className="mp-form"
        onSubmit={onSubmit}
        noValidate
        aria-describedby="brief-required-hint"
      >
        <p className="mp-form__hint" id="brief-required-hint">
          {brief.requiredHint}
        </p>

        <fieldset
          className="mp-field mp-field--group"
          aria-invalid={submitAttempted && !form.template}
        >
          <legend className="mp-field__label">
            {brief.fields.template.label}
            <span className="mp-field__required" aria-hidden="true">*</span>
          </legend>
          <p className="mp-field__hint">{brief.fields.template.placeholder}</p>
          <div className="mp-chip-group" role="radiogroup">
            {contents.items.map((tpl) => {
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
                  <span>{tpl.title}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mp-field">
          <label className="mp-field__label" htmlFor="brief-idea">
            {brief.fields.idea.label}
            <span className="mp-field__required" aria-hidden="true">*</span>
          </label>
          <p className="mp-field__hint" id="brief-idea-hint">
            {brief.fields.idea.hint}
          </p>
          <textarea
            id="brief-idea"
            className="mp-textarea"
            value={form.idea}
            onChange={(e) => update('idea', e.target.value)}
            placeholder={brief.fields.idea.placeholder}
            rows={3}
            required
            aria-required="true"
            aria-describedby="brief-idea-hint"
            aria-invalid={submitAttempted && !form.idea.trim()}
          />
        </div>

        <div className="mp-field">
          <label className="mp-field__label" htmlFor="brief-name">
            {brief.fields.name.label}
            <span className="mp-field__required" aria-hidden="true">*</span>
          </label>
          <input
            id="brief-name"
            className="mp-input"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={brief.fields.name.placeholder}
            autoComplete="given-name"
            required
            aria-required="true"
            aria-invalid={submitAttempted && !form.name.trim()}
          />
        </div>

        <fieldset className="mp-field mp-field--group">
          <legend className="mp-field__label">
            {brief.fields.contactMethod.label}
            <span className="mp-field__required" aria-hidden="true">*</span>
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
              <span>{brief.fields.contactMethod.whatsapp}</span>
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
              <span>{brief.fields.contactMethod.email}</span>
            </label>
          </div>
        </fieldset>

        <div className="mp-field">
          <label className="mp-field__label" htmlFor="brief-contact-value">
            {form.contactMethod === 'whatsapp'
              ? brief.fields.contactValue.labelWhatsapp
              : brief.fields.contactValue.labelEmail}
            <span className="mp-field__required" aria-hidden="true">*</span>
          </label>
          <input
            id="brief-contact-value"
            className="mp-input"
            type={form.contactMethod === 'email' ? 'email' : 'tel'}
            value={form.contactValue}
            onChange={(e) => update('contactValue', e.target.value)}
            placeholder={
              form.contactMethod === 'whatsapp'
                ? brief.fields.contactValue.placeholderWhatsapp
                : brief.fields.contactValue.placeholderEmail
            }
            autoComplete={form.contactMethod === 'email' ? 'email' : 'tel'}
            required
            aria-required="true"
            aria-invalid={submitAttempted && !form.contactValue.trim()}
          />
        </div>

        <h3 className="mp-form__optional">{brief.optionalHeading}</h3>

        <div className="mp-field">
          <label className="mp-field__label" htmlFor="brief-audience">
            {brief.fields.audience.label}
          </label>
          <input
            id="brief-audience"
            className="mp-input"
            type="text"
            value={form.audience}
            onChange={(e) => update('audience', e.target.value)}
            placeholder={brief.fields.audience.placeholder}
          />
        </div>

        <div className="mp-field">
          <label className="mp-field__label" htmlFor="brief-problem">
            {brief.fields.problem.label}
          </label>
          <textarea
            id="brief-problem"
            className="mp-textarea"
            value={form.problem}
            onChange={(e) => update('problem', e.target.value)}
            placeholder={brief.fields.problem.placeholder}
            rows={2}
          />
        </div>

        <fieldset className="mp-field mp-field--group">
          <legend className="mp-field__label">{brief.fields.features.label}</legend>
          <p className="mp-field__hint">{brief.fields.features.hint}</p>
          <div className="mp-chip-group" role="group">
            {brief.features.map((feat) => {
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
                  <span>{feat.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mp-field">
          <label className="mp-field__label" htmlFor="brief-references">
            {brief.fields.references.label}
          </label>
          <textarea
            id="brief-references"
            className="mp-textarea"
            value={form.references}
            onChange={(e) => update('references', e.target.value)}
            placeholder={brief.fields.references.placeholder}
            rows={2}
          />
        </div>

        <fieldset className="mp-field mp-field--group">
          <legend className="mp-field__label">{brief.fields.timeline.label}</legend>
          <div className="mp-chip-group mp-chip-group--inline" role="radiogroup">
            {brief.timelines.map((tl) => {
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
          <legend className="mp-field__label">{brief.fields.budget.label}</legend>
          <p className="mp-field__hint">{brief.fields.budget.hint}</p>
          <div className="mp-chip-group mp-chip-group--inline" role="radiogroup">
            {brief.budgets.map((b) => {
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

        <div className="mp-form__actions">
          <button type="submit" className="mp-form__submit">
            {brief.submit} →
          </button>
          <p className="mp-form__action-hint">{brief.submitHint}</p>
          <a className="mp-form__mail" href={mailHref}>
            {brief.mailFallback}
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
