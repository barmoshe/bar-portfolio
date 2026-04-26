/**
 * Marketing services - the three offerings advertised on /business/.
 * Hebrew copy lives here so it is reviewable in diffs and easy to tweak
 * without touching component code.
 */

export type Service = {
  /** URL-safe slug; also used as the React key. */
  slug: 'tutoring' | 'guiding' | 'building';
  /** Big emoji for the service tile. */
  emoji: string;
  /** Mono kicker above the title. */
  kicker: string;
  /** Card headline. */
  title: string;
  /** One-line summary. */
  summary: string;
  /** Bullet examples of what's included. */
  bullets: string[];
};

export const services: Service[] = [
  {
    slug: 'tutoring',
    emoji: '🎓',
    kicker: 'לימוד פרטי',
    title: 'שיעורים אחד על אחד',
    summary:
      'רוצה ללמוד לבנות בלי לדעת לבנות? אני אקח אותך מאפס לפרויקט אמיתי — בקצב שלך, בלי שטויות.',
    bullets: [
      'מבוא לתכנות, JavaScript, TypeScript ו-React',
      'ליווי לבחינות, מטלות ופרויקטי גמר',
      'הצצה ל-DevOps, ענן ו-AI לפי הצורך',
      'שיעור ראשון להיכרות — חינם',
    ],
  },
  {
    slug: 'guiding',
    emoji: '🧭',
    kicker: 'ליווי וייעוץ',
    title: 'ליווי טכני לצוות או יזם.ית סולו',
    summary:
      'יש לך רעיון ולא בטוח.ה איך מתחילים? נשב ביחד, נבנה תוכנית, ונוודא שכל בחירה טכנית משרתת את המוצר.',
    bullets: [
      'סקירת קוד וארכיטקטורה',
      'בחירת מחסנית טכנולוגית ותכנון תשתית',
      'מנטורינג שבועי / דו־שבועי לצוותי פיתוח',
      'עזרה במעבר מ-MVP למוצר חי',
    ],
  },
  {
    slug: 'building',
    emoji: '🛠',
    kicker: 'בנייה',
    title: 'בונים מקצה לקצה',
    summary:
      'מ-MVP לאתר חברה, מאפליקציית מובייל לכלי AI פנימי. מתכננים, בונים, ומשגרים — בלי הפתעות.',
    bullets: [
      'אתרי תדמית, נחיתה ו-Web Apps',
      'אפליקציות React Native / מובייל היברידי',
      'אינטגרציות AI, אוטומציות ו-DevOps',
      'ליווי שבועיים אחרי הלייב — כלול',
    ],
  },
];
