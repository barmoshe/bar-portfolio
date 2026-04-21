import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

interface KnobProps {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  valueText?: (v: number) => string;
  onChange: (v: number) => void;
  log?: boolean;
  stepped?: boolean;
  disabled?: boolean;
}

const ARC_DEG = 270;
const ARC_START = -135;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function Knob({
  label,
  min,
  max,
  step,
  defaultValue,
  valueText,
  onChange,
  log = false,
  stepped = false,
  disabled = false,
}: KnobProps) {
  const [value, setValue] = useState(defaultValue);
  const inputId = useId();
  const dragRef = useRef<{ startY: number; startValue: number } | null>(null);
  const lastEmitted = useRef<number>(defaultValue);

  const emit = useCallback(
    (v: number) => {
      const next = stepped ? Math.round(v) : v;
      if (next === lastEmitted.current) return;
      lastEmitted.current = next;
      onChange(next);
    },
    [onChange, stepped],
  );

  const commit = useCallback(
    (v: number) => {
      const snapped = stepped ? Math.round(v) : v;
      const clamped = clamp(snapped, min, max);
      setValue(clamped);
      emit(clamped);
    },
    [emit, max, min, stepped],
  );

  const fraction = log
    ? Math.log(Math.max(value, min) / min) / Math.log(max / min)
    : (value - min) / (max - min);
  const angle = ARC_START + clamp(fraction, 0, 1) * ARC_DEG;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startValue: value };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { startY, startValue } = dragRef.current;
    const deltaY = startY - e.clientY; // up = increase
    const span = max - min;
    const sensitivity = e.shiftKey ? 0.1 : 1;
    const delta = (deltaY / 180) * span * sensitivity;
    if (log) {
      // Move in log space for smoother sweep on frequency-style knobs.
      const logSpan = Math.log(max / min);
      const logStart = Math.log(Math.max(startValue, min));
      const logNext = logStart + (deltaY / 180) * logSpan * sensitivity;
      commit(clamp(Math.exp(logNext), min, max));
    } else {
      commit(clamp(startValue + delta, min, max));
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  // Keep internal value in sync with external changes (none today, but guards
  // future defaultValue updates).
  useEffect(() => {
    lastEmitted.current = defaultValue;
  }, [defaultValue]);

  const display = valueText ? valueText(value) : String(stepped ? Math.round(value) : value);

  return (
    <label className="knob" htmlFor={inputId}>
      <span className="knob__label">{label}</span>
      <div
        className="knob__body"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-disabled={disabled || undefined}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="40" className="knob__ring" />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="14"
            className="knob__tick"
            style={{ transform: `rotate(${angle}deg)`, transformOrigin: '50px 50px' }}
          />
          <circle cx="50" cy="50" r="4" className="knob__hub" />
        </svg>
        <input
          id={inputId}
          type="range"
          className="knob__input"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          aria-valuetext={display}
          onChange={(e) => commit(+e.target.value)}
        />
      </div>
      <span className="knob__value" aria-hidden="true">
        {display}
      </span>
    </label>
  );
}
