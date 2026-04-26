import { useTheme } from '../../hooks/useTheme';
import { resetAll } from '../lib/backend';
import { pushToast } from '../lib/hooks';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
};

export default function Topbar({ query, onQueryChange }: Props) {
  const { cycle, glyph, label } = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    cycle({ x: e.clientX, y: e.clientY });
  };

  const onReset = async () => {
    try {
      await resetAll();
      pushToast('success', 'הדמו אופס לערכי ברירת המחדל');
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  return (
    <header className="bo-topbar">
      <div className="bo-topbar__brand">
        <span className="bo-brand-mark" aria-hidden="true">
          ב·M
        </span>
        <div className="bo-brand-text">
          <strong>בק־אופיס</strong>
          <span className="bo-brand-sub">דמו פיקטיבי · בר משה</span>
        </div>
      </div>

      <label className="bo-search">
        <span className="bo-vh">חיפוש</span>
        <input
          type="search"
          placeholder="חפשי לקוח, פרויקט או תגית…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>

      <div className="bo-topbar__actions">
        <button type="button" className="bo-icon-btn" onClick={() => setConfirmOpen(true)} title="איפוס הדמו">
          ↺
          <span className="bo-vh">איפוס נתוני הדמו</span>
        </button>
        <button type="button" className="bo-icon-btn" onClick={onTheme} aria-label={label}>
          {glyph}
        </button>
        <a className="bo-icon-btn bo-icon-btn--text" href="../#intro" aria-label="חזרה לפורטפוליו">
          ← פורטפוליו
        </a>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          title="איפוס נתוני הדמו"
          body="הפעולה תחזיר את כל הלידים, המשימות, ההערות והחשבוניות לערכי ברירת המחדל הראשוניים. אין דרך לבטל."
          confirmLabel="כן, אפסי"
          tone="danger"
          onConfirm={onReset}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </header>
  );
}
