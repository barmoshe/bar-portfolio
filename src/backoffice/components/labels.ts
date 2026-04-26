import type { InvoiceStatus, LeadStatus, LeadType, Priority } from '../data/types';

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'חדש',
  discovery: 'גילוי',
  proposal: 'הצעה',
  in_progress: 'בעבודה',
  review: 'בבדיקה',
  completed: 'הושלם',
  on_hold: 'מושהה',
};

export const TYPE_LABEL: Record<LeadType, string> = {
  website: 'בניית אתר',
  mentorship: 'חניכה',
  consulting: 'ייעוץ',
  maintenance: 'תחזוקה',
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'נמוכה',
  normal: 'רגילה',
  high: 'גבוהה',
  urgent: 'דחוף',
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: 'טיוטה',
  sent: 'נשלחה',
  paid: 'שולמה',
  overdue: 'באיחור',
};

export const STATUS_ORDER: LeadStatus[] = [
  'new',
  'discovery',
  'proposal',
  'in_progress',
  'review',
  'completed',
  'on_hold',
];

export const TYPE_ORDER: LeadType[] = ['website', 'mentorship', 'consulting', 'maintenance'];
