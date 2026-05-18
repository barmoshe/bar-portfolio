export const INTAKE_ID = 'brief';

export function scrollToIntake() {
  const target = document.getElementById(INTAKE_ID);
  if (!target) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  const focusTarget =
    target.querySelector<HTMLElement>('[data-lab-focus]') ??
    target.querySelector<HTMLElement>('textarea, input, button');
  focusTarget?.focus({ preventScroll: true });
}
