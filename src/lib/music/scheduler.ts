/**
 * Lookahead scheduler — Chris Wilson's "A Tale of Two Clocks" pattern.
 *
 * Why custom (instead of Tone.Transport): the two sides have different
 * native tempos (78 BPM vs 60 BPM) and we want them to run independently
 * so the user's RPM knob can scale both without the math gymnastics of
 * shared transport time. Tone.Transport is a singleton — fine for global
 * SFX timing, awkward for two co-running compositions at different rates.
 *
 * The scheduler runs on a setTimeout loop that wakes every LOOKAHEAD_MS
 * and schedules every step that falls within SCHEDULE_AHEAD_S of `now`.
 * The callback receives the precise audio time (in Tone.Transport seconds)
 * and the absolute step index — it triggers Tone synths with that time.
 */

import * as Tone from 'tone';

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.18;

export type StepCallback = (time: number, step: number) => void;

export type Scheduler = {
  stop: () => void;
  setBpm: (bpm: number) => void;
};

export function startScheduler(
  bpm: number,
  stepsPerBeat: number,
  onStep: StepCallback,
): Scheduler {
  let currentBpm = bpm;
  let nextStepTime = Tone.now() + 0.06;
  let step = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const stepDuration = () => 60 / currentBpm / stepsPerBeat;

  const tick = () => {
    if (stopped) return;
    const horizon = Tone.now() + SCHEDULE_AHEAD_S;
    while (nextStepTime < horizon) {
      onStep(nextStepTime, step);
      nextStepTime += stepDuration();
      step += 1;
    }
    timer = setTimeout(tick, LOOKAHEAD_MS);
  };

  // Hidden tabs throttle setTimeout to 1 Hz; on refocus the while-loop above
  // would otherwise catch up by firing dozens of missed steps at once — an
  // audible burst. Pause on hide, snap forward to the next bar boundary on
  // return so the phrase stays aligned.
  const onVisibility = () => {
    if (stopped) return;
    if (typeof document === 'undefined') return;
    if (document.hidden) {
      if (timer) clearTimeout(timer);
      timer = null;
    } else if (!timer) {
      nextStepTime = Tone.now() + 0.06;
      const barSteps = stepsPerBeat * 4;
      step = Math.ceil(step / barSteps) * barSteps;
      tick();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibility);
  }

  tick();

  return {
    stop: () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      timer = null;
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility);
      }
    },
    setBpm: (next: number) => {
      currentBpm = next;
    },
  };
}
