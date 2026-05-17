/**
 * Marketing-site copy. Hebrew only — the page is HE-first and the EN
 * toggle was removed when the page pivoted to the build-first concept.
 * Components read from `useLang()` which returns `{ t }`. Strings stay
 * organized by section so editing copy is a one-file change.
 */

export type Lang = 'he';

export const DEFAULT_LANG: Lang = 'he';

export type Dict = {
  meta: { title: string; description: string };
  header: {
    skip: string;
    brandName: string;
    brandTagline: string;
    back: string;
    a11yTitle: string;
    a11yLabel: string;
  };
  hero: {
    sticker: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    pullQuote: { quote: string; cite: string };
    ctaPrimary: string;
    ctaSecondary: string;
    whatsappPrefill: string;
    statsLabel: string;
    stats: { num: string; label: string }[];
  };
  templates: {
    eyebrow: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    pickHint: string;
    fitChipLabel: string;
    items: {
      slug: string;
      emoji: string;
      title: string;
      summary: string;
      fits: string[];
    }[];
  };
  intake: {
    eyebrow: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    requiredHint: string;
    optionalHeading: string;
    fields: {
      template: { label: string; placeholder: string };
      idea: { label: string; hint: string; placeholder: string };
      audience: { label: string; placeholder: string };
      problem: { label: string; placeholder: string };
      features: { label: string; hint: string };
      references: { label: string; placeholder: string };
      timeline: { label: string };
      budget: { label: string; hint: string };
      name: { label: string; placeholder: string };
      contactMethod: { label: string; whatsapp: string; email: string };
      contactValue: {
        labelWhatsapp: string;
        labelEmail: string;
        placeholderWhatsapp: string;
        placeholderEmail: string;
      };
    };
    features: { id: string; label: string }[];
    timelines: { id: string; label: string }[];
    budgets: { id: string; label: string }[];
    submit: string;
    submitHint: string;
    mailFallback: string;
    mailSubject: string;
    liveSuccess: string;
    liveError: string;
    briefHeading: string;
    briefFooter: string;
    briefSections: {
      type: string;
      idea: string;
      audience: string;
      problem: string;
      features: string;
      references: string;
      timeline: string;
      budget: string;
    };
  };
  services: {
    eyebrow: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    ctaLabel: string;
    items: {
      slug: 'tutoring' | 'guiding' | 'building';
      emoji: string;
      kicker: string;
      title: string;
      summary: string;
      bullets: string[];
      whatsappMessage: string;
    }[];
  };
  process: {
    eyebrow: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    stepsLabel: string;
    steps: { num: string; title: string; body: string }[];
  };
  proof: {
    eyebrow: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    items: { id: string; quote: string; name: string; role: string; accent: 'primary' | 'accent2' | 'accent3' }[];
  };
  faq: {
    eyebrow: string;
    headlineLead: string;
    headlineMark: string;
    items: { q: string; a: string }[];
  };
  contact: {
    headline: string;
    body: string;
    ctaPrimary: string;
    ctaWhatsapp: string;
    ctaMail: string;
  };
  sticky: {
    region: string;
    primary: string;
    whatsapp: string;
  };
  footer: {
    text: string;
    portfolioLink: string;
  };
};

const HE: Dict = {
  meta: {
    title: 'בר משה — תאר. אבנה. את.ה מחליט.ה.',
    description:
      'יש לך רעיון? תאר אותו בטופס, אני בונה POC על חשבוני, ורק אם זה עובד עבורך — נמשיך. בלי בריפים אינסופיים ובלי הצעות מחיר ראשונות.',
  },
  header: {
    skip: 'דלג לתוכן',
    brandName: 'בר משה',
    brandTagline: '// סטודיו פרטי',
    back: '← פורטפוליו',
    a11yTitle: 'הגדרות נגישות',
    a11yLabel: 'פתיחת הגדרות נגישות',
  },
  hero: {
    sticker: '🛠 בונה ראשון, מדבר אחר־כך',
    headlineLead: 'תאר. אבנה.\n',
    headlineMark: 'את.ה מחליט.ה.',
    lead:
      'יש לך רעיון? תאר אותו בטופס למטה — אני אבנה POC ראשון. אם עובד עבורך, נמשיך לבנות יחד. אם לא — נפרדים בלי שום התחייבות.',
    pullQuote: {
      quote: 'תפס את הצורך מהשיחה הראשונה, ובנה POC לפני שהספקנו לחתום על משהו.',
      cite: 'מ. ק., מייסדת סטארטאפ',
    },
    ctaPrimary: 'תאר את הרעיון',
    ctaSecondary: 'או בוואטסאפ',
    whatsappPrefill:
      'היי בר! יש לי רעיון בראש ואני רוצה לתאר אותו בקצרה. אפשר לדבר?',
    statsLabel: 'במספרים',
    stats: [
      { num: '5+', label: 'שנים מפתח' },
      { num: '20+', label: 'POC ופרויקטים שוגרו' },
      { num: '0', label: 'תשלום מראש' },
    ],
  },
  templates: {
    eyebrow: 'תבניות פרויקטים',
    headlineLead: 'בחר.י מאיפה ',
    headlineMark: 'מתחילים.',
    lead:
      'לחיצה על תבנית מעבירה אותך לטופס עם סוג הפרויקט כבר מסומן. לא מצאת את שלך? יש "אחר" בסוף.',
    pickHint: 'לחץ.י לבחירה',
    fitChipLabel: 'מתאים גם ל',
    items: [
      {
        slug: 'mvp',
        emoji: '🚀',
        title: 'MVP לסטארטאפ',
        summary: 'גרסה ראשונה עובדת של המוצר — מספיק כדי להראות למשתמשים ולגייס.',
        fits: ['יזם.ית סולו', 'סטארטאפ early-stage'],
      },
      {
        slug: 'landing',
        emoji: '🌐',
        title: 'אתר תדמית / Landing Page',
        summary: 'דף נחיתה או אתר חברה ממוקד — כדי שתופיע ברצינות באינטרנט.',
        fits: ['עסק חדש', 'פרילנסר.ית', 'חברה'],
      },
      {
        slug: 'ecommerce',
        emoji: '🛍',
        title: 'חנות אונליין (E-commerce)',
        summary: 'חנות שמוכרת — Shopify, מותאם אישית, או משהו באמצע. כולל תשלומים ומלאי.',
        fits: ['מותג קטן', 'יצרן.ית עצמאי.ת'],
      },
      {
        slug: 'mobile',
        emoji: '📱',
        title: 'אפליקציית מובייל',
        summary: 'iOS + Android באותו codebase. React Native, אפליקציות היברידיות, או PWA.',
        fits: ['סטארטאפ', 'מוצר B2C'],
      },
      {
        slug: 'ai',
        emoji: '🤖',
        title: 'כלי AI / GPT לעסק',
        summary: 'אסיסטנט פנימי, chatbot, סיכום מסמכים, או אוטומציה מבוססת LLM.',
        fits: ['חברה', 'צוות תפעול', 'יזם.ית'],
      },
      {
        slug: 'automation',
        emoji: '🔧',
        title: 'אוטומציות ואינטגרציות',
        summary: 'חיבור מערכות, סנכרון נתונים, scripts שחוסכים שעות עבודה.',
        fits: ['צוות קטן', 'מנהל.ת תפעול'],
      },
      {
        slug: 'dashboard',
        emoji: '📊',
        title: 'דשבורד / מערכת ניהול',
        summary: 'Admin panel, BI, או מערכת פנים־ארגונית עם הרשאות וזרימת עבודה.',
        fits: ['חברה', 'סטארטאפ ב-Scale'],
      },
      {
        slug: 'portfolio',
        emoji: '🎨',
        title: 'פורטפוליו / אתר אישי',
        summary: 'אתר אישי עם אופי — לא תבנית. כמו שהאתר הזה.',
        fits: ['מעצב.ת', 'אמן.ית', 'פרילנסר.ית'],
      },
      {
        slug: 'bot',
        emoji: '💬',
        title: 'בוט וואטסאפ / Chatbot',
        summary: 'בוט שמשרת לקוחות, מקבל הזמנות, או עונה לשאלות חוזרות.',
        fits: ['עסק קטן', 'מסעדה / חנות', 'סוכנות'],
      },
      {
        slug: 'other',
        emoji: '✨',
        title: 'משהו אחר',
        summary: 'יש לך רעיון שלא מתאים לאף תבנית? מצוין. ספר.י בטופס.',
        fits: ['כל אחד'],
      },
    ],
  },
  intake: {
    eyebrow: 'תיאור הרעיון',
    headlineLead: 'מלא מה שאת.ה יודע.ת. אני ',
    headlineMark: 'אבנה ראשון.',
    lead:
      'הטופס נשלח ישירות לוואטסאפ שלי כהודעה מסודרת. ככל שתפרט.י יותר — POC ראשון מדויק יותר. אבל גם 3 שורות מספיקות להתחיל.',
    requiredHint: 'חובה רק 3 שדות: סוג, רעיון, ודרך ליצור איתך קשר.',
    optionalHeading: 'עוד פרטים — אופציונלי',
    fields: {
      template: {
        label: 'סוג הפרויקט',
        placeholder: 'בחר.י תבנית למעלה, או "אחר"',
      },
      idea: {
        label: 'מה את.ה רוצה לבנות?',
        hint: 'במשפט-שניים. בלי באזוורדס.',
        placeholder:
          'לדוגמה: "אפליקציה שמחברת בין מורים פרטיים לתלמידים לפי תחום וזמינות."',
      },
      audience: {
        label: 'מי המשתמש?',
        placeholder: 'סטודנטים, חנויות קטנות, צוותי פיתוח, אנשי 60+...',
      },
      problem: {
        label: 'מה הבעיה שזה פותר?',
        placeholder: 'מה לא עובד היום שהמוצר הזה אמור לפתור?',
      },
      features: {
        label: 'פיצ\'רים שחשובים',
        hint: 'בחר.י כל מה שמתאים. אפשר להוסיף עוד בטקסט החופשי.',
      },
      references: {
        label: 'השראה / דוגמאות',
        placeholder:
          'קישורים לאתרים, אפליקציות, או מותגים שמעוררים אותך. או "משהו בסגנון X".',
      },
      timeline: {
        label: 'מתי צריך את זה?',
      },
      budget: {
        label: 'סדר גודל של תקציב',
        hint: 'לא בטוח.ה? בחר.י "עוד לא יודע.ת". אעריך אחרי שאראה את הסקופ.',
      },
      name: {
        label: 'איך קוראים לך?',
        placeholder: 'שם פרטי מספיק',
      },
      contactMethod: {
        label: 'איפה הכי קל לדבר איתך?',
        whatsapp: 'WhatsApp',
        email: 'מייל',
      },
      contactValue: {
        labelWhatsapp: 'מספר טלפון',
        labelEmail: 'כתובת מייל',
        placeholderWhatsapp: '05X-XXXXXXX',
        placeholderEmail: 'you@example.com',
      },
    },
    features: [
      { id: 'auth', label: 'התחברות משתמשים (Auth)' },
      { id: 'payments', label: 'תשלומים' },
      { id: 'admin', label: 'פאנל ניהול' },
      { id: 'ai', label: 'AI / GPT' },
      { id: 'mobile', label: 'מובייל (iOS/Android)' },
      { id: 'multilang', label: 'רב-לשוני' },
      { id: 'api', label: 'אינטגרציה עם API חיצוני' },
      { id: 'notifications', label: 'שליחת מיילים / WhatsApp' },
      { id: 'uploads', label: 'העלאת קבצים / תמונות' },
      { id: 'maps', label: 'מפות / Geolocation' },
    ],
    timelines: [
      { id: 'urgent', label: 'דחוף — תוך שבוע' },
      { id: 'month', label: 'בחודש הקרוב' },
      { id: 'quarter', label: 'ברבעון הקרוב' },
      { id: 'no-rush', label: 'אין לחץ' },
    ],
    budgets: [
      { id: 'lt5', label: 'עד ₪5,000' },
      { id: '5-15', label: '₪5,000 – ₪15,000' },
      { id: '15-50', label: '₪15,000 – ₪50,000' },
      { id: 'gt50', label: 'מעל ₪50,000' },
      { id: 'unknown', label: 'עוד לא יודע.ת' },
    ],
    submit: 'שלח לבר עכשיו ←',
    submitHint:
      'ייפתח וואטסאפ עם ההודעה מסודרת. אפשר עוד לערוך לפני ששולחים. אין שמירת מידע באתר.',
    mailFallback: 'מעדיפ.ה במייל? לחצ.י כאן',
    mailSubject: 'פנייה חדשה מהאתר',
    liveSuccess: 'נפתח וואטסאפ עם ההודעה המסודרת.',
    liveError: 'יש שדות חסרים. בדק.י את הסימונים האדומים.',
    briefHeading: 'היי בר!',
    briefFooter: '— נשלח מהטופס באתר',
    briefSections: {
      type: '🎯 *סוג הפרויקט*',
      idea: '💡 *הרעיון*',
      audience: '👤 *המשתמש*',
      problem: '🔧 *הבעיה שזה פותר*',
      features: "⭐ *פיצ'רים חשובים*",
      references: '🎨 *השראה / דוגמאות*',
      timeline: '⏱ *לוח זמנים*',
      budget: '💰 *תקציב משוער*',
    },
  },
  services: {
    eyebrow: 'גם זה',
    headlineLead: 'פחות פרויקט שלם, יותר ',
    headlineMark: 'ליווי?',
    lead:
      'לא כל פנייה היא פרויקט מאפס. אם את.ה מחפש.ת ללמוד, להתייעץ, או להוסיף יד בצוות — יש גם את אלה.',
    ctaLabel: 'דברו איתי בוואטסאפ',
    items: [
      {
        slug: 'tutoring',
        emoji: '🎓',
        kicker: 'לימוד פרטי',
        title: 'שיעורים אחד על אחד',
        summary:
          'רוצה ללמוד לבנות בלי לדעת מאיפה מתחילים? אני אקח אותך מאפס לפרויקט אמיתי — בקצב שלך, בלי שטויות.',
        bullets: [
          'מבוא לתכנות, JavaScript, TypeScript ו-React',
          'ליווי לבחינות, מטלות ופרויקטי גמר',
          'הצצה ל-DevOps, ענן ו-AI לפי הצורך',
          'שיעור היכרות ראשון — חינם',
        ],
        whatsappMessage:
          'שלום בר, אני מעוניין/ת בשיעורים פרטיים בתכנות. אשמח לתאם שיחת היכרות.',
      },
      {
        slug: 'guiding',
        emoji: '🧭',
        kicker: 'ליווי וייעוץ',
        title: 'ליווי טכני לצוות או יזם.ית סולו',
        summary:
          'יש לך צוות קטן? יזם.ית סולו? נכנס פעם בשבוע/שבועיים לסקירת קוד, בחירת stack, ועזרה במעבר מ-MVP לחי.',
        bullets: [
          'סקירת קוד וארכיטקטורה',
          'בחירת מחסנית טכנולוגית ותכנון תשתית',
          'מנטורינג שבועי / דו־שבועי',
          'עזרה במעבר מ-MVP למוצר חי',
        ],
        whatsappMessage:
          'שלום בר, אני מחפש/ת ליווי וייעוץ טכני לפרויקט/צוות. אפשר לתאם שיחה?',
      },
      {
        slug: 'building',
        emoji: '🛠',
        kicker: 'בנייה ארוכת טווח',
        title: 'בנייה מקצה לקצה',
        summary:
          'אחרי שהוכחנו את ה-POC, בונים את הגרסה האמיתית: scope סגור, מחיר ידוע, אבני דרך שבועיות, ומסירה נקייה.',
        bullets: [
          'אתרי תדמית, נחיתה ו-Web Apps',
          'אפליקציות React Native / מובייל היברידי',
          'אינטגרציות AI, אוטומציות ו-DevOps',
          'ליווי שבועיים אחרי הלייב — כלול',
        ],
        whatsappMessage:
          'שלום בר, אני רוצה להמשיך אחרי POC לפרויקט מלא. אפשר לתאם שיחה?',
      },
    ],
  },
  process: {
    eyebrow: 'איך זה עובד',
    headlineLead: 'שלושה שלבים, ',
    headlineMark: 'בלי הצעות מחיר מסובכות.',
    lead:
      'במקום בריף שמתמשך שבועות והצעת מחיר שאת.ה מתלבט.ת עליה — אני בונה ראשון, ורק אם עובד עבורך נמשיך.',
    stepsLabel: 'שלבים',
    steps: [
      {
        num: '01',
        title: 'תאר את הרעיון',
        body:
          'מלא.י את הטופס למעלה. ההודעה תיפתח בוואטסאפ — אפשר לערוך לפני שולחים. אחרי שיגרה, אני חוזר אליך תוך 24 שעות.',
      },
      {
        num: '02',
        title: 'אני בונה POC',
        body:
          'תוך 7–14 ימים יהיה לך משהו עובד לראות. על חשבוני, בלי תשלום מראש, בלי חוזה. אם הסקופ גדול מדי ל-POC — נסכים יחד מה בפנים ומה לפעם הבאה.',
      },
      {
        num: '03',
        title: 'את.ה מחליט.ה',
        body:
          'אהבת? נסגור scope ומחיר לגרסה המלאה ונמשיך. לא? פוצים יפה, ה-POC נשאר אצלך, ואני ממשיך הלאה. בלי שום התחייבות.',
      },
    ],
  },
  proof: {
    eyebrow: 'עדויות',
    headlineLead: 'קולות שיצאו ',
    headlineMark: 'לאוויר.',
    lead: 'שורות ממי שלמד.ה איתי, בנה.ה איתי, או שיגרנו ביחד משהו לאוויר.',
    items: [
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
          'בר בנה לנו POC לפני שהספקנו לסיים בריף. שני ימים אחרי השיחה היה משהו שיכולנו לגעת בו — וזה שינה את כל הדיון הפנימי.',
        name: 'א. ב.',
        role: 'מנהל מוצר, חברת B2B',
        accent: 'accent3',
      },
      {
        id: 't3',
        quote:
          'תפס את הצורך מהשיחה הראשונה. בלי באזוורדס, בלי הפתעות תקציב, ועם פתרון שהחזיק שנים.',
        name: 'מ. ק.',
        role: 'מייסדת, סטארטאפ Edtech',
        accent: 'accent2',
      },
    ],
  },
  faq: {
    eyebrow: 'שאלות נפוצות',
    headlineLead: 'מה שאנשים ',
    headlineMark: 'שואלים אותי.',
    items: [
      {
        q: 'רגע, באמת אני לא משלם.ת מראש?',
        a: 'נכון. ה-POC הראשון הוא על חשבוני — בלי תשלום, בלי חוזה, בלי "תוסיף.י כרטיס אשראי". אם אחרי שראית מה בנייתי תרצה.י להמשיך לגרסה מלאה, רק אז נסגור scope ומחיר. אם לא — נפרדים, ה-POC נשאר אצלך, ואין בינינו שום התחייבות. הסיבה: בריפים והצעות מחיר ארוכות לוקחים שבועות. POC ראשון לוקח לי כמה ימים ומגלה הרבה יותר.',
      },
      {
        q: 'איזה סקופ של POC אתה מוכן לבנות בחינם?',
        a: 'תלוי. אם הרעיון מתאים — בדרך כלל 1-3 ימי עבודה שלי, מספיק כדי שתראה.י עובדת ליבה אחת או תזרים אחד עובד מקצה לקצה. אם הסקופ גדול מדי ל-POC, אני מציע גרסה מצומצמת שאני בונה חינם — ואת.ה מחליט.ה אם זה מספיק כדי להתקדם.',
      },
      {
        q: 'אני בלי רקע טכני בכלל. עדיין רלוונטי?',
        a: 'בהחלט. אני אעבור איתך על הטופס בוואטסאפ, נחדד את הרעיון יחד, ואז אני בונה. את.ה לא צריך.ה לדעת מה זה React או database — את.ה צריך.ה לדעת מה את.ה רוצה שהמשתמש.ת יוכל לעשות.',
      },
      {
        q: 'כמה זמן לוקח לבנות פרויקט מלא, אחרי שהחלטתי להמשיך?',
        a: 'תלוי בסקופ. אתר נחיתה — שבוע עד שבועיים. MVP אפליקציה — 4 עד 8 שבועות. אחרי שיש POC ביד, ההערכה הופכת מדויקת — כי כבר ראיתי איפה ההפתעות.',
      },
      {
        q: 'באילו טכנולוגיות אתה עובד?',
        a: 'יומיום: React, TypeScript, Node, Vite — וכל מה שמסביב כשצריך: AI / LLM, Python, ענן (AWS / Vercel), DevOps, React Native. הבחירה תמיד נגזרת מהצורך, לא להפך.',
      },
    ],
  },
  contact: {
    headline: 'מוכן.ה? תאר את הרעיון.',
    body:
      'הטופס פתוח. אין שדה חובה מעבר ל-3 הראשונים. ההודעה נשלחת לוואטסאפ שלי כהודעה מסודרת — לא נשמר כלום באתר.',
    ctaPrimary: 'לטופס ←',
    ctaWhatsapp: 'או בוואטסאפ',
    ctaMail: 'או במייל',
  },
  sticky: {
    region: 'קישורי יצירת קשר מהירים',
    primary: 'תאר את הרעיון',
    whatsapp: 'WhatsApp',
  },
  footer: {
    text: 'בר משה © 2026 · ',
    portfolioLink: 'חזרה לפורטפוליו',
  },
};

export const t: Dict = HE;
