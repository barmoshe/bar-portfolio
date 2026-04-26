type Item = { q: string; a: string };

const ITEMS: Item[] = [
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
];

export default function FAQ() {
  return (
    <section className="mp-section" id="faq" aria-labelledby="faq-headline">
      <span className="mp-eyebrow">שאלות נפוצות</span>
      <h2 className="mp-h2" id="faq-headline">
        מה שאנשים <mark>שואלים אותי.</mark>
      </h2>

      <div className="mp-faq">
        {ITEMS.map((it, i) => (
          <details key={it.q} {...(i === 0 ? { open: true } : {})}>
            <summary>{it.q}</summary>
            <p className="mp-faq__a">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
