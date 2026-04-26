import { contact } from '../data/portfolio';

const MAIL_SUBJECT = 'שלום בר, מעוניין/ת לדבר על פרויקט';
const MAIL_BODY =
  'היי בר,\n\nיש לי רעיון/פרויקט שאשמח להתייעץ עליו:\n\n';
const WHATSAPP_TEXT = 'היי בר! ראיתי את האתר שלך ויש לי רעיון לפרויקט שאשמח להתייעץ עליו.';

export const mailtoHref = `mailto:${contact.email}?subject=${encodeURIComponent(
  MAIL_SUBJECT,
)}&body=${encodeURIComponent(MAIL_BODY)}`;

// wa.me wants the international number with no '+'.
const WHATSAPP_NUMBER = contact.phone.replace(/[^\d]/g, '');

export const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_TEXT,
)}`;
