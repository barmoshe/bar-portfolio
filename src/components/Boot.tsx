import { useEffect, useState } from 'react';
import { useBootDismiss } from '../hooks/useBootDismiss';

type Props = { onGone: () => void };

export default function Boot({ onGone }: Props) {
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
  };

  useBootDismiss(!leaving, dismiss);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onGone, 650);
    return () => clearTimeout(t);
  }, [leaving, onGone]);

  return (
    <div
      className={`boot${leaving ? ' gone' : ''}`}
      id="boot"
      role="dialog"
      aria-label="Cover"
    >
      <div className="cover">
        <span className="version-tag">v2.0.0</span>
        <h1 className="mast">
          BAR MOSHE
          <span className="mast-tag">
            it's only one <em>prompt</em> away.
          </span>
        </h1>
        <p className="sub">Full-Stack · AI · Builder</p>
        <button
          className="enter pulse"
          id="enter"
          type="button"
          aria-label="Enter portfolio"
          onClick={dismiss}
        >
          Enter the portfolio
        </button>
        <div className="enter-hint">press any key · or click anywhere</div>
      </div>
    </div>
  );
}
