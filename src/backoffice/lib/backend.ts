import { SEED_STATE } from '../data/seed';
import type {
  ActivityEntry,
  ActivityKind,
  BackofficeState,
  Client,
  Currency,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Lead,
  LeadStatus,
  LeadType,
  Note,
  Priority,
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

function pushActivity(
  leadId: string,
  kind: ActivityKind,
  summary: string,
  at?: string,
): void {
  const entry: ActivityEntry = {
    id: nid('act'),
    leadId,
    kind,
    summary,
    createdAt: at ?? new Date().toISOString(),
  };
  // Insert + sort newest-first by createdAt so backdated entries land in
  // their correct historical slot rather than at the top of the feed.
  const sorter = (a: ActivityEntry, b: ActivityEntry) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  state.activity = [...state.activity, entry].sort(sorter).slice(0, ACTIVITY_CAP);
  const lead = state.leads.find((l) => l.id === leadId);
  if (lead) lead.activity = [...lead.activity, entry].sort(sorter).slice(0, ACTIVITY_CAP);
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
  input: {
    title: string;
    dueDate?: string;
    createdAt?: string;
    done?: boolean;
    completedAt?: string;
  },
): Promise<Task> {
  return simulate(() => {
    const lead = leadById(leadId);
    const task: Task = {
      id: nid('tsk'),
      title: input.title.trim(),
      done: !!input.done,
      createdAt: input.createdAt ?? new Date().toISOString(),
    };
    if (input.dueDate) task.dueDate = input.dueDate;
    if (input.done && input.completedAt) task.completedAt = input.completedAt;
    lead.tasks = [...lead.tasks, task];
    pushActivity(leadId, 'task_added', `משימה נוספה: ${task.title}`, task.createdAt);
    if (task.done && task.completedAt) {
      pushActivity(leadId, 'task_completed', `משימה הושלמה: ${task.title}`, task.completedAt);
    }
    persist();
    notify();
    return clone(task);
  });
}

export function toggleTask(leadId: string, taskId: string, at?: string): Promise<Task> {
  return simulate(() => {
    const lead = leadById(leadId);
    const task = lead.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('משימה לא נמצאה');
    task.done = !task.done;
    if (task.done) {
      task.completedAt = at ?? new Date().toISOString();
      pushActivity(leadId, 'task_completed', `משימה הושלמה: ${task.title}`, task.completedAt);
    } else {
      delete task.completedAt;
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

export function addNote(leadId: string, body: string, at?: string): Promise<Note> {
  return simulate(() => {
    const lead = leadById(leadId);
    const note: Note = {
      id: nid('nt'),
      body: body.trim(),
      author: 'בר',
      createdAt: at ?? new Date().toISOString(),
    };
    // Keep notes sorted newest-first by createdAt for predictable display.
    lead.notes = [...lead.notes, note].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    pushActivity(leadId, 'note_added', `הערה חדשה נוספה — ${lead.client.company}`, note.createdAt);
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

export type NewLeadInput = {
  client: Omit<Client, 'initials'> & { initials?: string };
  type: LeadType;
  title: string;
  summary: string;
  status: LeadStatus;
  priority: Priority;
  createdAt: string;
  dueDate?: string;
  budget: { amount: number; currency: Currency };
  hourlyRate?: number;
  tags: string[];
};

function deriveInitials(name: string, company: string): string {
  const words = `${name} ${company}`.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '··';
  if (words.length === 1) return words[0]!.slice(0, 2);
  return `${words[0]![0]}${words[1]![0]}`;
}

export function createLead(input: NewLeadInput): Promise<Lead> {
  return simulate(() => {
    const requiredErrors: string[] = [];
    if (!input.client.name.trim()) requiredErrors.push('שם איש קשר');
    if (!input.client.company.trim()) requiredErrors.push('שם עסק');
    if (!input.title.trim()) requiredErrors.push('כותרת הפרויקט');
    if (!(input.budget.amount > 0)) requiredErrors.push('תקציב');
    if (requiredErrors.length > 0) {
      throw new Error(`חסר: ${requiredErrors.join(', ')}`);
    }
    const lead: Lead = {
      id: nid('lead'),
      client: {
        ...input.client,
        initials:
          (input.client.initials && input.client.initials.trim()) ||
          deriveInitials(input.client.name, input.client.company),
      },
      type: input.type,
      title: input.title.trim(),
      summary: input.summary.trim(),
      status: input.status,
      priority: input.priority,
      createdAt: input.createdAt,
      ...(input.dueDate ? { dueDate: input.dueDate } : {}),
      progress: 0,
      budget: input.budget,
      ...(input.hourlyRate ? { hourlyRate: input.hourlyRate } : {}),
      hoursLogged: 0,
      tags: input.tags.filter((t) => t.trim().length > 0),
      tasks: [],
      notes: [],
      invoices: [],
      activity: [],
    };
    state.leads = [...state.leads, lead];
    pushActivity(
      lead.id,
      'lead_created',
      `ליד חדש: ${lead.client.name} — ${lead.client.company}`,
      lead.createdAt,
    );
    persist();
    notify();
    return clone(lead);
  });
}

export type NewInvoiceInput = {
  number: string;
  amount: number;
  currency: Currency;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  items: Array<Omit<InvoiceItem, 'id'>>;
};

export function nextInvoiceNumber(now: Date = new Date()): string {
  const year = now.getFullYear();
  const prefix = `${year}-`;
  let max = 0;
  state.leads.forEach((l) =>
    l.invoices.forEach((inv) => {
      if (inv.number.startsWith(prefix)) {
        const n = parseInt(inv.number.slice(prefix.length), 10);
        if (Number.isFinite(n) && n > max) max = n;
      }
    }),
  );
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

export function addInvoice(leadId: string, draft: NewInvoiceInput): Promise<Invoice> {
  return simulate(() => {
    const lead = leadById(leadId);
    if (!(draft.amount > 0)) throw new Error('סכום החשבונית חייב להיות גדול מאפס');
    if (new Date(draft.dueAt).getTime() < new Date(draft.issuedAt).getTime()) {
      throw new Error('"לתשלום עד" לא יכול להיות לפני "הופקה"');
    }
    const inv: Invoice = {
      id: nid('inv'),
      number: draft.number.trim() || nextInvoiceNumber(new Date(draft.issuedAt)),
      amount: draft.amount,
      currency: draft.currency,
      issuedAt: draft.issuedAt,
      dueAt: draft.dueAt,
      status: draft.status,
      items: draft.items.map((it) => ({ ...it, id: nid('it') })),
    };
    lead.invoices = [...lead.invoices, inv];
    if (draft.status === 'paid') {
      pushActivity(
        leadId,
        'invoice_paid',
        `חשבונית ${inv.number} סומנה כשולמה — ${lead.client.company}`,
        inv.issuedAt,
      );
    } else if (draft.status === 'sent') {
      pushActivity(
        leadId,
        'invoice_sent',
        `חשבונית ${inv.number} נשלחה — ${lead.client.company}`,
        inv.issuedAt,
      );
    }
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
