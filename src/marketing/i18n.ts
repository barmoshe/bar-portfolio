/**
 * Marketing-site translations. Hebrew is the default; English is the
 * opt-in alternate. Components read from `useT()` which returns the
 * dictionary for the active language. Strings are organized by section
 * so adding a new locale only requires duplicating the matching keys.
 */

export type Lang = 'he' | 'en';

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
    langTitleHe: string;
    langTitleEn: string;
    langGlyphHe: string;
    langGlyphEn: string;
  };
  hero: {
    sticker: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    questionsLabel: string;
    questions: string[];
    ctaWhatsapp: string;
    ctaMail: string;
    whatsappPrefill: string;
    statsLabel: string;
    stats: { num: string; label: string }[];
  };
  audience: {
    eyebrow: string;
    headlineLead: string;
    headlineMark: string;
    lead: string;
    items: {
      slug: string;
      emoji: string;
      kicker: string;
      title: string;
      summary: string;
      cta: string;
      ariaLabel: string;
      whatsappMessage: string;
    }[];
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
    ctaWhatsapp: string;
    ctaMail: string;
  };
  sticky: {
    region: string;
    whatsapp: string;
    mail: string;
  };
  footer: {
    text: string;
    portfolioLink: string;
  };
};

const HE: Dict = {
  meta: {
    title: 'בר משה — שירותים: לימוד, ליווי, ובנייה',
    description: 'בר משה — מפתח עצמאי. שיעורים פרטיים, ליווי טכני, ובניית אפליקציות, אתרים ורעיונות יצירתיים.',
  },
  header: {
    skip: 'דלג לתוכן',
    brandName: 'בר משה',
    brandTagline: '// סטודיו פרטי',
    back: '← פורטפוליו',
    a11yTitle: 'הגדרות נגישות',
    a11yLabel: 'פתיחת הגדרות נגישות',
    langTitleHe: 'עברית',
    langTitleEn: 'English',
    langGlyphHe: 'EN',
    langGlyphEn: 'עב',
  },
  hero: {
    sticker: '🎯 פתוח לפרויקטים חדשים',
    headlineLead: 'רעיון בראש,\nואין מושג מאיפה ',
    headlineMark: 'מתחילים?',
    lead: 'אני בר. מלמד, מלווה, ובונה — אפליקציות, אתרים, ורעיונות יצירתיים מהסקיצה ועד הלייב. בלי הפתעות, ובלי באזוורדס.',
    questionsLabel: 'מתאים אם...',
    questions: [
      'רוצה ללמוד לבנות בלי לדעת איך מתחילים',
      'יש לך מוצר בראש ואת.ה צריך.ה מישהו שינווט אותו לאוויר',
      'צוות קטן שמחפש מנטור או בילדר חיצוני',
    ],
    ctaWhatsapp: 'דברו איתי בוואטסאפ',
    ctaMail: 'שלחו מייל',
    whatsappPrefill: 'היי בר! יש לי רעיון בראש ואני מחפש.ת מאיפה להתחיל. אשמח לתאם שיחה ראשונה.',
    statsLabel: 'במספרים',
    stats: [
      { num: '5+', label: 'שנים מפתח' },
      { num: '20+', label: 'פרויקטים שוגרו' },
      { num: '∞', label: 'קפה במהלך' },
    ],
  },
  audience: {
    eyebrow: 'למי זה מתאים',
    headlineLead: 'אם אחד מאלה מוכר — ',
    headlineMark: 'בואו נדבר.',
    lead: 'ארבעה כיוונים, כל אחד עם נקודת התחלה משלו. בחר.י את שלך וההודעה תיפתח עם ההקשר הנכון.',
    items: [
      {
        slug: 'learners',
        emoji: '🎓',
        kicker: 'לומדים',
        title: 'רוצה ללמוד לפתח',
        summary: 'שיעורים פרטיים מאפס, ליווי למטלות, והדרכה לפרויקט גמר. מתחילים ראשון ללא התחייבות.',
        cta: 'בואו נדבר על שיעור',
        ariaLabel: 'פתח שיחה ב-WhatsApp - לומדים',
        whatsappMessage: 'שלום בר, אני מעוניין/ת ללמוד פיתוח ולקבל ליווי. אשמח לשמוע איך מתחילים.',
      },
      {
        slug: 'builders',
        emoji: '🛠',
        kicker: 'בילדרים',
        title: 'יש לי רעיון לבנות',
        summary: 'מ-MVP לאתר תדמית. מתכננים יחד, בונים בקצב צפוי, ומשגרים בלי הפתעות.',
        cta: 'נדבר על הרעיון',
        ariaLabel: 'פתח שיחה ב-WhatsApp - בילדרים',
        whatsappMessage: 'שלום בר, יש לי רעיון לפרויקט ואני צריך/ה הכוונה ובנייה. בא לי לשמוע איך אתה עובד.',
      },
      {
        slug: 'startups',
        emoji: '🚀',
        kicker: 'סטארטאפים',
        title: 'צוות קטן שזקוק למנטור',
        summary: 'מנטורינג, סקירות קוד, בחירת מחסנית טכנולוגית, ועזרה במעבר מ-MVP למוצר חי.',
        cta: 'נתאם שיחת ייעוץ',
        ariaLabel: 'פתח שיחה ב-WhatsApp - סטארטאפים',
        whatsappMessage: 'שלום בר, אני מסטארטאפ/צוות פיתוח קטן ואנחנו מחפשים מנטור או יועץ טכני. אפשר לתאם שיחה?',
      },
      {
        slug: 'companies',
        emoji: '🏢',
        kicker: 'חברות',
        title: 'חברה שצריכה בילדר חיצוני',
        summary: 'בנייה מקצה לקצה: אתרי תדמית, אפליקציות, כלי AI פנימיים, ואינטגרציות. עם תיעוד ומסירה מסודרת.',
        cta: 'נתאם שיחה ראשונה',
        ariaLabel: 'פתח שיחה ב-WhatsApp - חברות',
        whatsappMessage: 'שלום, אנחנו חברה שמעוניינת לשכור אותך לפרויקט. אשמח להציג בקצרה את הצורך ולתאם שיחה.',
      },
    ],
  },
  services: {
    eyebrow: 'השירותים',
    headlineLead: 'שלושה ',
    headlineMark: 'שערים',
    lead: 'כל שירות עומד בפני עצמו — בחר.י מה שמתאים, או נשלב כמה לפי השלב שלך.',
    ctaLabel: 'לפרטים ולתיאום',
    items: [
      {
        slug: 'tutoring',
        emoji: '🎓',
        kicker: 'לימוד פרטי',
        title: 'שיעורים אחד על אחד',
        summary: 'רוצה ללמוד לבנות בלי לדעת לבנות? אני אקח אותך מאפס לפרויקט אמיתי — בקצב שלך, בלי שטויות.',
        bullets: [
          'מבוא לתכנות, JavaScript, TypeScript ו-React',
          'ליווי לבחינות, מטלות ופרויקטי גמר',
          'הצצה ל-DevOps, ענן ו-AI לפי הצורך',
          'שיעור ראשון להיכרות — חינם',
        ],
        whatsappMessage: 'שלום בר, אני מעוניין/ת בשיעורים פרטיים בתכנות. אשמח לתאם שיחת היכרות.',
      },
      {
        slug: 'guiding',
        emoji: '🧭',
        kicker: 'ליווי וייעוץ',
        title: 'ליווי טכני לצוות או יזם.ית סולו',
        summary: 'יש לך רעיון ולא בטוח.ה איך מתחילים? נשב ביחד, נבנה תוכנית, ונוודא שכל בחירה טכנית משרתת את המוצר.',
        bullets: [
          'סקירת קוד וארכיטקטורה',
          'בחירת מחסנית טכנולוגית ותכנון תשתית',
          'מנטורינג שבועי / דו־שבועי לצוותי פיתוח',
          'עזרה במעבר מ-MVP למוצר חי',
        ],
        whatsappMessage: 'שלום בר, אני מחפש/ת ליווי וייעוץ טכני לפרויקט/צוות. אפשר לתאם שיחה?',
      },
      {
        slug: 'building',
        emoji: '🛠',
        kicker: 'בנייה',
        title: 'בונים מקצה לקצה',
        summary: 'מ-MVP לאתר חברה, מאפליקציית מובייל לכלי AI פנימי. מתכננים, בונים, ומשגרים — בלי הפתעות.',
        bullets: [
          'אתרי תדמית, נחיתה ו-Web Apps',
          'אפליקציות React Native / מובייל היברידי',
          'אינטגרציות AI, אוטומציות ו-DevOps',
          'ליווי שבועיים אחרי הלייב — כלול',
        ],
        whatsappMessage: 'שלום בר, יש לי פרויקט שאני רוצה לבנות מקצה לקצה. אשמח לתאם שיחה.',
      },
    ],
  },
  process: {
    eyebrow: 'איך עובדים',
    headlineLead: 'שלושה שלבים, ',
    headlineMark: 'בלי הפתעות.',
    lead: 'בלי תהליכים מסובכים. שיחה ראשונה, בנייה שקופה, ומסירה עם ליווי קצר אחרי שעולים לאוויר.',
    stepsLabel: 'שלבים',
    steps: [
      {
        num: '01',
        title: 'בריף',
        body: 'שיחת היכרות קצרה. מציפים את הצורך, מי המשתמש.ת, ואיך מודדים הצלחה. יוצאים עם תוכנית קונקרטית.',
      },
      {
        num: '02',
        title: 'בנייה',
        body: 'אני בונה בקצב צפוי, עם אבני דרך שבועיות. את.ה רואה התקדמות, נותן.ת פידבק, וכיוון משתנה כשצריך.',
      },
      {
        num: '03',
        title: 'מסירה',
        body: 'משגרים, מתעדים, ומשאירים אותך עם משהו שאת.ה יכול.ה לתחזק. ליווי שבועיים אחרי הלייב — כלול.',
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
        quote: 'התחלתי בלי שום רקע בתכנות. אחרי 3 חודשים שיגרנו לאוויר אתר שאני באמת מבין/ה מאחורי הקלעים.',
        name: 'נ. ל.',
        role: 'יזמית, סטודיו עיצוב',
        accent: 'primary',
      },
      {
        id: 't2',
        quote: 'הקצב היה צפוי, התקשורת ברורה, וחזרנו עם מוצר שאפשר לתחזק. הליווי אחרי הלייב היה ההבדל.',
        name: 'א. ב.',
        role: 'מנהל מוצר, חברת B2B',
        accent: 'accent3',
      },
      {
        id: 't3',
        quote: 'בר תפס את הצורך מהשיחה הראשונה. בלי באזוורדס, בלי הפתעות תקציב, ועם פתרון שהחזיק שנים.',
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
        q: 'אני בלי רקע טכני בכלל. עדיין רלוונטי?',
        a: 'בהחלט. רוב מי שפונים אליי לא בא מעולם הקוד. השיעור הראשון הוא תמיד היכרות — בלי התחייבות — שבה נבדוק יחד אם זה מתאים, ובאיזה קצב.',
      },
      {
        q: 'כמה זמן לוקח לבנות פרויקט?',
        a: 'תלוי בסקופ. אתר נחיתה — שבוע עד שבועיים. MVP אפליקציה — 4 עד 8 שבועות. אחרי שיחת בריף קצרה אני שולח הערכת זמן ריאלית עם אבני דרך.',
      },
      {
        q: 'באילו טכנולוגיות אתה עובד?',
        a: 'יומיום זה React, TypeScript, Node, ו-Vite — וכל מה שמסביב כשצריך: AI / LLM, Python, ענן (AWS / Vercel), DevOps, React Native. הבחירה תמיד נגזרת מהצורך, לא להפך.',
      },
      {
        q: 'מאיפה מתחילים?',
        a: 'הכי פשוט — הודעה בוואטסאפ או מייל. תכתבו במשפט-שניים מה הרעיון, ואני אחזור עם זמינות לשיחה ראשונה.',
      },
    ],
  },
  contact: {
    headline: 'בואו נבנה את זה ביחד.',
    body: 'שיחה ראשונה ללא התחייבות — מספרים לי על הרעיון, ואני אומר אם זה משהו שאני יכול לעזור איתו.',
    ctaWhatsapp: 'וואטסאפ',
    ctaMail: 'מייל',
  },
  sticky: {
    region: 'קישורי יצירת קשר מהירים',
    whatsapp: 'וואטסאפ',
    mail: 'מייל',
  },
  footer: {
    text: 'בר משה © 2026 · ',
    portfolioLink: 'חזרה לפורטפוליו',
  },
};

const EN: Dict = {
  meta: {
    title: 'Bar Moshe - Tutoring, Mentoring, and Building',
    description: 'Bar Moshe - independent developer. Private tutoring, technical mentoring, and building apps, websites, and creative ideas end-to-end.',
  },
  header: {
    skip: 'Skip to content',
    brandName: 'Bar Moshe',
    brandTagline: '// independent studio',
    back: 'Portfolio →',
    a11yTitle: 'Accessibility settings',
    a11yLabel: 'Open accessibility settings',
    langTitleHe: 'עברית',
    langTitleEn: 'English',
    langGlyphHe: 'EN',
    langGlyphEn: 'עב',
  },
  hero: {
    sticker: '🎯 Open for new projects',
    headlineLead: "Got an idea\nbut no clue where to ",
    headlineMark: 'start?',
    lead: "I'm Bar. I teach, mentor, and build - apps, websites, and creative ideas from sketch to live. No surprises, no buzzwords.",
    questionsLabel: 'For you if...',
    questions: [
      'You want to learn to build but don\'t know how to start',
      'You have a product in mind and need someone to ship it',
      'A small team looking for a mentor or external builder',
    ],
    ctaWhatsapp: 'Message me on WhatsApp',
    ctaMail: 'Send an email',
    whatsappPrefill: "Hi Bar! I have an idea in mind and I'm looking for a place to start. Would love to schedule a first call.",
    statsLabel: 'By the numbers',
    stats: [
      { num: '5+', label: 'years building' },
      { num: '20+', label: 'projects shipped' },
      { num: '∞', label: 'coffee along the way' },
    ],
  },
  audience: {
    eyebrow: 'Who this is for',
    headlineLead: 'If one of these sounds familiar - ',
    headlineMark: "let's talk.",
    lead: 'Four directions, each with its own starting point. Pick yours and the message opens with the right context.',
    items: [
      {
        slug: 'learners',
        emoji: '🎓',
        kicker: 'Learners',
        title: 'I want to learn to code',
        summary: 'Private lessons from zero, homework support, and final-project guidance. First session - no commitment.',
        cta: "Let's talk lessons",
        ariaLabel: 'Open WhatsApp chat - Learners',
        whatsappMessage: "Hi Bar, I'd like to learn coding and get some guidance. Would love to hear how to get started.",
      },
      {
        slug: 'builders',
        emoji: '🛠',
        kicker: 'Builders',
        title: 'I have an idea to build',
        summary: 'From MVP to landing page. We plan together, build at a predictable pace, and ship without surprises.',
        cta: "Let's talk about the idea",
        ariaLabel: 'Open WhatsApp chat - Builders',
        whatsappMessage: 'Hi Bar, I have a project idea and need direction and a builder. Curious to hear how you work.',
      },
      {
        slug: 'startups',
        emoji: '🚀',
        kicker: 'Startups',
        title: 'A small team that needs a mentor',
        summary: 'Mentoring, code reviews, tech-stack picks, and help moving from MVP to a live product.',
        cta: "Let's set up a call",
        ariaLabel: 'Open WhatsApp chat - Startups',
        whatsappMessage: "Hi Bar, I'm from a startup / small dev team and we're looking for a mentor or technical advisor. Can we schedule a call?",
      },
      {
        slug: 'companies',
        emoji: '🏢',
        kicker: 'Companies',
        title: 'A company that needs an external builder',
        summary: 'End-to-end builds: marketing sites, apps, internal AI tools, and integrations. With docs and a clean handoff.',
        cta: "Let's schedule a first call",
        ariaLabel: 'Open WhatsApp chat - Companies',
        whatsappMessage: "Hi, we're a company interested in hiring you for a project. Happy to brief you and schedule a call.",
      },
    ],
  },
  services: {
    eyebrow: 'Services',
    headlineLead: 'Three ',
    headlineMark: 'gateways',
    lead: 'Each service stands alone - pick what fits, or we combine a few based on the stage you\'re at.',
    ctaLabel: 'Details and scheduling',
    items: [
      {
        slug: 'tutoring',
        emoji: '🎓',
        kicker: 'Private tutoring',
        title: 'One-on-one lessons',
        summary: "Want to learn to build without knowing how? I'll take you from zero to a real project - at your pace, no fluff.",
        bullets: [
          'Intro to programming, JavaScript, TypeScript, and React',
          'Support for exams, homework, and capstone projects',
          'A peek at DevOps, cloud, and AI as needed',
          'First intro lesson - free',
        ],
        whatsappMessage: "Hi Bar, I'm interested in private coding lessons. Would love to schedule an intro call.",
      },
      {
        slug: 'guiding',
        emoji: '🧭',
        kicker: 'Mentoring & advising',
        title: 'Technical mentoring for teams or solo founders',
        summary: "Got an idea and not sure how to start? We sit together, build a plan, and make sure every tech choice serves the product.",
        bullets: [
          'Code and architecture reviews',
          'Tech-stack picks and infrastructure planning',
          'Weekly / bi-weekly mentoring for dev teams',
          'Help moving from MVP to live product',
        ],
        whatsappMessage: "Hi Bar, I'm looking for technical mentoring for a project / team. Can we schedule a call?",
      },
      {
        slug: 'building',
        emoji: '🛠',
        kicker: 'Building',
        title: 'End-to-end builds',
        summary: "From MVP to company site, from mobile app to internal AI tool. We plan, build, and ship - no surprises.",
        bullets: [
          'Marketing sites, landing pages, and Web Apps',
          'React Native / hybrid mobile apps',
          'AI integrations, automations, and DevOps',
          'Two weeks of post-launch support - included',
        ],
        whatsappMessage: 'Hi Bar, I have a project I want to build end-to-end. Would love to schedule a call.',
      },
    ],
  },
  process: {
    eyebrow: 'How we work',
    headlineLead: 'Three steps, ',
    headlineMark: 'no surprises.',
    lead: 'No complicated processes. A first call, transparent building, and a clean handoff with short post-launch support.',
    stepsLabel: 'Steps',
    steps: [
      {
        num: '01',
        title: 'Brief',
        body: "A short intro call. We surface the need, who the user is, and how we measure success. We leave with a concrete plan.",
      },
      {
        num: '02',
        title: 'Build',
        body: 'I build at a predictable pace, with weekly milestones. You see progress, give feedback, and we change direction when needed.',
      },
      {
        num: '03',
        title: 'Handoff',
        body: 'We ship, document, and leave you with something you can maintain. Two weeks of post-launch support - included.',
      },
    ],
  },
  proof: {
    eyebrow: 'Testimonials',
    headlineLead: 'Voices that went ',
    headlineMark: 'live.',
    lead: 'A few lines from people who studied with me, built with me, or shipped something together.',
    items: [
      {
        id: 't1',
        quote: 'I started with zero coding background. Three months later we shipped a site I genuinely understand under the hood.',
        name: 'N. L.',
        role: 'Founder, design studio',
        accent: 'primary',
      },
      {
        id: 't2',
        quote: 'The pace was predictable, communication was clear, and we walked away with a maintainable product. Post-launch support made the difference.',
        name: 'A. B.',
        role: 'Product manager, B2B company',
        accent: 'accent3',
      },
      {
        id: 't3',
        quote: 'Bar grasped the need from the first call. No buzzwords, no budget surprises, with a solution that lasted years.',
        name: 'M. K.',
        role: 'Founder, edtech startup',
        accent: 'accent2',
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    headlineLead: 'What people ',
    headlineMark: 'ask me.',
    items: [
      {
        q: "I have zero technical background. Is this still relevant?",
        a: "Absolutely. Most of the people who reach out don't come from code. The first session is always an intro - no commitment - where we check together if it fits and at what pace.",
      },
      {
        q: 'How long does a project take?',
        a: 'Depends on scope. Landing site - one to two weeks. App MVP - 4 to 8 weeks. After a short brief call I send a realistic time estimate with milestones.',
      },
      {
        q: 'What technologies do you work with?',
        a: 'Day-to-day: React, TypeScript, Node, and Vite - plus everything around it as needed: AI / LLM, Python, cloud (AWS / Vercel), DevOps, React Native. The choice always follows the need.',
      },
      {
        q: 'Where do we start?',
        a: 'The simplest way - a WhatsApp message or email. Drop a sentence or two about the idea and I\'ll get back with availability for a first call.',
      },
    ],
  },
  contact: {
    headline: "Let's build it together.",
    body: "A first call with no commitment - tell me about the idea and I'll say if it's something I can help with.",
    ctaWhatsapp: 'WhatsApp',
    ctaMail: 'Email',
  },
  sticky: {
    region: 'Quick contact links',
    whatsapp: 'WhatsApp',
    mail: 'Email',
  },
  footer: {
    text: 'Bar Moshe © 2026 · ',
    portfolioLink: 'back to portfolio',
  },
};

export const dictionaries: Record<Lang, Dict> = { he: HE, en: EN };
