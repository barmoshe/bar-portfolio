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
      'בונה לך POC על חשבוני לפני שמתחילים בכלל לדבר על מחיר. עבד לך? נמשיך. לא עבד? נפרדים בלי שום התחייבות.',
  },
  masthead: {
    issueNumber: 'גליון 01',
    issueDate: '2025 / 26',
    skip: 'דילוג לתוכן',
    brandName: 'בר משה',
    brandTagline: 'בונה ראשון, מדבר אחר־כך',
    portfolioLink: 'הפורטפוליו',
    briefLink: 'הבריף',
    a11yTitle: 'הגדרות נגישות',
    a11yLabel: 'פתיחת הגדרות נגישות',
    langGroupLabel: 'בחירת שפה',
    langEnLabel: 'English',
    langHeLabel: 'עברית',
    langSwitchedTo: 'השפה הוחלפה לעברית',
  },
  cover: {
    issueLine: 'גליון 01 · בנייה לפני בריף',
    // The cover headline is the manifesto. Three short lines that build:
    // "describe — I build — you decide". Tight, declarative, no chrome.
    headlineLines: ['לתאר.', 'אבנה.', 'לראות.'],
    standfirst:
      'במקום שבועות של בריפים והצעות מחיר שגוררות התלבטויות — מתארים את הרעיון בטופס, ואני בונה POC ראשון על חשבוני. עבד לך? נמשיך לבנות יחד. לא עבד? נפרדים בלי התחייבות.',
    byline: 'בר משה · עצמאי · מאז 2020',
    scrollHint: 'גלילה למטה',
  },
  contents: {
    number: '01',
    kicker: 'התוכן',
    title: 'מאיפה מתחילים',
    standfirst:
      'אלה סוגי הפרויקטים הכי נפוצים אצלי. בחירה כאן פותחת את הבריף עם השדה המתאים מסומן מראש. משהו אחר לגמרי? יש גם "אחר".',
    items: [
      {
        slug: 'mvp',
        title: 'MVP לסטארטאפ',
        summary:
          'מ-Figma לקוד עובד בתוך שבוע. גרסה ראשונה שמספיק טובה כדי להראות למשתמשים, לרוץ איתה לסבב גיוס, או פשוט להבין שזה לא הכיוון.',
        fits: ['ייזום סולו', 'סטארטאפ early-stage', 'צוות קטן'],
      },
      {
        slug: 'brand',
        title: 'אתר־מותג עם אופי',
        summary:
          'לא תבנית. אנימציות, פלטה משלך, אינטראקציות שנשארות בראש. בערך כמו האתר הזה — רק שלך.',
        fits: ['מותג חדש', 'פרילנס עם זהות', 'סטודיו'],
      },
      {
        slug: 'ecommerce',
        title: 'חנות אונליין מותאמת',
        summary:
          'שופיפיי מותאם מאפס, מערכת תשלומים משלך, או חנות־בוטיק שלמה בקוד. מתאים למותג עם זהות — לא לקטלוג גנרי.',
        fits: ['מותג קטן', 'יצירה עצמאית', 'חנות־בוטיק'],
      },
      {
        slug: 'ai-agent',
        title: 'אסיסטנט / סוכן AI פרטי',
        summary:
          'צ׳אטבוט ללקוחות, RAG על כל המסמכים שלך, סוכן שעובר על מיילים לבד ופשוט עושה את מה שצריך. OpenAI, Anthropic, או מודל פתוח.',
        fits: ['חברה', 'צוות תפעול / שירות', 'ייזום AI'],
      },
      {
        slug: 'ai-video',
        title: 'צנרת רינדור וידאו מבוססת AI',
        summary:
          'מטקסט → סצנות → וידאו, הכל אוטומטי. Remotion, FFmpeg, ElevenLabs, Runway. מתאים לייצור סדרתי של סרטוני הסבר, פודקאסט מאויר, או תוכן יומי לרשתות.',
        fits: ['יוצר תוכן', 'סוכנות שיווק', 'מותג עם סדרה / פודקאסט'],
      },
      {
        slug: 'audio',
        title: 'מנוע אודיו / אינטראקציה מוזיקלית',
        summary:
          'WebAudio, סינתזה, מיקסר רב־ערוצי, אפקטים בזמן אמת. כמו ה-Mixtape בפורטפוליו שלי. מתאים למוצר שהסאונד הוא חלק מהחוויה שלו — לא רק רעש רקע.',
        fits: ['יצירה מוזיקלית', 'מותג מוזיקלי', 'סטארטאפ אודיו'],
      },
      {
        slug: 'game',
        title: 'משחק דפדפן / חוויה אינטראקטיבית',
        summary:
          'Canvas, WebGL, Three.js. משחקון לקמפיין, חוויה ויראלית לסטוריז, או אבטיפוס למשחק אינדי שמתפתח אצלך.',
        fits: ['מותג עם קמפיין', 'פיתוח משחקי אינדי', 'סוכנות יצירתית'],
      },
      {
        slug: 'realtime',
        title: 'דשבורד / מערכת בזמן אמת',
        summary:
          'פאנל ניהול עם הרשאות, BI שמתעדכן בזמן אמת, מערכת ניטור על WebSocket. גרפים, פילטרים, ייצוא ל-CSV. כל מה שהצוות שלך עושה היום באקסל.',
        fits: ['חברה', 'סטארטאפ ב-Scale', 'צוות נתונים / ops'],
      },
      {
        slug: 'mobile',
        title: 'אפליקציית מובייל',
        summary:
          'iOS + Android מאותו codebase. React Native או PWA. push, אופליין, חנות, התחברות. אותו מפתח (אני), שתי פלטפורמות.',
        fits: ['סטארטאפ', 'מוצר B2C', 'עסק עם לקוחות נאמנים'],
      },
      {
        slug: 'other',
        title: 'משהו אחר לגמרי',
        summary:
          'יש לך רעיון מוזר מתחום שעוד לא נגעתי בו? מצוין — הדברים הכי טובים שיצא לי לעבוד עליהם התחילו ככה. כתבת את זה בבריף, נתחיל משם.',
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
      'שלושה שלבים. בלי הצעות מחיר על העיוור, בלי "הצעה מותאמת" של 14 עמודים, בלי לחתום על שום דבר לפני שיש משהו עובד מול העיניים.',
    steps: [
      {
        num: '01',
        title: 'לתאר',
        body:
          'בריף קצר. שלושה שדות חובה: סוג הפרויקט, הרעיון, וטלפון או מייל. כל השאר רשות. הבריף שלך נוחת ישירות בוואטסאפ שלי — בלי שמירה בשרת, בלי "להירשם לניוזלטר", בלי בולשיט.',
      },
      {
        num: '02',
        title: 'אבנה',
        body:
          'בתוך 3–7 ימים אני בונה POC ראשון על חשבוני. לא מוקאפ. לא Figma. קוד עובד. פותחים את הקישור, לוחצים, מראים לחבר — ושואלים אם זה הכיוון. לא הכיוון? נפרדים כאן. בלי חשבון.',
      },
      {
        num: '03',
        title: 'לראות',
        body:
          'עבד? נדבר על המשך: סקופ ברור, מחיר ידוע מראש, אבני דרך שבועיות, מסירות נקיות — בלי הפתעות. אני לא עובד לפי שעות, אני עובד לפי תוצאות.',
      },
    ],
    pullQuote: {
      quote: 'הסיכון הכי גדול של הלקוח הוא לא הכסף — זה הזמן שמתבזבז על הצעות שאף פעם לא הופכות לקוד.',
      cite: 'בר משה',
    },
  },
  about: {
    number: '03',
    kicker: 'מי אני',
    title: 'בר משה',
    paragraphs: [
      'מתכנת full-stack מאז 2020. רוב העבודה ב-TypeScript, React ו-Node, אבל בכל פרויקט מתגלגל לי משהו חדש — WebAudio פה, GSAP שם, ולאחרונה הרבה אסיסטנטים מבוססי LLM. בגלל זה אני עדיין בעניין.',
      'אני בונה כי זה היה התחביב הרבה לפני שהפך לפרנסה. אני מחליט מהר כי קוד שעובד קל לתקן, ובריף שלא הפך לקוד — כמעט אי אפשר. בגלל זה אני עובד POC-first: ככה אני יודע מה לבנות, ויש לך POC ביד עוד לפני שצריך להחליט משהו.',
      'יושב בישראל, עובד עם לקוחות בכל העולם — בעברית ובאנגלית. עדיף לכתוב לי לפני שעוברים על כל חברות הפיתוח: אם זה לא מתאים, אגיד מראש ולא נבזבז זמן לאף אחד.',
    ],
    stats: [
      { value: '5+', label: 'שנים בקוד' },
      { value: '20+', label: 'POCs שנבנו' },
      { value: '0', label: 'תשלום מראש' },
    ],
  },
  brief: {
    number: '04',
    kicker: 'הבריף',
    title: 'מה הרעיון שלך?',
    standfirst:
      'הבריף הזה נוחת ישירות בוואטסאפ שלי, מסודר ומוכן לקריאה. כמה שיותר פירוט — POC ראשון מדויק יותר. גם שלוש שורות זה התחלה.',
    requiredHint: 'חובה רק 3 שדות: סוג, רעיון, וטלפון או מייל.',
    optionalHeading: 'עוד פרטים — לא חובה',
    fields: {
      template: {
        label: 'סוג הפרויקט',
        placeholder: 'התבנית הקרובה ביותר.',
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
      'ייפתח וואטסאפ עם ההודעה כבר מסודרת. אפשר לערוך לפני השליחה — שום מידע לא נשמר באתר.',
    marginalNote:
      'לא חובה למלא הכל. שלושה שדות מספיקים בשביל להתחיל. עברית? יופי. אנגלית? גם בסדר גמור. קישור או צילום מסך? בוואטסאפ, אחרי שליחת הבריף.',
    mailFallback: 'מייל יותר נוח? לחיצה כאן',
    mailSubject: 'בריף חדש מהאתר',
    liveSuccess: 'נפתח וואטסאפ עם הבריף המסודר.',
    liveError: 'יש שדות חסרים. הסימונים האדומים מראים בדיוק איפה.',
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
    title: 'מה שואלים אותי לפני שפונים',
    items: [
      {
        q: 'באמת בלי תשלום על ה־POC?',
        a:
          'באמת. אני משקיע 3–7 ימי עבודה כי זו הדרך הכי טובה שמצאתי להוכיח שאני יכול לבנות את מה שצריך — לפני שמשלמים. לא נמשיך? הסיכון שלי. נמשיך? שני הצדדים יודעים בדיוק על מה חתמו.',
      },
      {
        q: 'מה אם הכיוון עדיין לא ברור?',
        a:
          'מעולה — זה רוב המקרים. אם ראית מוצר שמרגיז אותך, או יש בעיה יומיומית שכואבת — שני משפטים על זה, ואני אבנה את הניחוש הראשון שלי. ברגע שיש משהו לראות, הרבה יותר קל להגיד "כן, אבל…" — וזה בדיוק מה שאני מחפש.',
      },
      {
        q: 'אז איך בעצם משלמים אחרי ה־POC?',
        a:
          'אני לא עובד לפי שעות. כל פרויקט מקבל סקופ ברור ומחיר ידוע מראש — לפי תוצאות. פרויקטים קטנים יוצאים במחיר חבילה. פרויקטים גדולים מתפצלים לאבני דרך, עם תשלום אחרי כל מסירה. אין ריטיינר חודשי, אין חוזה ארוך. נגמרה העבודה — נגמר התשלום.',
      },
    ],
  },
  colophon: {
    number: '06',
    kicker: 'קולופון',
    title: 'יפה. הגעת עד לכאן.',
    pullQuote:
      'אז שווה לתאר את הרעיון במשפט אחד, ולראות מה יוצא מזה.',
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

const EN: Dict = {
  meta: {
    title: 'Bar Moshe — Describe. I Build. You Decide.',
    description:
      'I build a working POC on my own dime before we talk price. If it works for you — we keep going. If not — we part ways, no strings attached.',
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
      'Instead of a brief that drags on for weeks and a proposal you have to wonder about — describe the idea in the form, and I build a first POC on my own dime. If it works for you, we keep building together. If not, we part ways, no strings attached.',
    byline: 'Bar Moshe · Independent builds · since 2020',
    scrollHint: 'Keep reading',
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
        title: 'Startup MVP',
        summary:
          'From Figma to working code in a week. A first version solid enough to show users, raise on, or decide it’s not the direction.',
        fits: ['Solo founder', 'Early-stage startup', 'Small team'],
      },
      {
        slug: 'brand',
        title: 'Brand site with character',
        summary:
          'Not a template. Animations, a palette of your own, interactions that make people remember you. Like this site — only yours.',
        fits: ['New brand', 'Freelancer with identity', 'Studio'],
      },
      {
        slug: 'ecommerce',
        title: 'Custom online store',
        summary:
          'Shopify rebuilt from the ground up, a private checkout system, or a full boutique store from code. Right for a brand with identity — not a generic catalogue.',
        fits: ['Small brand', 'Independent maker', 'Boutique shop'],
      },
      {
        slug: 'ai-agent',
        title: 'Private AI assistant / agent',
        summary:
          'A GPT chatbot for customers, RAG over all your documents, an autonomous agent that triages email and does the work. OpenAI, Anthropic, or an open model.',
        fits: ['Company', 'Ops / support team', 'AI founder'],
      },
      {
        slug: 'ai-video',
        title: 'AI video render pipeline',
        summary:
          'A system that turns text → scenes → rendered video automatically. Remotion, FFmpeg, ElevenLabs, Runway. Right for explainer videos at scale, an illustrated podcast, or daily content for socials.',
        fits: ['Content creator', 'Marketing agency', 'Brand with a series / podcast'],
      },
      {
        slug: 'audio',
        title: 'Audio engine / musical interaction',
        summary:
          'WebAudio, synthesis, multi-channel mixer, real-time effects. Like the Mixtape in my portfolio. Right for a product whose sound is part of the experience — not just background noise.',
        fits: ['Artist', 'Music brand', 'Audio startup'],
      },
      {
        slug: 'game',
        title: 'Browser game / interactive experience',
        summary:
          'Canvas, WebGL, Three.js. A mini-game for a campaign, a viral piece for stories, or a prototype for a game you’re building yourself.',
        fits: ['Brand with a campaign', 'Indie game dev', 'Creative agency'],
      },
      {
        slug: 'realtime',
        title: 'Dashboard / real-time system',
        summary:
          'Admin panel with permissions, live BI, a monitoring system on WebSocket. Charts, filters, CSV export. Everything your team is doing in Excel right now.',
        fits: ['Company', 'Scaling startup', 'Data / ops team'],
      },
      {
        slug: 'mobile',
        title: 'Mobile app',
        summary:
          'iOS + Android in the same codebase. React Native or PWA. Push, offline, store, auth. Same team (me), two platforms.',
        fits: ['Startup', 'B2C product', 'Business with loyal customers'],
      },
      {
        slug: 'other',
        title: 'Something else entirely',
        summary:
          'Got a weird idea in a space I haven’t seen? Perfect — the best things I’ve worked on started that way. Write it in the brief.',
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
          'You fill in a short brief. Three required fields: project type, the idea, and a way to reach you. Everything else is optional. The brief lands directly in my WhatsApp as a tidy message — no server storage, no "subscribe to the newsletter", no nonsense.',
      },
      {
        num: '02',
        title: 'I build',
        body:
          'Within 3–7 days I build a first POC on my own dime. Not a mockup. Not Figma. Working code you can open, click, send to a friend, and ask if this is what you imagined. If not, we part ways here. No invoice.',
      },
      {
        num: '03',
        title: 'You decide',
        body:
          'If it works for you, we talk about going further: clear scope, price known up front, weekly milestones, clean handoff. I don’t work by the hour — I work by the outcome.',
      },
    ],
    pullQuote: {
      quote:
        'The biggest risk for the client isn’t the money — it’s the time wasted on a proposal that never ships.',
      cite: 'Bar Moshe',
    },
  },
  about: {
    number: '03',
    kicker: 'Who I am',
    title: 'Bar Moshe',
    paragraphs: [
      'Full-stack developer since 2020. Most of the work is TypeScript, React, and Node, but the second line of my CV is always something different: WebAudio, GSAP, Three.js, and lately a lot of LLM-based assistants. Every project is a chance to learn something new — that’s why I’m still here.',
      'I build because it was the hobby before it was the job. I decide quickly because it’s much easier to fix code that sort of works than a brief that never became code. That’s why I work POC-first: I learn what to build, and you see what you’re getting.',
      'Based in Israel, working with clients around the world in Hebrew and English. Write before you check the big software shops — if it isn’t a fit, I’ll tell you.',
    ],
    stats: [
      { value: '5+', label: 'years building' },
      { value: '20+', label: 'POCs shipped' },
      { value: '0', label: 'upfront payment' },
    ],
  },
  brief: {
    number: '04',
    kicker: 'The brief',
    title: 'What do you want to build',
    standfirst:
      'This brief goes straight to my WhatsApp as a tidy message. The more detail you give, the sharper the first POC. Three lines is enough to start.',
    requiredHint: 'Only 3 required fields: type, idea, and a way to reach you.',
    optionalHeading: 'More detail — optional',
    fields: {
      template: {
        label: 'Project type',
        placeholder: 'Pick the closest template — you can always change it later',
      },
      idea: {
        label: 'The idea in short',
        hint: 'One sentence or three. Clear beats clever.',
        placeholder:
          'For example: "A platform that connects ceramic makers with design shops — the maker uploads a catalogue, the shop orders directly, and they pay a fee only on a sale."',
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
        placeholder: 'GitHub, a friend, portfolio, search — whatever you remember',
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
    briefFooter: '— sent from the site brief',
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
  },
  qa: {
    number: '05',
    kicker: 'Q & A',
    title: 'What people ask before reaching out',
    items: [
      {
        q: 'Really no payment for the POC?',
        a:
          'Really. I invest 3–7 days because it’s the best way I’ve found to show I can build what you need — before you pay anything. If we don’t continue, that’s my risk. If we do, both sides know exactly what they’re signing up for.',
      },
      {
        q: 'What if I don’t know yet exactly what I want?',
        a:
          'Perfect — that’s most cases. Describe in two sentences what you don’t want, or which daily problem is in front of you, and I’ll build my first read of it. Once you see something, it’s much easier to say "yes, but…" — and that’s exactly what I’m after.',
      },
      {
        q: 'So how does payment actually work after the POC?',
        a:
          'I don’t work by the hour. Every project gets a clear scope and a price known up front — outcome-based. Small projects ship at a package price; larger ones break into milestones with payment after each delivery. No monthly retainer, no long contract. Work’s done — payment’s done.',
      },
    ],
  },
  colophon: {
    number: '06',
    kicker: 'Colophon',
    title: 'Right. You made it this far.',
    pullQuote:
      'So what do you think — worth describing the idea in one sentence and seeing what comes out?',
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
};

const DICTS: Record<Lang, Dict> = { en: EN, he: HE };

export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? HE;
}

// Back-compat exports. Older callers can still `import { t }`; the value
// is the default-language dictionary at module load. Stateful callers
// should use `useLang()` from LangContext instead.
export const t: Dict = DICTS[DEFAULT_LANG];

export function tFor(lang: Lang = DEFAULT_LANG): Dict {
  return getDict(lang);
}
