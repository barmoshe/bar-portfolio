import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useLang } from '../LangContext';
import { buildMailtoHref, buildWhatsAppHref } from '../../marketing/contact';
import { INTAKE_ID } from '../scrollToIntake';
import type { Beat, ContactMethodKey } from '../i18n';

/**
 * LabIntake — "Quest Dialogue" sequential form.
 *
 * One beat at a time. Bar's avatar types in a question, the user
 * either taps a suggestion chip or types freeform, advances, and
 * the brief assembles in real time in the sticky preview. Per
 * template the beats vary (3-4 specific questions); two universal
 * contact beats (method + value) are appended at the end.
 *
 * Inspired by Visual Novel / conversational form patterns —
 * Mad Libs (+25-40% conversion, LukeW/Vast.com), conversational
 * forms (+30%, Jotform).
 */

type Answer = string;

type ContactState = {
  method: ContactMethodKey;
  value: string;
};

type Phase = 'questioning' | 'sent';

type Props = { selectedTemplate: string };

const CONTACT_METHOD_BEAT_ID = '__contactMethod';
const CONTACT_VALUE_BEAT_ID = '__contactValue';

export default function LabIntake({ selectedTemplate }: Props) {
  const { t, lang } = useLang();
  const { brief, contents, board } = t;
  const { quest } = brief;
  const isRTL = lang === 'he';
  // In RTL, "previous" lives visually on the right, so flip the affordances.
  const backArrow = isRTL ? '→' : '←';
  const nextArrow = isRTL ? '←' : '→';

  const pickedItem = useMemo(
    () => contents.items.find((i) => i.slug === selectedTemplate),
    [contents.items, selectedTemplate],
  );

  // Compose the full beat sequence: template beats + universal contact beats.
  const beats: Beat[] = useMemo(() => {
    if (!pickedItem) return [];
    const contactMethod: Beat = {
      id: CONTACT_METHOD_BEAT_ID,
      prompt: quest.contactMethodPrompt,
      chips: [
        { value: 'whatsapp', label: quest.contactMethodChips.whatsapp },
        { value: 'email', label: quest.contactMethodChips.email },
      ],
      required: true,
    };
    return [...pickedItem.beats, contactMethod];
    // Contact value is rendered specially because its label/placeholder/
    // input mode depend on the contactMethod answer; it's added below.
  }, [pickedItem, quest.contactMethodPrompt, quest.contactMethodChips]);

  // The user can navigate forward/back through beats. `step` is the
  // current beat index; `committed` is the highest beat ever seen
  // (used to know if we should show the contact-value beat too).
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [contact, setContact] = useState<ContactState>({ method: 'whatsapp', value: '' });
  const [phase, setPhase] = useState<Phase>('questioning');
  // typing animation flag, reset each time the prompt changes.
  const [typing, setTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotionPref();

  // Reset state when template changes.
  useEffect(() => {
    setStep(0);
    setAnswers({});
    setContact({ method: 'whatsapp', value: '' });
    setPhase('questioning');
  }, [selectedTemplate]);

  // Total step count: template beats + method beat + (always) value beat.
  const totalSteps = beats.length + 1;

  // Determine current beat: either from beats[] or the synthetic contact-value beat.
  const isContactValueStep = step === beats.length;
  const currentBeat: Beat | null = useMemo(() => {
    if (isContactValueStep) {
      return {
        id: CONTACT_VALUE_BEAT_ID,
        prompt:
          contact.method === 'whatsapp'
            ? quest.contactValuePromptWhatsapp
            : quest.contactValuePromptEmail,
        placeholder:
          contact.method === 'whatsapp'
            ? brief.fields.contactValue.placeholderWhatsapp
            : brief.fields.contactValue.placeholderEmail,
        required: true,
      };
    }
    return beats[step] ?? null;
  }, [
    isContactValueStep,
    contact.method,
    quest.contactValuePromptWhatsapp,
    quest.contactValuePromptEmail,
    brief.fields.contactValue.placeholderWhatsapp,
    brief.fields.contactValue.placeholderEmail,
    beats,
    step,
  ]);

  // Typing animation — when the beat changes, briefly show dots, then
  // show the text. Disabled under prefers-reduced-motion.
  useEffect(() => {
    if (!currentBeat) return;
    if (reducedMotion) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const id = window.setTimeout(() => setTyping(false), 380);
    return () => window.clearTimeout(id);
  }, [step, isContactValueStep, currentBeat, reducedMotion]);

  // After typing finishes, focus the input. We keep this separate so
  // focus doesn't fight with the typing animation.
  useEffect(() => {
    if (typing) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [typing, step, isContactValueStep]);

  // Current value for the active beat.
  const currentValue: string = useMemo(() => {
    if (!currentBeat) return '';
    if (currentBeat.id === CONTACT_METHOD_BEAT_ID) return contact.method;
    if (currentBeat.id === CONTACT_VALUE_BEAT_ID) return contact.value;
    return answers[currentBeat.id] ?? '';
  }, [currentBeat, answers, contact]);

  const setCurrentValue = (value: string) => {
    if (!currentBeat) return;
    if (currentBeat.id === CONTACT_METHOD_BEAT_ID) {
      // The chips for the contact-method beat hold the method key.
      const method = value === 'email' ? 'email' : 'whatsapp';
      setContact((c) => ({ ...c, method }));
      return;
    }
    if (currentBeat.id === CONTACT_VALUE_BEAT_ID) {
      setContact((c) => ({ ...c, value }));
      return;
    }
    setAnswers((a) => ({ ...a, [currentBeat.id]: value }));
  };

  const canAdvance = useMemo(() => {
    if (!currentBeat) return false;
    if (!currentBeat.required) return true;
    return currentValue.trim().length > 0;
  }, [currentBeat, currentValue]);

  const isLastStep = step >= totalSteps - 1;

  const onBack = () => setStep((s) => Math.max(0, s - 1));
  const onNext = () => setStep((s) => Math.min(totalSteps - 1, s + 1));
  const onSkip = () => onNext();

  const onChipPick = (value: string) => {
    setCurrentValue(value);
    // Method chip auto-advances; other chips fill the value but let
    // the user augment via the text input before advancing.
    if (currentBeat?.id === CONTACT_METHOD_BEAT_ID) {
      // Defer one tick so the state lands before navigation.
      requestAnimationFrame(onNext);
    }
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Enter advances. Shift+Enter inside textarea adds a newline.
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement && e.shiftKey)) {
      e.preventDefault();
      if (canAdvance) {
        if (isLastStep) onSend();
        else onNext();
      }
    }
    // Esc goes back.
    if (e.key === 'Escape' && step > 0) {
      e.preventDefault();
      onBack();
    }
  };

  // Build the prefilled brief body for wa.me / mailto.
  const buildBriefBody = useCallback((): string => {
    const lines: string[] = [];
    lines.push(brief.briefHeading, '');
    if (pickedItem) {
      lines.push(`${brief.briefSections.type}: ${pickedItem.title}`);
    }
    for (const beat of beats) {
      if (beat.id === CONTACT_METHOD_BEAT_ID) continue;
      const v = answers[beat.id]?.trim();
      if (!v) continue;
      lines.push(`*${beat.prompt}*: ${v}`);
    }
    lines.push('', brief.briefFooter);
    return lines.join('\n');
  }, [answers, beats, brief, pickedItem]);

  const onSend = () => {
    if (!canAdvance) return;
    const body = buildBriefBody();
    const href =
      contact.method === 'whatsapp'
        ? buildWhatsAppHref(body)
        : buildMailtoHref(brief.mailSubject, body);
    setPhase('sent');
    if (contact.method === 'whatsapp') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  const onMailFallback = () => {
    const body = buildBriefBody();
    window.location.href = buildMailtoHref(brief.mailSubject, body);
  };

  // Empty state — no template picked yet.
  if (!pickedItem) {
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
        <div className="lab-quest lab-quest--empty mp-card">
          <p>{quest.pickTemplateFirst}</p>
          <a href="#contents" className="mp-cta mp-cta--secondary">
            ↑
          </a>
        </div>
      </section>
    );
  }

  // SENT state — confirmation card.
  if (phase === 'sent') {
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
        <div className="lab-quest lab-quest--sent mp-card">
          <h3 className="lab-quest__sent-title">✦ {quest.sentTitle}</h3>
          <p className="lab-quest__sent-body">{quest.sentBody}</p>
          <button
            type="button"
            className="mp-cta mp-cta--secondary"
            onClick={() => { setStep(0); setPhase('questioning'); }}
          >
            ↺ {quest.back}
          </button>
        </div>
      </section>
    );
  }

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

      <div className="lab-quest">
        <div
          ref={cardRef}
          className="lab-quest__card mp-card"
          key={`${step}-${isContactValueStep}`}
          data-step={step}
        >
          {/* Progress dots */}
          <div
            className="lab-quest__progress"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={quest.progressLabel.replace('{n}', String(step + 1)).replace('{total}', String(totalSteps))}
          >
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className="lab-quest__dot"
                data-state={
                  i < step ? 'done' : i === step ? 'active' : 'todo'
                }
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Avatar + bubble */}
          <div className="lab-quest__chat">
            <div
              className="lab-quest__avatar"
              aria-label={quest.avatarName}
              data-typing={typing || undefined}
            >
              <span className="lab-quest__avatar-letter">
                {isRTL ? 'ב' : 'B'}
              </span>
            </div>
            <div
              className="lab-quest__bubble"
              aria-live="polite"
            >
              {typing ? (
                <span className="lab-quest__typing" aria-label={quest.typingHint}>
                  <span /><span /><span />
                </span>
              ) : (
                <>
                  <p className="lab-quest__prompt">{currentBeat?.prompt}</p>
                  {currentBeat?.hint ? (
                    <p className="lab-quest__hint">{currentBeat.hint}</p>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {/* Chips */}
          {!typing && currentBeat?.chips ? (
            <div
              className="lab-quest__chips"
              role={currentBeat.id === CONTACT_METHOD_BEAT_ID ? 'radiogroup' : 'group'}
              aria-label={quest.pickAnswer}
            >
              {currentBeat.chips.map((chip, i) => {
                const isActive =
                  currentBeat.id === CONTACT_METHOD_BEAT_ID
                    ? contact.method === chip.value
                    : currentValue === chip.value;
                return (
                  <button
                    key={chip.value}
                    type="button"
                    className="lab-quest__chip"
                    style={{ animationDelay: reducedMotion ? undefined : `${i * 50}ms` }}
                    data-active={isActive || undefined}
                    aria-pressed={currentBeat.id !== CONTACT_METHOD_BEAT_ID ? isActive : undefined}
                    aria-checked={currentBeat.id === CONTACT_METHOD_BEAT_ID ? isActive : undefined}
                    role={currentBeat.id === CONTACT_METHOD_BEAT_ID ? 'radio' : undefined}
                    onClick={() => onChipPick(chip.value)}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Freeform input — hidden for the contact-method beat */}
          {!typing && currentBeat && currentBeat.id !== CONTACT_METHOD_BEAT_ID ? (
            <div className="lab-quest__input-wrap">
              {currentBeat.inputType === 'textarea' ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  className="lab-quest__input lab-quest__input--textarea"
                  dir="auto"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder={currentBeat.placeholder}
                  rows={3}
                  aria-label={currentBeat.prompt}
                  aria-required={currentBeat.required || undefined}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  className="lab-quest__input"
                  dir="auto"
                  type={
                    currentBeat.id === CONTACT_VALUE_BEAT_ID && contact.method === 'email'
                      ? 'email'
                      : currentBeat.id === CONTACT_VALUE_BEAT_ID
                        ? 'tel'
                        : 'text'
                  }
                  inputMode={
                    currentBeat.id === CONTACT_VALUE_BEAT_ID && contact.method === 'email'
                      ? 'email'
                      : currentBeat.id === CONTACT_VALUE_BEAT_ID
                        ? 'tel'
                        : 'text'
                  }
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder={currentBeat.placeholder}
                  aria-label={currentBeat.prompt}
                  aria-required={currentBeat.required || undefined}
                />
              )}
            </div>
          ) : null}

          {/* Nav footer */}
          {!typing ? (
            <footer className="lab-quest__nav">
              <button
                type="button"
                className="mp-cta mp-cta--secondary lab-quest__nav-btn"
                onClick={onBack}
                disabled={step === 0}
              >
                {backArrow} {quest.back}
              </button>
              {!currentBeat?.required && !isLastStep ? (
                <button
                  type="button"
                  className="mp-cta mp-cta--secondary lab-quest__nav-btn lab-quest__nav-skip"
                  onClick={onSkip}
                >
                  {quest.skip} {nextArrow}
                </button>
              ) : null}
              {isLastStep ? (
                <button
                  type="button"
                  className="mp-cta mp-cta--primary lab-quest__nav-btn lab-quest__nav-send"
                  onClick={onSend}
                  disabled={!canAdvance}
                  data-ready={canAdvance || undefined}
                >
                  {quest.send}
                </button>
              ) : (
                <button
                  type="button"
                  className="mp-cta mp-cta--primary lab-quest__nav-btn lab-quest__nav-next"
                  onClick={onNext}
                  disabled={!canAdvance}
                  data-ready={canAdvance || undefined}
                >
                  {quest.next} {nextArrow}
                </button>
              )}
            </footer>
          ) : null}

          {isLastStep && !typing ? (
            <p className="lab-quest__done">{quest.done} {quest.doneHint}</p>
          ) : null}

          <button
            type="button"
            className="lab-quest__mail-fallback"
            onClick={onMailFallback}
          >
            {brief.mailFallback}
          </button>
        </div>

        {/* Live brief preview — sidebar on desktop, sticky bottom on mobile */}
        <aside
          className="lab-quest__preview mp-card"
          aria-label={quest.previewHeading}
        >
          <header className="lab-quest__preview-head">
            <span className="lab-quest__preview-title">
              {quest.previewHeading}
            </span>
          </header>
          <div className="lab-quest__preview-body" aria-live="polite">
            <p className="lab-quest__preview-type">
              <strong>{pickedItem.title}</strong>
            </p>
            {beats.filter((b) => b.id !== CONTACT_METHOD_BEAT_ID).map((b) => {
              const v = answers[b.id]?.trim();
              if (!v) return null;
              return (
                <p className="lab-quest__preview-line" key={b.id}>
                  <span className="lab-quest__preview-key">{b.prompt}</span>
                  <span className="lab-quest__preview-val" dir="auto">{v}</span>
                </p>
              );
            })}
            {!Object.values(answers).some((v) => v?.trim()) ? (
              <p className="lab-quest__preview-line lab-quest__preview-line--ghost">
                {quest.previewEmpty}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

/** Returns true if the user prefers reduced motion. */
function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}
