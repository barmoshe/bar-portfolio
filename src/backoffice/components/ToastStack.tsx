import { useToasts } from '../lib/hooks';

export default function ToastStack() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="bo-toasts" role="status" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className="bo-toast" data-kind={t.kind}>
          <span className="bo-toast__msg">{t.message}</span>
          <button
            type="button"
            className="bo-toast__close"
            aria-label="סגירת הודעה"
            onClick={() => dismiss(t.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
