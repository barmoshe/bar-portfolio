import { useState } from 'react';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import PriorityDot from '../components/PriorityDot';
import ProgressBar from '../components/ProgressBar';
import SegmentedControl from '../components/SegmentedControl';
import Tabs from '../components/Tabs';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import {
  addNote,
  addTask,
  isInvoiceOverdue,
  markInvoicePaid,
  removeTask,
  sendInvoice,
  setLeadStatus,
  setProgress,
  toggleTask,
} from '../lib/backend';
import { pushToast, useLead } from '../lib/hooks';
import { formatDate, formatDateLong, formatMoney, isOverdue, relativeTime } from '../lib/format';
import {
  INVOICE_STATUS_LABEL,
  STATUS_LABEL,
  STATUS_ORDER,
  TYPE_LABEL,
} from '../components/labels';
import type { LeadTab, Route } from '../lib/route';
import type { LeadStatus } from '../data/types';

type Props = {
  leadId: string;
  tab: LeadTab;
  navigate: (r: Route) => void;
};

export default function LeadDetailView({ leadId, tab, navigate }: Props) {
  const { data: lead, loading, error } = useLead(leadId);
  const [taskInput, setTaskInput] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [noteInput, setNoteInput] = useState('');

  if (loading) {
    return (
      <section className="bo-view">
        <header className="bo-view__head">
          <Skeleton width={300} height={32} />
        </header>
        <div className="bo-card" style={{ padding: 24 }}>
          <Skeleton height={140} />
        </div>
      </section>
    );
  }
  if (error || !lead) {
    return (
      <section className="bo-view">
        <EmptyState
          title="לא הצלחנו לטעון את הליד"
          body={error?.message ?? 'נסי לחזור לרשימת הלידים ולפתוח שוב.'}
          action={
            <button type="button" className="bo-btn" onClick={() => navigate({ view: 'leads' })}>
              חזרה ללידים
            </button>
          }
        />
      </section>
    );
  }

  const onStatus = async (next: LeadStatus) => {
    if (next === lead.status) return;
    try {
      await setLeadStatus(lead.id, next);
      pushToast('success', `סטטוס עודכן ל"${STATUS_LABEL[next]}"`);
    } catch (e) {
      pushToast('error', (e as Error).message);
    }
  };

  const onProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    try {
      await setProgress(lead.id, next);
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  const onAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    try {
      await addTask(lead.id, { title: taskInput, dueDate: taskDue || undefined });
      setTaskInput('');
      setTaskDue('');
      pushToast('success', 'משימה נוספה');
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  const onToggleTask = async (taskId: string) => {
    try {
      await toggleTask(lead.id, taskId);
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  const onRemoveTask = async (taskId: string) => {
    try {
      await removeTask(lead.id, taskId);
      pushToast('success', 'משימה נמחקה');
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  const onAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    try {
      await addNote(lead.id, noteInput);
      setNoteInput('');
      pushToast('success', 'הערה נוספה');
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  const onMarkPaid = async (invoiceId: string) => {
    try {
      await markInvoicePaid(lead.id, invoiceId);
      pushToast('success', 'החשבונית סומנה כשולמה');
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  const onSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoice(lead.id, invoiceId);
      pushToast('success', 'החשבונית נשלחה');
    } catch (err) {
      pushToast('error', (err as Error).message);
    }
  };

  const tasksOpen = lead.tasks.filter((t) => !t.done).length;

  return (
    <section className="bo-view">
      <nav aria-label="פירורי לחם">
        <button type="button" className="bo-back" onClick={() => navigate({ view: 'leads' })}>
          ← חזרה ללידים
        </button>
      </nav>

      <header className="bo-detail-head">
        <Avatar client={lead.client} size={64} />
        <div className="bo-detail-head__main">
          <div className="bo-detail-head__row">
            <h1>{lead.client.company}</h1>
            <StatusBadge kind="lead" status={lead.status} />
            <PriorityDot priority={lead.priority} />
          </div>
          <p className="bo-detail-head__sub">
            {TYPE_LABEL[lead.type]} · {lead.client.name}
          </p>
          <p className="bo-detail-head__title">{lead.title}</p>
        </div>
      </header>

      <div className="bo-detail-grid">
        <div className="bo-detail-main">
          <article className="bo-card bo-detail-controls">
            <SegmentedControl
              legend="סטטוס"
              value={lead.status}
              onChange={(v) => onStatus(v as LeadStatus)}
              options={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
            />
            <label className="bo-progress-input">
              <span>התקדמות: {lead.progress}%</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={lead.progress}
                onChange={onProgress}
                aria-valuetext={`${lead.progress} אחוז`}
              />
              <ProgressBar value={lead.progress} />
            </label>
          </article>

          <Tabs
            ariaLabel="לשוניות הליד"
            active={tab}
            onChange={(t) => navigate({ view: 'lead', id: lead.id, tab: t })}
            tabs={[
              { value: 'tasks', label: 'משימות', badge: tasksOpen },
              { value: 'notes', label: 'הערות', badge: lead.notes.length },
              { value: 'invoices', label: 'חשבוניות', badge: lead.invoices.length },
            ]}
          />

          {tab === 'tasks' && (
            <article className="bo-card" role="tabpanel" aria-label="משימות">
              <form className="bo-task-add" onSubmit={onAddTask}>
                <label className="bo-field">
                  <span className="bo-vh">משימה חדשה</span>
                  <input
                    type="text"
                    placeholder="הוסיפי משימה…"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    required
                  />
                </label>
                <label className="bo-field">
                  <span className="bo-vh">דדליין (לא חובה)</span>
                  <input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} />
                </label>
                <button type="submit" className="bo-btn">
                  הוספה
                </button>
              </form>

              {lead.tasks.length === 0 ? (
                <EmptyState title="אין עדיין משימות" body="התחילי בהוספה למעלה." />
              ) : (
                <ul className="bo-tasks">
                  {lead.tasks.map((t) => {
                    const overdue = !t.done && t.dueDate && isOverdue(t.dueDate);
                    return (
                      <li key={t.id} className="bo-task" data-overdue={overdue || undefined}>
                        <label className="bo-task__main">
                          <input type="checkbox" checked={t.done} onChange={() => onToggleTask(t.id)} />
                          <span className={t.done ? 'bo-task__title bo-task__title--done' : 'bo-task__title'}>
                            {t.title}
                          </span>
                        </label>
                        {t.dueDate && (
                          <span className="bo-task__due">
                            {overdue ? 'באיחור · ' : ''}
                            {formatDate(t.dueDate)}
                          </span>
                        )}
                        <button
                          type="button"
                          className="bo-icon-btn bo-icon-btn--small"
                          aria-label="מחיקת משימה"
                          onClick={() => onRemoveTask(t.id)}
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          )}

          {tab === 'notes' && (
            <article className="bo-card" role="tabpanel" aria-label="הערות">
              <form className="bo-note-add" onSubmit={onAddNote}>
                <label className="bo-field">
                  <span className="bo-vh">הערה חדשה</span>
                  <textarea
                    rows={3}
                    placeholder="הוסיפי הערה — מה נאמר, מה הוסכם, מה צריך לעקוב…"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="bo-btn">
                  הוסיפי הערה
                </button>
              </form>

              {lead.notes.length === 0 ? (
                <EmptyState title="אין עדיין הערות" />
              ) : (
                <ul className="bo-notes">
                  {lead.notes.map((n) => (
                    <li key={n.id} className="bo-note">
                      <header>
                        <strong>{n.author}</strong>
                        <span className="bo-note__when" title={formatDateLong(n.createdAt)}>
                          {relativeTime(n.createdAt)}
                        </span>
                      </header>
                      <p>{n.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          )}

          {tab === 'invoices' && (
            <article className="bo-card" role="tabpanel" aria-label="חשבוניות">
              {lead.invoices.length === 0 ? (
                <EmptyState title="אין עדיין חשבוניות" body="חשבוניות יופיעו כאן ברגע שיופקו." />
              ) : (
                <ul className="bo-inv-list">
                  {lead.invoices.map((inv) => {
                    const overdue = isInvoiceOverdue(inv);
                    const status = overdue ? 'overdue' : inv.status;
                    return (
                      <li key={inv.id} className="bo-inv">
                        <div className="bo-inv__head">
                          <span className="bo-inv__num">חשבונית {inv.number}</span>
                          <StatusBadge kind="invoice" status={status} />
                        </div>
                        <div className="bo-inv__row">
                          <span>סכום: <strong>{formatMoney(inv.amount, inv.currency)}</strong></span>
                          <span>הופקה: {formatDate(inv.issuedAt)}</span>
                          <span>לתשלום עד: {formatDate(inv.dueAt)}</span>
                        </div>
                        <ul className="bo-inv__items">
                          {inv.items.map((it) => (
                            <li key={it.id}>
                              {it.label} — {it.qty} × {formatMoney(it.unitPrice, inv.currency)}
                            </li>
                          ))}
                        </ul>
                        <div className="bo-inv__actions">
                          {inv.status === 'draft' && (
                            <button type="button" className="bo-btn bo-btn--ghost" onClick={() => onSendInvoice(inv.id)}>
                              שליחה ללקוח
                            </button>
                          )}
                          {(inv.status === 'sent' || overdue) && (
                            <button type="button" className="bo-btn" onClick={() => onMarkPaid(inv.id)}>
                              סימון כשולמה
                            </button>
                          )}
                          {inv.status === 'paid' && (
                            <span className="bo-inv__paid-note">{INVOICE_STATUS_LABEL.paid} ✓</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          )}
        </div>

        <aside className="bo-detail-rail">
          <article className="bo-card">
            <header className="bo-card__head">
              <h2>פרטי קשר</h2>
            </header>
            <dl className="bo-meta">
              <div>
                <dt>איש קשר</dt>
                <dd>{lead.client.name}</dd>
              </div>
              <div>
                <dt>אימייל</dt>
                <dd>
                  <a href={`mailto:${lead.client.email}`}>{lead.client.email}</a>
                </dd>
              </div>
              <div>
                <dt>טלפון</dt>
                <dd>
                  <a href={`tel:${lead.client.phone.replace(/-/g, '')}`}>{lead.client.phone}</a>
                </dd>
              </div>
              <div>
                <dt>אזור</dt>
                <dd>{lead.client.city}</dd>
              </div>
            </dl>
          </article>

          <article className="bo-card">
            <header className="bo-card__head">
              <h2>סיכום פיננסי</h2>
            </header>
            <dl className="bo-meta">
              <div>
                <dt>תקציב</dt>
                <dd>{formatMoney(lead.budget.amount, lead.budget.currency)}</dd>
              </div>
              {lead.hourlyRate && (
                <div>
                  <dt>תעריף לשעה</dt>
                  <dd>{formatMoney(lead.hourlyRate, lead.budget.currency)}</dd>
                </div>
              )}
              <div>
                <dt>שעות שנרשמו</dt>
                <dd>{lead.hoursLogged}</dd>
              </div>
              <div>
                <dt>תאריך פתיחה</dt>
                <dd>{formatDate(lead.createdAt)}</dd>
              </div>
              {lead.dueDate && (
                <div>
                  <dt>דדליין יעד</dt>
                  <dd>{formatDate(lead.dueDate)}</dd>
                </div>
              )}
            </dl>
          </article>

          {lead.tags.length > 0 && (
            <article className="bo-card">
              <header className="bo-card__head">
                <h2>תגיות</h2>
              </header>
              <ul className="bo-tags">
                {lead.tags.map((t) => (
                  <li key={t} className="bo-tag">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          )}

          <article className="bo-card">
            <header className="bo-card__head">
              <h2>פעילות בליד</h2>
            </header>
            {lead.activity.length === 0 ? (
              <EmptyState title="אין פעילות עדיין" />
            ) : (
              <ul className="bo-feed bo-feed--rail">
                {lead.activity.slice(0, 8).map((a) => (
                  <li key={a.id} className="bo-feed__item">
                    <span className="bo-feed__when">{relativeTime(a.createdAt)}</span>
                    <span className="bo-feed__what">{a.summary}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </aside>
      </div>
    </section>
  );
}
