/**
 * Marketing-site copy. EN + HE. The page is framed as a printed
 * editorial issue ("Issue 01" / "גליון 01"), so the copy is
 * structured by section with magazine-style numbering, kickers,
 * and pull quotes. Editing copy is a one-file change.
 */

export type Lang = 'en' | 'he';

export const DEFAULT_LANG: Lang = 'he';

export const LANGS: readonly Lang[] = ['en', 'he'] as const;

export const DIR: Record<Lang, 'ltr' | 'rtl'> = {
  en: 'ltr',
  he: 'rtl',
};

// Weight for the first-visit random pick. Must be kept in sync with the
// inline pre-paint script in `business/index.html` (it can't import this
// module since it runs before module evaluation).
export const HE_RANDOM_WEIGHT = 0.7;

declare global {
  interface Window {
    __bmLang?: Lang;
  }
}

export type Dict = {
  meta: { title: string; description: string };
  masthead: {
    issueNumber: string;
    issueDate: string;
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
  cover: {
    issueLine: string;
    headlineLines: string[];
    standfirst: string;
    byline: string;
    scrollHint: string;
    /** Primary hero CTA label - "start a build" */
    ctaStart: string;
    /** Secondary hero text link - "see what I build" */
    ctaBrowse: string;
  };
  contents: {
    number: string;
    kicker: string;
    title: string;
    standfirst: string;
    items: {
      slug: string;
      title: string;
      summary: string;
      fits: string[];
    }[];
    pickedLabel: string;
  };
  method: {
    number: string;
    kicker: string;
    title: string;
    standfirst: string;
    steps: { num: string; title: string; body: string }[];
    pullQuote: { quote: string; cite: string };
  };
  about: {
    number: string;
    kicker: string;
    title: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
  };
  brief: {
    number: string;
    kicker: string;
    title: string;
    standfirst: string;
    requiredHint: string;
    optionalHeading: string;
    fields: {
      template: { label: string; placeholder: string };
      idea: { label: string; hint: string; placeholder: string };
      whyNow: { label: string; hint: string; placeholder: string };
      audience: { label: string; placeholder: string };
      problem: { label: string; placeholder: string };
      references: { label: string; placeholder: string };
      timeline: { label: string };
      howHeard: { label: string; placeholder: string };
      name: { label: string; placeholder: string };
      contactMethod: { label: string; whatsapp: string; email: string };
      contactValue: {
        labelWhatsapp: string;
        labelEmail: string;
        placeholderWhatsapp: string;
        placeholderEmail: string;
      };
    };
    timelines: { id: string; label: string }[];
    submit: string;
    submitHint: string;
    marginalNote: string;
    mailFallback: string;
    mailSubject: string;
    liveSuccess: string;
    liveError: string;
    briefHeading: string;
    briefFooter: string;
    briefSections: {
      type: string;
      idea: string;
      whyNow: string;
      audience: string;
      problem: string;
      references: string;
      timeline: string;
      howHeard: string;
    };
    quest: {
      chapters: {
        spark: string;
        you: string;
        detail: string;
        when: string;
        send: string;
      };
      nav: {
        next: string;
        back: string;
        skip: string;
        edit: string;
        send: string;
        sendAgain: string;
      };
      counter: string;
      liveStep: string;
      liveCommitted: string;
      liveBriefLabel: string;
      letterIntro: string;
      letterEmpty: string;
      reviewTitle: string;
      reviewIntro: string;
      sentTitle: string;
      sentBody: string;
      tapToEdit: string;
      keyboardHint: string;
      prompts: {
        template: string;
        idea: string;
        name: string;
        contact: string;
        whyNow: string;
        audience: string;
        problem: string;
        references: string;
        timeline: string;
        howHeard: string;
        review: string;
      };
      /**
       * Per-template overrides for every beat that benefits from being
       * tuned to the chosen project type. Any field left unset falls back
       * to the generic `prompts` / `fields.*` copy.
       */
      byTemplate: Record<string, {
        idea?:       { prompt?: string; hint?: string; placeholder?: string };
        whyNow?:     { prompt?: string; hint?: string; placeholder?: string };
        audience?:   { prompt?: string; placeholder?: string };
        problem?:    { prompt?: string; placeholder?: string };
        references?: { prompt?: string; placeholder?: string };
        timeline?:   { prompt?: string };
        howHeard?:   { prompt?: string; placeholder?: string };
        review?:     { prompt?: string };
      }>;
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
  };
  runningFoot: {
    backToTop: string;
    whatsapp: string;
    mail: string;
    issueLabel: string;
  };
  /**
   * BOARD-direction microcopy. Status pills, column headers, and the
   * sticky brief mini-ticket. Additive - not consumed by older sections,
   * referenced by the redesigned chrome only.
   */
  board: {
    status: {
      todo: string;
      doing: string;
      done: string;
      selected: string;
      open: string;
      closed: string;
      building: string;
    };
    columns: {
      backlog: string;
      process: string;
      about: string;
      intake: string;
      faq: string;
      ship: string;
    };
    brief: string;
    progress: string;
    ringHold: string;
  };
};

const HE: Dict = {
  meta: {
    title: 'בר משה - תאר. אבנה. תחליט.',
    description:
      'בונה לך אבטיפוס על חשבוני לפני שמדברים בכלל על מחיר. עבד לך? יאללה ממשיכים. לא? כל אחד הולך לדרכו, בלי שום התחייבות.',
  },
  masthead: {
    issueNumber: 'גליון 01',
    issueDate: '2025 / 26',
    skip: 'דילוג לתוכן',
    brandName: 'בר משה',
    brandTagline: 'בונה קודם, מדבר אחר־כך',
    portfolioLink: 'הפורטפוליו',
    briefLink: 'תכתוב לי',
    a11yTitle: 'הגדרות נגישות',
    a11yLabel: 'פתיחת הגדרות נגישות',
    langGroupLabel: 'בחירת שפה',
    langEnLabel: 'English',
    langHeLabel: 'עברית',
    langSwitchedTo: 'השפה הוחלפה לעברית',
  },
  cover: {
    issueLine: 'גליון 01 · בונה קודם, מדבר אחר־כך',
    // The cover headline is the manifesto. Three short imperatives -
    // direct, punchy, matches the HTML title.
    headlineLines: ['תאר.', 'אבנה.', 'תחליט.'],
    standfirst:
      'תפסיק עם הבריפים האינסופיים. תכתוב לי בכמה שורות מה אתה רוצה לבנות, ובתוך שבוע אני שולח לך אבטיפוס אמיתי - על חשבוני. אהבת? יאללה ממשיכים. לא אהבת? נפרדים בלי שאלות.',
    byline: 'בר משה · בונה דברים מאז 2020',
    scrollHint: 'גלילה למטה',
    ctaStart: 'בוא נתחיל',
    ctaBrowse: 'מה אני בונה',
  },
  contents: {
    number: '01',
    kicker: 'התוכן',
    title: 'אז מה בונים?',
    standfirst:
      'אלה הדברים שהכי מבקשים ממני לבנות. תבחר אחד - והטופס למטה ייפתח עם השדה הנכון כבר מסומן. משהו אחר לגמרי? יש גם "אחר".',
    items: [
      {
        slug: 'mvp',
        title: 'גרסה ראשונה לסטארטאפ',
        summary:
          'מרעיון לקוד עובד בתוך שבוע. גרסה ראשונה שמספיק טובה כדי להראות למשתמשים, לרוץ איתה לסבב גיוס, או פשוט להבין שזה לא הכיוון.',
        fits: ['ייזום סולו', 'סטארטאפ early-stage', 'צוות קטן'],
      },
      {
        slug: 'brand',
        title: 'אתר שזוכרים',
        summary:
          'לא עוד תבנית. אנימציות, פלטה משלך, אינטראקציות שנשארות בראש. בערך כמו האתר הזה - רק שלך.',
        fits: ['מותג חדש', 'פרילנס עם זהות', 'סטודיו'],
      },
      {
        slug: 'ecommerce',
        title: 'חנות אונליין שזה לא תבנית',
        summary:
          'חנות שעוצבה מאפס על תשתית קיימת, מערכת תשלומים משלך, או חנות־בוטיק שלמה בקוד. למותג עם אופי - לא לעוד קטלוג גנרי.',
        fits: ['מותג קטן', 'יצירה עצמאית', 'חנות־בוטיק'],
      },
      {
        slug: 'ai-agent',
        title: 'סוכן AI שעובד בשבילך',
        summary:
          'צ׳אט ללקוחות, מערכת שעונה על שאלות לפי המסמכים שלך, או סוכן שעובר על מיילים ופשוט עושה את העבודה. מודל ענן או מודל פתוח - מה שמתאים לעסק שלך.',
        fits: ['חברה', 'צוות תפעול / שירות', 'יזמ.ית AI'],
      },
      {
        slug: 'ai-video',
        title: 'מכונה שמייצרת לך וידאו (AI)',
        summary:
          'מטקסט → סצנות → וידאו מוכן, הכל אוטומטי. לסרטוני הסבר בכמויות, פודקאסט מאויר, או תוכן יומי לרשתות.',
        fits: ['יוצר.ת תוכן', 'סוכנות שיווק', 'מותג עם סדרה / פודקאסט'],
      },
      {
        slug: 'audio',
        title: 'הכל מסביב לסאונד ומוזיקה',
        summary:
          'פלאגינים לאולפן, כלי הפקה, מערכות לאיוו פרפורמנס, סינתזה, מיקסר רב־ערוצי, אפקטים בזמן אמת. אני גם מנגן ומפיק - אז אני יודע איך זה צריך להרגיש בצד השני של המסך.',
        fits: ['מוזיקאי.ת', 'מפיק.ה', 'מותג מוזיקלי', 'סטארטאפ אודיו'],
      },
      {
        slug: 'game',
        title: 'משחק דפדפן או חוויה אינטראקטיבית',
        summary:
          'משחקון לקמפיין, חוויה ויראלית לסטוריז, או אבטיפוס למשחק אינדי שאתה מפתח.',
        fits: ['מותג עם קמפיין', 'פיתוח משחקי אינדי', 'סוכנות יצירתית'],
      },
      {
        slug: 'realtime',
        title: 'דשבורד שמתעדכן בזמן אמת',
        summary:
          'פאנל ניהול עם הרשאות, BI חי, מערכת ניטור בזמן אמת. גרפים, פילטרים, ייצוא נתונים. כל מה שהצוות שלך עושה היום באקסל - רק שזה עובד.',
        fits: ['חברה', 'סטארטאפ ב-scale', 'צוות נתונים / ops'],
      },
      {
        slug: 'mobile',
        title: 'אפליקציה לטלפון',
        summary:
          'iOS + Android מאותו קוד. push, אופליין, חנות, התחברות. מפתח אחד (אני), שתי פלטפורמות.',
        fits: ['סטארטאפ', 'מוצר B2C', 'עסק עם לקוחות נאמנים'],
      },
      {
        slug: 'other',
        title: 'משהו אחר לגמרי',
        summary:
          'יש לך רעיון מוזר מתחום שעוד לא נגעתי בו? מצוין - הדברים הכי טובים שיצא לי לעבוד עליהם התחילו ככה. תכתוב את זה בטופס, נתחיל משם.',
        fits: ['כל אחד.ת'],
      },
    ],
    pickedLabel: 'נבחר',
  },
  method: {
    number: '02',
    kicker: 'איך זה עובד',
    title: 'איך בונים יחד',
    standfirst:
      'שלושה שלבים. בלי הצעות על העיוור. בלי "הצעה מותאמת" של 14 עמודים. בלי לחתום על שום דבר לפני שיש משהו אמיתי מול העיניים.',
    steps: [
      {
        num: '01',
        title: 'תאר',
        body:
          'בריף קצר. שלושה שדות חובה: סוג הפרויקט, הרעיון, ואיך לחזור אליך. השאר רשות. הכל נוחת אצלי בוואטסאפ - בלי שמירה בשרת, בלי "להירשם לניוזלטר", בלי בולשיט.',
      },
      {
        num: '02',
        title: 'אבנה',
        body:
          'תוך 3–7 ימים יש לך אבטיפוס ביד. לא מוקאפ. לא מצגת. קוד עובד. תפתח, תלחץ, תראה לחבר, ותגיד לי אם זה הכיוון. לא הכיוון? נפרדים כאן. בלי חשבון.',
      },
      {
        num: '03',
        title: 'תחליט',
        body:
          'אהבת? יאללה נדבר על המשך: סקופ ברור, מחיר סגור מראש, אבני דרך שבועיות. בלי הפתעות, בלי חשבונות לפי שעות. אני עובד לפי תוצאות, לא לפי שעון.',
      },
    ],
    pullQuote: {
      quote: 'הסיכון הכי גדול הוא לא הכסף - זה הזמן שמתבזבז על הצעות שאף פעם לא הופכות לקוד.',
      cite: 'בר משה',
    },
  },
  about: {
    number: '03',
    kicker: 'מי אני',
    title: 'בר משה',
    paragraphs: [
      'מפתח מאז 2020. כל פרויקט מביא איתו אתגר אחר - וזה בדיוק מה שמשאיר את העבודה מעניינת. בזכות זה אני עדיין נהנה.',
      'התחלתי לבנות הרבה לפני שזה הפך לפרנסה. אני מחליט מהר כי קוד שעובד קל לתקן, ובריף שלא הפך לקוד - כמעט אי אפשר. בגלל זה אני מתחיל מאבטיפוס: ככה אני יודע מה לבנות, ואתה רואה מה אתה מקבל - לפני שצריך להחליט משהו.',
      'אני בישראל, עובד עם לקוחות בכל העולם - בעברית ובאנגלית. עדיף שתכתוב לי לפני שאתה רץ לכל חברות הפיתוח: אם זה לא מתאים, אגיד לך מראש. כך לא נבזבז זמן לאף אחד.',
    ],
    stats: [
      { value: '5+', label: 'שנים בקוד' },
      { value: '20+', label: 'אבטיפוסים שנבנו' },
      { value: '0', label: 'תשלום מראש' },
    ],
  },
  brief: {
    number: '04',
    kicker: 'תכתוב לי',
    title: 'מה הרעיון שלך?',
    standfirst:
      'הבריף נוחת ישר אצלי בוואטסאפ, מסודר ומוכן לקריאה. כמה שיותר פירוט - אבטיפוס מדויק יותר. גם שלוש שורות זה התחלה מצוינת.',
    requiredHint: 'רק 3 שדות חובה: סוג, רעיון, ואיך לחזור אליך.',
    optionalHeading: 'יש לך עוד? אל תתבייש',
    fields: {
      template: {
        label: 'סוג הפרויקט',
        placeholder: 'התבנית הקרובה ביותר.',
      },
      idea: {
        label: 'הרעיון בקצרה',
        hint: 'משפט אחד או שלושה. ברור עדיף על מנומק.',
        placeholder:
          'לדוגמה: "פלטפורמה שמחברת בין יצרני קרמיקה לחנויות עיצוב - היצרן מעלה קטלוג, החנות מזמינה ישירות, הוא משלם עמלה רק על מכירה."',
      },
      audience: {
        label: 'מי ישתמש בזה',
        placeholder: 'לדוגמה: בעלי חנויות עיצוב בגיל 30–50, יצרני קרמיקה עצמאיים',
      },
      problem: {
        label: 'איזו בעיה זה פותר',
        placeholder: 'הם מבזבזים שעות על תיאום בוואטסאפ ובאקסל…',
      },
      whyNow: {
        label: 'למה דווקא עכשיו',
        hint: 'מה השתנה לאחרונה? עוזר לי להבין כמה זה דחוף ולמה זה קורה דווקא עכשיו.',
        placeholder: 'לדוגמה: "סגרנו סבב גיוס", "המתחרה השיק משהו דומה", או "התעייפתי לחכות".',
      },
      references: {
        label: 'יש משהו דומה שאהבת?',
        placeholder: 'קישורים, צילומי מסך, או "כמו X אבל בלי Y"',
      },
      timeline: { label: 'מתי דרוש' },
      howHeard: {
        label: 'איך הגעת אליי',
        placeholder: 'GitHub, חבר שסיפר, פורטפוליו, חיפוש - מה שזכור',
      },
      name: { label: 'שם', placeholder: 'שם או כינוי' },
      contactMethod: {
        label: 'דרך מועדפת ליצירת קשר',
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
    timelines: [
      { id: 'asap', label: 'כמה שיותר מהר' },
      { id: '1mo', label: 'בחודש הקרוב' },
      { id: '3mo', label: 'תוך 2–3 חודשים' },
      { id: 'open', label: 'גמיש' },
    ],
    submit: 'תשלח את זה',
    submitHint:
      'ייפתח וואטסאפ עם ההודעה מסודרת. תעבור, תוסיף או תשנה אם בא לך, ותשלח. שום מידע לא נשמר באתר.',
    marginalNote:
      'אין חובה למלא הכל. שלושה שדות מספיקים בשביל להתחיל. עברית? יופי. אנגלית? גם בסדר גמור. קישור או צילום? תוסיף בוואטסאפ אחרי השליחה.',
    mailFallback: 'יותר נוח במייל? פה.',
    mailSubject: 'בריף חדש מהאתר',
    liveSuccess: 'נפתח וואטסאפ עם הבריף המסודר.',
    liveError: 'יש שדות חסרים. הסימונים האדומים מראים בדיוק איפה.',
    briefHeading: 'היי בר,',
    briefFooter: '- נשלח מהבריף באתר',
    briefSections: {
      type: '*סוג הפרויקט*',
      idea: '*הרעיון*',
      whyNow: '*למה דווקא עכשיו*',
      audience: '*המשתמש*',
      problem: '*הבעיה שזה פותר*',
      references: '*השראה / דוגמאות*',
      timeline: '*לוח זמנים*',
      howHeard: '*איך הגיע אליי*',
    },
    quest: {
      chapters: {
        spark: 'הניצוץ',
        you: 'מי אתה',
        detail: 'פרטים',
        when: 'מתי',
        send: 'שליחה',
      },
      nav: {
        next: 'הבא',
        back: 'חזרה',
        skip: 'דלג',
        edit: 'עריכה',
        send: 'שלח את זה',
        sendAgain: 'פתח שוב את וואטסאפ',
      },
      counter: 'שאלה {step} מתוך {total}',
      liveStep: 'שאלה {step} מתוך {total}, פרק {chapter}',
      liveCommitted: 'תשובה נשמרה.',
      liveBriefLabel: 'הבריף שלך, נבנה בזמן אמת',
      letterIntro: 'הבריף עד עכשיו',
      letterEmpty: 'עוד ריק. נתחיל מהשאלה הראשונה.',
      reviewTitle: 'הבריף מוכן',
      reviewIntro: 'זה מה שייפתח אצלך בוואטסאפ. אפשר עוד לערוך כל סעיף בלחיצה.',
      sentTitle: 'נשלח. תודה.',
      sentBody: 'נפתח חלון וואטסאפ עם הבריף המסודר. אפשר עוד להוסיף קישורים או צילומים לפני שמשלחים.',
      tapToEdit: 'עריכה',
      keyboardHint: 'Enter להמשך · Esc לחזרה · Alt+S לדילוג',
      prompts: {
        template: 'נתחיל קל - איזה סוג פרויקט יש לך בראש?',
        idea: 'אז מה הרעיון? משפט-שניים מספיק. נחדד יחד.',
        name: 'איך לקרוא לך?',
        contact: 'איך הכי נוח לחזור אליך?',
        whyNow: 'למה דווקא עכשיו? מה השתנה לאחרונה?',
        audience: 'מי הולך להשתמש בזה?',
        problem: 'איזו בעיה זה פותר? מה כואב היום בלי זה?',
        references: 'יש משהו דומה שאהבת? קישור, צילום, "כמו X אבל בלי Y".',
        timeline: 'מתי אתה צריך את זה?',
        howHeard: 'איך הגעת אליי? סתם סקרנות.',
        review: 'זה הבריף. אישור אחרון, ואז זה נופל אצלי בוואטסאפ.',
      },
      byTemplate: {
        mvp: {
          idea: {
            prompt: 'איזו גרסה ראשונה אתה רוצה לבנות? מה החלק הקטן ביותר שכבר מספיק כדי לבדוק את ההנחה?',
            hint: 'משפט אחד מספיק. נחדד יחד.',
            placeholder:
              'פלטפורמה שמעצבים פרילנסרים מציגים בה פרויקטים קטנים, לקוחות מזמינים פגישת 30 דקות, התשלום בנאמנות עד מסירה.',
          },
          whyNow: {
            prompt: 'למה דווקא עכשיו? סבב גיוס, תאריך לוח שנה, או נמאס לחכות?',
            placeholder: 'אנחנו מציגים ל-YC בעוד 5 שבועות ורוצים דמו אמיתי, לא מצגת.',
          },
          audience: {
            prompt: 'מי המשתמש הראשון - האדם שאם הוא יאהב, תדע שיש כיוון?',
            placeholder: 'מעצבי פרודקט בני 25-40 שעובדים בערבים כפרילנסרים.',
          },
          problem: {
            prompt: 'מה כואב היום בלי הגרסה הראשונה הזו?',
            placeholder: 'מעצבים רודפים אחרי שינויי סקופ בוואטסאפ ומקבלים תשלום באיחור.',
          },
          references: {
            prompt: 'ראית משהו שקרוב לזה? קישור, צילום, "כמו X אבל בלי Y".',
            placeholder: 'כמו Toptal אבל ליוצרים סולו, בלי עמלת סוכנות.',
          },
          timeline: { prompt: 'מתי אתה צריך אבטיפוס עובד ביד?' },
          howHeard: { prompt: 'איך הגעת אליי? סקרנות.' },
          review: { prompt: 'זה הבריף של הגרסה הראשונה. אישור אחרון לפני שזה נופל בוואטסאפ?' },
        },
        brand: {
          idea: {
            prompt: 'איזה מותג אנחנו בונים? מה האתר צריך לגרום למבקר להרגיש בשלוש השניות הראשונות?',
            hint: 'אם לאתר היה ז\'אנר מוזיקלי - מה הוא היה?',
            placeholder:
              'סטודיו לקרמיקה לאספנים - שקט, איטי, כמו חדר במוזיאון שמצאת במקרה.',
          },
          whyNow: {
            prompt: 'למה אתר חדש דווקא עכשיו? השקה, ריבריידינג, או פשוט נמאס מהקיים?',
            placeholder: 'אנחנו מציגים בפריז באוקטובר והאתר הנוכחי הוא רק תמונות סטוק.',
          },
          audience: {
            prompt: 'מי נוחת באתר? אספנים, גלריסטים, סקרנים מאינסטגרם?',
            placeholder: 'אספנים שעוקבים אחרינו באינסטגרם ורוצים לראות את העבודות בגדול.',
          },
          problem: {
            prompt: 'מה האתר הנוכחי עולה לך?',
            placeholder: 'אנשים שולחים מייל עם אותן שלוש שאלות כי שום דבר באתר לא ניתן למצוא.',
          },
          references: {
            prompt: 'אתרים ששמרת? לוחות פינטרסט, קישורים, "מרגיש כמו X".',
            placeholder: 'studio.bruno-mars, kvadrat.dk - אותה רמת איפוק.',
          },
          timeline: { prompt: 'מתי אתה רוצה להיות באתר החדש?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'זה הבריף של המותג. פותחים וואטסאפ?' },
        },
        ecommerce: {
          idea: {
            prompt: 'מה אתה מוכר ולמי? מה הופך את החנות הזו ליותר מקטלוג?',
            hint: 'פסקה קצרה על קו המוצר מספיקה.',
            placeholder:
              'ספלי קרמיקה בעבודת יד, 4 דגמים, 30 ליחידה. הקונה צריך להרגיש שהוא קונה מהיוצר, לא ממותג חסר פנים.',
          },
          whyNow: {
            prompt: 'למה לפתוח או לבנות מחדש עכשיו? קו מוצר חדש, חנות קיימת שתקועה, עונת שיא?',
            placeholder: 'Black Friday בעוד 8 שבועות ואנחנו עדיין על Etsy.',
          },
          audience: {
            prompt: 'מי הקונה? מאיפה הוא מגיע אליך?',
            placeholder: 'גילאי 30-50, מודעים לעיצוב, רובם מאינסטגרם ובהמלצות חברים.',
          },
          problem: {
            prompt: 'מה שבור בהגדרה הנוכחית?',
            placeholder: 'עמלות Etsy אוכלות 12% ואין לנו מושג מי הלקוחות שלנו.',
          },
          references: {
            prompt: 'חנויות אחרות שאתה אוהב? אפילו פיצ\'רים שהיית גונב.',
            placeholder: 'Flow של Goodfair, דפי המוצר של Smol.',
          },
          timeline: { prompt: 'מתי החנות צריכה להיות חיה?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'זה הבריף של החנות. לשלוח?' },
        },
        'ai-agent': {
          idea: {
            prompt: 'איזה אסיסטנט או סוכן AI? איזו פעולה אנושית הוא מבטל?',
            hint: 'תתאר אותו כאילו אתה מסביר לעובד חדש ביום הראשון.',
            placeholder:
              'סוכן שקורא מיילי מכירות נכנסים, מתייג לפי כוונה (דמו / תמחור / ספאם) וכותב טיוטת תשובה ראשונה בקול שלנו.',
          },
          whyNow: {
            prompt: 'מה השתנה - ב-AI או בעסק - שגורם לזה להיות עכשיו?',
            placeholder: 'ה-SDR שלנו עזב ונדרש שהאינבוקס ימשיך לזוז.',
          },
          audience: {
            prompt: 'מי משתמש בסוכן? עובד פנימי, לקוח קצה, מנהל?',
            placeholder: 'שני אנשי sales ops שעוברים על 200 מיילים ביום כל אחד.',
          },
          problem: {
            prompt: 'מה העלות של הגרסה הידנית היום?',
            placeholder: 'בערך 6 שעות ביום על פני הצוות, עם פיגור של 12 שעות בתשובות.',
          },
          references: {
            prompt: 'מוצרי AI שניסית שכמעט קלעו?',
            placeholder: 'ה-AI של Linear לטיוטת issues - אותה רמת איפוק.',
          },
          timeline: { prompt: 'מתי הסוכן צריך לרוץ?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'זה הבריף של הסוכן. מוכן לשליחה?' },
        },
        'ai-video': {
          idea: {
            prompt: 'איזה תוכן וידאו אתה רוצה שייוצר אוטומטית? איך הוא מתחיל ומה יוצא בסוף?',
            hint: 'מקור → טרנספורם → פלט. שורה לכל אחד.',
            placeholder:
              'כותרת חדשות יומית → סרטון אנכי של 30 שניות עם הקראה סינתטית + b-roll, מתפרסם בטיקטוק ב-8 בבוקר.',
          },
          whyNow: {
            prompt: 'למה לאוטומט עכשיו - מכסת תוכן, צוות חסר, פלטפורמה חדשה?',
            placeholder: 'הבטחנו 5 שורטים בשבוע לספונסר והעורך שלנו מצליח רק שניים.',
          },
          audience: {
            prompt: 'מי צופה בפלט? גודל קהל, פלטפורמה, אורך קשב?',
            placeholder: 'TikTok / Reels, גילאי 16-30, 30 שניות מקסימום.',
          },
          problem: {
            prompt: 'מה העלות של ייצור ידני היום?',
            placeholder: 'עורך אחד, 4 שעות לסרטון, 7 בשבוע = משרה מלאה.',
          },
          references: {
            prompt: 'מערכות אוטו-וידאו או סגנונות שאתה אוהב?',
            placeholder: 'כמו Opus Clip אבל לסקריפטים מקוריים, לא רק לעיבוד מחדש.',
          },
          timeline: { prompt: 'מתי הצנרת צריכה לייצר?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'זה הבריף לצנרת הוידאו. לשלוח?' },
        },
        audio: {
          idea: {
            prompt: 'איזו חוויה מוזיקלית או מנוע אודיו? איך זה צריך להרגיש לאוזן?',
            hint: 'אם היה לזה מבחן עיניים-עצומות - מה המשתמש שומע?',
            placeholder:
              'פס-קול אינטראקטיבי לאתר גלריה - אקורדים משתנים תוך כדי גלילה בין סקציות.',
          },
          whyNow: {
            prompt: 'למה עכשיו - תערוכה, השקה, רעיון לכלי נגינה חדש?',
            placeholder: 'ערב פתיחה במרץ והפס-קול הוא כל ההצגה.',
          },
          audience: {
            prompt: 'מי שומע את זה? מבקרים של איזה אתר או אפליקציה?',
            placeholder: 'מבקרים של אתר גלריית אמנות, רובם דסקטופ, אוזניות עליהם.',
          },
          problem: {
            prompt: 'מה המבקר מקבל מהצליל שאי אפשר לקבל מהוויזואל?',
            placeholder: 'תחושת חדר, של נוכחות איפשהו במקום לחיצה בין דפים.',
          },
          references: {
            prompt: 'אתרים, אפליקציות, פלאגינים או כלים מוזיקליים שאתה אוהב? קישור, סקרינשוט, או "כמו X אבל בלי Y".',
            placeholder: 'קישור לאתר, פלאגין או דמו - והתחושה שאתה רוצה להעביר.',
          },
          timeline: { prompt: 'מתי זה צריך להיות חי?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'זה הבריף האודיו. לשלוח לבר?' },
        },
        game: {
          idea: {
            prompt: 'איזה משחק או חוויה אינטראקטיבית? מה המכניקה הראשית במשפט?',
            hint: 'אם זה היה ארון משחקים בלונה פארק - מה היה כתוב על המדבקה?',
            placeholder:
              'משחק דפדפן ללחיצה על עגבניות - שחקנים מצילים עגבנייה נופלת בלחיצה לפני שהיא פוגעת ברצפה, טבלת שיאים בסוף.',
          },
          whyNow: {
            prompt: 'למה עכשיו - השקת קמפיין, הפעלת מותג, פרויקט-צד?',
            placeholder:
              'אנחנו ספונסרים של פסטיבל אוכל בעוד 6 שבועות ורוצים מיני-משחק שאפשר לחלוק על האתר של המותג.',
          },
          audience: {
            prompt: 'מי השחקן? באיזה הקשר - סטוריז, דפדפן בעבודה, סלולרי בתור?',
            placeholder: 'גילאי 16-35 בסלולרי, מגיעים מסטוריז אינסטגרם.',
          },
          problem: {
            prompt: 'למה משחק ולא וידאו או הגרלה?',
            placeholder: 'אנחנו רוצים זמן באתר ורגע שאפשר לשתף, לא צפייה פסיבית.',
          },
          references: {
            prompt: 'משחקי דפדפן או חוויות אינטראקטיביות שתפסו אותך?',
            placeholder: 'כמו Patatap - אותה רמת ליטוש.',
          },
          timeline: { prompt: 'מתי המשחק צריך להיות אפשר-לשחק?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'הבריף של המשחק מוכן. לוחצים שלח?' },
        },
        realtime: {
          idea: {
            prompt: 'איזה דשבורד או מערכת בזמן אמת? אילו נתונים זורמים פנימה וכל כמה זמן?',
            hint: 'מקור → דשבורד → מי פועל לפי זה.',
            placeholder:
              'דשבורד חי של תחנות ליקוט במחסן: תחנות, הזמנות נוכחיות, ליקוטים, התרעות כשתחנה רגועה יותר מ-5 דקות.',
          },
          whyNow: {
            prompt: 'למה לעבור מאקסל / Looker / משהו ביתי דווקא עכשיו?',
            placeholder:
              'ה-COO שלנו עושה התרעות ידני בסלאק והכפלנו עכשיו את נפח ההזמנות.',
          },
          audience: {
            prompt: 'מי צופה בדשבורד? מנהל תפעול על מסך, צוות בשטח על סלולרי?',
            placeholder: 'מנהל רצפה על מסך גדול, ועוד 6 מפקחים שמסתכלים בסלולרי.',
          },
          problem: {
            prompt: 'מה משתבש היום כי הנתונים לא בזמן אמת?',
            placeholder: 'אנחנו מבחינים בתחנות רגועות באיחור של 30 דקות ומפספסים SLA.',
          },
          references: {
            prompt: 'דשבורדים או מערכות חיות שראית עושים נכון?',
            placeholder: 'סטטוס פרויקט של Linear, תצוגת deploy של Vercel.',
          },
          timeline: { prompt: 'מתי הדשבורד צריך להיות פעיל?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'הבריף של הדשבורד מוכן. לשלוח?' },
        },
        mobile: {
          idea: {
            prompt: 'איזו אפליקציית מובייל? מה הפעולה היומיומית הראשית בה?',
            hint: 'דמיין משתמש פותח את האפליקציה בתחנת אוטובוס - מה הוא עושה?',
            placeholder:
              'אפליקציית מובייל לחובבי ציפורים: לוג של תצפית ב-3 הקשות, ראייה של מה נצפה בסביבה היום.',
          },
          whyNow: {
            prompt: 'למה מובייל עכשיו ולא רק תצוגת web במובייל?',
            placeholder: 'אנחנו צריכים מצלמה + GPS + אופליין, וגם Apple Watch בעוד שנה.',
          },
          audience: {
            prompt: 'מי מתקין את האפליקציה? לקוחות נאמנים, צוות פנימי, או הציבור?',
            placeholder: 'חובבי ציפורים בני 35+, שמשתמשים היום ב-eBird ורוצים משהו פחות קליני.',
          },
          problem: {
            prompt: 'מה הם לא יכולים לעשות היום בגרסת ה-web?',
            placeholder: 'ללכוד תצפית בשדה בלי סיגנל, עם GPS שמתויג אוטומטית.',
          },
          references: {
            prompt: 'אפליקציות שתפנה אליהן בתור נורת צפון?',
            placeholder: 'Strava לפיד החברתי, Merlin Bird ID לזרימת הלכידה.',
          },
          timeline: { prompt: 'מתי האפליקציה צריכה להישלח לחנויות?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'הבריף של האפליקציה מוכן. לשלוח?' },
        },
        other: {
          idea: {
            prompt: 'תאר את הרעיון. מה הוא - ולמה הוא צריך להיות קיים?',
            hint: 'מוזר זה בברכה. הקצוות המוזרות עושות את הפרויקטים הכי טובים.',
            placeholder:
              'יומן מעקב שינה שמדרג חלומות לפי לוסידיות, נתפר כל בוקר מהקלטות קוליות שמלמלת ב-4 לפנות בוקר.',
          },
          whyNow: {
            prompt: 'למה זה צריך להיבנות עכשיו? או למה אף אחד עוד לא בנה את זה?',
            placeholder: 'תמלול קולי סוף סוף מספיק טוב למלמולים של חצי-ער.',
          },
          audience: {
            prompt: 'למי זה? אפילו נישה של 50 איש זה בסדר - החדים יוצאים לאוויר.',
            placeholder: 'מתרגלי חלימה צלולה וביבליופילים שמנהלים יומני חלומות.',
          },
          problem: {
            prompt: 'איזו בעיה או סקרנות זה מגרד?',
            placeholder: 'אני שוכח את החלומות שלי בשתי דקות והאפליקציות הקיימות קליניות מדי.',
          },
          references: {
            prompt: 'משהו ביקום שדומה ברוח?',
            placeholder: 'כמו Day One אבל לחלומות. או כמו Daylio מצולב עם מולסקין מהודר.',
          },
          timeline: { prompt: 'מתי תרצה גרסה ראשונה?' },
          howHeard: { prompt: 'איך הגעת אליי?' },
          review: { prompt: 'הבריף המוזר מוכן. לשלוח לבר?' },
        },
      },
    },
  },
  qa: {
    number: '05',
    kicker: 'שאלות ותשובות',
    title: 'מה שואלים אותי לפני שפונים',
    items: [
      {
        q: 'באמת בלי תשלום על האבטיפוס?',
        a:
          'באמת. אני משקיע 3–7 ימים כי זו הדרך הכי טובה שמצאתי להוכיח שאני יכול לבנות את מה שצריך - לפני שמשלמים. לא ממשיכים? הסיכון שלי. ממשיכים? שני הצדדים יודעים בדיוק על מה חתמו.',
      },
      {
        q: 'מה אם הכיוון עדיין לא לגמרי ברור?',
        a:
          'מעולה - זה רוב המקרים. אם ראית מוצר שמרגיז אותך, או יש בעיה יומיומית שכואבת - תכתוב שני משפטים, ואני אבנה את הניחוש הראשון שלי. ברגע שיש משהו לראות, הרבה יותר קל להגיד "כן, אבל…" - וזה בדיוק מה שאני מחפש.',
      },
      {
        q: 'אז איך בעצם משלמים אחרי האבטיפוס?',
        a:
          'אני לא עובד לפי שעות. כל פרויקט מקבל סקופ ברור ומחיר סגור מראש - לפי תוצאות. פרויקטים קטנים יוצאים במחיר חבילה. גדולים מתפצלים לאבני דרך, עם תשלום אחרי כל מסירה. אין ריטיינר חודשי, אין חוזה ארוך. נגמרה העבודה - נגמר התשלום.',
      },
    ],
  },
  colophon: {
    number: '06',
    kicker: 'קולופון',
    title: 'יפה. הגעת עד לכאן.',
    pullQuote:
      'אז שווה לתאר את הרעיון במשפט אחד - ולראות מה יוצא מזה.',
    ctaPrimary: 'בוא נתחיל',
    ctaWhatsapp: 'תכתוב לי בוואטסאפ',
    ctaMail: 'או מייל',
    credit: 'נכתב, עוצב וקודד על־ידי בר משה · 2025/26',
    portfolioLink: 'הפורטפוליו המלא',
  },
  runningFoot: {
    backToTop: '↑ למעלה',
    whatsapp: 'וואטסאפ',
    mail: 'מייל',
    issueLabel: 'גליון 01',
  },
  board: {
    status: {
      todo: 'לעשות',
      doing: 'בעבודה',
      done: 'בוצע',
      selected: 'נבחר',
      open: 'פתוח',
      closed: 'סגור',
      building: 'בונה',
    },
    columns: {
      backlog: 'מוכן להתחיל',
      process: 'איך זה עובד',
      about: 'מי אני',
      intake: 'פתח כרטיס',
      faq: 'שאלות',
      ship: 'מוכן לשלוח',
    },
    brief: 'התקציר שלך עד כה',
    progress: '{n}/{total} פרקים',
    ringHold: 'החזק כדי לשלוח',
  },
};

const EN: Dict = {
  meta: {
    title: 'Bar Moshe - Describe. I Build. You Decide.',
    description:
      'I build a working prototype on my own dime before we talk price. If it works for you - we keep going. If not - we part ways, no strings attached.',
  },
  masthead: {
    issueNumber: 'Issue 01',
    issueDate: '2025 / 26',
    skip: 'Skip to content',
    brandName: 'Bar Moshe',
    brandTagline: 'Builds first, talks later',
    portfolioLink: 'Portfolio',
    briefLink: 'The brief',
    a11yTitle: 'Accessibility settings',
    a11yLabel: 'Open accessibility settings',
    langGroupLabel: 'Language',
    langEnLabel: 'English',
    langHeLabel: 'עברית',
    langSwitchedTo: 'Language switched to English',
  },
  cover: {
    issueLine: 'Issue 01 · Build before brief',
    headlineLines: ['Describe.', 'I build.', 'You decide.'],
    standfirst:
      'Instead of a brief that drags on for weeks and a proposal you have to wonder about - describe the idea in the form, and I build a first prototype on my own dime. If it works for you, we keep building together. If not, we part ways, no strings attached.',
    byline: 'Bar Moshe · Independent builds · since 2020',
    scrollHint: 'Keep reading',
    ctaStart: 'Start a build',
    ctaBrowse: 'See what I build',
  },
  contents: {
    number: '01',
    kicker: 'Contents',
    title: 'Where to start',
    standfirst:
      'These are the kinds of projects I build most. Picking one here opens the brief with the right field already filled in. Not there? There’s "other".',
    items: [
      {
        slug: 'mvp',
        title: 'Startup first version',
        summary:
          'From idea to working code in a week. A first version solid enough to show users, raise on, or decide it’s not the direction.',
        fits: ['Solo founder', 'Early-stage startup', 'Small team'],
      },
      {
        slug: 'brand',
        title: 'Brand site with character',
        summary:
          'Not a template. Animations, a palette of your own, interactions that make people remember you. Like this site - only yours.',
        fits: ['New brand', 'Freelancer with identity', 'Studio'],
      },
      {
        slug: 'ecommerce',
        title: 'Custom online store',
        summary:
          'A store redesigned from scratch on an existing platform, a private checkout system, or a full boutique store from code. Right for a brand with identity - not a generic catalogue.',
        fits: ['Small brand', 'Independent maker', 'Boutique shop'],
      },
      {
        slug: 'ai-agent',
        title: 'Private AI assistant / agent',
        summary:
          'A chatbot for customers, a system that answers questions from your own documents, or an autonomous agent that triages email and does the work. Cloud-hosted or open model - whatever fits your data and budget.',
        fits: ['Company', 'Ops / support team', 'AI founder'],
      },
      {
        slug: 'ai-video',
        title: 'AI video render pipeline',
        summary:
          'A system that turns text → scenes → rendered video automatically. Right for explainer videos at scale, an illustrated podcast, or daily content for socials.',
        fits: ['Content creator', 'Marketing agency', 'Brand with a series / podcast'],
      },
      {
        slug: 'audio',
        title: 'Anything around sound and music',
        summary:
          'Studio plugins, production tools, live-performance rigs, synthesis, multi-channel mixers, real-time effects. I play and produce music too - so I know how it has to feel on the other side of the screen.',
        fits: ['Musician', 'Producer', 'Music brand', 'Audio startup'],
      },
      {
        slug: 'game',
        title: 'Browser game / interactive experience',
        summary:
          'A mini-game for a campaign, a viral piece for stories, or a prototype for a game you’re building yourself.',
        fits: ['Brand with a campaign', 'Indie game dev', 'Creative agency'],
      },
      {
        slug: 'realtime',
        title: 'Dashboard / real-time system',
        summary:
          'Admin panel with permissions, live BI, a real-time monitoring system. Charts, filters, data export. Everything your team is doing in Excel right now.',
        fits: ['Company', 'Scaling startup', 'Data / ops team'],
      },
      {
        slug: 'mobile',
        title: 'Mobile app',
        summary:
          'iOS + Android from one codebase. Push, offline, store, auth. Same team (me), two platforms.',
        fits: ['Startup', 'B2C product', 'Business with loyal customers'],
      },
      {
        slug: 'other',
        title: 'Something else entirely',
        summary:
          'Got a weird idea in a space I haven’t seen? Perfect - the best things I’ve worked on started that way. Write it in the brief.',
        fits: ['Anyone'],
      },
    ],
    pickedLabel: 'Picked',
  },
  method: {
    number: '02',
    kicker: 'The method',
    title: 'How we build together',
    standfirst:
      'Three steps with no opening proposals. No 14-page "tailored quote". No signing anything before you see something working.',
    steps: [
      {
        num: '01',
        title: 'Describe',
        body:
          'You fill in a short brief. Three required fields: project type, the idea, and a way to reach you. Everything else is optional. The brief lands directly in my WhatsApp as a tidy message - no server storage, no "subscribe to the newsletter", no nonsense.',
      },
      {
        num: '02',
        title: 'I build',
        body:
          'Within 3–7 days I build a first prototype on my own dime. Not a mockup. Not a slide deck. Working code you can open, click, send to a friend, and ask if this is what you imagined. If not, we part ways here. No invoice.',
      },
      {
        num: '03',
        title: 'You decide',
        body:
          'If it works for you, we talk about going further: clear scope, price known up front, weekly milestones, clean handoff. I don’t work by the hour - I work by the outcome.',
      },
    ],
    pullQuote: {
      quote:
        'The biggest risk for the client isn’t the money - it’s the time wasted on a proposal that never ships.',
      cite: 'Bar Moshe',
    },
  },
  about: {
    number: '03',
    kicker: 'Who I am',
    title: 'Bar Moshe',
    paragraphs: [
      'Developer since 2020. Every project brings a different challenge - which is exactly what keeps the work interesting. That’s why I’m still here.',
      'I build because it was the hobby before it was the job. I decide quickly because it’s much easier to fix code that sort of works than a brief that never became code. That’s why I work prototype-first: I learn what to build, and you see what you’re getting.',
      'Based in Israel, working with clients around the world in Hebrew and English. Write before you check the big software shops - if it isn’t a fit, I’ll tell you.',
    ],
    stats: [
      { value: '5+', label: 'years building' },
      { value: '20+', label: 'prototypes shipped' },
      { value: '0', label: 'upfront payment' },
    ],
  },
  brief: {
    number: '04',
    kicker: 'The brief',
    title: 'What do you want to build',
    standfirst:
      'This brief goes straight to my WhatsApp as a tidy message. The more detail you give, the sharper the first prototype. Three lines is enough to start.',
    requiredHint: 'Only 3 required fields: type, idea, and a way to reach you.',
    optionalHeading: 'More detail - optional',
    fields: {
      template: {
        label: 'Project type',
        placeholder: 'Pick the closest template - you can always change it later',
      },
      idea: {
        label: 'The idea in short',
        hint: 'One sentence or three. Clear beats clever.',
        placeholder:
          'For example: "A platform that connects ceramic makers with design shops - the maker uploads a catalogue, the shop orders directly, and they pay a fee only on a sale."',
      },
      audience: {
        label: 'Who will use it',
        placeholder: 'For example: design-shop owners aged 30–50, independent ceramic makers',
      },
      problem: {
        label: 'What problem it solves',
        placeholder: 'They waste hours coordinating over WhatsApp and Excel…',
      },
      whyNow: {
        label: 'Why now',
        hint: 'What changed that brought you here today? This helps me read urgency and context.',
        placeholder:
          'For example: "we closed a funding round", "a competitor shipped something similar", or "I got tired of waiting".',
      },
      references: {
        label: 'Anything similar you liked',
        placeholder: 'Links, screenshots, or "like X but without Y"',
      },
      timeline: { label: 'When you need it' },
      howHeard: {
        label: 'How you found me',
        placeholder: 'GitHub, a friend, portfolio, search - whatever you remember',
      },
      name: { label: 'Name', placeholder: 'What should I call you' },
      contactMethod: {
        label: 'Preferred way to reach you',
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
    timelines: [
      { id: 'asap', label: 'As soon as possible' },
      { id: '1mo', label: 'Within the next month' },
      { id: '3mo', label: 'Within 2–3 months' },
      { id: 'open', label: 'Flexible' },
    ],
    submit: 'Send the brief to Bar',
    submitHint:
      'WhatsApp will open with the message ready to go. You can still edit before sending. Nothing is stored on the site.',
    marginalNote:
      'You don’t have to fill everything. Three fields is enough to start. Writing in English? Great. Hebrew? Also fine. Want to attach a link or screenshot? Send it on WhatsApp once the brief is on its way.',
    mailFallback: 'Prefer email? Click here',
    mailSubject: 'New brief from the site',
    liveSuccess: 'WhatsApp opened with the tidy brief.',
    liveError: 'Some fields are missing. Check the red markers.',
    briefHeading: 'Hi Bar,',
    briefFooter: '- sent from the site brief',
    briefSections: {
      type: '*Project type*',
      idea: '*The idea*',
      whyNow: '*Why now*',
      audience: '*The user*',
      problem: '*The problem it solves*',
      references: '*Inspiration / examples*',
      timeline: '*Timeline*',
      howHeard: '*How they found me*',
    },
    quest: {
      chapters: {
        spark: 'The spark',
        you: 'You',
        detail: 'Detail',
        when: 'When',
        send: 'Send',
      },
      nav: {
        next: 'Next',
        back: 'Back',
        skip: 'Skip',
        edit: 'Edit',
        send: 'Send the brief',
        sendAgain: 'Open WhatsApp again',
      },
      counter: 'Question {step} of {total}',
      liveStep: 'Question {step} of {total}, chapter {chapter}',
      liveCommitted: 'Answer saved.',
      liveBriefLabel: 'Your brief, assembled in real time',
      letterIntro: 'The brief so far',
      letterEmpty: 'Empty for now. The first question is on the other side.',
      reviewTitle: 'Your brief is ready',
      reviewIntro: 'This is exactly what will open in WhatsApp. Tap any line to edit it.',
      sentTitle: 'Sent. Thanks.',
      sentBody: 'WhatsApp opened with the tidy brief. You can still add links or screenshots before you hit send.',
      tapToEdit: 'Edit',
      keyboardHint: 'Enter to continue · Esc for back · Alt+S to skip',
      prompts: {
        template: 'Easy one to start - what kind of project do you have in mind?',
        idea: 'Tell me about the idea. One sentence or three.',
        name: 'What should I call you?',
        contact: 'Best way to reach you?',
        whyNow: 'Why now? What changed recently?',
        audience: 'Who will use it?',
        problem: 'What problem does it solve? What hurts today without it?',
        references: 'Anything similar you liked? A link, a screenshot, "like X but without Y".',
        timeline: 'When do you need it?',
        howHeard: 'How did you find me? Just curious.',
        review: 'This is the brief. Last look before it drops straight into my WhatsApp.',
      },
      byTemplate: {
        mvp: {
          idea: {
            prompt: 'What first version do you want to build? What’s the smallest slice that already tests the bet?',
            hint: 'One sentence is plenty. We’ll sharpen it together.',
            placeholder:
              'A platform where solo designers list 1-off projects, clients book a 30-min slot, payment held in escrow until delivery.',
          },
          whyNow: {
            prompt: 'Why now? A funding round, a calendar date, or tired of waiting?',
            placeholder: 'We pitch to YC interviewers in 5 weeks and want a real demo, not slides.',
          },
          audience: {
            prompt: 'Who’s the first user - the one whose love means the direction is real?',
            placeholder: 'Solo product designers, 25–40, freelancing evenings.',
          },
          problem: {
            prompt: 'What hurts today without this first version?',
            placeholder: 'Designers chase scope changes on WhatsApp and get paid late.',
          },
          references: {
            prompt: 'Anything you’ve seen that’s close? A link, a screenshot, "like X but without Y".',
            placeholder: 'Like Toptal but solo-creator, no agency markup.',
          },
          timeline: { prompt: 'When do you need a working prototype in hand?' },
          howHeard: { prompt: 'How did you find me? Curious.' },
          review: { prompt: 'This is the first-version brief. Last check before it lands in WhatsApp?' },
        },
        brand: {
          idea: {
            prompt: 'What brand are we building? What should it make visitors feel in the first three seconds?',
            hint: 'If the site had a music genre, what would it be?',
            placeholder:
              'A ceramics studio for collectors - quiet, slow, like a museum room you stumble into.',
          },
          whyNow: {
            prompt: 'Why a new site now? Launch, rebrand, finally tired of Squarespace?',
            placeholder: 'We show in Paris in October and the current site is a wall of stock photos.',
          },
          audience: {
            prompt: 'Who lands here? Collectors, gallerists, curious-from-Instagram?',
            placeholder: 'Collectors who already follow us on Instagram and want to see the work bigger.',
          },
          problem: {
            prompt: 'What is the current site costing you?',
            placeholder: 'People email asking the same three questions because nothing is findable.',
          },
          references: {
            prompt: 'Sites you’ve saved? Pinterest boards, links, "feels like X".',
            placeholder: 'studio.bruno-mars, kvadrat.dk - that level of restraint.',
          },
          timeline: { prompt: 'When do you want to be on the new site?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'This is the brand brief. Open WhatsApp?' },
        },
        ecommerce: {
          idea: {
            prompt: 'What are you selling and to whom? What makes the store more than a catalogue?',
            hint: 'A short paragraph on the product line is enough.',
            placeholder:
              'Hand-thrown ceramic mugs, 4 styles, 30 per unit. Shoppers should feel they’re buying from the maker, not a faceless brand.',
          },
          whyNow: {
            prompt: 'Why open or rebuild now? New product line, an existing store that\'s stuck, peak season?',
            placeholder: 'Black Friday is 8 weeks out and we’re still on Etsy.',
          },
          audience: {
            prompt: 'Who buys? Where do they come from before they land on you?',
            placeholder: 'Design-curious, 30–50, mostly from Instagram and word of mouth.',
          },
          problem: {
            prompt: 'What’s broken about the current setup?',
            placeholder: 'Etsy fees eat 12% and we have no idea who our customers are.',
          },
          references: {
            prompt: 'Other stores you admire? Even features you’d steal.',
            placeholder: 'Goodfair’s checkout flow, Smol’s product pages.',
          },
          timeline: { prompt: 'When does the store need to be live?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'This is the store brief. Send it?' },
        },
        'ai-agent': {
          idea: {
            prompt: 'What kind of AI assistant or agent? Which human action does it erase?',
            hint: 'Pretend you’re describing it to a new hire on day one.',
            placeholder:
              'An agent that reads incoming sales emails, tags them by intent (demo / pricing / spam), and drafts a first reply in our voice.',
          },
          whyNow: {
            prompt: 'What changed - in AI or in the business - that makes this now?',
            placeholder: 'Our SDR just left and the inbox needs to keep moving.',
          },
          audience: {
            prompt: 'Who uses this assistant? Internal staff, end customer, manager?',
            placeholder: 'Two sales-ops people who currently triage 200 emails a day each.',
          },
          problem: {
            prompt: 'What does the manual version cost today?',
            placeholder: 'About 6 hours/day across the team, with a 12-hour reply lag.',
          },
          references: {
            prompt: 'Any AI products you’ve tried that almost got it right?',
            placeholder: 'Linear’s AI for drafting issues - that kind of restraint.',
          },
          timeline: { prompt: 'When does the agent need to be running?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'This is the agent brief. Ready to send?' },
        },
        'ai-video': {
          idea: {
            prompt: 'What video content do you want produced automatically? How does it start and what comes out?',
            hint: 'Source → transform → output. One line each.',
            placeholder:
              'Daily news headline → 30-second vertical with synthetic VO + b-roll, posted to TikTok at 8am.',
          },
          whyNow: {
            prompt: 'Why automate now - content quota, headcount, new platform?',
            placeholder: 'We promised 5 shorts/week to a sponsor and our editor can do two.',
          },
          audience: {
            prompt: 'Who watches the output? Audience size, platform, attention span?',
            placeholder: 'TikTok / Reels, 16–30, 30 seconds max.',
          },
          problem: {
            prompt: 'What’s the cost of doing it manually today?',
            placeholder: 'One editor, 4 hours per video, 7 a week - that’s a full-time hire.',
          },
          references: {
            prompt: 'Any auto-video systems or styles you like?',
            placeholder: 'Like Opus Clip but for original scripts, not repurposing.',
          },
          timeline: { prompt: 'When does the pipeline need to be producing?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'This is the video brief. Send?' },
        },
        audio: {
          idea: {
            prompt: 'What kind of musical experience or audio engine? How should it feel to the ear?',
            hint: 'If it had a closing-the-eyes test, what would the user hear?',
            placeholder:
              'An interactive ambient soundtrack for an art-gallery site - chords change as you scroll past sections.',
          },
          whyNow: {
            prompt: 'Why now - an exhibition, a launch, a new instrument idea?',
            placeholder: 'Opening night is in March and the soundtrack is the whole show.',
          },
          audience: {
            prompt: 'Who hears this? Visitors of what kind of site or app?',
            placeholder: 'Visitors of a fine-art gallery site, mostly desktop, headphones on.',
          },
          problem: {
            prompt: 'What does the visitor get from sound that they can’t from visuals?',
            placeholder: 'Sense of room, of being present somewhere instead of clicking through pages.',
          },
          references: {
            prompt: 'Sound-driven sites, apps, plugins, or musical tools you love? Link, screenshot, or "like X but without Y".',
            placeholder: 'A link to a site, plugin, or demo - and the feel you want to capture.',
          },
          timeline: { prompt: 'When does it need to be live?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'This is the audio brief. Send to Bar?' },
        },
        game: {
          idea: {
            prompt: 'What game or interactive piece? What’s the one-line core mechanic?',
            hint: 'If it were an arcade cabinet, what would the sticker say?',
            placeholder:
              'Click-the-tomato browser game - players save a falling tomato by clicking before it hits the floor, leaderboard at the end.',
          },
          whyNow: {
            prompt: 'Why now - a campaign launch, a brand activation, a side-project?',
            placeholder: 'We’re sponsoring a food festival in 6 weeks and want a shareable mini-game on the brand site.',
          },
          audience: {
            prompt: 'Who’s the player? In what context - story tap, browser at work, phone in line?',
            placeholder: '16–35 on phones, arriving from Instagram stories.',
          },
          problem: {
            prompt: 'Why a game and not, say, a video or a giveaway?',
            placeholder: 'We want time-on-site and a shareable moment, not a passive view.',
          },
          references: {
            prompt: 'Any browser games or interactive pieces that nailed it?',
            placeholder: 'Like Patatap - that level of polish.',
          },
          timeline: { prompt: 'When does the game need to be playable?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'Game brief is ready. Hit send?' },
        },
        realtime: {
          idea: {
            prompt: 'What dashboard or live system? What data flows in and how often?',
            hint: 'Source → dashboard → who acts on it.',
            placeholder:
              'Live dashboard of warehouse pick-and-pack stations: stations, current orders, pickers, alerts when a station idles >5min.',
          },
          whyNow: {
            prompt: 'Why move off Excel / Looker / homegrown thing now?',
            placeholder: 'Our COO is doing alerts manually over Slack and we just doubled order volume.',
          },
          audience: {
            prompt: 'Who watches the dashboard? Ops manager on a screen, field team on phones?',
            placeholder: 'Floor manager on a wall TV, plus 6 supervisors checking on phones.',
          },
          problem: {
            prompt: 'What goes wrong today because data isn’t live?',
            placeholder: 'We notice idle stations 30 minutes late and miss the SLA.',
          },
          references: {
            prompt: 'Other dashboards or live systems done well?',
            placeholder: 'Linear’s project status, Vercel’s deploy view.',
          },
          timeline: { prompt: 'When does the dashboard need to be operational?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'Dashboard brief is ready. Send it?' },
        },
        mobile: {
          idea: {
            prompt: 'What mobile app? What’s the one daily action inside it?',
            hint: 'Imagine the user opening the app at a bus stop - what do they do?',
            placeholder:
              'A mobile app for amateur birders: log a sighting in 3 taps, see what’s been spotted nearby today.',
          },
          whyNow: {
            prompt: 'Why native now and not just a mobile web view?',
            placeholder: 'We need camera + GPS + offline, and an Apple Watch app within a year.',
          },
          audience: {
            prompt: 'Who installs the app? Loyal customers, internal team, the public?',
            placeholder: 'Birding hobbyists, 35+, currently using eBird and wanting something less clinical.',
          },
          problem: {
            prompt: 'What can’t they do today on the web version?',
            placeholder: 'Capture a sighting in the field without signal, with GPS auto-tagged.',
          },
          references: {
            prompt: 'Any apps you’d point to as a north star?',
            placeholder: 'Strava for the social feed pattern, Merlin Bird ID for capture flow.',
          },
          timeline: { prompt: 'When does the app need to be submitted to the stores?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'App brief is ready. Send?' },
        },
        other: {
          idea: {
            prompt: 'Describe the idea. What is it - and why does it need to exist?',
            hint: 'Weird is welcome. Strange edges make the best projects.',
            placeholder:
              'A sleep-tracking journal that ranks your dreams by lucidity, stitched together each morning from voice notes you mumbled at 4am.',
          },
          whyNow: {
            prompt: 'Why does this need to be built now? Or why has nobody built it yet?',
            placeholder: 'Voice transcription is finally good enough for half-asleep mumbling.',
          },
          audience: {
            prompt: 'Who’s it for? Even a niche of 50 is fine - the sharpest gets shipped.',
            placeholder: 'Lucid-dream practitioners and bibliophiles who keep dream journals.',
          },
          problem: {
            prompt: 'What problem or curiosity is this scratching?',
            placeholder: 'I forget my dreams in two minutes and the existing apps are clinical.',
          },
          references: {
            prompt: 'Anything in the universe that’s close in spirit?',
            placeholder: 'Like Day One but for dreams. Or Daylio crossed with a fancy Moleskine.',
          },
          timeline: { prompt: 'When would you want a first version?' },
          howHeard: { prompt: 'How did you find me?' },
          review: { prompt: 'The weird brief is ready. Send it to Bar?' },
        },
      },
    },
  },
  qa: {
    number: '05',
    kicker: 'Q & A',
    title: 'What people ask before reaching out',
    items: [
      {
        q: 'Really no payment for the prototype?',
        a:
          'Really. I invest 3–7 days because it’s the best way I’ve found to show I can build what you need - before you pay anything. If we don’t continue, that’s my risk. If we do, both sides know exactly what they’re signing up for.',
      },
      {
        q: 'What if I don’t know yet exactly what I want?',
        a:
          'Perfect - that’s most cases. Describe in two sentences what you don’t want, or which daily problem is in front of you, and I’ll build my first read of it. Once you see something, it’s much easier to say "yes, but…" - and that’s exactly what I’m after.',
      },
      {
        q: 'So how does payment actually work after the prototype?',
        a:
          'I don’t work by the hour. Every project gets a clear scope and a price known up front - outcome-based. Small projects ship at a package price; larger ones break into milestones with payment after each delivery. No monthly retainer, no long contract. Work’s done - payment’s done.',
      },
    ],
  },
  colophon: {
    number: '06',
    kicker: 'Colophon',
    title: 'Right. You made it this far.',
    pullQuote:
      'So what do you think - worth describing the idea in one sentence and seeing what comes out?',
    ctaPrimary: 'To the brief',
    ctaWhatsapp: 'Send me a WhatsApp',
    ctaMail: 'Or email',
    credit: 'Written, designed, and coded by Bar Moshe · 2025/26',
    portfolioLink: 'Full portfolio',
  },
  runningFoot: {
    backToTop: '↑ Top',
    whatsapp: 'WhatsApp',
    mail: 'Email',
    issueLabel: 'Issue 01',
  },
  board: {
    status: {
      todo: 'TODO',
      doing: 'DOING',
      done: 'DONE',
      selected: 'PICKED',
      open: 'OPEN',
      closed: 'CLOSED',
      building: 'BUILDING',
    },
    columns: {
      backlog: 'BACKLOG',
      process: 'PROCESS',
      about: 'ABOUT',
      intake: 'NEW TICKET',
      faq: 'FAQ',
      ship: 'READY TO SHIP',
    },
    brief: 'Your brief so far',
    progress: '{n}/{total} chapters',
    ringHold: 'Hold to send',
  },
};

const DICTS: Record<Lang, Dict> = { en: EN, he: HE };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}
