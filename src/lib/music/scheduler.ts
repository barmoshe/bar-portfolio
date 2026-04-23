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
const SCHEDULE_AHEAD_S = 0.12;

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

  tick();

  return {
    stop: () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      timer = null;
    },
    setBpm: (next: number) => {
      currentBpm = next;
    },
  };
}
