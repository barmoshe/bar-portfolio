/**
 * Marketing services - the three offerings advertised on /business/.
 * Hebrew copy lives here so it is reviewable in diffs and easy to tweak
 * without touching component code.
 */

export type ServiceEngagement = 'fixed' | 'hourly' | 'retainer';

export type Service = {
  /** URL-safe slug; also used as the React key. */
  slug: 'tutoring' | 'guiding' | 'building';
  /** Mono kicker above the title (Hebrew or short English label). */
  kicker: string;
  /** Card headline (Hebrew). */
  title: string;
  /** One-line summary (Hebrew). */
  summary: string;
  /** Bullet examples of what's included (Hebrew). */
  bullets: string[];
  /** Engagement model hint, surfaced as a chip under the bullets. */
  engagement: ServiceEngagement;
  /** Accent token name to tint the card's offset shadow. */
  accent: 'green' | 'blue' | 'magenta';
};

export const services: Service[] = [
  {
    slug: 'tutoring',
    kicker: 'לימוד פרטי',
    title: 'שיעורים פרטיים — אחד על אחד',
    summary:
      'רוצה ללמוד לבנות בלי לדעת לבנות? אני אקח אותך מאפס לפרויקט אמיתי, בקצב שלך.',
    bullets: [
      'מבוא לתכנות, JavaScript / TypeScript, ו-React',
      'ליווי לבחינות, מטלות ופרויקטי גמר',
      'הצצה אל DevOps, ענן ו-AI לפי הצורך',
      'שיעור ראשון להיכרות — חינם.',
    ],
    engagement: 'hourly',
    accent: 'green',
  },
  {
    slug: 'guiding',
    kicker: 'ליווי וייעוץ',
    title: 'ליווי טכני — לצוות או ליזם.ית סולו',
    summary:
      'יש לך רעיון ולא בטוח.ה איך מתחילים? נשב ביחד, נבנה תוכנית, ונוודא שכל בחירה טכנית משרתת את המוצר.',
    bullets: [
      'סקירת קוד וארכיטקטורה',
      'בחירת מחסנית טכנולוגית ותכנון תשתית',
      'מנטורינג שבועי / דו־שבועי לצוותי פיתוח',
      'עזרה במעבר מ-MVP למוצר חי.',
    ],
    engagement: 'retainer',
    accent: 'blue',
  },
  {
    slug: 'building',
    kicker: 'בנייה',
    title: 'בנייה מקצה לקצה — אפליקציות, אתרים, ורעיונות יצירתיים',
    summary:
      'מ-MVP לאתר חברה, מאפליקציית מובייל לכלי AI פנימי. מתכננים, בונים ומשגרים — בלי הפתעות.',
    bullets: [
      'אתרי תדמית, נחיתה ו-Web Apps',
      'אפליקציות React Native / מובייל היברידי',
      'אינטגרציות AI, אוטומציות ו-DevOps',
      'מחיר קבוע לפי סקופ — או ריטיינר חודשי.',
    ],
    engagement: 'fixed',
    accent: 'magenta',
  },
];

/** Hebrew label for the engagement chip. */
export const engagementLabel: Record<ServiceEngagement, string> = {
  fixed: 'מחיר קבוע לסקופ',
  hourly: 'תשלום לפי שעה',
  retainer: 'ריטיינר חודשי',
};
