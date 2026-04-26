import { useId, useMemo, useState } from 'react';
import { formatDateLong } from '../lib/format';

type Props = {
  legend: string;
  value: string; // ISO string
  onChange: (iso: string) => void;
  /** YYYY-MM-DD */
  min?: string;
  /** YYYY-MM-DD */
  max?: string;
  /** Allow leaving the value empty (useful for optional dueDate). */
  optional?: boolean;
};

type Preset = { key: string; label: string; daysAgo: number };

const PRESETS: Preset[] = [
  { key: 'today', label: 'היום', daysAgo: 0 },
  { key: 'yesterday', label: 'אתמול', daysAgo: 1 },
  { key: 'week', label: 'לפני שבוע', daysAgo: 7 },
  { key: 'month', label: 'לפני חודש', daysAgo: 30 },
  { key: 'quarter', label: 'לפני 3 חודשים', daysAgo: 90 },
];

function isoForDaysAgo(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function toDateInputValue(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  // `<input type="date">` wants YYYY-MM-DD in local time.
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function fromDateInputValue(v: string): string {
  if (!v) return '';
  const d = new Date(`${v}T12:00:00`);
  return d.toISOString();
}

export default function DatePresetField({ legend, value, onChange, min, max, optional }: Props) {
  const inputId = useId();
  const [customOpen, setCustomOpen] = useState(false);

  const activeKey = useMemo(() => {
    if (!value) return optional ? 'none' : 'today';
    const v = toDateInputValue(value);
    for (const p of PRESETS) {
      if (toDateInputValue(isoForDaysAgo(p.daysAgo)) === v) return p.key;
    }
    return 'custom';
  }, [value, optional]);

  const pickPreset = (p: Preset) => {
    onChange(isoForDaysAgo(p.daysAgo));
    setCustomOpen(false);
  };

  return (
    <fieldset className="bo-date-preset">
      <legend className="bo-date-preset__legend">{legend}</legend>
      <div className="bo-date-preset__chips">
        {optional && (
          <button
            type="button"
            className="bo-chip"
            aria-pressed={activeKey === 'none'}
            onClick={() => {
              onChange('');
              setCustomOpen(false);
            }}
          >
            ללא
          </button>
        )}
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            className="bo-chip"
            aria-pressed={activeKey === p.key}
            onClick={() => pickPreset(p)}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          className="bo-chip"
          aria-pressed={activeKey === 'custom' || customOpen}
          onClick={() => setCustomOpen((o) => !o)}
        >
          מותאם…
        </button>
      </div>
      {(customOpen || activeKey === 'custom') && (
        <div className="bo-date-preset__custom">
          <label htmlFor={inputId} className="bo-vh">
            {legend}
          </label>
          <input
            id={inputId}
            type="date"
            value={toDateInputValue(value)}
            min={min}
            max={max}
            onChange={(e) => onChange(fromDateInputValue(e.target.value))}
          />
        </div>
      )}
      {value && <p className="bo-date-preset__caption">נבחר: {formatDateLong(value)}</p>}
    </fieldset>
  );
}
