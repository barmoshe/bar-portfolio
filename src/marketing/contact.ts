import { contact } from '../data/portfolio';

const DEFAULT_MAIL_SUBJECT = 'שלום בר, מעוניין/ת לדבר על פרויקט';
const DEFAULT_MAIL_BODY =
  'היי בר,\n\nיש לי רעיון/פרויקט שאשמח להתייעץ עליו:\n\n';
const WHATSAPP_TEXT = 'היי בר! ראיתי את האתר שלך ויש לי רעיון לפרויקט שאשמח להתייעץ עליו.';

export const mailRecipient = contact.email;

export const buildMailtoHref = (
  subject: string = DEFAULT_MAIL_SUBJECT,
  body: string = DEFAULT_MAIL_BODY,
) =>
  `mailto:${mailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const mailtoHref = buildMailtoHref();

// wa.me wants the international number with no '+'.
const WHATSAPP_NUMBER = contact.phone.replace(/[^\d]/g, '');

export const buildWhatsAppHref = (text: string = WHATSAPP_TEXT) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const whatsappHref = buildWhatsAppHref();
