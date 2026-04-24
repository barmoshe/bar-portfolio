/**
 * Lookahead scheduler — the Chris Wilson "A Tale of Two Clocks" pattern.
 * A setTimeout loop wakes every LOOKAHEAD ms and schedules any steps that
 * fall within SCHEDULE_AHEAD seconds of the current AudioContext time.
 * The callback receives precise audio time and the step index, which it
 * uses to trigger sample-accurate note starts.
 */

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.12;

export type StepCallback = (time: number, step: number) => void;

export type Scheduler = {
  stop: () => void;
  setBpm: (bpm: number) => void;
};

export function startScheduler(
  ctx: AudioContext,
  bpm: number,
  stepsPerBeat: number,
  onStep: StepCallback,
): Scheduler {
  let currentBpm = bpm;
  let nextStepTime = ctx.currentTime + 0.05;
  let step = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const stepDuration = () => 60 / currentBpm / stepsPerBeat;

  const tick = () => {
    if (stopped) return;
    while (nextStepTime < ctx.currentTime + SCHEDULE_AHEAD_S) {
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
