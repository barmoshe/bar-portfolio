import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { useLeads } from '../lib/hooks';
import { addDays, formatDateLong, formatMonthYear, isSameDay, startOfDay } from '../lib/format';
import type { Route } from '../lib/route';
import type { Lead } from '../data/types';

type DayItem = {
  id: string;
  kind: 'task' | 'invoice';
  title: string;
  leadId: string;
  company: string;
  status?: 'sent' | 'draft' | 'paid' | 'overdue';
};

type CellData = {
  date: Date;
  inMonth: boolean;
  items: DayItem[];
};

const WEEKDAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

export default function CalendarView({ navigate }: { navigate: (r: Route) => void }) {
  const { data: leads, loading } = useLeads();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [openDay, setOpenDay] = useState<Date | null>(null);

  const cells = useMemo<CellData[]>(() => buildMonth(cursor, leads ?? []), [cursor, leads]);

  if (loading) {
    return (
      <section className="bo-view">
        <header className="bo-view__head">
          <h1>יומן</h1>
        </header>
        <div className="bo-card" style={{ padding: 24 }}>
          <Skeleton height={420} />
        </div>
      </section>
    );
  }

  const openDayItems: DayItem[] = openDay ? cells.find((c) => isSameDay(c.date, openDay))?.items ?? [] : [];

  return (
    <section className="bo-view">
      <header className="bo-view__head">
        <h1>יומן</h1>
        <p className="bo-view__sub">דדליינים של משימות וחשבוניות לאורך החודש.</p>
      </header>

      <article className="bo-card">
        <header className="bo-cal__head">
          <button type="button" className="bo-icon-btn" aria-label="חודש קודם" onClick={() => setCursor((c) => shift(c, -1))}>
            ‹
          </button>
          <strong>{formatMonthYear(cursor.toISOString())}</strong>
          <button type="button" className="bo-icon-btn" aria-label="חודש הבא" onClick={() => setCursor((c) => shift(c, 1))}>
            ›
          </button>
          <button
            type="button"
            className="bo-btn bo-btn--ghost bo-btn--small"
            onClick={() => setCursor(() => {
              const d = new Date();
              d.setDate(1);
              return d;
            })}
          >
            היום
          </button>
        </header>

        <div className="bo-cal__weekdays" aria-hidden="true">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="bo-cal__grid" role="grid" aria-label={`לוח שנה ${formatMonthYear(cursor.toISOString())}`}>
          {cells.map((cell, i) => {
            const today = isSameDay(cell.date, new Date());
            const isoDate = cell.date.toISOString();
            return (
              <div key={i} role="gridcell" className="bo-cal__cell" data-month={cell.inMonth || undefined} data-today={today || undefined}>
                <button
                  type="button"
                  className="bo-cal__day"
                  onClick={() => setOpenDay(cell.date)}
                  aria-label={`${formatDateLong(isoDate)} — ${cell.items.length} פריטים`}
                  disabled={cell.items.length === 0}
                >
                  <span className="bo-cal__num">{cell.date.getDate()}</span>
                  {cell.items.length > 0 && (
                    <span className="bo-cal__dots" aria-hidden="true">
                      {cell.items.slice(0, 3).map((it) => (
                        <span
                          key={it.id}
                          className="bo-cal__dot"
                          style={{
                            background:
                              it.kind === 'invoice'
                                ? `var(--status-${it.status ?? 'sent'})`
                                : 'var(--status-in_progress)',
                          }}
                        />
                      ))}
                      {cell.items.length > 3 && <span className="bo-cal__more">+{cell.items.length - 3}</span>}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </article>

      {openDay && (
        <Modal title={formatDateLong(openDay.toISOString())} onClose={() => setOpenDay(null)} width={520}>
          {openDayItems.length === 0 ? (
            <EmptyState title="אין פריטים ביום זה" />
          ) : (
            <ul className="bo-day-items">
              {openDayItems.map((it) => (
                <li key={it.id} className="bo-day-item">
                  <span className="bo-day-item__kind">{it.kind === 'task' ? 'משימה' : 'חשבונית'}</span>
                  <span className="bo-day-item__title">{it.title}</span>
                  {it.kind === 'invoice' && it.status && <StatusBadge kind="invoice" status={it.status} />}
                  <button
                    type="button"
                    className="bo-link"
                    onClick={() => {
                      setOpenDay(null);
                      navigate({ view: 'lead', id: it.leadId, tab: it.kind === 'invoice' ? 'invoices' : 'tasks' });
                    }}
                  >
                    {it.company}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </section>
  );
}

function shift(d: Date, months: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function buildMonth(cursor: Date, leads: Lead[]): CellData[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  // Hebrew week starts on Sunday (day 0); first.getDay() already returns 0 for Sunday.
  const start = addDays(startOfDay(first), -first.getDay());
  const cells: CellData[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = addDays(start, i);
    const items: DayItem[] = [];
    leads.forEach((lead) => {
      lead.tasks.forEach((t) => {
        if (t.dueDate && isSameDay(new Date(t.dueDate), date) && !t.done) {
          items.push({
            id: `t_${t.id}`,
            kind: 'task',
            title: t.title,
            leadId: lead.id,
            company: lead.client.company,
          });
        }
      });
      lead.invoices.forEach((inv) => {
        if (isSameDay(new Date(inv.dueAt), date)) {
          const overdue = inv.status === 'sent' && new Date(inv.dueAt).getTime() < Date.now();
          items.push({
            id: `i_${inv.id}`,
            kind: 'invoice',
            title: `חשבונית ${inv.number}`,
            leadId: lead.id,
            company: lead.client.company,
            status: overdue ? 'overdue' : (inv.status as 'sent' | 'draft' | 'paid'),
          });
        }
      });
    });
    cells.push({
      date,
      inMonth: date.getMonth() === cursor.getMonth(),
      items,
    });
  }
  return cells;
}
