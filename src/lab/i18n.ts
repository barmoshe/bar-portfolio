/**
 * Lab-page copy. EN + HE. Bilingual dictionary shaped specifically for
 * the smaller Lab intake (no multi-step quest, no per-template hint maps
 * other than the optional `promptHint` on each template item). The
 * structure intentionally mirrors `src/marketing/i18n.ts` only where
 * forked sections (Cover, ProjectTemplates, Process, About, FAQ,
 * ContactCTA, Header) read the same keys — but the brief sub-tree is
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
    items: {
      slug: string;
      title: string;
      summary: string;
      /** Placeholder hint piped into the LabIntake idea textarea. */
      promptHint?: string;
    }[];
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
    };
    templatePickedPrefix: string;
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
    title: 'בר משה — המעבדה. תביא רעיון, אני בונה.',
    description:
      'תביא רעיון, אני בונה. בלי חוזה, בלי הצעת מחיר, בלי שאלות. אם זה עובד — מדברים. אם לא — יצאת עם מוצר ביד.',
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
    number: '01',
    kicker: 'מה אפשר לבנות',
    title: 'אז מה רץ לך בראש?',
    standfirst:
      'כמה דוגמאות. תבחר את הקרוב ביותר, או פשוט תכתוב משלך. הטופס נפתח עם פלייסהולדר שמתאים לסוג.',
    items: [
      {
        slug: 'mvp',
        title: 'גרסה ראשונה למיזם',
        summary: 'מרעיון למוצר עובד, מהר. גרסה ראשונה שמספיק טובה להראות.',
        promptHint:
          'למשל: פלטפורמה שמחברת בין מעצבים פרילנסרים ללקוחות — הזמנה, תיאום, תשלום בנאמנות.',
      },
      {
        slug: 'brand',
        title: 'אתר משלך, לא מתבנית',
        summary: 'מעוצב ונבנה אישית. טיפוגרפיה, צבעים ואנימציות שמתאימים לך.',
        promptHint:
          'למשל: אתר לסטודיו קרמיקה — שקט, מוזיאוני, עם גלריית עבודות שמרגישה כמו חדר תצוגה.',
      },
      {
        slug: 'ecommerce',
        title: 'חנות אונליין מעוצבת אישית',
        summary: 'חנות עם אופי. לא קטלוג גנרי.',
        promptHint:
          'למשל: חנות לספלי קרמיקה בעבודת יד — 4 דגמים, סיפור של היוצר על כל מוצר.',
      },
      {
        slug: 'ai-agent',
        title: 'סוכן AI שעובד בשבילך',
        summary: 'צ׳אט ללקוחות, מענה לפי מסמכים שלך, סוכן שעובר על מיילים.',
        promptHint:
          'למשל: סוכן שקורא מיילים נכנסים, מתייג לפי כוונה (דמו / תמחור / ספאם) ומציע טיוטת תשובה.',
      },
      {
        slug: 'ai-video',
        title: 'סטודיו יצירתי מבוסס AI',
        summary: 'כלים לגרפיקה, תמונות, סרטונים — מהרעיון לתוצר.',
        promptHint:
          'למשל: כלי שמקבל כותרת חדשות בבוקר ומייצר סרטון אנכי קצר עם הקראה ורקע מתאים.',
      },
      {
        slug: 'audio',
        title: 'מוזיקה, סאונד וכל מה שביניהם',
        summary: 'פלאגינים, כלי הפקה, סינתזה, אפקטים בזמן אמת.',
        promptHint:
          'למשל: פס-קול אינטראקטיבי לאתר גלריה — אקורדים שמשתנים תוך כדי גלילה בין סקציות.',
      },
      {
        slug: 'game',
        title: 'משחק דפדפן או חוויה אינטראקטיבית',
        summary: 'משחקון לקמפיין, חוויה לסטוריז, או גרסה ראשונה למשחק אינדי.',
        promptHint:
          'למשל: מיני-משחק שיתופי לקמפיין מותג — לחיצה מהירה, טבלת שיאים, אפשרות לשתף תוצאה.',
      },
      {
        slug: 'realtime',
        title: 'דשבורד שמתעדכן בזמן אמת',
        summary: 'פאנל ניהול עם הרשאות, נתונים חיים, התראות, ייצוא.',
        promptHint:
          'למשל: דשבורד למחסן — תחנות, הזמנות פתוחות, התראה כשתחנה רגועה יותר מ-5 דקות.',
      },
      {
        slug: 'mobile',
        title: 'אפליקציה לטלפון',
        summary: 'אפליקציה שעובדת על כל טלפון. התראות, מצב לא־מקוון, התחברות.',
        promptHint:
          'למשל: אפליקציה לחובבי ציפורים — לוג של תצפית ב-3 הקשות, גרף ועוד מה נצפה בסביבה היום.',
      },
      {
        slug: 'other',
        title: 'משהו אחר לגמרי',
        summary: 'יש לך רעיון מוזר? מעולה. הדברים הטובים מתחילים ככה.',
        promptHint:
          'תאר את הרעיון כמו שאתה מספר אותו לחבר. מוזר זה בברכה.',
      },
    ],
    pickedLabel: 'נבחר',
  },
  method: {
    number: '02',
    kicker: 'איך זה עובד',
    title: 'שלושה שלבים, אפס מחויבות',
    standfirst:
      'בלי חוזים. בלי הצעת מחיר. בלי שאלות. שולח, בונה, מחליטים.',
    steps: [
      {
        num: '01',
        title: 'שולח',
        body:
          'טופס קצר. שלושה שדות. עברית רגילה. בלי באזוורדס, בלי הכנה. ייקח לך פחות מדקה.',
      },
      {
        num: '02',
        title: 'אני בונה',
        body:
          'כמה ימים. גרסה ראשונה חיה, באוויר, עם לינק שאפשר לשלוח. חינם. בלי חוזה, בלי שאלות.',
      },
      {
        num: '03',
        title: 'מחליטים',
        body:
          'רוצים להמשיך יחד? מדברים. לא רוצים? יצאת עם מוצר ביד. No strings attached.',
      },
    ],
  },
  about: {
    number: '03',
    kicker: 'מי אני',
    title: 'אני אוהב לבנות',
    paragraphs: [
      'אני אוהב לבנות. ובא לי לבנות לא רק לעצמי.',
      'היום כולם בונים הכל עם AI. קשה לעקוב, וכולם מרגישים קצת בפיגור. וזה גם די נכון. אבל רוב מה שאנשים באמת צריכים זה דברים פשוטים — אתר לעסק, אפליקציה קטנה, כלי שיחסוך שעות בעבודה.',
      'הכלים החדשים (Base44, Lovable וכאלה) הם הדרך הקלה לעבוד עם AI לבד, והם מצוינים. אבל לפעמים מה שחסר זה בנאדם באמצע — מישהו שמבין צורך, מוצר ופיתוח, לא רק את הפרומפט.',
      'אז זה מה שאני מציע פה: רעיון שלך, בנייה עליי, אפס מחויבות.',
    ],
  },
  brief: {
    number: '04',
    kicker: 'הבריף',
    title: 'מה אתה רוצה לבנות?',
    standfirst:
      'שלוש שורות בעברית רגילה. הטופס נוחת אצלי בוואטסאפ. אם רוצים לערוך לפני שליחה — אפשר.',
    fields: {
      idea: {
        label: 'הרעיון',
        hint: 'משפט אחד או שלושה. ברור עדיף על מתוחכם.',
        placeholder: 'בקצרה — מה אתה רוצה שיקרה?',
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
    previewEmpty: 'תתחיל לכתוב — הבריף ייבנה פה תוך כדי.',
    previewFor: 'בשביל',
    previewLike: 'כמו',
    previewSendVia: { whatsapp: 'נשלח בוואטסאפ', email: 'נשלח במייל' },
    briefHeading: 'היי בר,',
    briefFooter: '— נשלח מהמעבדה באתר',
    briefSections: {
      type: '*סוג*',
      idea: '*הרעיון*',
      whoFor: '*בשביל מי*',
      reference: '*דוגמה דומה*',
    },
    templatePickedPrefix: 'סוג נבחר',
  },
  qa: {
    number: '05',
    kicker: 'שאלות',
    title: 'מה שואלים אותי',
    items: [
      {
        q: 'איפה הקאצ׳?',
        a:
          'אין קאצ׳. אני אוהב לבנות, ולפעמים בא לי לבנות לאחרים. אם הגרסה הראשונה עובדת ונרצה להמשיך יחד — נדבר על זה אז. אם לא — נעימה הייתה ההיכרות.',
      },
      {
        q: 'כמה זמן זה לוקח?',
        a:
          'בדרך כלל כמה ימים. תלוי בסיבוך — אבל הרעיון הוא לבנות גרסה ראשונה מהר, לא מוצר מלא. ברגע שיש משהו לראות, הרבה יותר קל לדעת מה הלאה.',
      },
      {
        q: 'מה אם אני נעלם אחרי?',
        a:
          'זה בסדר גמור. בניתי כי בא לי. יצא לי לבנות עוד משהו שאהבתי לבנות. הקוד שלך — אם תרצה אותו, אעביר.',
      },
      {
        q: 'באיזה כלים אתה משתמש?',
        a:
          'תלוי בפרויקט. לפעמים זה כתיבה ישירה של קוד, לפעמים שילוב עם Base44/Lovable וכאלה. אני בוחר את הכלי המתאים — לא להפך.',
      },
      {
        q: 'אני בכלל לא טכני, זה בעיה?',
        a:
          'הפוך. אם תוכל לתאר במילים מה אתה רוצה שיקרה — יש לי מספיק לעבוד איתו. הצד הטכני הוא הצד שלי.',
      },
    ],
  },
  colophon: {
    number: '06',
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
    title: 'Bar Moshe — The Lab. Bring an idea. I build.',
    description:
      'Bring an idea, I build. No contract, no quote, no questions. If it works — we talk. If not — you walk away with a product.',
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
    number: '01',
    kicker: 'What we can build',
    title: 'So what’s on your mind?',
    standfirst:
      'A few examples. Pick the closest — or write your own. The form opens with a matching placeholder.',
    items: [
      {
        slug: 'mvp',
        title: 'First version of a venture',
        summary: 'From idea to a working product, fast. Solid enough to show.',
        promptHint:
          'For example: a platform connecting freelance designers and clients — booking, scope, escrow payment.',
      },
      {
        slug: 'brand',
        title: 'A site of your own, not from a template',
        summary: 'Designed and built personally. Typography, colors, animations chosen for you.',
        promptHint:
          'For example: a site for a ceramics studio — quiet, museum-like, with a gallery that feels like a viewing room.',
      },
      {
        slug: 'ecommerce',
        title: 'A custom-designed online store',
        summary: 'A store with identity. Not a generic catalogue.',
        promptHint:
          'For example: a shop for hand-thrown ceramic mugs — 4 styles, a story from the maker on every item.',
      },
      {
        slug: 'ai-agent',
        title: 'Private AI assistant / agent',
        summary: 'Customer chat, doc-grounded Q&A, an agent that triages email.',
        promptHint:
          'For example: an agent that reads incoming sales emails, tags them by intent (demo / pricing / spam), and drafts a first reply.',
      },
      {
        slug: 'ai-video',
        title: 'AI creative & visual toolkit',
        summary: 'Graphics, images, video — from idea to finished asset.',
        promptHint:
          'For example: a tool that takes a morning news headline and produces a short vertical video with VO and b-roll.',
      },
      {
        slug: 'audio',
        title: 'Music, sound, and the tools in between',
        summary: 'Plugins, production tools, synthesis, real-time effects.',
        promptHint:
          'For example: an interactive soundtrack for a gallery site — chords shift as you scroll between sections.',
      },
      {
        slug: 'game',
        title: 'Browser game / interactive experience',
        summary: 'A mini-game for a campaign, a viral piece, or a first version of an indie game.',
        promptHint:
          'For example: a shareable click-to-win mini-game for a brand campaign — leaderboard, share-result, fast.',
      },
      {
        slug: 'realtime',
        title: 'Dashboard / real-time system',
        summary: 'Admin panel with permissions, live data, alerts, exports.',
        promptHint:
          'For example: a warehouse dashboard — pick-stations, open orders, alert when a station idles >5min.',
      },
      {
        slug: 'mobile',
        title: 'Mobile app',
        summary: 'An app for every phone. Notifications, offline mode, sign-in.',
        promptHint:
          'For example: an app for amateur birders — log a sighting in 3 taps, see what was spotted nearby today.',
      },
      {
        slug: 'other',
        title: 'Something else entirely',
        summary: 'Got a weird idea? Great. The good ones start that way.',
        promptHint:
          'Describe it like you’d tell a friend. Weird is welcome.',
      },
    ],
    pickedLabel: 'Picked',
  },
  method: {
    number: '02',
    kicker: 'How it works',
    title: 'Three steps, zero commitment',
    standfirst:
      'No contracts. No quotes. No questions. You send, I build, we decide.',
    steps: [
      {
        num: '01',
        title: 'You send',
        body:
          'A short brief. Three fields. Plain English. No buzzwords, no prep. Under a minute.',
      },
      {
        num: '02',
        title: 'I build',
        body:
          'A few days. A live first version, online, with a link you can share. Free. No contract, no questions.',
      },
      {
        num: '03',
        title: 'We decide',
        body:
          'Want to keep going together? Let’s talk. Don’t? You walked away with a product. No strings attached.',
      },
    ],
  },
  about: {
    number: '03',
    kicker: 'Who I am',
    title: 'I love building',
    paragraphs: [
      'I love building. And I want to build for others, not just myself.',
      'Today everyone builds everything with AI. Hard to follow, easy to feel behind. That’s also kind of true. But most of what people actually need stays simple — a small site, a small app, a tool that saves hours.',
      'The new tools (Base44, Lovable and the like) are the easy way to work with AI alone, and they’re great. But sometimes what’s missing is a human in the middle — someone who understands need, product, and development, not just the prompt.',
      'So here’s what I’m offering: your idea, my build, zero commitment.',
    ],
  },
  brief: {
    number: '04',
    kicker: 'The brief',
    title: 'What do you want to build?',
    standfirst:
      'Three lines in plain English. The brief lands in my WhatsApp. You can still edit before sending.',
    fields: {
      idea: {
        label: 'The idea',
        hint: 'One sentence or three. Clear beats clever.',
        placeholder: 'In short — what do you want to happen?',
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
    previewEmpty: 'Start typing — the brief assembles here as you go.',
    previewFor: 'For',
    previewLike: 'Like',
    previewSendVia: { whatsapp: 'Sending via WhatsApp', email: 'Sending via email' },
    briefHeading: 'Hi Bar,',
    briefFooter: '— sent from the Lab',
    briefSections: {
      type: '*Type*',
      idea: '*The idea*',
      whoFor: '*For*',
      reference: '*Similar to*',
    },
    templatePickedPrefix: 'Type picked',
  },
  qa: {
    number: '05',
    kicker: 'Q&A',
    title: 'What people ask',
    items: [
      {
        q: 'Where’s the catch?',
        a:
          'No catch. I love building, and sometimes I want to build for others. If the first version works and we want to continue together — we’ll talk about that then. If not — nice meeting you.',
      },
      {
        q: 'How long does it take?',
        a:
          'Usually a few days. Depends on complexity — but the goal is a fast first version, not a full product. Once there’s something to see, it’s much easier to know what comes next.',
      },
      {
        q: 'What if I disappear after?',
        a:
          'Totally fine. I built because I wanted to. I got to build one more thing I enjoyed building. Your code — if you want it, I’ll hand it over.',
      },
      {
        q: 'What tools do you use?',
        a:
          'Depends on the project. Sometimes direct code, sometimes integration with Base44/Lovable and the like. I pick the tool for the job — not the other way around.',
      },
      {
        q: 'I’m not technical at all — is that a problem?',
        a:
          'The opposite. If you can describe in words what you want to happen, I have enough to work with. The technical side is on me.',
      },
    ],
  },
  colophon: {
    number: '06',
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
