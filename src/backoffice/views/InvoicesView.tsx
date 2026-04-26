import { useMemo } from 'react';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { flattenInvoices, isInvoiceOverdue, useLeads } from '../lib/hooks';
import { markInvoicePaid, sendInvoice } from '../lib/backend';
import { formatDate, formatMoney } from '../lib/format';
import { pushToast } from '../lib/hooks';
import type { Currency, InvoiceStatus } from '../data/types';
import type { Route } from '../lib/route';

const SECTION_ORDER: Array<'overdue' | InvoiceStatus> = ['overdue', 'sent', 'draft', 'paid'];
const SECTION_TITLE: Record<'overdue' | InvoiceStatus, string> = {
  overdue: 'באיחור',
  sent: 'נשלחו וממתינות',
  draft: 'טיוטות',
  paid: 'שולמו',
};

export default function InvoicesView({ navigate }: { navigate: (r: Route) => void }) {
  const { data: leads, loading } = useLeads();

  const grouped = useMemo(() => {
    if (!leads) return null;
    const flat = flattenInvoices(leads);
    const buckets: Record<'overdue' | InvoiceStatus, typeof flat> = {
      overdue: [],
      draft: [],
      sent: [],
      paid: [],
    };
    flat.forEach((inv) => {
      if (isInvoiceOverdue(inv)) buckets.overdue.push(inv);
      else buckets[inv.status].push(inv);
    });
    return buckets;
  }, [leads]);

  if (loading || !grouped) {
    return (
      <section className="bo-view">
        <header className="bo-view__head">
          <h1>חשבוניות</h1>
        </header>
        <div className="bo-card" style={{ padding: 24 }}>
          <Skeleton height={140} />
        </div>
      </section>
    );
  }

  const totals: Record<'overdue' | InvoiceStatus, Record<Currency, number>> = {
    overdue: { ILS: 0, USD: 0 },
    sent: { ILS: 0, USD: 0 },
    draft: { ILS: 0, USD: 0 },
    paid: { ILS: 0, USD: 0 },
  };
  SECTION_ORDER.forEach((k) => {
    grouped[k].forEach((inv) => {
      totals[k][inv.currency] += inv.amount;
    });
  });

  const onMarkPaid = async (leadId: string, invoiceId: string) => {
    try {
      await markInvoicePaid(leadId, invoiceId);
      pushToast('success', 'החשבונית סומנה כשולמה');
    } catch (e) {
      pushToast('error', (e as Error).message);
    }
  };

  const onSend = async (leadId: string, invoiceId: string) => {
    try {
      await sendInvoice(leadId, invoiceId);
      pushToast('success', 'החשבונית נשלחה');
    } catch (e) {
      pushToast('error', (e as Error).message);
    }
  };

  return (
    <section className="bo-view">
      <header className="bo-view__head">
        <h1>חשבוניות</h1>
        <p className="bo-view__sub">תצוגה צולבת של כל החשבוניות בכל הלידים.</p>
      </header>

      {SECTION_ORDER.map((key) => {
        const items = grouped[key];
        return (
          <article className="bo-card" key={key}>
            <header className="bo-card__head">
              <h2>{SECTION_TITLE[key]}</h2>
              <span className="bo-card__sub">
                {items.length} פריטים · {moneyList(totals[key])}
              </span>
            </header>
            {items.length === 0 ? (
              <EmptyState title="אין כרגע פריטים בקבוצה זו" />
            ) : (
              <table className="bo-table">
                <thead>
                  <tr>
                    <th scope="col">מספר</th>
                    <th scope="col">לקוחה</th>
                    <th scope="col">סכום</th>
                    <th scope="col">הופקה</th>
                    <th scope="col">לתשלום עד</th>
                    <th scope="col">סטטוס</th>
                    <th scope="col">
                      <span className="bo-vh">פעולות</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((inv) => {
                    const status = key === 'overdue' ? 'overdue' : inv.status;
                    return (
                      <tr key={inv.id}>
                        <td>{inv.number}</td>
                        <td>
                          <button
                            type="button"
                            className="bo-link"
                            onClick={() => navigate({ view: 'lead', id: inv.leadId, tab: 'invoices' })}
                          >
                            {inv.company}
                          </button>
                          <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{inv.clientName}</small>
                        </td>
                        <td>{formatMoney(inv.amount, inv.currency)}</td>
                        <td>{formatDate(inv.issuedAt)}</td>
                        <td>{formatDate(inv.dueAt)}</td>
                        <td>
                          <StatusBadge kind="invoice" status={status} />
                        </td>
                        <td>
                          {inv.status === 'draft' && (
                            <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={() => onSend(inv.leadId, inv.id)}>
                              שליחה
                            </button>
                          )}
                          {(inv.status === 'sent' || key === 'overdue') && (
                            <button type="button" className="bo-btn bo-btn--small" onClick={() => onMarkPaid(inv.leadId, inv.id)}>
                              סימון כשולמה
                            </button>
                          )}
                          {inv.status === 'paid' && <span style={{ color: 'var(--ink-faint)' }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </article>
        );
      })}
    </section>
  );
}

function moneyList(byCcy: Record<Currency, number>): string {
  const parts: string[] = [];
  if (byCcy.ILS > 0) parts.push(formatMoney(byCcy.ILS, 'ILS'));
  if (byCcy.USD > 0) parts.push(formatMoney(byCcy.USD, 'USD'));
  return parts.length ? parts.join(' · ') : formatMoney(0, 'ILS');
}
