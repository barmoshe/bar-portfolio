import { SEED_STATE } from '../data/seed';
import type {
  ActivityEntry,
  ActivityKind,
  BackofficeState,
  Invoice,
  Lead,
  LeadStatus,
  Note,
  Task,
} from '../data/types';
import { nid } from './ids';
import { safeGet, safeSet } from './storage';

const KEY = 'bm:backoffice-state';
const ACTIVITY_CAP = 50;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function load(): BackofficeState | null {
  const raw = safeGet(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as BackofficeState;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(): void {
  safeSet(KEY, JSON.stringify(state));
}

let state: BackofficeState = load() ?? clone(SEED_STATE);
const subs = new Set<() => void>();

const stable =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('demo') === 'stable';

function notify(): void {
  subs.forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore subscriber errors */
    }
  });
}

function delay(): Promise<void> {
  const ms = 200 + Math.random() * 400;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulate<T>(fn: () => T, errorChance = 0.05): Promise<T> {
  await delay();
  if (!stable && Math.random() < errorChance) {
    throw new Error('שגיאת רשת מדומה — נסי שוב');
  }
  return fn();
}

function pushActivity(leadId: string, kind: ActivityKind, summary: string): void {
  const entry: ActivityEntry = {
    id: nid('act'),
    leadId,
    kind,
    summary,
    createdAt: new Date().toISOString(),
  };
  state.activity = [entry, ...state.activity].slice(0, ACTIVITY_CAP);
  const lead = state.leads.find((l) => l.id === leadId);
  if (lead) lead.activity = [entry, ...lead.activity].slice(0, ACTIVITY_CAP);
}

function leadById(id: string): Lead {
  const lead = state.leads.find((l) => l.id === id);
  if (!lead) throw new Error(`ליד לא נמצא: ${id}`);
  return lead;
}

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'חדש',
  discovery: 'גילוי',
  proposal: 'הצעה',
  in_progress: 'בעבודה',
  review: 'בבדיקה',
  completed: 'הושלם',
  on_hold: 'מושהה',
};

export function subscribe(fn: () => void): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function isStableMode(): boolean {
  return stable;
}

export function listLeads(): Promise<Lead[]> {
  return simulate(() => clone(state.leads));
}

export function getLead(id: string): Promise<Lead> {
  return simulate(() => clone(leadById(id)));
}

export function listActivity(): Promise<ActivityEntry[]> {
  return simulate(() => clone(state.activity));
}

export function setLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  return simulate(() => {
    const lead = leadById(id);
    const before = lead.status;
    lead.status = status;
    pushActivity(id, 'status_changed', `סטטוס שונה ל"${STATUS_LABEL[status]}" — ${lead.client.company} (היה: ${STATUS_LABEL[before]})`);
    persist();
    notify();
    return clone(lead);
  });
}

export function setProgress(id: string, progress: number): Promise<Lead> {
  return simulate(() => {
    const lead = leadById(id);
    const next = Math.max(0, Math.min(100, Math.round(progress)));
    lead.progress = next;
    pushActivity(id, 'progress_changed', `התקדמות עודכנה ל־${next}% — ${lead.client.company}`);
    persist();
    notify();
    return clone(lead);
  }, 0); // never inject error on slider drag
}

export function addTask(
  leadId: string,
  input: { title: string; dueDate?: string },
): Promise<Task> {
  return simulate(() => {
    const lead = leadById(leadId);
    const task: Task = { id: nid('tsk'), title: input.title.trim(), done: false };
    if (input.dueDate) task.dueDate = input.dueDate;
    lead.tasks = [...lead.tasks, task];
    pushActivity(leadId, 'task_added', `משימה נוספה: ${task.title}`);
    persist();
    notify();
    return clone(task);
  });
}

export function toggleTask(leadId: string, taskId: string): Promise<Task> {
  return simulate(() => {
    const lead = leadById(leadId);
    const task = lead.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('משימה לא נמצאה');
    task.done = !task.done;
    if (task.done) {
      pushActivity(leadId, 'task_completed', `משימה הושלמה: ${task.title}`);
    }
    persist();
    notify();
    return clone(task);
  }, 0);
}

export function removeTask(leadId: string, taskId: string): Promise<void> {
  return simulate(() => {
    const lead = leadById(leadId);
    lead.tasks = lead.tasks.filter((t) => t.id !== taskId);
    persist();
    notify();
  });
}

export function addNote(leadId: string, body: string): Promise<Note> {
  return simulate(() => {
    const lead = leadById(leadId);
    const note: Note = {
      id: nid('nt'),
      body: body.trim(),
      author: 'בר',
      createdAt: new Date().toISOString(),
    };
    lead.notes = [note, ...lead.notes];
    pushActivity(leadId, 'note_added', `הערה חדשה נוספה — ${lead.client.company}`);
    persist();
    notify();
    return clone(note);
  });
}

export function markInvoicePaid(leadId: string, invoiceId: string): Promise<Invoice> {
  return simulate(() => {
    const lead = leadById(leadId);
    const inv = lead.invoices.find((i) => i.id === invoiceId);
    if (!inv) throw new Error('חשבונית לא נמצאה');
    inv.status = 'paid';
    pushActivity(leadId, 'invoice_paid', `חשבונית ${inv.number} סומנה כשולמה — ${lead.client.company}`);
    persist();
    notify();
    return clone(inv);
  });
}

export function sendInvoice(leadId: string, invoiceId: string): Promise<Invoice> {
  return simulate(() => {
    const lead = leadById(leadId);
    const inv = lead.invoices.find((i) => i.id === invoiceId);
    if (!inv) throw new Error('חשבונית לא נמצאה');
    inv.status = 'sent';
    pushActivity(leadId, 'invoice_sent', `חשבונית ${inv.number} נשלחה — ${lead.client.company}`);
    persist();
    notify();
    return clone(inv);
  });
}

export function resetAll(): Promise<void> {
  return simulate(() => {
    state = clone(SEED_STATE);
    persist();
    notify();
  }, 0);
}

/**
 * Derived: an invoice is "overdue" when status === 'sent' and dueAt is past.
 * Kept as a pure helper rather than a stored field so the calculation stays
 * fresh without having to write a daily migration.
 */
export function isInvoiceOverdue(inv: Invoice, now: Date = new Date()): boolean {
  return inv.status === 'sent' && new Date(inv.dueAt).getTime() < now.getTime();
}
