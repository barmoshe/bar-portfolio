export type LeadType = 'website' | 'mentorship' | 'consulting' | 'maintenance';

export type LeadStatus =
  | 'new'
  | 'discovery'
  | 'proposal'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'on_hold';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type Currency = 'ILS' | 'USD';

export interface Client {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  dueDate?: string;
}

export interface Note {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  label: string;
  qty: number;
  unitPrice: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: Currency;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
}

export type ActivityKind =
  | 'lead_created'
  | 'status_changed'
  | 'task_added'
  | 'task_completed'
  | 'note_added'
  | 'invoice_sent'
  | 'invoice_paid'
  | 'progress_changed';

export interface ActivityEntry {
  id: string;
  leadId: string;
  kind: ActivityKind;
  summary: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  client: Client;
  type: LeadType;
  title: string;
  summary: string;
  status: LeadStatus;
  priority: Priority;
  createdAt: string;
  dueDate?: string;
  progress: number;
  budget: { amount: number; currency: Currency };
  hourlyRate?: number;
  hoursLogged: number;
  tags: string[];
  tasks: Task[];
  notes: Note[];
  invoices: Invoice[];
  activity: ActivityEntry[];
}

export interface BackofficeState {
  version: 1;
  leads: Lead[];
  activity: ActivityEntry[];
}
