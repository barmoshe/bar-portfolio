import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLang } from '../LangContext';
import { buildMailtoHref, buildWhatsAppHref } from '../contact';
import { INTAKE_ID } from '../scrollToIntake';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { useLongPress } from '../hooks/useLongPress';

// SectionHeading + RunningFoot are intentionally NOT imported — the
// BOARD redesign uses ticket-style chrome instead. See `mp-h` /
// `mp-final` in marketing.css for the replacement primitives.

type ContactMethod = 'whatsapp' | 'email';

type FormState = {
  template: string;
  idea: string;
  whyNow: string;
  audience: string;
  problem: string;
  references: string;
  timeline: string;
  howHeard: string;
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
};

const INITIAL: FormState = {
  template: '',
  idea: '',
  whyNow: '',
  audience: '',
  problem: '',
  references: '',
  timeline: '',
  howHeard: '',
  name: '',
  contactMethod: 'whatsapp',
  contactValue: '',
};

type BeatId =
  | 'template'
  | 'idea'
  | 'name'
  | 'contact'
  | 'whyNow'
  | 'audience'
  | 'problem'
  | 'references'
  | 'timeline'
  | 'howHeard'
  | 'review';

type ChapterId = 'spark' | 'you' | 'detail' | 'when' | 'send';

type Beat = { id: BeatId; chapter: ChapterId; required: boolean };

const BEATS: Beat[] = [
  { id: 'template',   chapter: 'spark',  required: true  },
  { id: 'idea',       chapter: 'spark',  required: true  },
  { id: 'name',       chapter: 'you',    required: true  },
  { id: 'contact',    chapter: 'you',    required: true  },
  { id: 'whyNow',     chapter: 'detail', required: false },
  { id: 'audience',   chapter: 'detail', required: false },
  { id: 'problem',    chapter: 'detail', required: false },
  { id: 'references', chapter: 'detail', required: false },
  { id: 'timeline',   chapter: 'when',   required: false },
  { id: 'howHeard',   chapter: 'when',   required: false },
  { id: 'review',     chapter: 'send',   required: true  },
];

const CHAPTERS: ChapterId[] = ['spark', 'you', 'detail', 'when', 'send'];

type Props = { selectedTemplate: string };

export default function Intake({ selectedTemplate }: Props) {
  const { t } = useLang();
  const { brief, contents, board } = t;
  const quest = brief.quest;

  const [form, setForm] = useState<FormState>(INITIAL);
  const [stepIndex, setStepIndex] = useState(0);
  const [committed, setCommitted] = useState<Set<BeatId>>(() => new Set());
  const [invalidBeat, setInvalidBeat] = useState<BeatId | null>(null);
  const [status, setStatus] = useState('');
  const [phase, setPhase] = useState<'questioning' | 'sent'>('questioning');
  // Tracks the most-recently-committed beat so the matching brief row
  // can flash a magenta border-bloom for one frame. Cleared on
  // animationend (CSS-driven).
  const [lastCommit, setLastCommit] = useState<BeatId | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<HTMLElement | null>(null);

  const beat = BEATS[stepIndex];
  const total = BEATS.length;

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
      if (invalidBeat) setInvalidBeat(null);
    },
    [invalidBeat],
  );

  // External template selection from ProjectTemplates flows in. Auto-commit it
  // and, if the user is still on the template beat, advance to the idea beat
  // so picking from the contents list feels like answering question 1.
  useEffect(() => {
    if (!selectedTemplate || selectedTemplate === form.template) return;
    setForm((f) => ({ ...f, template: selectedTemplate }));
    setCommitted((c) => {
      const n = new Set(c);
      n.add('template');
      return n;
    });
    setStepIndex((idx) => (idx === 0 ? 1 : idx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  // Build the brief text — kept byte-identical to the previous form's output
  // so the WhatsApp message that lands on Bar's phone looks unchanged.
  const builtBrief = useMemo(() => {
    const lookup = <T extends { id?: string; slug?: string }>(
      list: readonly T[],
      id: string,
    ): T | undefined => list.find((it) => it.id === id || it.slug === id);

    const tpl = lookup(contents.items, form.template);
    const templateLabel = tpl ? tpl.title : '—';
    const timelineLabel = lookup(brief.timelines, form.timeline)?.label ?? '';
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
    if (form.whyNow.trim()) blocks.push([s.whyNow, form.whyNow.trim()]);
    if (form.audience.trim()) blocks.push([s.audience, form.audience.trim()]);
    if (form.problem.trim()) blocks.push([s.problem, form.problem.trim()]);
    if (form.references.trim()) blocks.push([s.references, form.references.trim()]);
    if (timelineLabel) blocks.push([s.timeline, timelineLabel]);
    if (form.howHeard.trim()) blocks.push([s.howHeard, form.howHeard.trim()]);
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

  const beatHasContent = useCallback(
    (id: BeatId): boolean => {
      switch (id) {
        case 'template':   return !!form.template;
        case 'idea':       return !!form.idea.trim();
        case 'name':       return !!form.name.trim();
        case 'contact':    return !!form.contactValue.trim();
        case 'whyNow':     return !!form.whyNow.trim();
        case 'audience':   return !!form.audience.trim();
        case 'problem':    return !!form.problem.trim();
        case 'references': return !!form.references.trim();
        case 'timeline':   return !!form.timeline;
        case 'howHeard':   return !!form.howHeard.trim();
        default:           return false;
      }
    },
    [form],
  );

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(BEATS.length - 1, idx));
      setStepIndex(clamped);
      setInvalidBeat(null);
    },
    [],
  );

  const jumpTo = useCallback(
    (id: BeatId) => {
      const idx = BEATS.findIndex((b) => b.id === id);
      if (idx >= 0) goTo(idx);
    },
    [goTo],
  );

  const next = useCallback(() => {
    if (beat.id === 'review') return;
    if (beat.required && !beatHasContent(beat.id)) {
      setInvalidBeat(beat.id);
      setStatus(brief.liveError);
      focusRef.current?.focus({ preventScroll: true });
      return;
    }
    setCommitted((c) => {
      const n = new Set(c);
      if (beatHasContent(beat.id)) {
        n.add(beat.id);
      } else {
        n.delete(beat.id);
      }
      return n;
    });
    // Border-bloom trigger — flashes the brief row that just landed.
    if (beatHasContent(beat.id)) setLastCommit(beat.id);
    if (stepIndex < BEATS.length - 1) {
      setStatus(quest.liveCommitted);
      setStepIndex(stepIndex + 1);
    }
  }, [beat, beatHasContent, stepIndex, brief.liveError, quest.liveCommitted]);

  const back = useCallback(() => {
    if (stepIndex > 0) goTo(stepIndex - 1);
  }, [stepIndex, goTo]);

  const skip = useCallback(() => {
    if (beat.required || beat.id === 'review') return;
    setCommitted((c) => {
      const n = new Set(c);
      n.delete(beat.id);
      return n;
    });
    if (stepIndex < BEATS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  }, [beat, stepIndex]);

  const submit = useCallback(() => {
    const missing =
      !form.template ||
      !form.idea.trim() ||
      !form.name.trim() ||
      !form.contactValue.trim();
    if (missing) {
      setStatus(brief.liveError);
      // Jump back to the first required-but-empty beat
      if (!form.template) jumpTo('template');
      else if (!form.idea.trim()) jumpTo('idea');
      else if (!form.name.trim()) jumpTo('name');
      else jumpTo('contact');
      return;
    }
    window.open(buildWhatsAppHref(builtBrief), '_blank', 'noopener,noreferrer');
    setStatus(brief.liveSuccess);
    setPhase('sent');
  }, [form, builtBrief, brief.liveError, brief.liveSuccess, jumpTo]);

  // Focus the primary control of the current beat after every step change.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      focusRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [stepIndex, phase]);

  // Card entrance animation — fade + slide. Guarded by motion preference.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          '.mp-quest__card',
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
          },
        );
      });
      return () => mm.kill();
    },
    { dependencies: [stepIndex, phase], scope: stageRef },
  );

  // Letter line append animation — new last line ink-bleeds in.
  const committedCount = committed.size;
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          '.mp-quest__letter-line:last-of-type',
          { opacity: 0, filter: 'blur(6px)', y: 6 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 0.36,
            ease: 'power2.out',
            clearProps: 'opacity,filter,transform',
          },
        );
      });
      return () => mm.kill();
    },
    { dependencies: [committedCount], scope: stageRef },
  );

  // Document-level keyboard shortcuts (Esc to go back, Alt+S to skip,
  // Ctrl/Cmd+Enter inside a textarea to advance). Scoped: only fires
  // when focus is somewhere inside the stage so the rest of the page
  // is unaffected. Enter on inputs is handled by native form submit.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const root = stageRef.current;
      if (!root || !root.contains(document.activeElement)) return;
      const target = e.target as HTMLElement | null;
      const isTextarea = target?.tagName === 'TEXTAREA';
      if (e.key === 'Escape') {
        e.preventDefault();
        back();
      } else if (
        e.altKey &&
        (e.key === 's' || e.key === 'S') &&
        !beat.required &&
        beat.id !== 'review'
      ) {
        e.preventDefault();
        skip();
      } else if (e.key === 'Enter' && isTextarea && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (beat.id === 'review') submit();
        else next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [back, skip, next, submit, beat]);

  // Per-beat copy resolution: a template-specific override always wins,
  // then the generic prompt from quest.prompts. The same shape covers
  // hint and placeholder so every input box reads on-topic for the
  // chosen project type.
  const tplOverride = useMemo(() => {
    const tpl = form.template;
    if (!tpl) return undefined;
    return quest.byTemplate?.[tpl];
  }, [form.template, quest]);

  const beatOverride = useMemo(() => {
    if (!tplOverride) return undefined;
    switch (beat.id) {
      case 'idea':       return tplOverride.idea;
      case 'whyNow':     return tplOverride.whyNow;
      case 'audience':   return tplOverride.audience;
      case 'problem':    return tplOverride.problem;
      case 'references': return tplOverride.references;
      case 'timeline':   return tplOverride.timeline;
      case 'howHeard':   return tplOverride.howHeard;
      case 'review':     return tplOverride.review;
      default:           return undefined;
    }
  }, [beat.id, tplOverride]);

  // The override union has different optional fields per beat; TS won't
  // narrow well across the union, so we read with an explicit cast.
  const overrideRead = beatOverride as
    | { prompt?: string; hint?: string; placeholder?: string }
    | undefined;

  const promptCopy = useMemo<string>(() => {
    if (overrideRead?.prompt) return overrideRead.prompt;
    const p = quest.prompts;
    switch (beat.id) {
      case 'template':   return p.template;
      case 'idea':       return p.idea;
      case 'name':       return p.name;
      case 'contact':    return p.contact;
      case 'whyNow':     return p.whyNow;
      case 'audience':   return p.audience;
      case 'problem':    return p.problem;
      case 'references': return p.references;
      case 'timeline':   return p.timeline;
      case 'howHeard':   return p.howHeard;
      case 'review':     return p.review;
    }
  }, [beat.id, overrideRead, quest]);

  const hintCopy = useMemo<string>(() => {
    if (overrideRead?.hint) return overrideRead.hint;
    switch (beat.id) {
      case 'idea':   return brief.fields.idea.hint;
      case 'whyNow': return brief.fields.whyNow.hint;
      default:       return '';
    }
  }, [beat.id, overrideRead, brief]);

  // Falls back to the generic field placeholder for inputs whose beat
  // has no template-specific override (e.g. name / contact / timeline).
  const placeholderCopy = useMemo<string | undefined>(() => {
    return overrideRead?.placeholder || undefined;
  }, [overrideRead]);

  const liveAnnouncement = useMemo(() => {
    if (phase === 'sent') return brief.liveSuccess;
    if (status === brief.liveError) return status;
    return quest.liveStep
      .replace('{step}', String(stepIndex + 1))
      .replace('{total}', String(total))
      .replace('{chapter}', quest.chapters[beat.chapter]);
  }, [phase, status, beat, stepIndex, total, quest, brief.liveError, brief.liveSuccess]);

  // Map each committed beat to its letter line. Name + contact get merged
  // into a single signature line so the visible letter mirrors the brief
  // sent to WhatsApp.
  const letterEntries = useMemo(() => {
    const lookup = <T extends { id?: string; slug?: string }>(
      list: readonly T[],
      id: string,
    ) => list.find((it) => it.id === id || it.slug === id);
    const tpl = lookup(contents.items, form.template);
    const timelineLabel = lookup(brief.timelines, form.timeline)?.label ?? '';
    const s = brief.briefSections;
    const out: { jumpId: BeatId; label: string; value: string }[] = [];
    for (const b of BEATS) {
      if (b.id === 'review' || b.id === 'name' || b.id === 'contact') continue;
      if (!committed.has(b.id)) continue;
      switch (b.id) {
        case 'template':
          if (tpl) out.push({ jumpId: b.id, label: s.type, value: tpl.title });
          break;
        case 'idea':
          out.push({ jumpId: b.id, label: s.idea, value: form.idea.trim() });
          break;
        case 'whyNow':
          out.push({ jumpId: b.id, label: s.whyNow, value: form.whyNow.trim() });
          break;
        case 'audience':
          out.push({ jumpId: b.id, label: s.audience, value: form.audience.trim() });
          break;
        case 'problem':
          out.push({ jumpId: b.id, label: s.problem, value: form.problem.trim() });
          break;
        case 'references':
          out.push({ jumpId: b.id, label: s.references, value: form.references.trim() });
          break;
        case 'timeline':
          if (timelineLabel) out.push({ jumpId: b.id, label: s.timeline, value: timelineLabel });
          break;
        case 'howHeard':
          out.push({ jumpId: b.id, label: s.howHeard, value: form.howHeard.trim() });
          break;
      }
    }
    // Signature line is shown if either name or contact has been committed.
    if (committed.has('name') || committed.has('contact')) {
      const contactKind =
        form.contactMethod === 'whatsapp'
          ? brief.fields.contactMethod.whatsapp
          : brief.fields.contactMethod.email;
      const namePart = form.name.trim() || '—';
      const contactPart = form.contactValue.trim()
        ? `${contactKind}: ${form.contactValue.trim()}`
        : contactKind;
      out.push({
        jumpId: committed.has('name') ? 'name' : 'contact',
        label: '— —',
        value: `${namePart} · ${contactPart}`,
      });
    }
    return out;
  }, [committed, form, contents, brief]);

  const chapterProgress = useMemo(() => {
    const idx = CHAPTERS.indexOf(beat.chapter);
    return (idx + 1) / CHAPTERS.length;
  }, [beat.chapter]);

  const overallProgress = (stepIndex + 1) / total;

  const counterCopy = quest.counter
    .replace('{step}', String(stepIndex + 1))
    .replace('{total}', String(total));

  const isInvalid = invalidBeat === beat.id;

  return (
    <section
      className="mp-section mp-quest"
      id={INTAKE_ID}
      aria-labelledby="brief-headline"
    >
      <header className="mp-h">
        <span className="mp-h__num" aria-hidden="true">{brief.number}</span>
        <span className="mp-h__kicker">{board.columns.intake}</span>
        <h2 id="brief-headline" className="mp-h__title">{brief.title}</h2>
      </header>

      <p className="mp-standfirst">{brief.standfirst}</p>

      {phase === 'sent' ? (
        <div className="mp-quest__stage mp-quest__stage--sent" ref={stageRef}>
          <article className="mp-quest__card mp-quest__card--sent" role="status">
            <p className="mp-quest__counter" aria-hidden="true">✓</p>
            <h3 className="mp-quest__prompt">{quest.sentTitle}</h3>
            <p className="mp-quest__hint">{quest.sentBody}</p>
            <nav className="mp-quest__nav" aria-label={quest.nav.send}>
              <button
                type="button"
                className="mp-quest__primary"
                onClick={() => {
                  window.open(
                    buildWhatsAppHref(builtBrief),
                    '_blank',
                    'noopener,noreferrer',
                  );
                }}
                data-quest-focus
                ref={(node) => {
                  focusRef.current = node;
                }}
              >
                {quest.nav.sendAgain} →
              </button>
              <a className="mp-form__mail" href={mailHref}>
                {brief.mailFallback}
              </a>
            </nav>
          </article>
        </div>
      ) : (
        <div className="mp-quest__stage" ref={stageRef}>
          <ol className="mp-quest__chapters" aria-label={quest.liveBriefLabel}>
            {CHAPTERS.map((ch, i) => {
              const activeIdx = CHAPTERS.indexOf(beat.chapter);
              const state =
                i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'upcoming';
              return (
                <li
                  key={ch}
                  className="mp-quest__chapter"
                  data-state={state}
                  aria-current={state === 'active' ? 'step' : undefined}
                >
                  <span className="mp-quest__chapter-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mp-quest__chapter-name">{quest.chapters[ch]}</span>
                </li>
              );
            })}
            <li
              className="mp-quest__progress"
              aria-hidden="true"
              style={
                {
                  ['--mp-progress' as string]: chapterProgress,
                  ['--mp-progress-overall' as string]: overallProgress,
                } as React.CSSProperties
              }
            />
          </ol>

          <div className="mp-quest__board">
            <form
              className="mp-quest__card-wrap"
              onSubmit={(e) => {
                e.preventDefault();
                if (beat.id === 'review') submit();
                else next();
              }}
              noValidate
            >
              <article
                key={stepIndex}
                className="mp-quest__card"
                role="group"
                aria-labelledby="quest-prompt"
              >
                <header className="mp-quest__card-header">
                  <p className="mp-quest__counter" aria-hidden="true">{counterCopy}</p>
                  <p className="mp-quest__chapter-tag">{quest.chapters[beat.chapter]}</p>
                </header>

                <h3 id="quest-prompt" className="mp-quest__prompt">
                  {promptCopy}
                </h3>

                {hintCopy && <p className="mp-quest__hint">{hintCopy}</p>}

                <div className="mp-quest__control">
                  <BeatControl
                    beat={beat}
                    form={form}
                    update={update}
                    t={t}
                    focusRef={focusRef}
                    invalid={isInvalid}
                    builtBrief={builtBrief}
                    onSubmit={submit}
                    onJump={jumpTo}
                    letterEntries={letterEntries}
                    placeholderOverride={placeholderCopy}
                  />
                </div>

                {beat.id !== 'review' && (
                  <nav className="mp-quest__nav" aria-label={quest.nav.next}>
                    <button
                      type="button"
                      className="mp-quest__nav-btn"
                      onClick={back}
                      disabled={stepIndex === 0}
                    >
                      ← {quest.nav.back}
                    </button>
                    {!beat.required && (
                      <button
                        type="button"
                        className="mp-quest__nav-btn mp-quest__nav-btn--skip"
                        onClick={skip}
                      >
                        {quest.nav.skip}
                      </button>
                    )}
                    <button
                      type="button"
                      className="mp-quest__primary"
                      onClick={next}
                    >
                      {quest.nav.next} →
                    </button>
                  </nav>
                )}
              </article>
            </form>

            <aside
              className="mp-quest__letter"
              aria-label={quest.liveBriefLabel}
            >
              <header className="mp-quest__letter-head">
                <span className="mp-quest__letter-pen" aria-hidden="true">✒</span>
                <p>{quest.letterIntro}</p>
              </header>
              {letterEntries.length === 0 ? (
                <p className="mp-quest__letter-empty">{quest.letterEmpty}</p>
              ) : (
                <ul className="mp-quest__letter-list">
                  {letterEntries.map((entry, i) => (
                    <li
                      key={`${entry.jumpId}-${i}`}
                      className="mp-quest__letter-line"
                      data-just-committed={lastCommit === entry.jumpId || undefined}
                      onAnimationEnd={() => {
                        if (lastCommit === entry.jumpId) setLastCommit(null);
                      }}
                    >
                      <button
                        type="button"
                        className="mp-quest__letter-edit"
                        onClick={() => jumpTo(entry.jumpId)}
                        aria-label={`${quest.tapToEdit}: ${entry.label.replace(/[*]/g, '')}`}
                      >
                        <span className="mp-quest__letter-label">{entry.label}</span>
                        <span className="mp-quest__letter-value">{entry.value}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        </div>
      )}

      <div
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveAnnouncement}
      </div>
    </section>
  );
}

type BeatControlProps = {
  beat: Beat;
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  t: ReturnType<typeof useLang>['t'];
  focusRef: { current: HTMLElement | null };
  invalid: boolean;
  builtBrief: string;
  onSubmit: () => void;
  onJump: (id: BeatId) => void;
  letterEntries: { jumpId: BeatId; label: string; value: string }[];
  /** Template-specific example text to show inside the active beat's input. */
  placeholderOverride?: string;
};

function BeatControl({
  beat,
  form,
  update,
  t,
  focusRef,
  invalid,
  builtBrief,
  onSubmit,
  onJump,
  letterEntries,
  placeholderOverride,
}: BeatControlProps) {
  const { brief, contents } = t;
  const quest = brief.quest;

  switch (beat.id) {
    case 'template':
      return (
        <fieldset className="mp-quest__chips" aria-invalid={invalid}>
          <legend className="visually-hidden">{brief.fields.template.label}</legend>
          <div className="mp-quest__chip-grid" role="radiogroup">
            {contents.items.map((tpl, i) => {
              const checked = form.template === tpl.slug;
              return (
                <label
                  key={tpl.slug}
                  className="mp-quest__chip"
                  data-selected={checked || undefined}
                >
                  <input
                    type="radio"
                    name="quest-template"
                    value={tpl.slug}
                    checked={checked}
                    onChange={() => update('template', tpl.slug)}
                    ref={i === 0 ? (node) => { focusRef.current = node; } : undefined}
                    data-quest-focus={i === 0 || undefined}
                  />
                  <span className="mp-quest__chip-label">{tpl.title}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      );

    case 'idea':
      return (
        <textarea
          className="mp-quest__textarea"
          value={form.idea}
          onChange={(e) => update('idea', e.target.value)}
          placeholder={placeholderOverride ?? brief.fields.idea.placeholder}
          rows={4}
          aria-required="true"
          aria-invalid={invalid}
          aria-label={brief.fields.idea.label}
          data-quest-focus
          ref={(node) => { focusRef.current = node; }}
        />
      );

    case 'name':
      return (
        <input
          type="text"
          className="mp-quest__input"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder={brief.fields.name.placeholder}
          autoComplete="given-name"
          aria-required="true"
          aria-invalid={invalid}
          aria-label={brief.fields.name.label}
          data-quest-focus
          ref={(node) => { focusRef.current = node; }}
        />
      );

    case 'contact':
      return (
        <div className="mp-quest__contact">
          <fieldset className="mp-quest__chips mp-quest__chips--inline">
            <legend className="mp-quest__sublabel">{brief.fields.contactMethod.label}</legend>
            <div className="mp-quest__chip-grid mp-quest__chip-grid--inline" role="radiogroup">
              {(['whatsapp', 'email'] as ContactMethod[]).map((m) => {
                const checked = form.contactMethod === m;
                const label =
                  m === 'whatsapp'
                    ? brief.fields.contactMethod.whatsapp
                    : brief.fields.contactMethod.email;
                return (
                  <label
                    key={m}
                    className="mp-quest__chip"
                    data-selected={checked || undefined}
                  >
                    <input
                      type="radio"
                      name="quest-contact-method"
                      value={m}
                      checked={checked}
                      onChange={() => update('contactMethod', m)}
                    />
                    <span className="mp-quest__chip-label">{label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <label className="mp-quest__field">
            <span className="mp-quest__sublabel">
              {form.contactMethod === 'whatsapp'
                ? brief.fields.contactValue.labelWhatsapp
                : brief.fields.contactValue.labelEmail}
            </span>
            <input
              type={form.contactMethod === 'email' ? 'email' : 'tel'}
              className="mp-quest__input"
              value={form.contactValue}
              onChange={(e) => update('contactValue', e.target.value)}
              placeholder={
                form.contactMethod === 'whatsapp'
                  ? brief.fields.contactValue.placeholderWhatsapp
                  : brief.fields.contactValue.placeholderEmail
              }
              autoComplete={form.contactMethod === 'email' ? 'email' : 'tel'}
              aria-required="true"
              aria-invalid={invalid}
              data-quest-focus
              ref={(node) => { focusRef.current = node; }}
            />
          </label>
        </div>
      );

    case 'whyNow':
      return (
        <textarea
          className="mp-quest__textarea"
          value={form.whyNow}
          onChange={(e) => update('whyNow', e.target.value)}
          placeholder={placeholderOverride ?? brief.fields.whyNow.placeholder}
          rows={3}
          aria-label={brief.fields.whyNow.label}
          data-quest-focus
          ref={(node) => { focusRef.current = node; }}
        />
      );

    case 'audience':
      return (
        <input
          type="text"
          className="mp-quest__input"
          value={form.audience}
          onChange={(e) => update('audience', e.target.value)}
          placeholder={placeholderOverride ?? brief.fields.audience.placeholder}
          aria-label={brief.fields.audience.label}
          data-quest-focus
          ref={(node) => { focusRef.current = node; }}
        />
      );

    case 'problem':
      return (
        <textarea
          className="mp-quest__textarea"
          value={form.problem}
          onChange={(e) => update('problem', e.target.value)}
          placeholder={placeholderOverride ?? brief.fields.problem.placeholder}
          rows={3}
          aria-label={brief.fields.problem.label}
          data-quest-focus
          ref={(node) => { focusRef.current = node; }}
        />
      );

    case 'references':
      return (
        <textarea
          className="mp-quest__textarea"
          value={form.references}
          onChange={(e) => update('references', e.target.value)}
          placeholder={placeholderOverride ?? brief.fields.references.placeholder}
          rows={3}
          aria-label={brief.fields.references.label}
          data-quest-focus
          ref={(node) => { focusRef.current = node; }}
        />
      );

    case 'timeline':
      return (
        <fieldset className="mp-quest__chips mp-quest__chips--inline">
          <legend className="visually-hidden">{brief.fields.timeline.label}</legend>
          <div className="mp-quest__chip-grid mp-quest__chip-grid--inline" role="radiogroup">
            {brief.timelines.map((tl, i) => {
              const checked = form.timeline === tl.id;
              return (
                <label
                  key={tl.id}
                  className="mp-quest__chip"
                  data-selected={checked || undefined}
                >
                  <input
                    type="radio"
                    name="quest-timeline"
                    value={tl.id}
                    checked={checked}
                    onChange={() => update('timeline', tl.id)}
                    ref={i === 0 ? (node) => { focusRef.current = node; } : undefined}
                    data-quest-focus={i === 0 || undefined}
                  />
                  <span className="mp-quest__chip-label">{tl.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      );

    case 'howHeard':
      return (
        <input
          type="text"
          className="mp-quest__input"
          value={form.howHeard}
          onChange={(e) => update('howHeard', e.target.value)}
          placeholder={placeholderOverride ?? brief.fields.howHeard.placeholder}
          aria-label={brief.fields.howHeard.label}
          data-quest-focus
          ref={(node) => { focusRef.current = node; }}
        />
      );

    case 'review':
      return (
        <ReviewBlock
          quest={quest}
          brief={brief}
          builtBrief={builtBrief}
          letterEntries={letterEntries}
          onSubmit={onSubmit}
          onJump={onJump}
          focusRef={focusRef}
        />
      );
  }
}

type ReviewBlockProps = {
  quest: BeatControlProps['t']['brief']['quest'];
  brief: BeatControlProps['t']['brief'];
  builtBrief: string;
  letterEntries: BeatControlProps['letterEntries'];
  onSubmit: () => void;
  onJump: (id: BeatId) => void;
  focusRef: BeatControlProps['focusRef'];
};

function ReviewBlock({
  quest,
  brief,
  builtBrief,
  letterEntries,
  onSubmit,
  onJump,
  focusRef,
}: ReviewBlockProps) {
  const { t } = useLang();
  const { board } = t;
  const { bind, progress, holding } = useLongPress({
    ms: 600,
    onConfirm: onSubmit,
  });
  // SVG ring geometry — circumference ≈ 100, easy to drive via dasharray.
  const RING_LEN = 100;
  const dashOffset = RING_LEN * (1 - progress);

  return (
    <div className="mp-quest__review">
      <p className="mp-quest__review-intro">{quest.reviewIntro}</p>
      <pre className="mp-quest__brief-out" aria-label={quest.reviewTitle}>
        {builtBrief}
      </pre>
      {letterEntries.length > 0 && (
        <ul className="mp-quest__review-edit-list">
          {letterEntries.map((entry, i) => (
            <li key={`${entry.jumpId}-${i}`}>
              <button
                type="button"
                className="mp-quest__nav-btn"
                onClick={() => onJump(entry.jumpId)}
              >
                {quest.tapToEdit}: {entry.label.replace(/[*]/g, '')}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mp-quest__send">
        <button
          type="button"
          className="mp-quest__primary mp-quest__primary--send"
          data-quest-focus
          data-holding={holding || undefined}
          ref={(node) => { focusRef.current = node; }}
          aria-label={`${quest.nav.send} — ${board.ringHold}`}
          {...bind}
        >
          <span>{quest.nav.send} →</span>
          <svg
            className="mp-longpress-ring"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <circle
              className="mp-longpress-ring__bg"
              cx="18" cy="18" r="15.9155"
            />
            <circle
              className="mp-longpress-ring__fill"
              cx="18" cy="18" r="15.9155"
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
        </button>
        <p className="mp-form__action-hint">
          {board.ringHold} · {brief.submitHint}
        </p>
        <a
          className="mp-form__mail"
          href={buildMailtoHref(brief.mailSubject, builtBrief)}
        >
          {brief.mailFallback}
        </a>
      </div>
    </div>
  );
}
