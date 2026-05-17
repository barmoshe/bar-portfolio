/**
 * Marketing-site copy. Hebrew only. The page is framed as a printed
 * editorial issue ("גליון 01"), so the copy is structured by section
 * with magazine-style numbering, kickers, and pull quotes. Editing
 * copy is a one-file change.
 */

export type Lang = 'he';

export const DEFAULT_LANG: Lang = 'he';

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
  };
  cover: {
    issueLine: string;
    headlineLines: string[];
    standfirst: string;
    byline: string;
    scrollHint: string;
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
};

const HE: Dict = {
  meta: {
    title: 'בר משה — תאר. אבנה. את.ה רואה.',
    description:
      'אני בונה POC על חשבוני לפני שאנחנו מתחילים לדבר על מחיר. אם זה עובד עבורך — נמשיך. אם לא — נפרדים בלי שום התחייבות.',
  },
  masthead: {
    issueNumber: 'גליון 01',
    issueDate: '2025 / 26',
    skip: 'דלג לתוכן',
    brandName: 'בר משה',
    brandTagline: 'בונה ראשון, מדבר אחר־כך',
    portfolioLink: 'הפורטפוליו',
    briefLink: 'הבריף',
    a11yTitle: 'הגדרות נגישות',
    a11yLabel: 'פתיחת הגדרות נגישות',
  },
  cover: {
    issueLine: 'גליון 01 · בנייה לפני בריף',
    // The cover headline is the manifesto. Three short lines that build:
    // "describe — I build — you decide". Tight, declarative, no chrome.
    headlineLines: ['תאר.', 'אבנה.', 'את.ה רואה.'],
    standfirst:
      'במקום בריף שמתמשך שבועות והצעת מחיר שאת.ה מתלבט.ת עליה — תאר.י את הרעיון בטופס, ואני אבנה POC ראשון על חשבוני. אם זה עובד עבורך — נמשיך לבנות יחד. אם לא — נפרדים בלי שום התחייבות.',
    byline: 'בר משה · בנייה פרטית · מאז 2020',
    scrollHint: 'המשך לקריאה',
  },
  contents: {
    number: '01',
    kicker: 'התוכן',
    title: 'מאיפה מתחילים',
    standfirst:
      'אלה סוגי הפרויקטים שאני בונה הכי הרבה. בחירה כאן פותחת את הבריף עם השדה המתאים כבר מסומן. לא מצאת? יש "אחר".',
    items: [
      {
        slug: 'mvp',
        title: 'MVP לסטארטאפ',
        summary:
          'מ-Figma לקוד עובד תוך שבוע. גרסה ראשונה שמספיקה כדי להראות למשתמשים, לגייס, או להחליט שזה לא הכיוון.',
        fits: ['יזם.ית סולו', 'סטארטאפ early-stage', 'צוות קטן'],
      },
      {
        slug: 'brand',
        title: 'אתר־מותג עם אופי',
        summary:
          'לא תבנית. אנימציות, צבעוניות עצמאית, אינטראקציות שגורמות לאנשים לזכור אותך. כמו האתר הזה — אבל שלך.',
        fits: ['מותג חדש', 'פרילנסר.ית עם זהות', 'סטודיו'],
      },
      {
        slug: 'ecommerce',
        title: 'חנות אונליין מותאמת',
        summary:
          'Shopify ערוך מהבסיס, מערכת תשלומים פרטית, או חנות־בוטיק שלמה מקוד. מתאים למותג עם זהות — לא לקטלוג גנרי.',
        fits: ['מותג קטן', 'יצרן.ית עצמאי.ת', 'חנות־בוטיק'],
      },
      {
        slug: 'ai-agent',
        title: 'אסיסטנט / סוכן AI פרטי',
        summary:
          'GPT chatbot ללקוחות, RAG על כל המסמכים שלך, סוכן אוטונומי שעובר על מיילים ועושה את העבודה. OpenAI, Anthropic, או מודל פתוח.',
        fits: ['חברה', 'צוות תפעול / שירות', 'יזם.ית AI'],
      },
      {
        slug: 'ai-video',
        title: 'צנרת רינדור וידאו מבוססת AI',
        summary:
          'מערכת שלוקחת טקסט → סצנות → וידאו רנדור אוטומטי. Remotion, FFmpeg, ElevenLabs, Runway. מתאים לסרטוני הסבר בקנה־מידה, פודקאסט מאויר, או תוכן יומי לרשתות.',
        fits: ['יוצר תוכן', 'סוכנות שיווק', 'מותג עם סדרה / פודקאסט'],
      },
      {
        slug: 'audio',
        title: 'מנוע אודיו / אינטראקציה מוזיקלית',
        summary:
          'WebAudio, סנתזה, מיקסר רב־ערוצי, אפקטים בזמן אמת. כמו ה-Mixtape בפורטפוליו שלי. מתאים למוצר שצריך סאונד שהוא חלק מהחוויה — לא רק רעש רקע.',
        fits: ['אמן.ית', 'מותג מוזיקלי', 'סטארטאפ אודיו'],
      },
      {
        slug: 'game',
        title: 'משחק דפדפן / חוויה אינטראקטיבית',
        summary:
          'Canvas, WebGL, Three.js. משחקון לקמפיין, חוויה ויראלית לסטוריס, או אבטיפוס למשחק שאת.ה מפתח.ת בעצמך.',
        fits: ['מותג עם קמפיין', 'מפתח.ת משחקים אינדי', 'סוכנות יצירתית'],
      },
      {
        slug: 'realtime',
        title: 'דשבורד / מערכת בזמן אמת',
        summary:
          'Admin panel עם הרשאות, BI שמתעדכן חי, מערכת ניטור על WebSocket. גרפים, פילטרים, ייצוא ל-CSV. כל מה שהצוות שלך עכשיו עושה באקסל.',
        fits: ['חברה', 'סטארטאפ ב-Scale', 'צוות נתונים / ops'],
      },
      {
        slug: 'mobile',
        title: 'אפליקציית מובייל',
        summary:
          'iOS + Android באותו codebase. React Native או PWA. push, אופליין, חנות, הזדהות. אותו צוות (אני), שתי פלטפורמות.',
        fits: ['סטארטאפ', 'מוצר B2C', 'עסק עם לקוחות נאמנים'],
      },
      {
        slug: 'other',
        title: 'משהו אחר לגמרי',
        summary:
          'יש לך רעיון מוזר מתחום שלא ראיתי? מצוין — הדברים הכי טובים שעבדתי עליהם התחילו ככה. כתב.י בבריף.',
        fits: ['כל אחד'],
      },
    ],
    pickedLabel: 'נבחר',
  },
  method: {
    number: '02',
    kicker: 'השיטה',
    title: 'איך בונים יחד',
    standfirst:
      'שלושה שלבים בלי הצעות מחיר ראשונות. בלי "הצעה מותאמת" של 14 עמודים. בלי לחתום על דבר לפני שאת.ה רואה משהו עובד.',
    steps: [
      {
        num: '01',
        title: 'תאר',
        body:
          'את.ה ממלא.ת בריף קצר. שלושה שדות חובה: סוג הפרויקט, הרעיון, ודרך ליצור איתך קשר. כל השאר אופציונלי. הבריף נשלח ישירות לוואטסאפ שלי כהודעה מסודרת — בלי שמירה בשרת, בלי "הירשם לניוזלטר", בלי שום שטויות.',
      },
      {
        num: '02',
        title: 'אבנה',
        body:
          'תוך 3–7 ימים אני בונה POC ראשון על חשבוני. לא Mockup. לא Figma. קוד עובד שאת.ה יכול.ה לפתוח, ללחוץ, לשלוח לחבר.ה ולשאול אם זה מה שדמיינת. אם זה לא — נפרדים כאן. בלי חשבון.',
      },
      {
        num: '03',
        title: 'את.ה רואה',
        body:
          'אם זה עובד עבורך, מדברים על המשך: scope ברור, מחיר ידוע מראש, אבני דרך שבועיות, ומסירה נקייה. אני לא עובד לפי שעות — לפי תוצאות.',
      },
    ],
    pullQuote: {
      quote: 'הסיכון הכי גדול עבור הלקוח הוא לא הכסף — זה הזמן שיבוזבז על הצעה שלא תצא לפועל.',
      cite: 'בר משה',
    },
  },
  brief: {
    number: '03',
    kicker: 'הבריף',
    title: 'מה את.ה רוצה לבנות',
    standfirst:
      'הבריף הזה נשלח ישירות לוואטסאפ שלי כהודעה מסודרת. ככל שתפרט.י יותר — POC ראשון מדויק יותר. גם 3 שורות מספיקות להתחיל.',
    requiredHint: 'חובה רק 3 שדות: סוג, רעיון, ודרך ליצור איתך קשר.',
    optionalHeading: 'עוד פרטים — אופציונלי',
    fields: {
      template: {
        label: 'סוג הפרויקט',
        placeholder: 'בחר.י את התבנית הקרובה ביותר — אפשר תמיד לעדכן אחר־כך',
      },
      idea: {
        label: 'הרעיון בקצרה',
        hint: 'משפט אחד או שלושה. ברור עדיף על מנומק.',
        placeholder:
          'לדוגמה: "פלטפורמה שמחברת בין יצרני קרמיקה לחנויות עיצוב — היצרן מעלה קטלוג, החנות מזמינה ישירות, הוא משלם עמלה רק על מכירה."',
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
        hint: 'מה השתנה שקרה לכך שאת.ה פונה היום? המידע הזה עוזר לי להבין דחיפות וקונטקסט.',
        placeholder: 'לדוגמה: "סיימנו סבב גיוס", "המתחרה השיק משהו דומה", או "התעייפתי לחכות".',
      },
      references: {
        label: 'יש משהו דומה שאהבת',
        placeholder: 'קישורים, צילומי מסך, או "כמו X אבל בלי Y"',
      },
      timeline: { label: 'מתי דרוש' },
      howHeard: {
        label: 'איך הגעת אליי',
        placeholder: 'GitHub, חבר.ה, פורטפוליו, חיפוש — מה שזכור',
      },
      name: { label: 'שם', placeholder: 'איך אקרא לך' },
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
    submit: 'שלח את הבריף לבר',
    submitHint:
      'ייפתח וואטסאפ עם ההודעה מסודרת. אפשר עוד לערוך לפני ששולחים. אין שמירת מידע באתר.',
    mailFallback: 'מעדיפ.ה במייל? לחצ.י כאן',
    mailSubject: 'בריף חדש מהאתר',
    liveSuccess: 'נפתח וואטסאפ עם הבריף המסודר.',
    liveError: 'יש שדות חסרים. בדק.י את הסימונים האדומים.',
    briefHeading: 'היי בר,',
    briefFooter: '— נשלח מהבריף באתר',
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
  },
  qa: {
    number: '04',
    kicker: 'שאלות ותשובות',
    title: 'מה אנשים שואלים לפני שהם פונים',
    items: [
      {
        q: 'באמת בלי תשלום על ה־POC?',
        a:
          'באמת. אני משקיע 3–7 ימים עבודה כי זה הדרך הכי טובה שמצאתי להראות שאני יכול לבנות את מה שאת.ה צריך.ה — לפני שאת.ה משלמ.ת. אם לא נמשיך, זה הסיכון שלי. אם נמשיך, כל הצדדים יודעים בדיוק על מה הם חותמים.',
      },
      {
        q: 'מה אם אני עדיין לא יודע.ת בדיוק מה אני רוצה?',
        a:
          'מעולה — זה הרוב מהמקרים. תאר.י בשני משפטים מה את.ה לא רוצה, או איזו בעיה יומיומית עומדת מולך, ואני אבנה את ההבנה הראשונה שלי. אחרי שתראה.י משהו, קל בהרבה להגיד "כן, אבל…" — וזה בדיוק מה שאני מחפש.',
      },
      {
        q: 'אז איך בעצם משלמים אחרי ה־POC?',
        a:
          'אני לא עובד לפי שעות. כל פרויקט מקבל scope ברור ומחיר ידוע מראש — לפי תוצאות. פרויקטים קטנים יוצאים במחיר חבילה, פרויקטים גדולים מתפצלים לאבני דרך עם תשלום אחרי כל מסירה. אין retainer חודשי, אין חוזה ארוך. נגמרה עבודה — נגמר התשלום.',
      },
    ],
  },
  colophon: {
    number: '05',
    kicker: 'קולופון',
    title: 'נכון. הגעת עד לכאן.',
    pullQuote:
      'אז מה דעתך — שווה לתאר את הרעיון במשפט אחד ולראות מה יוצא?',
    ctaPrimary: 'אל הבריף',
    ctaWhatsapp: 'שלח לי וואטסאפ',
    ctaMail: 'או מייל',
    credit: 'נכתב, עוצב, וקודד על־ידי בר משה · 2025/26',
    portfolioLink: 'הפורטפוליו המלא',
  },
};

const DICTS: Record<Lang, Dict> = {
  he: HE,
};

export const t: Dict = HE;

export function tFor(lang: Lang = DEFAULT_LANG): Dict {
  return DICTS[lang] ?? HE;
}
