import { useEffect, useRef, type ReactNode } from 'react';
import { useFocusTrap } from '../lib/hooks';

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
};

export default function Modal({ title, onClose, children, footer, width = 480 }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  useFocusTrap(panelRef, onClose);

  // Restore focus to whatever element opened the modal.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => {
      opener?.focus?.();
    };
  }, []);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className="bo-modal-backdrop" onClick={onBackdrop}>
      <div
        className="bo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bo-modal-title"
        ref={panelRef}
        style={{ inlineSize: `min(${width}px, 92vw)` }}
      >
        <header className="bo-modal__head">
          <h2 id="bo-modal-title">{title}</h2>
          <button type="button" className="bo-modal__close" aria-label="סגירה" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="bo-modal__body">{children}</div>
        {footer && <footer className="bo-modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}
