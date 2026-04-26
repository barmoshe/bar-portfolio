type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
};

export default function SegmentedControl<T extends string>({
  legend,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <fieldset className="bo-seg" aria-label={legend}>
      <legend className="bo-seg__legend">{legend}</legend>
      <div className="bo-seg__row">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="bo-seg__btn"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
