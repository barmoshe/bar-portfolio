/**
 * Time-decayed scroll reveal primitives.
 *
 * `createReveal` is a drop-in replacement for `gsap.to(target, { ..., scrollTrigger })`
 * that adds re-trigger-on-stale behavior: the first time a section enters the
 * viewport the animation plays; it never auto-reverses on leave; when the user
 * scrolls (or TabBar-jumps) back to the section after `staleAfterMs`, the
 * animation replays from its initial state. Short continuous scrolls back up
 * are a no-op, so the section doesn't thrash on casual scroll.
 *
 * Pitfalls: do NOT use with `scrub` — staleness replay assumes discrete play,
 * not scrub progress. Scrub animations (see InkTimeline's path) stay on the
 * plain ScrollTrigger API.
 */
import { gsap, ScrollTrigger, DEFAULT_REVEAL_STALE_MS } from './gsap';

type Vars = gsap.TweenVars;

export type RevealOpts = {
  trigger: Element;
  start?: string;
  end?: string;
  /** Milliseconds the trigger must be off-screen before a replay. Default 8000. */
  staleAfterMs?: number;
  /** Legacy one-shot mode (never replays). Default false. */
  once?: boolean;
  /** Extra side-effect fired every time the reveal actually (re)plays. */
  onPlay?: () => void;
  /** Extra side-effect fired on scrolling past the section downward. */
  onLeave?: () => void;
  /** Extra side-effect fired on scrolling back up past the section's start. */
  onLeaveBack?: () => void;
};

/**
 * Set `target` to `fromVars`, build a paused tween to `toVars`, and wire a
 * ScrollTrigger that plays it on enter / replays it on stale re-entry.
 * Returns the created ScrollTrigger so callers can tag an id or kill it.
 */
export function createReveal(
  target: gsap.TweenTarget,
  fromVars: Vars,
  toVars: Vars,
  opts: RevealOpts,
): ScrollTrigger {
  const staleAfterMs = opts.staleAfterMs ?? DEFAULT_REVEAL_STALE_MS;
  const once = opts.once ?? false;

  gsap.set(target, fromVars);
  const tween = gsap.to(target, { ...toVars, paused: true });

  let lastLeftAt: number | null = null;
  let hasPlayed = false;

  const play = () => {
    const fresh =
      !hasPlayed ||
      (!once && lastLeftAt != null && performance.now() - lastLeftAt >= staleAfterMs);
    if (!fresh) return;
    hasPlayed = true;
    opts.onPlay?.();
    tween.pause(0).play();
  };

  const stamp = () => {
    lastLeftAt = performance.now();
  };

  return ScrollTrigger.create({
    trigger: opts.trigger,
    start: opts.start ?? 'top 75%',
    ...(opts.end ? { end: opts.end } : {}),
    onEnter: play,
    onEnterBack: play,
    onLeave: () => {
      stamp();
      opts.onLeave?.();
    },
    onLeaveBack: () => {
      stamp();
      opts.onLeaveBack?.();
    },
  });
}
