import { whatsappHref } from './contact';

/**
 * Persistent WhatsApp pill — fixed bottom-inline-end. On mobile it's the
 * primary CTA after the user scrolls past the hero; on desktop it's a
 * smaller pill that stays out of the way.
 */
export default function StickyCTA() {
  return (
    <aside className="mp-pill-wrap" aria-label="קישור מהיר ל-WhatsApp">
      <a
        className="mp-pill"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="פתח שיחה ב-WhatsApp עם בר משה"
      >
        <span className="mp-pill__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
          <path
            fill="currentColor"
            d="M20.5 3.5A11 11 0 0 0 3.6 17.6L2 22l4.5-1.5a11 11 0 0 0 13.9-13A10.9 10.9 0 0 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.7.9.9-2.6-.2-.3a9 9 0 1 1 6.9 3.5Zm5-6.7c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1a7.3 7.3 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5L9 6.6c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.9 2.6 1 2.6.7 3.1.7s1.6-.6 1.8-1.3c.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3Z"
          />
        </svg>
      </span>
        <span className="mp-pill__label">בואו נדבר בוואטסאפ</span>
      </a>
    </aside>
  );
}
