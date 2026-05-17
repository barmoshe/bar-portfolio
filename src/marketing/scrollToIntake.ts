export const INTAKE_ID = 'intake';

export function scrollToIntake() {
  const target = document.getElementById(INTAKE_ID);
  if (!target) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  const firstField = target.querySelector<HTMLElement>('textarea, input');
  firstField?.focus({ preventScroll: true });
}
