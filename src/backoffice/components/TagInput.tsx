import { useState } from 'react';

type Props = {
  legend: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

export default function TagInput({ legend, value, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const trimmed = draft.trim().replace(/,$/, '').trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
  };

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <fieldset className="bo-tag-input">
      <legend className="bo-tag-input__legend">{legend}</legend>
      <div className="bo-tag-input__row">
        {value.map((t) => (
          <span key={t} className="bo-tag bo-tag--editable">
            {t}
            <button
              type="button"
              className="bo-tag__remove"
              aria-label={`הסירי תגית ${t}`}
              onClick={() => remove(t)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
              remove(value[value.length - 1]!);
            }
          }}
          onBlur={commit}
          placeholder={placeholder ?? 'הוסיפי תגית ולחצי Enter…'}
        />
      </div>
    </fieldset>
  );
}
