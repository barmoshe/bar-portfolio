/**
 * Placeholder testimonials for the marketing Proof bento. Real quotes
 * land here once the user supplies them. Keep the shape stable so the
 * Proof component does not need to change when copy is swapped.
 */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  accent: 'primary' | 'accent2' | 'accent3';
};

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'התחלתי בלי שום רקע בתכנות. אחרי 3 חודשים שיגרנו לאוויר אתר שאני באמת מבין/ה מאחורי הקלעים.',
    name: 'נ. ל.',
    role: 'יזמית, סטודיו עיצוב',
    accent: 'primary',
  },
  {
    id: 't2',
    quote:
      'הקצב היה צפוי, התקשורת ברורה, וחזרנו עם מוצר שאפשר לתחזק. הליווי אחרי הלייב היה ההבדל.',
    name: 'א. ב.',
    role: 'מנהל מוצר, חברת B2B',
    accent: 'accent3',
  },
  {
    id: 't3',
    quote:
      'בר תפס את הצורך מהשיחה הראשונה. בלי באזוורדס, בלי הפתעות תקציב, ועם פתרון שהחזיק שנים.',
    name: 'מ. ק.',
    role: 'מייסדת, סטארטאפ Edtech',
    accent: 'accent2',
  },
];
