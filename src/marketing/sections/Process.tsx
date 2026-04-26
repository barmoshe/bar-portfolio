type Step = { num: string; title: string; body: string };

const STEPS: Step[] = [
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
];

export default function Process() {
  return (
    <section className="mp-section mp-section--alt" id="process" aria-labelledby="process-headline">
      <div className="mp-section__inner">
        <span className="mp-eyebrow">איך עובדים</span>
        <h2 className="mp-h2" id="process-headline">
          שלושה שלבים, <mark>בלי הפתעות.</mark>
        </h2>
        <p className="mp-lead">
          בלי תהליכים מסובכים. שיחה ראשונה, בנייה שקופה, ומסירה עם ליווי קצר אחרי שעולים לאוויר.
        </p>

        <ol className="mp-process" aria-label="שלבים">
          {STEPS.map((s) => (
            <li className="mp-process__step" key={s.num}>
              <span className="mp-process__num" aria-hidden="true">{s.num}</span>
              <h3 className="mp-process__title">{s.title}</h3>
              <p className="mp-process__body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
