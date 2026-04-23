/**
 * Minimal form primitives for the backoffice editor.
 *
 * Styled entirely through the existing CSS custom properties (--paper, --ink,
 * --green, ...) so dark mode works without any extra wiring. Structural
 * classes are scoped under `.admin-root` (see the admin section in
 * `src/styles.css`). No external UI library.
 */

import type { ChangeEvent, ReactNode } from 'react';

/** Single-line text input with a label. */
export function TextField(props: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'tel' | 'password';
  disabled?: boolean;
  monospace?: boolean;
}) {
  const { label, value, onChange, placeholder, type = 'text', disabled, monospace } = props;
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <input
        className={`admin-input${monospace ? ' admin-input-mono' : ''}`}
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={type === 'text'}
        autoComplete="off"
      />
    </label>
  );
}

/** Multi-line text input. */
export function TextArea(props: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  monospace?: boolean;
}) {
  const { label, value, onChange, placeholder, rows = 4, monospace } = props;
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      <textarea
        className={`admin-input admin-textarea${monospace ? ' admin-input-mono' : ''}`}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  );
}

/** Styled button. Intent maps to an accent color. */
export function Button(props: {
  children: ReactNode;
  onClick?: () => void;
  intent?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const { children, onClick, intent = 'ghost', disabled, type = 'button' } = props;
  return (
    <button
      className={`admin-button admin-button-${intent}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

/** Simple tabs. Presentational-only; parent owns the selection state. */
export function Tabs<T extends string>(props: {
  value: T;
  onChange: (next: T) => void;
  tabs: ReadonlyArray<{ id: T; label: string; dirty?: boolean }>;
}) {
  const { value, onChange, tabs } = props;
  return (
    <div className="admin-tabs" role="tablist">
      {tabs.map((t) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            className={`admin-tab${selected ? ' admin-tab-selected' : ''}`}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.id)}
            type="button"
          >
            {t.label}
            {t.dirty ? <span className="admin-tab-dot" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </div>
  );
}

/** Reorderable list editor. Parent provides the item renderer. */
export function ListEditor<T>(props: {
  items: T[];
  onChange: (next: T[]) => void;
  renderItem: (item: T, setItem: (next: T) => void, index: number) => ReactNode;
  emptyTemplate: () => T;
  addLabel?: string;
  itemLabel?: (item: T, index: number) => string;
}) {
  const { items, onChange, renderItem, emptyTemplate, addLabel = 'Add item', itemLabel } = props;

  const update = (index: number, next: T) => {
    const copy = items.slice();
    copy[index] = next;
    onChange(copy);
  };
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = items.slice();
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };
  const add = () => onChange([...items, emptyTemplate()]);

  return (
    <div className="admin-list">
      {items.map((item, i) => (
        <div key={i} className="admin-list-item">
          <div className="admin-list-item-header">
            <span className="admin-list-item-title">
              {itemLabel ? itemLabel(item, i) : `Item ${i + 1}`}
            </span>
            <div className="admin-list-item-controls">
              <Button onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </Button>
              <Button onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                ↓
              </Button>
              <Button intent="danger" onClick={() => remove(i)}>
                ✕
              </Button>
            </div>
          </div>
          <div className="admin-list-item-body">
            {renderItem(item, (next) => update(i, next), i)}
          </div>
        </div>
      ))}
      <Button intent="primary" onClick={add}>
        + {addLabel}
      </Button>
    </div>
  );
}
