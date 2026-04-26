import type { Route } from '../lib/route';

type Item = {
  view: Route['view'];
  label: string;
  glyph: string;
  hint?: string;
};

const ITEMS: Item[] = [
  { view: 'dashboard', label: 'דשבורד', glyph: '◐' },
  { view: 'leads', label: 'לידים', glyph: '◧' },
  { view: 'invoices', label: 'חשבוניות', glyph: '₪' },
  { view: 'calendar', label: 'יומן', glyph: '▦' },
];

type Props = {
  route: Route;
  navigate: (next: Route) => void;
  badges?: Partial<Record<Route['view'], number>>;
};

export default function Sidebar({ route, navigate, badges }: Props) {
  return (
    <nav className="bo-sidebar" aria-label="ניווט בק־אופיס">
      <ul className="bo-sidebar__list">
        {ITEMS.map((item) => {
          const isActive =
            route.view === item.view || (item.view === 'leads' && route.view === 'lead');
          const badge = badges?.[item.view];
          return (
            <li key={item.view}>
              <a
                href={`#/${item.view}`}
                className="bo-side-link"
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.view === 'lead') return;
                  navigate({ view: item.view } as Route);
                }}
              >
                <span className="bo-side-link__glyph" aria-hidden="true">
                  {item.glyph}
                </span>
                <span className="bo-side-link__label">{item.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="bo-side-link__badge" aria-label={`${badge} פריטים`}>
                    {badge}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="bo-sidebar__foot">
        <p className="bo-sidebar__hint">
          <strong>שימי לב:</strong> כל הנתונים פיקטיביים ונשמרים מקומית בדפדפן בלבד.
        </p>
      </div>
    </nav>
  );
}
