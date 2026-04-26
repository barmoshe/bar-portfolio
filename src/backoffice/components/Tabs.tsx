type Tab<T extends string> = { value: T; label: string; badge?: number };

type Props<T extends string> = {
  ariaLabel: string;
  tabs: Tab<T>[];
  active: T;
  onChange: (next: T) => void;
};

export default function Tabs<T extends string>({ ariaLabel, tabs, active, onChange }: Props<T>) {
  return (
    <div className="bo-tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          type="button"
          aria-selected={active === t.value}
          tabIndex={active === t.value ? 0 : -1}
          className="bo-tab"
          onClick={() => onChange(t.value)}
        >
          {t.label}
          {t.badge !== undefined && t.badge > 0 && (
            <span className="bo-tab__badge" aria-hidden="true">
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
