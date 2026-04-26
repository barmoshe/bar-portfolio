export default function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="bo-progress"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${clamped}% הושלם`}
    >
      <div className="bo-progress__fill" style={{ inlineSize: `${clamped}%` }} />
      <span className="bo-progress__text">{clamped}%</span>
    </div>
  );
}
