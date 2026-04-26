type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  legend: string;
  options: Option<T>[];
  selected: T | 'all';
  onChange: (next: T | 'all') => void;
};

export default function FilterChips<T extends string>({
  legend,
  options,
  selected,
  onChange,
}: Props<T>) {
  return (
    <fieldset className="bo-chips">
      <legend className="bo-chips__legend">{legend}</legend>
      <button
        type="button"
        className="bo-chip"
        aria-pressed={selected === 'all'}
        onClick={() => onChange('all')}
      >
        הכול
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="bo-chip"
          aria-pressed={selected === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </fieldset>
  );
}
