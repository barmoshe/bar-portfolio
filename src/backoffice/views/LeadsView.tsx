import { useMemo, useState } from 'react';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import PriorityDot from '../components/PriorityDot';
import ProgressBar from '../components/ProgressBar';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { useLeads } from '../lib/hooks';
import type { LeadStatus, LeadType } from '../data/types';
import { STATUS_LABEL, STATUS_ORDER, TYPE_LABEL, TYPE_ORDER } from '../components/labels';
import { formatDate, formatMoney } from '../lib/format';
import type { Route } from '../lib/route';

type SortKey = 'client' | 'status' | 'progress' | 'budget' | 'due';

export default function LeadsView({
  query,
  navigate,
}: {
  query: string;
  navigate: (r: Route) => void;
}) {
  const { data: leads, loading } = useLeads();
  const [typeFilter, setTypeFilter] = useState<LeadType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('due');
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    if (!leads) return [];
    const q = query.trim().toLowerCase();
    let r = leads.filter((l) => {
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (!q) return true;
      const blob = `${l.client.name} ${l.client.company} ${l.title} ${l.tags.join(' ')}`.toLowerCase();
      return blob.includes(q);
    });
    r = [...r].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'client':
          cmp = a.client.company.localeCompare(b.client.company, 'he');
          break;
        case 'status':
          cmp = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
          break;
        case 'progress':
          cmp = a.progress - b.progress;
          break;
        case 'budget':
          cmp = a.budget.amount - b.budget.amount;
          break;
        case 'due': {
          const av = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
          const bv = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
          cmp = av - bv;
          break;
        }
      }
      return sortAsc ? cmp : -cmp;
    });
    return r;
  }, [leads, query, typeFilter, statusFilter, sortKey, sortAsc]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortAttr = (key: SortKey): 'ascending' | 'descending' | 'none' =>
    sortKey === key ? (sortAsc ? 'ascending' : 'descending') : 'none';

  if (loading) {
    return (
      <section className="bo-view">
        <header className="bo-view__head">
          <h1>לידים</h1>
        </header>
        <div className="bo-card">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ padding: 12 }}>
              <Skeleton height={48} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bo-view">
      <header className="bo-view__head">
        <h1>לידים</h1>
        <p className="bo-view__sub">
          {leads?.length ?? 0} לידים בסך הכול · מציג {rows.length}
        </p>
      </header>

      <div className="bo-filters">
        <FilterChips
          legend="סוג"
          options={TYPE_ORDER.map((t) => ({ value: t, label: TYPE_LABEL[t] }))}
          selected={typeFilter}
          onChange={setTypeFilter}
        />
        <FilterChips
          legend="סטטוס"
          options={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {rows.length === 0 ? (
        <div className="bo-card">
          <EmptyState title="אין לידים מתאימים" body="נסי להסיר חלק מהמסננים או לחפש מילה אחרת." />
        </div>
      ) : (
        <div className="bo-card bo-table-wrap">
          <table className="bo-table">
            <thead>
              <tr>
                <th scope="col" aria-sort={sortAttr('client')}>
                  <SortBtn label="לקוחה" active={sortKey === 'client'} dir={sortAttr('client')} onClick={() => onSort('client')} />
                </th>
                <th scope="col">סוג</th>
                <th scope="col" aria-sort={sortAttr('status')}>
                  <SortBtn label="סטטוס" active={sortKey === 'status'} dir={sortAttr('status')} onClick={() => onSort('status')} />
                </th>
                <th scope="col" aria-sort={sortAttr('progress')}>
                  <SortBtn label="התקדמות" active={sortKey === 'progress'} dir={sortAttr('progress')} onClick={() => onSort('progress')} />
                </th>
                <th scope="col" aria-sort={sortAttr('budget')}>
                  <SortBtn label="תקציב" active={sortKey === 'budget'} dir={sortAttr('budget')} onClick={() => onSort('budget')} />
                </th>
                <th scope="col" aria-sort={sortAttr('due')}>
                  <SortBtn label="דדליין" active={sortKey === 'due'} dir={sortAttr('due')} onClick={() => onSort('due')} />
                </th>
                <th scope="col">עדיפות</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr key={lead.id} className="bo-row">
                  <th scope="row" className="bo-row__client">
                    <button
                      type="button"
                      className="bo-row__open"
                      onClick={() => navigate({ view: 'lead', id: lead.id, tab: 'tasks' })}
                    >
                      <Avatar client={lead.client} size={32} />
                      <span className="bo-row__client-text">
                        <strong>{lead.client.company}</strong>
                        <small>{lead.client.name}</small>
                      </span>
                    </button>
                  </th>
                  <td>{TYPE_LABEL[lead.type]}</td>
                  <td>
                    <StatusBadge kind="lead" status={lead.status} />
                  </td>
                  <td className="bo-row__progress">
                    <ProgressBar value={lead.progress} />
                  </td>
                  <td className="bo-row__budget">{formatMoney(lead.budget.amount, lead.budget.currency)}</td>
                  <td>{lead.dueDate ? formatDate(lead.dueDate) : '—'}</td>
                  <td>
                    <PriorityDot priority={lead.priority} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SortBtn({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: 'ascending' | 'descending' | 'none';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="bo-sort"
      aria-label={`מיין לפי ${label}`}
      data-active={active}
      onClick={onClick}
    >
      {label}
      <span className="bo-sort__arrow" aria-hidden="true">
        {dir === 'ascending' ? '▲' : dir === 'descending' ? '▼' : '↕'}
      </span>
    </button>
  );
}
