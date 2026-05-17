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
};

const HE: Dict = {
  meta: {
    title: 'בר משה — לתאר. אבנה. לראות.',
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
    headlineLines: ['לתאר.', 'אבנה.', 'לראות.'],
    standfirst:
      'במקום בריף שנמרח שבועות והצעת מחיר שגוררת התלבטויות — תיאור קצר של הרעיון שלך בטופס, ואני אבנה POC ראשון על חשבוני. אם זה עובד — נמשיך לבנות יחד. אם לא — נפרדים בלי שום התחייבות.',
    byline: 'בר משה · בנייה פרטית · מאז 2020',
    scrollHint: 'המשך לקריאה',
  },
  contents: {
    number: '01',
    kicker: 'התוכן',
    title: 'מאיפה מתחילים',
    standfirst:
      'אלה סוגי הפרויקטים שאני בונה הכי הרבה. הבחירה שלך כאן פותחת את הבריף עם השדה המתאים כבר מסומן. אין התאמה? יש "אחר".',
    items: [
      {
        slug: 'mvp',
        title: 'MVP לסטארטאפ',
        summary:
          'מ-Figma לקוד עובד תוך שבוע. גרסה ראשונה שמספיקה כדי להראות למשתמשים, לגייס, או להחליט שזה לא הכיוון.',
        fits: ['ייזום סולו', 'סטארטאפ early-stage', 'צוות קטן'],
      },
      {
        slug: 'brand',
        title: 'אתר־מותג עם אופי',
        summary:
          'לא תבנית. אנימציות, פלטה משלך, אינטראקציות שגורמות לאנשים לזכור אותך. כמו האתר הזה — אבל שלך.',
        fits: ['מותג חדש', 'פרילנס עם זהות', 'סטודיו'],
      },
      {
        slug: 'ecommerce',
        title: 'חנות אונליין מותאמת',
        summary:
          'Shopify ערוך מהבסיס, מערכת תשלומים שלך, או חנות־בוטיק שלמה בקוד. מתאים למותג עם זהות — לא לקטלוג גנרי.',
        fits: ['מותג קטן', 'יצירה עצמאית', 'חנות־בוטיק'],
      },
      {
        slug: 'ai-agent',
        title: 'אסיסטנט / סוכן AI פרטי',
        summary:
          'GPT chatbot ללקוחות, RAG על כל המסמכים שלך, סוכן אוטונומי שעובר על מיילים ועושה את העבודה. OpenAI, Anthropic, או מודל פתוח.',
        fits: ['חברה', 'צוות תפעול / שירות', 'ייזום AI'],
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
        fits: ['יצירה מוזיקלית', 'מותג מוזיקלי', 'סטארטאפ אודיו'],
      },
      {
        slug: 'game',
        title: 'משחק דפדפן / חוויה אינטראקטיבית',
        summary:
          'Canvas, WebGL, Three.js. משחקון לקמפיין, חוויה ויראלית לסטוריס, או אבטיפוס למשחק בפיתוח עצמאי.',
        fits: ['מותג עם קמפיין', 'פיתוח משחקי אינדי', 'סוכנות יצירתית'],
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
          'יש רעיון מוזר מתחום שלא ראיתי? מצוין — הדברים הכי טובים שעבדתי עליהם התחילו ככה. כתבת את זה בבריף — נתחיל משם.',
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
      'שלושה שלבים. בלי הצעות מחיר ראשונות, בלי "הצעה מותאמת" של 14 עמודים, בלי חתימה על דבר לפני שיש משהו עובד לראות.',
    steps: [
      {
        num: '01',
        title: 'לתאר',
        body:
          'בריף קצר. שלושה שדות חובה: סוג, רעיון, וטלפון או מייל. כל השאר אופציונלי. הבריף שלך נופל ישירות בוואטסאפ שלי — בלי שמירה בשרת, בלי "להירשם לניוזלטר", בלי בולשיט.',
      },
      {
        num: '02',
        title: 'אבנה',
        body:
          'תוך 3–7 ימים אני בונה POC ראשון על חשבוני. לא Mockup. לא Figma. קוד עובד. פותחים את הקישור, לוחצים, מראים לחבר — ושואלים אם זה הכיוון. אם לא — נפרדים כאן. בלי חשבון.',
      },
      {
        num: '03',
        title: 'לראות',
        body:
          'אם זה עובד — נדבר על המשך: scope ברור, מחיר ידוע מראש, אבני דרך שבועיות, מסירות נקיות — בלי הפתעות. אני לא עובד לפי שעות — לפי תוצאות.',
      },
    ],
    pullQuote: {
      quote: 'הסיכון הכי גדול עבור הלקוח הוא לא הכסף — זה הזמן שיבוזבז על הצעה שלא תיהפוך אף פעם לקוד.',
      cite: 'בר משה',
    },
  },
  about: {
    number: '03',
    kicker: 'מי אני',
    title: 'בר משה',
    paragraphs: [
      'מתכנת full-stack מאז 2020. עיקר העבודה ב-TypeScript, React ו-Node, אבל כל פרויקט הוא תירגול במשהו חדש — WebAudio פה, GSAP שם, ולאחרונה הרבה אסיסטנטים על LLM. זה מה ששומר אותי ער.',
      'אני בונה כי זה היה התחביב לפני שזו הייתה פרנסה. אני מקבל החלטות מהירות כי קל לתקן קוד שעובד, וכמעט בלתי אפשרי לתקן בריף שמעולם לא הפך לקוד. זו הסיבה שאני עובד POC-first: ככה אני יודע מה לבנות, ויש לך POC ביד לפני כל החלטה.',
      'מבוסס בישראל, עובד עם לקוחות בכל העולם, בעברית ובאנגלית. עדיף לכתוב לי לפני שמתחילים לסקור חברות תוכנה — אם זה לא מתאים, אגיד מראש ולא נבזבז זמן.',
    ],
    stats: [
      { value: '5+', label: 'שנים בפיתוח' },
      { value: '20+', label: 'POCs שנבנו' },
      { value: '0', label: 'תשלום מראש' },
    ],
  },
  brief: {
    number: '04',
    kicker: 'הבריף',
    title: 'מה הרעיון שלך?',
    standfirst:
      'הבריף הזה נופל ישירות בוואטסאפ שלי, מוכן לקריאה. ככל שיש יותר פירוט — POC ראשון מדויק יותר. גם שלוש שורות מספיקות להתחיל.',
    requiredHint: 'חובה רק 3 שדות: סוג, הרעיון, וטלפון או מייל.',
    optionalHeading: 'עוד פרטים — אופציונלי',
    fields: {
      template: {
        label: 'סוג הפרויקט',
        placeholder: 'התבנית הקרובה ביותר.',
      },
      idea: {
        label: 'הרעיון בקצרה',
        hint: 'משפט אחד או שלושה. עדיף ברור מאשר מנומק.',
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
        hint: 'מה השתנה? למה דווקא עכשיו? עוזר לי להבין כמה זה דחוף.',
        placeholder: 'לדוגמה: "סיימנו סבב גיוס", "המתחרה השיק משהו דומה", או "התעייפתי לחכות".',
      },
      references: {
        label: 'יש משהו דומה שאהבת?',
        placeholder: 'קישורים, צילומי מסך, או "כמו X אבל בלי Y"',
      },
      timeline: { label: 'מתי דרוש' },
      howHeard: {
        label: 'איך הגעת אליי',
        placeholder: 'GitHub, חבר שסיפר, פורטפוליו, חיפוש — מה שזכור',
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
    submit: 'לשלוח את הבריף לבר',
    submitHint:
      'ייפתח וואטסאפ עם ההודעה מסודרת. אפשר לערוך לפני שליחה — שום מידע לא נשמר באתר.',
    marginalNote:
      'לא חובה למלא הכל. שלושה שדות מספיקים להתחיל. עברית? יופי. אנגלית? גם בסדר. קישור או צילום מסך? בוואטסאפ, אחרי שליחת הבריף.',
    mailFallback: 'מייל מתאים יותר? כאן',
    mailSubject: 'בריף חדש מהאתר',
    liveSuccess: 'נפתח וואטסאפ עם הבריף המסודר.',
    liveError: 'יש שדות חסרים. הסימונים האדומים מראים איפה.',
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
    number: '05',
    kicker: 'שאלות ותשובות',
    title: 'מה אנשים שואלים לפני שהם פונים',
    items: [
      {
        q: 'באמת בלי תשלום על ה־POC?',
        a:
          'באמת. אני משקיע 3–7 ימים עבודה כי זו הדרך הכי טובה שמצאתי להראות שאני יכול לבנות את מה שצריך — לפני התשלום. אם לא נמשיך, זה הסיכון שלי. אם נמשיך, כל הצדדים יודעים בדיוק על מה הם חותמים.',
      },
      {
        q: 'מה אם הכיוון עדיין לא ברור?',
        a:
          'מעולה — זה הרוב מהמקרים. אם ראית מוצר שמרגיז אותך, או יש בעיה יומיומית שכואבת — שני משפטים על זה, ואני אבנה את ההבנה הראשונה שלי. אחרי שרואים משהו, קל בהרבה להגיד "כן, אבל…" — וזה בדיוק מה שאני מחפש.',
      },
      {
        q: 'אז איך בעצם משלמים אחרי ה־POC?',
        a:
          'אני לא עובד לפי שעות. כל פרויקט מקבל scope ברור ומחיר ידוע מראש — לפי תוצאות. פרויקטים קטנים יוצאים במחיר חבילה, פרויקטים גדולים מתפצלים לאבני דרך עם תשלום אחרי כל מסירה. אין retainer חודשי, אין חוזה ארוך. נגמרה עבודה — נגמר התשלום.',
      },
    ],
  },
  colophon: {
    number: '06',
    kicker: 'קולופון',
    title: 'יפה. הגעת עד לכאן.',
    pullQuote:
      'אז שווה לתאר את הרעיון במשפט אחד — ונראה מה יוצא.',
    ctaPrimary: 'אל הבריף',
    ctaWhatsapp: 'אל הוואטסאפ של בר',
    ctaMail: 'או מייל',
    credit: 'נכתב, עוצב, וקודד על־ידי בר משה · 2025/26',
    portfolioLink: 'הפורטפוליו המלא',
  },
  runningFoot: {
    backToTop: '↑ למעלה',
    whatsapp: 'וואטסאפ',
    mail: 'מייל',
    issueLabel: 'גליון 01',
  },
};

const DICTS: Record<Lang, Dict> = {
  he: HE,
};

export const t: Dict = HE;

export function tFor(lang: Lang = DEFAULT_LANG): Dict {
  return DICTS[lang] ?? HE;
}
