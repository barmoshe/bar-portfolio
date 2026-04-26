/**
 * Audience cards on the marketing page bento. Each card maps a target
 * audience to a pre-filled WhatsApp message so the conversation starts
 * with context the visitor already self-selected.
 */

export type Audience = {
  slug: 'learners' | 'builders' | 'startups' | 'companies';
  emoji: string;
  kicker: string;
  title: string;
  summary: string;
  whatsappMessage: string;
  cta: string;
  span: 'wide' | 'tall' | 'half';
};

export const audiences: Audience[] = [
  {
    slug: 'learners',
    emoji: '🎓',
    kicker: 'לומדים',
    title: 'רוצה ללמוד לפתח',
    summary:
      'שיעורים פרטיים מאפס, ליווי למטלות, והדרכה לפרויקט גמר. מתחילים ראשון ללא התחייבות.',
    whatsappMessage:
      'שלום בר, אני מעוניין/ת ללמוד פיתוח ולקבל ליווי. אשמח לשמוע איך מתחילים.',
    cta: 'בואו נדבר על שיעור',
    span: 'wide',
  },
  {
    slug: 'builders',
    emoji: '🛠',
    kicker: 'בילדרים',
    title: 'יש לי רעיון לבנות',
    summary:
      'מ-MVP לאתר תדמית. מתכננים יחד, בונים בקצב צפוי, ומשגרים בלי הפתעות.',
    whatsappMessage:
      'שלום בר, יש לי רעיון לפרויקט ואני צריך/ה הכוונה ובנייה. בא לי לשמוע איך אתה עובד.',
    cta: 'נדבר על הרעיון',
    span: 'half',
  },
  {
    slug: 'startups',
    emoji: '🚀',
    kicker: 'סטארטאפים',
    title: 'צוות קטן שזקוק למנטור',
    summary:
      'מנטורינג, סקירות קוד, בחירת מחסנית טכנולוגית, ועזרה במעבר מ-MVP למוצר חי.',
    whatsappMessage:
      'שלום בר, אני מסטארטאפ/צוות פיתוח קטן ואנחנו מחפשים מנטור או יועץ טכני. אפשר לתאם שיחה?',
    cta: 'נתאם שיחת ייעוץ',
    span: 'half',
  },
  {
    slug: 'companies',
    emoji: '🏢',
    kicker: 'חברות',
    title: 'חברה שצריכה בילדר חיצוני',
    summary:
      'בנייה מקצה לקצה: אתרי תדמית, אפליקציות, כלי AI פנימיים, ואינטגרציות. עם תיעוד ומסירה מסודרת.',
    whatsappMessage:
      'שלום, אנחנו חברה שמעוניינת לשכור אותך לפרויקט. אשמח להציג בקצרה את הצורך ולתאם שיחה.',
    cta: 'נתאם שיחה ראשונה',
    span: 'wide',
  },
];
