import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useLang } from '../LangContext';
import { buildMailtoHref, buildWhatsAppHref } from '../contact';
import { INTAKE_ID } from '../scrollToIntake';
import type { Beat, ContactMethodKey, Dict } from '../i18n';

/**
 * Marketing Intake — "Quest Dialogue" sequential form.
 *
 * Mirrors the LabIntake pattern from the /lab/ surface but consumes the
 * marketing dict. Beats are constructed dynamically from the existing
 * per-template quest copy in `brief.quest.byTemplate`, so no new data
 * needs to live in i18n: idea / audience / whyNow / references / timeline
 * pull their prompts and placeholders from the same source the old
 * chapter-based quest used.
 */

type Phase = 'questioning' | 'sent';

type ContactState = {
  method: ContactMethodKey;
  value: string;
};

type Props = { selectedTemplate: string };

const CONTACT_METHOD_BEAT_ID = '__contactMethod';
const CONTACT_VALUE_BEAT_ID = '__contactValue';

/** Build the beat list for a given template, sourcing all copy from
 *  the existing marketing dict (no new data added). */
function buildBeats(
  item: Dict['contents']['items'][number],
  brief: Dict['brief'],
): Beat[] {
  const quest = brief.quest;
  const byT = quest.byTemplate[item.slug] ?? {};
  return [
    {
      id: 'idea',
      prompt: byT.idea?.prompt ?? quest.prompts.idea,
      hint: byT.idea?.hint ?? brief.fields.idea.hint,
      placeholder: byT.idea?.placeholder ?? brief.fields.idea.placeholder,
      inputType: 'textarea',
      required: true,
    },
    {
      id: 'audience',
      prompt: byT.audience?.prompt ?? quest.prompts.audience,
      chips: item.fits.map((f) => ({ value: f, label: f })),
      placeholder: byT.audience?.placeholder ?? brief.fields.audience.placeholder,
      required: true,
    },
    {
      id: 'whyNow',
      prompt: byT.whyNow?.prompt ?? quest.prompts.whyNow,
      hint: byT.whyNow?.hint ?? brief.fields.whyNow.hint,
      placeholder: byT.whyNow?.placeholder ?? brief.fields.whyNow.placeholder,
      required: false,
    },
    {
      id: 'references',
      prompt: byT.references?.prompt ?? quest.prompts.references,
      placeholder: byT.references?.placeholder ?? brief.fields.references.placeholder,
      required: false,
    },
    {
      id: 'timeline',
      prompt: byT.timeline?.prompt ?? quest.prompts.timeline,
      chips: brief.timelines.map((tl) => ({ value: tl.id, label: tl.label })),
      required: false,
    },
  ];
}

export default function Intake({ selectedTemplate }: Props) {
  const { t, lang } = useLang();
  const { brief, contents, board } = t;
  const quest = brief.quest;
  const dialogue = quest.dialogue;
  const isRTL = lang === 'he';
  const backArrow = isRTL ? '→' : '←';
  const nextArrow = isRTL ? '←' : '→';

  const pickedItem = useMemo(
    () => contents.items.find((i) => i.slug === selectedTemplate),
    [contents.items, selectedTemplate],
  );

  const beats: Beat[] = useMemo(() => {
    if (!pickedItem) return [];
    const templateBeats = buildBeats(pickedItem, brief);
    const contactMethod: Beat = {
      id: CONTACT_METHOD_BEAT_ID,
      prompt: dialogue.contactMethodPrompt,
      chips: [
        { value: 'whatsapp', label: brief.fields.contactMethod.whatsapp },
        { value: 'email', label: brief.fields.contactMethod.email },
      ],
      required: true,
    };
    return [...templateBeats, contactMethod];
  }, [pickedItem, brief, dialogue.contactMethodPrompt]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<ContactState>({ method: 'whatsapp', value: '' });
  const [phase, setPhase] = useState<Phase>('questioning');
  const [typing, setTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const reducedMotion = useReducedMotionPref();

  useEffect(() => {
    setStep(0);
    setAnswers({});
    setContact({ method: 'whatsapp', value: '' });
    setPhase('questioning');
  }, [selectedTemplate]);

  const totalSteps = beats.length + 1;

  const isContactValueStep = step === beats.length;
  const currentBeat: Beat | null = useMemo(() => {
    if (isContactValueStep) {
      return {
        id: CONTACT_VALUE_BEAT_ID,
        prompt:
          contact.method === 'whatsapp'
            ? dialogue.contactValuePromptWhatsapp
            : dialogue.contactValuePromptEmail,
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
    dialogue.contactValuePromptWhatsapp,
    dialogue.contactValuePromptEmail,
    brief.fields.contactValue.placeholderWhatsapp,
    brief.fields.contactValue.placeholderEmail,
    beats,
    step,
  ]);

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

  useEffect(() => {
    if (typing) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [typing, step, isContactValueStep]);

  const currentValue: string = useMemo(() => {
    if (!currentBeat) return '';
    if (currentBeat.id === CONTACT_METHOD_BEAT_ID) return contact.method;
    if (currentBeat.id === CONTACT_VALUE_BEAT_ID) return contact.value;
    return answers[currentBeat.id] ?? '';
  }, [currentBeat, answers, contact]);

  const setCurrentValue = (value: string) => {
    if (!currentBeat) return;
    if (currentBeat.id === CONTACT_METHOD_BEAT_ID) {
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
    if (currentBeat?.id === CONTACT_METHOD_BEAT_ID) {
      requestAnimationFrame(onNext);
    }
  };

  const buildBriefBody = useCallback((): string => {
    const lines: string[] = [];
    lines.push(brief.briefHeading, '');
    if (pickedItem) {
      lines.push(`${brief.briefSections.type}: ${pickedItem.title}`);
    }
    const labelByBeatId: Record<string, string> = {
      idea: brief.briefSections.idea,
      audience: brief.briefSections.audience,
      whyNow: brief.briefSections.whyNow,
      references: brief.briefSections.references,
      timeline: brief.briefSections.timeline,
    };
    for (const beat of beats) {
      if (beat.id === CONTACT_METHOD_BEAT_ID) continue;
      const v = answers[beat.id]?.trim();
      if (!v) continue;
      const label = labelByBeatId[beat.id] ?? `*${beat.prompt}*`;
      lines.push(`${label}: ${v}`);
    }
    lines.push('', brief.briefFooter);
    return lines.join('\n');
  }, [answers, beats, brief, pickedItem]);

  const onSend = useCallback(() => {
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
  }, [canAdvance, buildBriefBody, contact.method, brief.mailSubject]);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement && e.shiftKey)) {
      e.preventDefault();
      if (canAdvance) {
        if (isLastStep) onSend();
        else onNext();
      }
    }
    if (e.key === 'Escape' && step > 0) {
      e.preventDefault();
      onBack();
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
        className="mp-section mp-brief"
        id={INTAKE_ID}
        aria-labelledby="brief-headline"
      >
        <header className="mp-h">
          <span className="mp-h__num" aria-hidden="true">{brief.number}</span>
          <span className="mp-h__kicker">{brief.kicker}</span>
          <h2 id="brief-headline" className="mp-h__title">
            {brief.title}
          </h2>
        </header>
        <p className="mp-standfirst" style={{ marginBlockEnd: 20 }}>
          {brief.standfirst}
        </p>
        <div className="lab-quest lab-quest--empty mp-card">
          <p>{quest.letterEmpty}</p>
          <a href="#contents" className="mp-cta mp-cta--secondary">
            ↑ {board.columns.backlog}
          </a>
        </div>
      </section>
    );
  }

  // Sent state.
  if (phase === 'sent') {
    return (
      <section
        className="mp-section mp-brief"
        id={INTAKE_ID}
        aria-labelledby="brief-headline"
      >
        <header className="mp-h">
          <span className="mp-h__num" aria-hidden="true">{brief.number}</span>
          <span className="mp-h__kicker">{brief.kicker}</span>
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
            ↺ {quest.nav.back}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="mp-section mp-brief"
      id={INTAKE_ID}
      aria-labelledby="brief-headline"
    >
      <header className="mp-h">
        <span className="mp-h__num" aria-hidden="true">{brief.number}</span>
        <span className="mp-h__kicker">{brief.kicker}</span>
        <h2 id="brief-headline" className="mp-h__title">
          {brief.title}
        </h2>
      </header>

      <p className="mp-standfirst" style={{ marginBlockEnd: 20 }}>
        {brief.standfirst}
      </p>

      <div className="lab-quest">
        <div
          className="lab-quest__card mp-card"
          key={`${step}-${isContactValueStep}`}
        >
          <div
            className="lab-quest__progress"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={dialogue.progressLabel.replace('{n}', String(step + 1)).replace('{total}', String(totalSteps))}
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

          <div className="lab-quest__chat">
            <div
              className="lab-quest__avatar"
              aria-label={dialogue.avatarName}
              data-typing={typing || undefined}
            >
              <span className="lab-quest__avatar-letter">
                {isRTL ? 'ב' : 'B'}
              </span>
            </div>
            <div className="lab-quest__bubble" aria-live="polite">
              {typing ? (
                <span className="lab-quest__typing" aria-label={dialogue.typingHint}>
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

          {!typing && currentBeat?.chips ? (
            <div
              className="lab-quest__chips"
              role={currentBeat.id === CONTACT_METHOD_BEAT_ID ? 'radiogroup' : 'group'}
              aria-label={dialogue.pickAnswer}
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

          {!typing ? (
            <footer className="lab-quest__nav">
              <button
                type="button"
                className="mp-cta mp-cta--secondary lab-quest__nav-btn"
                onClick={onBack}
                disabled={step === 0}
              >
                {backArrow} {quest.nav.back}
              </button>
              {!currentBeat?.required && !isLastStep ? (
                <button
                  type="button"
                  className="mp-cta mp-cta--secondary lab-quest__nav-btn lab-quest__nav-skip"
                  onClick={onSkip}
                >
                  {quest.nav.skip} {nextArrow}
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
                  ✦ {quest.nav.send}
                </button>
              ) : (
                <button
                  type="button"
                  className="mp-cta mp-cta--primary lab-quest__nav-btn lab-quest__nav-next"
                  onClick={onNext}
                  disabled={!canAdvance}
                  data-ready={canAdvance || undefined}
                >
                  {quest.nav.next} {nextArrow}
                </button>
              )}
            </footer>
          ) : null}

          {isLastStep && !typing ? (
            <p className="lab-quest__done">{dialogue.done} {dialogue.doneHint}</p>
          ) : null}

          <button
            type="button"
            className="lab-quest__mail-fallback"
            onClick={onMailFallback}
          >
            {brief.mailFallback}
          </button>
        </div>

        <aside
          className="lab-quest__preview mp-card"
          aria-label={quest.liveBriefLabel}
        >
          <header className="lab-quest__preview-head">
            <span className="lab-quest__preview-title">
              {quest.liveBriefLabel}
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
                {quest.letterEmpty}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

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
