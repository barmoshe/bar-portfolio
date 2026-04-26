import { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { isInvoiceOverdue, useActivity, useLeads } from '../lib/hooks';
import { formatDayMonth, formatMoney, relativeTime } from '../lib/format';
import type { Currency, Lead, LeadStatus } from '../data/types';
import type { Route } from '../lib/route';
import { STATUS_LABEL, STATUS_ORDER } from '../components/labels';

const ACTIVE: LeadStatus[] = ['in_progress', 'review'];
const PIPELINE: LeadStatus[] = ['discovery', 'proposal'];

export default function DashboardView({ navigate }: { navigate: (r: Route) => void }) {
  const { data: leads, loading } = useLeads();
  const { data: activity } = useActivity();

  const stats = useMemo(() => {
    if (!leads) return null;
    const activeProjects = leads.filter((l) => ACTIVE.includes(l.status)).length;
    const pipelineByCcy = sumByCurrency(leads.filter((l) => PIPELINE.includes(l.status)).map((l) => l.budget));
    const recurringByCcy = sumByCurrency(
      leads.filter((l) => l.type === 'mentorship' || l.type === 'maintenance').map((l) => l.budget),
    );
    let overdueCount = 0;
    let overdueByCcy: Record<Currency, number> = { ILS: 0, USD: 0 };
    leads.forEach((l) =>
      l.invoices.forEach((inv) => {
        if (isInvoiceOverdue(inv)) {
          overdueCount += 1;
          overdueByCcy[inv.currency] += inv.amount;
        }
      }),
    );
    const breakdown = STATUS_ORDER.map((s) => ({
      status: s,
      count: leads.filter((l) => l.status === s).length,
    }));
    const upcoming = upcomingDeadlines(leads);
    return { activeProjects, pipelineByCcy, recurringByCcy, overdueCount, overdueByCcy, breakdown, upcoming };
  }, [leads]);

  if (loading || !stats) {
    return (
      <section className="bo-view">
        <header className="bo-view__head">
          <h1>דשבורד</h1>
        </header>
        <div className="bo-kpis">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bo-kpi">
              <Skeleton width={80} />
              <div style={{ marginBlockStart: 12 }}>
                <Skeleton width={120} height={28} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bo-view">
      <header className="bo-view__head">
        <h1>דשבורד</h1>
        <p className="bo-view__sub">תמונת מצב חיה — כל הנתונים פיקטיביים, מקומיים בלבד.</p>
      </header>

      <div className="bo-kpis">
        <KpiCard
          label="פרויקטים פעילים"
          value={stats.activeProjects}
          hint='בעבודה + בבדיקה'
        />
        <KpiCard
          label="ערך פייפליין"
          value={moneyList(stats.pipelineByCcy)}
          hint="גילוי + הצעה"
        />
        <KpiCard
          label="הכנסה חוזרת"
          value={moneyList(stats.recurringByCcy)}
          hint="חניכות + תחזוקות"
        />
        <KpiCard
          label="חשבוניות באיחור"
          value={stats.overdueCount}
          tone={stats.overdueCount > 0 ? 'warning' : 'default'}
          hint={stats.overdueCount > 0 ? `סך הכל ${moneyList(stats.overdueByCcy)}` : 'הכול תחת שליטה'}
        />
      </div>

      <div className="bo-grid-2">
        <article className="bo-card">
          <header className="bo-card__head">
            <h2>פעילות אחרונה</h2>
          </header>
          {(activity ?? []).length === 0 ? (
            <EmptyState title="אין פעילות עדיין" />
          ) : (
            <ul className="bo-feed">
              {(activity ?? []).slice(0, 10).map((a) => {
                const lead = (leads ?? []).find((l) => l.id === a.leadId);
                return (
                  <li key={a.id} className="bo-feed__item">
                    <span className="bo-feed__when">{relativeTime(a.createdAt)}</span>
                    <span className="bo-feed__what">{a.summary}</span>
                    {lead && (
                      <button
                        type="button"
                        className="bo-link"
                        onClick={() => navigate({ view: 'lead', id: lead.id, tab: 'tasks' })}
                      >
                        פתחי
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        <article className="bo-card">
          <header className="bo-card__head">
            <h2>דדליינים קרובים</h2>
          </header>
          {stats.upcoming.length === 0 ? (
            <EmptyState title="אין דדליינים בשבוע הקרוב" />
          ) : (
            <ul className="bo-deadlines">
              {stats.upcoming.map((d) => (
                <li key={d.key} className="bo-deadlines__item">
                  <span className="bo-deadlines__date">{formatDayMonth(d.date)}</span>
                  <span className="bo-deadlines__title">{d.title}</span>
                  <button
                    type="button"
                    className="bo-link"
                    onClick={() => navigate({ view: 'lead', id: d.leadId, tab: d.tab })}
                  >
                    {d.company}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <article className="bo-card">
        <header className="bo-card__head">
          <h2>פילוח לידים לפי סטטוס</h2>
        </header>
        <div className="bo-breakdown">
          <div className="bo-breakdown__bar" role="img" aria-label="פילוח לפי סטטוס">
            {stats.breakdown
              .filter((b) => b.count > 0)
              .map((b) => (
                <span
                  key={b.status}
                  className="bo-breakdown__seg"
                  style={{
                    background: `var(--status-${b.status})`,
                    flex: b.count,
                  }}
                  title={`${STATUS_LABEL[b.status]}: ${b.count}`}
                />
              ))}
          </div>
          <ul className="bo-breakdown__legend">
            {stats.breakdown.map((b) => (
              <li key={b.status}>
                <StatusBadge kind="lead" status={b.status} />
                <span className="bo-breakdown__count">{b.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}

function sumByCurrency(items: Array<{ amount: number; currency: Currency }>): Record<Currency, number> {
  const acc: Record<Currency, number> = { ILS: 0, USD: 0 };
  items.forEach((i) => {
    acc[i.currency] += i.amount;
  });
  return acc;
}

function moneyList(byCcy: Record<Currency, number>): string {
  const parts: string[] = [];
  if (byCcy.ILS > 0) parts.push(formatMoney(byCcy.ILS, 'ILS'));
  if (byCcy.USD > 0) parts.push(formatMoney(byCcy.USD, 'USD'));
  return parts.length ? parts.join(' · ') : formatMoney(0, 'ILS');
}

type Deadline = {
  key: string;
  date: string;
  title: string;
  leadId: string;
  company: string;
  tab: 'tasks' | 'invoices';
};

function upcomingDeadlines(leads: Lead[]): Deadline[] {
  const now = Date.now();
  const horizon = now + 14 * 24 * 60 * 60 * 1000;
  const items: Deadline[] = [];
  leads.forEach((lead) => {
    lead.tasks.forEach((t) => {
      if (!t.done && t.dueDate) {
        const ts = new Date(t.dueDate).getTime();
        if (ts >= now - 24 * 60 * 60 * 1000 && ts <= horizon) {
          items.push({
            key: `t_${t.id}`,
            date: t.dueDate,
            title: t.title,
            leadId: lead.id,
            company: lead.client.company,
            tab: 'tasks',
          });
        }
      }
    });
    lead.invoices.forEach((inv) => {
      if (inv.status === 'sent' || inv.status === 'draft') {
        const ts = new Date(inv.dueAt).getTime();
        if (ts >= now - 24 * 60 * 60 * 1000 && ts <= horizon) {
          items.push({
            key: `i_${inv.id}`,
            date: inv.dueAt,
            title: `חשבונית ${inv.number}`,
            leadId: lead.id,
            company: lead.client.company,
            tab: 'invoices',
          });
        }
      }
    });
  });
  return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 8);
}
