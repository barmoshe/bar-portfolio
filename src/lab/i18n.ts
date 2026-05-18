/**
 * Lab-page copy. EN + HE. Bilingual dictionary shaped specifically for
 * the smaller Lab intake (no multi-step quest, no per-template hint maps
 * other than the optional `promptHint` on each template item). The
 * structure intentionally mirrors `src/marketing/i18n.ts` only where
 * forked sections (Cover, ProjectTemplates, Process, About, FAQ,
 * ContactCTA, Header) read the same keys, but the brief sub-tree is
 * pruned to the fields LabIntake actually uses.
 */

export type Lang = 'en' | 'he';

export const DEFAULT_LANG: Lang = 'he';

export const LANGS: readonly Lang[] = ['en', 'he'] as const;

export const DIR: Record<Lang, 'ltr' | 'rtl'> = {
  en: 'ltr',
  he: 'rtl',
};

// Kept in sync with the inline pre-paint script in `lab/index.html`.
export const HE_RANDOM_WEIGHT = 0.7;

export type ContactMethodKey = 'whatsapp' | 'email';

/** A quick-pick suggestion underneath a dialogue prompt. */
export type Chip = { value: string; label: string };

/** One question in the Quest Dialogue flow. */
export type Beat = {
  id: string;
  /** What Bar asks. */
  prompt: string;
  /** Optional helper sentence under the prompt. */
  hint?: string;
  /** Optional quick-pick chips. Picking one auto-fills the freeform input. */
  chips?: Chip[];
  /** Placeholder for the freeform input. */
  placeholder?: string;
  required: boolean;
  /** 'text' or 'textarea'. Defaults to 'text'. */
  inputType?: 'text' | 'textarea';
};

export type TemplateItem = {
  slug: string;
  title: string;
  summary: string;
  /** Per-template sequence of dialogue beats (3-4 questions). The two
   *  universal contact beats are appended at runtime in LabIntake. */
  beats: Beat[];
};

export type Dict = {
  meta: { title: string; description: string };
  masthead: {
    skip: string;
    brandName: string;
    brandTagline: string;
    portfolioLink: string;
    briefLink: string;
    a11yTitle: string;
    a11yLabel: string;
    langGroupLabel: string;
    langEnLabel: string;
    langHeLabel: string;
    langSwitchedTo: string;
  };
  contents: {
    number: string;
    kicker: string;
    title: string;
    standfirst: string;
    items: TemplateItem[];
    pickedLabel: string;
  };
  method: {
    number: string;
    kicker: string;
    title: string;
    standfirst: string;
    steps: { num: string; title: string; body: string }[];
  };
  about: {
    number: string;
    kicker: string;
    title: string;
    paragraphs: string[];
  };
  brief: {
    number: string;
    kicker: string;
    title: string;
    standfirst: string;
    fields: {
      idea: { label: string; placeholder: string; hint: string };
      whoFor: { label: string; placeholder: string };
      reference: { label: string; placeholder: string };
      contactMethod: { label: string; whatsapp: string; email: string };
      contactValue: {
        labelWhatsapp: string;
        labelEmail: string;
        placeholderWhatsapp: string;
        placeholderEmail: string;
      };
    };
    submit: string;
    submitHint: string;
    mailFallback: string;
    mailSubject: string;
    liveSuccess: string;
    liveError: string;
    previewHeading: string;
    previewEmpty: string;
    previewFor: string;
    previewLike: string;
    previewSendVia: { whatsapp: string; email: string };
    briefHeading: string;
    briefFooter: string;
    briefSections: {
      type: string;
      idea: string;
      whoFor: string;
      reference: string;
      vibe: string;
    };
    templatePickedPrefix: string;
    /** Quest Dialogue copy. */
    quest: {
      pickTemplateFirst: string;
      avatarName: string;
      typingHint: string;
      progressLabel: string;
      next: string;
      back: string;
      skip: string;
      send: string;
      sendReady: string;
      pickAnswer: string;
      contactMethodPrompt: string;
      contactMethodChips: { whatsapp: string; email: string };
      contactValuePromptWhatsapp: string;
      contactValuePromptEmail: string;
      done: string;
      doneHint: string;
      sentTitle: string;
      sentBody: string;
      previewHeading: string;
      previewEmpty: string;
    };
  };
  qa: {
    number: string;
    kicker: string;
    title: string;
    items: { q: string; a: string }[];
  };
  colophon: {
    number: string;
    kicker: string;
    title: string;
    pullQuote: string;
    ctaPrimary: string;
    ctaWhatsapp: string;
    ctaMail: string;
    credit: string;
    portfolioLink: string;
    softFollowUp: string;
  };
  board: {
    status: {
      todo: string;
      doing: string;
      done: string;
      selected: string;
    };
    columns: {
      backlog: string;
      process: string;
      about: string;
      faq: string;
      ship: string;
    };
  };
};

const HE: Dict = {
  meta: {
    title: 'בר משה · המעבדה. תביא רעיון, אני בונה.',
    description:
      'תביא רעיון, אני בונה. בלי חוזה, בלי הצעת מחיר, בלי שאלות. אם זה עובד, מדברים. אם לא, יצאת עם מוצר ביד.',
  },
  masthead: {
    skip: 'דילוג לתוכן',
    brandName: 'בר משה / המעבדה',
    brandTagline: 'תביא רעיון, אני בונה',
    portfolioLink: 'הפורטפוליו',
    briefLink: 'שלח רעיון',
    a11yTitle: 'הגדרות נגישות',
    a11yLabel: 'פתיחת הגדרות נגישות',
    langGroupLabel: 'בחירת שפה',
    langEnLabel: 'English',
    langHeLabel: 'עברית',
    langSwitchedTo: 'השפה הוחלפה לעברית',
  },
  contents: {
    number: '03',
    kicker: 'מה אפשר לבנות',
    title: 'אז מה רץ לך בראש?',
    standfirst:
      '10 כיוונים. כל אחד פותח את הטופס בכיוון אחר. אם משהו לא כאן, יש "אחר".',
    items: [
      {
        slug: 'mvp',
        title: 'גרסה ראשונה למיזם',
        summary: 'מרעיון למוצר עובד, מהר. גרסה ראשונה שמספיק טובה להראות.',
        beats: [
          {
            id: 'what',
            prompt: 'אז יש לך רעיון לגרסה ראשונה. מה אנחנו בונים?',
            hint: 'משפט אחד או שלושה.',
            placeholder: 'פלטפורמה, אפליקציה, MVP, ברעיון אחד...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'מי המשתמש הראשון שאם הוא יאהב, נדע שזה הכיוון?',
            chips: [
              { value: 'יזמ.ית סולו', label: 'יזמ.ית סולו' },
              { value: 'צוות קטן', label: 'צוות קטן' },
              { value: 'סטארטאפ צעיר', label: 'סטארטאפ צעיר' },
              { value: 'לקוחות עסקיים', label: 'לקוחות עסקיים' },
            ],
            placeholder: 'תאר במשפט מי הם',
            required: true,
          },
          {
            id: 'whyNow',
            prompt: 'ולמה דווקא עכשיו?',
            chips: [
              { value: 'סבב גיוס', label: 'סבב גיוס' },
              { value: 'תאריך פיץ׳', label: 'תאריך פיץ׳' },
              { value: 'נמאס לחכות', label: 'נמאס לחכות' },
            ],
            placeholder: 'או משהו אחר שדוחף',
            required: false,
          },
        ],
      },
      {
        slug: 'brand',
        title: 'אתר משלך, לא מתבנית',
        summary: 'מעוצב ונבנה אישית. טיפוגרפיה, צבעים ואנימציות שמתאימים לך.',
        beats: [
          {
            id: 'what',
            prompt: 'איזה מותג / אתר אנחנו בונים?',
            placeholder: 'סטודיו קרמיקה, פרילנס עם זהות, מותג חדש...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'vibe',
            prompt: 'איך זה צריך להרגיש בשלוש שניות?',
            hint: 'בחר אחד או יותר, או כתוב משלך.',
            chips: [
              { value: 'מינימלי', label: 'מינימלי' },
              { value: 'מקסימלי', label: 'מקסימלי' },
              { value: 'Y2K', label: 'Y2K' },
              { value: 'רחוב', label: 'רחוב' },
              { value: 'בוטיק', label: 'בוטיק' },
              { value: 'תאגידי', label: 'תאגידי' },
            ],
            placeholder: 'או תאר במילים שלך',
            required: true,
          },
          {
            id: 'audience',
            prompt: 'מי נוחת באתר?',
            chips: [
              { value: 'אספנים', label: 'אספנים' },
              { value: 'גלריסטים', label: 'גלריסטים' },
              { value: 'מאינסטגרם', label: 'מאינסטגרם' },
              { value: 'לקוחות קיימים', label: 'לקוחות קיימים' },
            ],
            placeholder: 'או תאר בקצרה',
            required: false,
          },
        ],
      },
      {
        slug: 'ecommerce',
        title: 'חנות אונליין מעוצבת אישית',
        summary: 'חנות עם אופי. לא קטלוג גנרי.',
        beats: [
          {
            id: 'what',
            prompt: 'מה מוכרים, ולמי?',
            placeholder: 'ספלי קרמיקה, ארבעה דגמים, סיפור של היוצר...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'range',
            prompt: 'באיזה טווח מחיר?',
            chips: [
              { value: 'זול', label: 'זול' },
              { value: 'בינוני', label: 'בינוני' },
              { value: 'פרימיום', label: 'פרימיום' },
              { value: 'יוקרה', label: 'יוקרה' },
            ],
            required: true,
          },
          {
            id: 'channel',
            prompt: 'מאיפה הלקוחות מגיעים?',
            chips: [
              { value: 'אינסטגרם', label: 'אינסטגרם' },
              { value: 'המלצות', label: 'המלצות' },
              { value: 'חיפוש', label: 'חיפוש בגוגל' },
              { value: 'מותג קיים', label: 'מותג קיים' },
            ],
            placeholder: 'או דרך אחרת',
            required: false,
          },
        ],
      },
      {
        slug: 'ai-agent',
        title: 'סוכן AI שעובד בשבילך',
        summary: 'צ׳אט ללקוחות, מענה לפי מסמכים שלך, סוכן שעובר על מיילים.',
        beats: [
          {
            id: 'what',
            prompt: 'איזו פעולה אנושית הסוכן יחליף?',
            hint: 'תאר אותו כאילו אתה מסביר לעובד חדש ביום הראשון.',
            placeholder: 'קורא מיילים, מתייג לפי כוונה, מציע טיוטת תשובה...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'מי משתמש בסוכן?',
            chips: [
              { value: 'צוות מכירות', label: 'צוות מכירות' },
              { value: 'שירות לקוחות', label: 'שירות לקוחות' },
              { value: 'לקוח קצה', label: 'לקוח קצה' },
              { value: 'פנימי', label: 'צוות פנימי' },
            ],
            required: true,
          },
          {
            id: 'context',
            prompt: 'באיזה context הוא ירוץ?',
            chips: [
              { value: 'מייל', label: 'מייל' },
              { value: 'צ׳אט', label: 'צ׳אט' },
              { value: 'סלאק', label: 'סלאק' },
              { value: 'API', label: 'API' },
              { value: 'דשבורד', label: 'דשבורד' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'ai-video',
        title: 'סטודיו יצירתי מבוסס AI',
        summary: 'כלים לגרפיקה, תמונות, סרטונים, מהרעיון לתוצר.',
        beats: [
          {
            id: 'what',
            prompt: 'איזה תוכן ויזואלי אנחנו מייצרים?',
            hint: 'מקור ← טרנספורם ← פלט.',
            placeholder: 'סרטונים אנכיים, גרפיקות יומיות, סטוריז...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'frequency',
            prompt: 'באיזו תדירות?',
            chips: [
              { value: 'יומי', label: 'יומי' },
              { value: 'שבועי', label: 'שבועי' },
              { value: 'חד פעמי', label: 'חד פעמי' },
              { value: 'לקמפיין', label: 'לקמפיין' },
            ],
            required: true,
          },
          {
            id: 'style',
            prompt: 'איזה סטייל ויזואלי?',
            placeholder: 'מינימלי, רטרו, צבעוני, אסתטי...',
            required: false,
          },
        ],
      },
      {
        slug: 'audio',
        title: 'מוזיקה, סאונד וכל מה שביניהם',
        summary: 'פלאגינים, כלי הפקה, סינתזה, אפקטים בזמן אמת.',
        beats: [
          {
            id: 'what',
            prompt: 'איזו חוויה מוזיקלית או מנוע אודיו?',
            hint: 'איך זה צריך להרגיש לאוזן?',
            placeholder: 'פס-קול לאתר, פלאגין, כלי הפקה...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'mood',
            prompt: 'איזה מצב רוח?',
            chips: [
              { value: 'סינתי', label: 'סינתי' },
              { value: 'אקוסטי', label: 'אקוסטי' },
              { value: 'אמביינט', label: 'אמביינט' },
              { value: 'אלקטרוני', label: 'אלקטרוני' },
              { value: 'קולנועי', label: 'קולנועי' },
            ],
            required: true,
          },
          {
            id: 'context',
            prompt: 'איפה זה ינוגן?',
            chips: [
              { value: 'אתר', label: 'אתר' },
              { value: 'אולפן', label: 'אולפן' },
              { value: 'הופעה חיה', label: 'הופעה חיה' },
              { value: 'אפליקציה', label: 'אפליקציה' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'game',
        title: 'משחק דפדפן או חוויה אינטראקטיבית',
        summary: 'משחקון לקמפיין, חוויה לסטוריז, או גרסה ראשונה למשחק אינדי.',
        beats: [
          {
            id: 'what',
            prompt: 'איזה משחק או חוויה?',
            hint: 'מה המכניקה הראשית במשפט?',
            placeholder: 'משחק לחיצה, פאזל, טריוויה, חוויה אינטראקטיבית...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'context',
            prompt: 'מה ההקשר?',
            chips: [
              { value: 'קמפיין מותג', label: 'קמפיין מותג' },
              { value: 'סטוריז', label: 'סטוריז' },
              { value: 'פרויקט צד', label: 'פרויקט צד' },
              { value: 'הפעלת מותג', label: 'הפעלת מותג' },
            ],
            required: true,
          },
          {
            id: 'audience',
            prompt: 'מי השחקנים?',
            chips: [
              { value: 'ילדים', label: 'ילדים' },
              { value: 'נוער', label: 'נוער' },
              { value: 'מבוגרים', label: 'מבוגרים' },
              { value: 'כולם', label: 'כולם' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'realtime',
        title: 'דשבורד שמתעדכן בזמן אמת',
        summary: 'פאנל ניהול עם הרשאות, נתונים חיים, התראות, ייצוא.',
        beats: [
          {
            id: 'what',
            prompt: 'איזה דשבורד או מערכת בזמן אמת?',
            hint: 'אילו נתונים זורמים פנימה וכל כמה זמן?',
            placeholder: 'דשבורד מחסן, מצב פרויקטים, נתוני מכירות...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'מי צופה בדשבורד?',
            chips: [
              { value: 'מנהל תפעול', label: 'מנהל תפעול' },
              { value: 'צוות בשטח', label: 'צוות בשטח' },
              { value: 'לקוחות', label: 'לקוחות' },
              { value: 'הנהלה בכירה', label: 'הנהלה בכירה' },
            ],
            required: true,
          },
          {
            id: 'alerts',
            prompt: 'אילו התראות צריך לשלוח?',
            chips: [
              { value: 'על תקלות', label: 'על תקלות' },
              { value: 'על אבני דרך', label: 'על אבני דרך' },
              { value: 'על שיאים', label: 'על שיאים' },
              { value: 'ללא התראות', label: 'ללא התראות' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'mobile',
        title: 'אפליקציה לטלפון',
        summary: 'אפליקציה שעובדת על כל טלפון. התראות, מצב לא מקוון, התחברות.',
        beats: [
          {
            id: 'what',
            prompt: 'איזו אפליקציה? מה הפעולה היומיומית הראשית בה?',
            hint: 'דמיין משתמש פותח אותה בתחנת אוטובוס.',
            placeholder: 'אפליקציה ללוג, מעקב, מסחר, שיתוף...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'platform',
            prompt: 'איזו פלטפורמה?',
            chips: [
              { value: 'iOS', label: 'iOS' },
              { value: 'אנדרואיד', label: 'אנדרואיד' },
              { value: 'שתיהן', label: 'שתיהן' },
              { value: 'לא משנה', label: 'לא משנה' },
            ],
            required: true,
          },
          {
            id: 'offline',
            prompt: 'צריך לעבוד אופליין?',
            chips: [
              { value: 'כן', label: 'כן, חובה' },
              { value: 'חלקית', label: 'חלקית' },
              { value: 'לא', label: 'לא צריך' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'other',
        title: 'משהו אחר לגמרי',
        summary: 'יש לך רעיון מוזר? מעולה. הדברים הטובים מתחילים ככה.',
        beats: [
          {
            id: 'what',
            prompt: 'אז ספר. מה הרעיון, ולמה הוא צריך להיות קיים?',
            hint: 'מוזר זה בברכה. הקצוות המוזרות עושות את הפרויקטים הכי טובים.',
            placeholder: 'תאר כמו שאתה מספר לחבר',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'למי זה?',
            hint: 'אפילו נישה של חמישים זה בסדר.',
            placeholder: 'מתרגלי חלימה צלולה, אספני קלטות, מי שזה לא יהיה',
            required: false,
          },
          {
            id: 'why',
            prompt: 'למה זה צריך להיבנות עכשיו?',
            placeholder: 'מה השתנה, או למה אף אחד עוד לא בנה את זה',
            required: false,
          },
        ],
      },
    ],
    pickedLabel: 'נבחר',
  },
  method: {
    number: '01',
    kicker: 'איך זה עובד',
    title: 'שלושה שלבים, אפס מחויבות',
    standfirst:
      'שולח. בונה. מחליטים. בלי חוזה, בלי הצעת מחיר, בלי שאלות.',
    steps: [
      {
        num: '01',
        title: 'שולח',
        body:
          'טופס קצר במשבצות. עברית רגילה. בלי באזוורדס, בלי הכנה. ייקח דקה.',
      },
      {
        num: '02',
        title: 'אני בונה',
        body:
          'כמה ימים. גרסה ראשונה חיה, באוויר, עם לינק שאפשר לשלוח לחבר.',
      },
      {
        num: '03',
        title: 'מחליטים',
        body:
          'רוצים להמשיך יחד? נדבר אז. לא רוצים? יצאת עם מוצר. שום דבר לא נסגר מראש.',
      },
    ],
  },
  about: {
    number: '02',
    kicker: 'מי אני',
    title: 'אני אוהב לבנות',
    paragraphs: [
      'אני אוהב לבנות. ובא לי לבנות לא רק לעצמי.',
      'היום כולם בונים הכל עם AI. קשה לעקוב, וכולם מרגישים קצת בפיגור. וזה גם די נכון. אבל רוב מה שאנשים באמת צריכים זה דברים פשוטים, אתר לעסק, אפליקציה קטנה, כלי שיחסוך שעות בעבודה.',
      'הכלים החדשים (Base44, Lovable וכאלה) הם הדרך הקלה לעבוד עם AI לבד, והם מצוינים. אבל לפעמים מה שחסר זה בנאדם באמצע, מישהו שמבין צורך, מוצר ופיתוח, לא רק את הפרומפט.',
      'למטה כמה דוגמאות לדברים שאני אוהב לבנות. בחר אחת שמרגישה קרוב, או דלג ישר לטופס.',
    ],
  },
  brief: {
    number: '03',
    kicker: 'הבריף',
    title: 'מה אתה רוצה לבנות?',
    standfirst:
      'מלא משבצות. הבריף מורכב פה תוך כדי, ונפתח בוואטסאפ או במייל מסודר. אפשר עוד לערוך לפני שליחה.',
    fields: {
      idea: {
        label: 'הרעיון',
        hint: 'משפט אחד או שלושה. ברור עדיף על מתוחכם.',
        placeholder: 'בקצרה, מה אתה רוצה שיקרה?',
      },
      whoFor: {
        label: 'בשביל מי',
        placeholder: 'עסק קטן, אני, חבר, צוות, סבתא…',
      },
      reference: {
        label: 'יש משהו דומה שאהבת?',
        placeholder: 'לינק לאתר/אפליקציה דומה (לא חובה)',
      },
      contactMethod: {
        label: 'איך לחזור אליך',
        whatsapp: 'וואטסאפ',
        email: 'מייל',
      },
      contactValue: {
        labelWhatsapp: 'מספר טלפון',
        labelEmail: 'כתובת מייל',
        placeholderWhatsapp: '05X-XXXXXXX',
        placeholderEmail: 'name@example.com',
      },
    },
    submit: 'שלח את הבריף',
    submitHint:
      'ייפתח וואטסאפ עם ההודעה מסודרת. תעבור, תוסיף או תשנה אם בא לך, ותשלח.',
    mailFallback: 'יותר נוח במייל? פה.',
    mailSubject: 'בריף חדש מהמעבדה',
    liveSuccess: 'נפתח וואטסאפ עם הבריף.',
    liveError: 'יש שדות חובה ריקים. הסימונים האדומים מראים איפה.',
    previewHeading: 'הבריף שלך, בשלוש שורות',
    previewEmpty: 'תתחיל לכתוב, הבריף ייבנה פה תוך כדי.',
    previewFor: 'בשביל',
    previewLike: 'כמו',
    previewSendVia: { whatsapp: 'נשלח בוואטסאפ', email: 'נשלח במייל' },
    briefHeading: 'היי בר,',
    briefFooter: 'נשלח מהמעבדה באתר',
    briefSections: {
      type: '*סוג*',
      idea: '*הרעיון*',
      whoFor: '*בשביל מי*',
      reference: '*דוגמה דומה*',
      vibe: '*וייב*',
    },
    templatePickedPrefix: 'סוג נבחר',
    quest: {
      pickTemplateFirst: 'בחר סוג למעלה כדי להתחיל.',
      avatarName: 'בר',
      typingHint: 'בר כותב…',
      progressLabel: 'שאלה {n} מתוך {total}',
      next: 'הבא',
      back: 'אחורה',
      skip: 'דלג',
      send: '✦ שלח את הבריף',
      sendReady: '✦ שלח את הבריף',
      pickAnswer: 'בחר אחד או כתוב משלך',
      contactMethodPrompt: 'איך הכי נוח לחזור אליך?',
      contactMethodChips: { whatsapp: 'וואטסאפ', email: 'מייל' },
      contactValuePromptWhatsapp: 'תן לי את מספר הוואטסאפ',
      contactValuePromptEmail: 'תן לי את כתובת המייל',
      done: 'הבריף מוכן.',
      doneHint: 'בדוק שזה נראה כמו שאתה רוצה, ולחץ שלח.',
      sentTitle: 'נשלח!',
      sentBody: 'נפתח לך וואטסאפ עם הבריף מסודר. אפשר עוד להוסיף קישורים או צילומים לפני שמשלחים.',
      previewHeading: 'הבריף שלך',
      previewEmpty: 'הבריף ייבנה כאן תוך כדי שיחה.',
    },
  },
  qa: {
    number: '04',
    kicker: 'שאלות',
    title: 'מה שואלים אותי',
    items: [
      {
        q: 'איפה הקאצ׳?',
        a:
          'אין קאצ׳. אני אוהב לבנות, ולפעמים בא לי לבנות לאחרים. אם הגרסה הראשונה עובדת ונרצה להמשיך יחד, נדבר על זה אז. אם לא, נעימה הייתה ההיכרות.',
      },
      {
        q: 'כמה זמן זה לוקח?',
        a:
          'בדרך כלל כמה ימים. תלוי בסיבוך, אבל הרעיון הוא לבנות גרסה ראשונה מהר, לא מוצר מלא. ברגע שיש משהו לראות, הרבה יותר קל לדעת מה הלאה.',
      },
      {
        q: 'מה אם אני נעלם אחרי?',
        a:
          'זה בסדר גמור. בניתי כי בא לי. יצא לי לבנות עוד משהו שאהבתי לבנות. הקוד שלך, אם תרצה אותו, אעביר.',
      },
      {
        q: 'באיזה כלים אתה משתמש?',
        a:
          'תלוי בפרויקט. אני עובד AI-native ומהיר, יודע מתי לקפוץ ל-Base44 או Lovable, מתי לכתוב ישירות עם Cursor, ומתי להפעיל את Claude Code עם ה-skills וה-workflow שפיתחתי לעצמי. הכלי משרת את הפרויקט, לא להפך.',
      },
      {
        q: 'אני בכלל לא טכני, זה בעיה?',
        a:
          'הפוך. אם תוכל לתאר במילים מה אתה רוצה שיקרה, יש לי מספיק לעבוד איתו. הצד הטכני הוא הצד שלי.',
      },
    ],
  },
  colophon: {
    number: '05',
    kicker: 'הסוף',
    title: 'יאללה, בוא נבנה משהו.',
    pullQuote:
      'Build first, ask later. It’s only one prompt away.',
    ctaPrimary: 'אל הבריף',
    ctaWhatsapp: 'או דבר איתי בוואטסאפ',
    ctaMail: 'או מייל',
    credit: 'בר משה · המעבדה · 2026',
    portfolioLink: 'הפורטפוליו',
    softFollowUp:
      'אהבת? נשמח לדבר על המשך. לא? יצאת עם מוצר ביד.',
  },
  board: {
    status: {
      todo: 'לעשות',
      doing: 'בעבודה',
      done: 'בוצע',
      selected: 'נבחר',
    },
    columns: {
      backlog: 'אפשרויות',
      process: 'איך זה עובד',
      about: 'מי אני',
      faq: 'שאלות',
      ship: 'מוכן לשלוח',
    },
  },
};

const EN: Dict = {
  meta: {
    title: 'Bar Moshe · The Lab. Bring an idea. I build.',
    description:
      'Bring an idea, I build. No contract, no quote, no questions. If it works, we talk. If not, you walk away with a product.',
  },
  masthead: {
    skip: 'Skip to content',
    brandName: 'Bar Moshe / The Lab',
    brandTagline: 'Bring an idea. I build.',
    portfolioLink: 'Portfolio',
    briefLink: 'Send an idea',
    a11yTitle: 'Accessibility settings',
    a11yLabel: 'Open accessibility settings',
    langGroupLabel: 'Language',
    langEnLabel: 'English',
    langHeLabel: 'עברית',
    langSwitchedTo: 'Language switched to English',
  },
  contents: {
    number: '03',
    kicker: 'What we can build',
    title: 'So what’s on your mind?',
    standfirst:
      '10 directions. Each one opens the form in a different direction. If yours isn’t here, there’s "other".',
    items: [
      {
        slug: 'mvp',
        title: 'First version of a venture',
        summary: 'From idea to a working product, fast. Solid enough to show.',
        beats: [
          {
            id: 'what',
            prompt: 'So you have an idea for a first version. What are we building?',
            hint: 'One sentence or three.',
            placeholder: 'A platform, an app, an MVP, in one idea...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'Who is the first user, the one whose love means the direction is real?',
            chips: [
              { value: 'solo founder', label: 'solo founder' },
              { value: 'small team', label: 'small team' },
              { value: 'young startup', label: 'young startup' },
              { value: 'business customers', label: 'business customers' },
            ],
            placeholder: 'Describe in a sentence',
            required: true,
          },
          {
            id: 'whyNow',
            prompt: 'And why now?',
            chips: [
              { value: 'funding round', label: 'funding round' },
              { value: 'pitch deadline', label: 'pitch deadline' },
              { value: 'tired of waiting', label: 'tired of waiting' },
            ],
            placeholder: 'Or something else pushing it',
            required: false,
          },
        ],
      },
      {
        slug: 'brand',
        title: 'A site of your own, not from a template',
        summary: 'Designed and built personally. Typography, colors, animations chosen for you.',
        beats: [
          {
            id: 'what',
            prompt: 'What brand or site are we building?',
            placeholder: 'A ceramics studio, a freelancer with identity, a new brand...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'vibe',
            prompt: 'How should it feel in three seconds?',
            hint: 'Pick one or more, or write your own.',
            chips: [
              { value: 'minimal', label: 'minimal' },
              { value: 'maximal', label: 'maximal' },
              { value: 'Y2K', label: 'Y2K' },
              { value: 'street', label: 'street' },
              { value: 'boutique', label: 'boutique' },
              { value: 'corporate', label: 'corporate' },
            ],
            placeholder: 'Or describe in your own words',
            required: true,
          },
          {
            id: 'audience',
            prompt: 'Who lands on this site?',
            chips: [
              { value: 'collectors', label: 'collectors' },
              { value: 'gallerists', label: 'gallerists' },
              { value: 'from Instagram', label: 'from Instagram' },
              { value: 'existing customers', label: 'existing customers' },
            ],
            placeholder: 'Or describe briefly',
            required: false,
          },
        ],
      },
      {
        slug: 'ecommerce',
        title: 'A custom online store',
        summary: 'A store with identity. Not a generic catalogue.',
        beats: [
          {
            id: 'what',
            prompt: 'What are you selling, and to whom?',
            placeholder: 'Hand thrown ceramic mugs, four styles, maker’s story on every item...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'range',
            prompt: 'What price range?',
            chips: [
              { value: 'budget', label: 'budget' },
              { value: 'mid range', label: 'mid range' },
              { value: 'premium', label: 'premium' },
              { value: 'luxury', label: 'luxury' },
            ],
            required: true,
          },
          {
            id: 'channel',
            prompt: 'Where do customers come from?',
            chips: [
              { value: 'Instagram', label: 'Instagram' },
              { value: 'word of mouth', label: 'word of mouth' },
              { value: 'Google search', label: 'Google search' },
              { value: 'existing brand', label: 'existing brand' },
            ],
            placeholder: 'Or another channel',
            required: false,
          },
        ],
      },
      {
        slug: 'ai-agent',
        title: 'Private AI assistant / agent',
        summary: 'Customer chat, answers grounded in your docs, an agent that triages email.',
        beats: [
          {
            id: 'what',
            prompt: 'What human action will the agent replace?',
            hint: 'Describe it like you’re telling a new hire on day one.',
            placeholder: 'Reads emails, tags by intent, drafts first reply...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'Who uses the agent?',
            chips: [
              { value: 'sales team', label: 'sales team' },
              { value: 'customer support', label: 'customer support' },
              { value: 'end customer', label: 'end customer' },
              { value: 'internal staff', label: 'internal staff' },
            ],
            required: true,
          },
          {
            id: 'context',
            prompt: 'In what context will it run?',
            chips: [
              { value: 'email', label: 'email' },
              { value: 'chat', label: 'chat' },
              { value: 'Slack', label: 'Slack' },
              { value: 'API', label: 'API' },
              { value: 'dashboard', label: 'dashboard' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'ai-video',
        title: 'AI creative & visual toolkit',
        summary: 'Graphics, images, video, from idea to finished asset.',
        beats: [
          {
            id: 'what',
            prompt: 'What visual content are we producing?',
            hint: 'Source → transform → output.',
            placeholder: 'Vertical videos, daily graphics, stories...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'frequency',
            prompt: 'How often?',
            chips: [
              { value: 'daily', label: 'daily' },
              { value: 'weekly', label: 'weekly' },
              { value: 'one off', label: 'one off' },
              { value: 'for a campaign', label: 'for a campaign' },
            ],
            required: true,
          },
          {
            id: 'style',
            prompt: 'What visual style?',
            placeholder: 'Minimal, retro, colorful, aesthetic...',
            required: false,
          },
        ],
      },
      {
        slug: 'audio',
        title: 'Music, sound, and the tools in between',
        summary: 'Plugins, production tools, synthesis, live effects.',
        beats: [
          {
            id: 'what',
            prompt: 'What kind of musical experience or audio engine?',
            hint: 'How should it feel to the ear?',
            placeholder: 'Soundtrack for a site, plugin, production tool...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'mood',
            prompt: 'What mood?',
            chips: [
              { value: 'synthetic', label: 'synthetic' },
              { value: 'acoustic', label: 'acoustic' },
              { value: 'ambient', label: 'ambient' },
              { value: 'electronic', label: 'electronic' },
              { value: 'cinematic', label: 'cinematic' },
            ],
            required: true,
          },
          {
            id: 'context',
            prompt: 'Where will it play?',
            chips: [
              { value: 'a site', label: 'a site' },
              { value: 'studio', label: 'studio' },
              { value: 'live show', label: 'live show' },
              { value: 'an app', label: 'an app' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'game',
        title: 'Browser game / interactive experience',
        summary: 'A small game for a campaign, a viral piece, or a first version of an indie game.',
        beats: [
          {
            id: 'what',
            prompt: 'What kind of game or experience?',
            hint: 'What’s the one line core mechanic?',
            placeholder: 'Click game, puzzle, trivia, interactive experience...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'context',
            prompt: 'What’s the context?',
            chips: [
              { value: 'brand campaign', label: 'brand campaign' },
              { value: 'stories', label: 'stories' },
              { value: 'side project', label: 'side project' },
              { value: 'brand activation', label: 'brand activation' },
            ],
            required: true,
          },
          {
            id: 'audience',
            prompt: 'Who are the players?',
            chips: [
              { value: 'kids', label: 'kids' },
              { value: 'teens', label: 'teens' },
              { value: 'adults', label: 'adults' },
              { value: 'everyone', label: 'everyone' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'realtime',
        title: 'Dashboard / live system',
        summary: 'Admin panel with permissions, live data, alerts, exports.',
        beats: [
          {
            id: 'what',
            prompt: 'What kind of dashboard or live system?',
            hint: 'What data flows in and how often?',
            placeholder: 'Warehouse dashboard, project status, sales data...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'Who watches the dashboard?',
            chips: [
              { value: 'operations manager', label: 'operations manager' },
              { value: 'field team', label: 'field team' },
              { value: 'customers', label: 'customers' },
              { value: 'senior leadership', label: 'senior leadership' },
            ],
            required: true,
          },
          {
            id: 'alerts',
            prompt: 'What alerts should it send?',
            chips: [
              { value: 'on failures', label: 'on failures' },
              { value: 'on milestones', label: 'on milestones' },
              { value: 'on records', label: 'on records' },
              { value: 'no alerts', label: 'no alerts' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'mobile',
        title: 'Mobile app',
        summary: 'An app for every phone. Notifications, offline mode, sign in.',
        beats: [
          {
            id: 'what',
            prompt: 'What kind of mobile app? What’s the one daily action inside it?',
            hint: 'Imagine the user opening it at a bus stop.',
            placeholder: 'Logging app, tracker, commerce, sharing...',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'platform',
            prompt: 'Which platform?',
            chips: [
              { value: 'iOS', label: 'iOS' },
              { value: 'Android', label: 'Android' },
              { value: 'both', label: 'both' },
              { value: 'no preference', label: 'no preference' },
            ],
            required: true,
          },
          {
            id: 'offline',
            prompt: 'Does it need to work offline?',
            chips: [
              { value: 'yes', label: 'yes, required' },
              { value: 'partly', label: 'partly' },
              { value: 'no', label: 'not needed' },
            ],
            required: false,
          },
        ],
      },
      {
        slug: 'other',
        title: 'Something else entirely',
        summary: 'Got a weird idea? Great. The good ones start that way.',
        beats: [
          {
            id: 'what',
            prompt: 'Tell me. What is it, and why does it need to exist?',
            hint: 'Weird is welcome. Strange edges make the best projects.',
            placeholder: 'Describe it like you’re telling a friend',
            inputType: 'textarea',
            required: true,
          },
          {
            id: 'who',
            prompt: 'Who is it for?',
            hint: 'Even a niche of fifty is fine.',
            placeholder: 'Lucid dream practitioners, tape collectors, whoever it is',
            required: false,
          },
          {
            id: 'why',
            prompt: 'Why does this need to be built now?',
            placeholder: 'What changed, or why has nobody built it yet',
            required: false,
          },
        ],
      },
    ],
    pickedLabel: 'Picked',
  },
  method: {
    number: '01',
    kicker: 'How it works',
    title: 'Three steps, zero commitment',
    standfirst:
      'You send. I build. We decide. No contract, no quote, no questions.',
    steps: [
      {
        num: '01',
        title: 'You send',
        body:
          'A short brief in slots. Plain words. No buzzwords, no prep. Takes a minute.',
      },
      {
        num: '02',
        title: 'I build',
        body:
          'A few days. A live first version, online, with a link you can send to a friend.',
      },
      {
        num: '03',
        title: 'We decide',
        body:
          'Want to keep going together? We talk then. Don’t? You walked away with a product. Nothing is locked in advance.',
      },
    ],
  },
  about: {
    number: '02',
    kicker: 'Who I am',
    title: 'I love building',
    paragraphs: [
      'I love building. And I want to build for others, not just myself.',
      'Today everyone builds everything with AI. Hard to follow, easy to feel behind. That’s also kind of true. But most of what people actually need stays simple, a small site, a small app, a tool that saves hours.',
      'The new tools (Base44, Lovable and the like) are the easy way to work with AI alone, and they’re great. But sometimes what’s missing is a human in the middle, someone who understands need, product, and development, not just the prompt.',
      'Below are a few examples of things I love to build. Pick one that feels close, or skip straight to the brief.',
    ],
  },
  brief: {
    number: '03',
    kicker: 'The brief',
    title: 'What do you want to build?',
    standfirst:
      'Fill slots. The brief assembles here as you go, then opens in WhatsApp or as a tidy email. You can still edit before sending.',
    fields: {
      idea: {
        label: 'The idea',
        hint: 'One sentence or three. Clear beats clever.',
        placeholder: 'In short, what do you want to happen?',
      },
      whoFor: {
        label: 'Who it’s for',
        placeholder: 'Small business, me, a friend, a team, grandma…',
      },
      reference: {
        label: 'Anything similar you liked?',
        placeholder: 'Link to a similar site/app (optional)',
      },
      contactMethod: {
        label: 'How to reach you',
        whatsapp: 'WhatsApp',
        email: 'Email',
      },
      contactValue: {
        labelWhatsapp: 'Phone number',
        labelEmail: 'Email address',
        placeholderWhatsapp: '+972 5X-XXXXXXX',
        placeholderEmail: 'name@example.com',
      },
    },
    submit: 'Send the brief',
    submitHint:
      'WhatsApp will open with the message ready. Review, edit if you want, then send.',
    mailFallback: 'Prefer email? Click here.',
    mailSubject: 'New brief from the Lab',
    liveSuccess: 'WhatsApp opened with the brief.',
    liveError: 'Required fields are missing. Red marks show where.',
    previewHeading: 'Your brief, in three lines',
    previewEmpty: 'Start typing, the brief assembles here as you go.',
    previewFor: 'For',
    previewLike: 'Like',
    previewSendVia: { whatsapp: 'Sending via WhatsApp', email: 'Sending via email' },
    briefHeading: 'Hi Bar,',
    briefFooter: 'sent from the Lab',
    briefSections: {
      type: '*Type*',
      idea: '*The idea*',
      whoFor: '*For*',
      reference: '*Similar to*',
      vibe: '*Vibe*',
    },
    templatePickedPrefix: 'Type picked',
    quest: {
      pickTemplateFirst: 'Pick a type above to start.',
      avatarName: 'Bar',
      typingHint: 'Bar is typing…',
      progressLabel: 'Question {n} of {total}',
      next: 'Next',
      back: 'Back',
      skip: 'Skip',
      send: '✦ Send the brief',
      sendReady: '✦ Send the brief',
      pickAnswer: 'Pick one or write your own',
      contactMethodPrompt: 'How’s best to reach you?',
      contactMethodChips: { whatsapp: 'WhatsApp', email: 'Email' },
      contactValuePromptWhatsapp: 'Give me your WhatsApp number',
      contactValuePromptEmail: 'Give me your email address',
      done: 'Brief is ready.',
      doneHint: 'Check it looks right, then hit send.',
      sentTitle: 'Sent!',
      sentBody: 'WhatsApp opened with the brief tidied up. You can still add links or screenshots before sending.',
      previewHeading: 'Your brief',
      previewEmpty: 'The brief will assemble here as we talk.',
    },
  },
  qa: {
    number: '04',
    kicker: 'Q&A',
    title: 'What people ask',
    items: [
      {
        q: 'Where’s the catch?',
        a:
          'No catch. I love building, and sometimes I want to build for others. If the first version works and we want to continue together, we’ll talk about that then. If not, nice meeting you.',
      },
      {
        q: 'How long does it take?',
        a:
          'Usually a few days. Depends on complexity, but the goal is a fast first version, not a full product. Once there’s something to see, it’s much easier to know what comes next.',
      },
      {
        q: 'What if I disappear after?',
        a:
          'Totally fine. I built because I wanted to. I got to build one more thing I enjoyed building. Your code, if you want it, I’ll hand it over.',
      },
      {
        q: 'What tools do you use?',
        a:
          'Depends on the project. I work AI-native and fast, knowing when to jump into Base44 or Lovable, when to write directly with Cursor, and when to run Claude Code with the custom skills and workflow I built for myself. The tool serves the project, not the other way around.',
      },
      {
        q: 'I’m not technical at all, is that a problem?',
        a:
          'The opposite. If you can describe in words what you want to happen, I have enough to work with. The technical side is on me.',
      },
    ],
  },
  colophon: {
    number: '05',
    kicker: 'The end',
    title: 'Alright, let’s build something.',
    pullQuote:
      'Build first, ask later. It’s only one prompt away.',
    ctaPrimary: 'To the brief',
    ctaWhatsapp: 'Or hit me on WhatsApp',
    ctaMail: 'Or email',
    credit: 'Bar Moshe · The Lab · 2026',
    portfolioLink: 'Portfolio',
    softFollowUp:
      'Loved it? Happy to talk about next steps. Didn’t? You walked away with a product.',
  },
  board: {
    status: {
      todo: 'TODO',
      doing: 'DOING',
      done: 'DONE',
      selected: 'PICKED',
    },
    columns: {
      backlog: 'OPTIONS',
      process: 'HOW IT WORKS',
      about: 'ABOUT',
      faq: 'FAQ',
      ship: 'READY',
    },
  },
};

const DICTS: Record<Lang, Dict> = { en: EN, he: HE };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}
