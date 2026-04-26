export type LeadTab = 'tasks' | 'notes' | 'invoices';

export type Route =
  | { view: 'dashboard' }
  | { view: 'leads' }
  | { view: 'invoices' }
  | { view: 'calendar' }
  | { view: 'lead'; id: string; tab: LeadTab };

const VALID_TABS: LeadTab[] = ['tasks', 'notes', 'invoices'];

export function serialize(r: Route): string {
  switch (r.view) {
    case 'dashboard':
      return '#/dashboard';
    case 'leads':
      return '#/leads';
    case 'invoices':
      return '#/invoices';
    case 'calendar':
      return '#/calendar';
    case 'lead':
      return `#/leads/${encodeURIComponent(r.id)}/${r.tab}`;
  }
}

export function parse(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  if (!clean || clean === 'dashboard') return { view: 'dashboard' };
  const parts = clean.split('/').filter(Boolean);
  if (parts[0] === 'leads') {
    if (parts.length === 1) return { view: 'leads' };
    const id = decodeURIComponent(parts[1] ?? '');
    const rawTab = parts[2] as LeadTab | undefined;
    const tab: LeadTab = rawTab && VALID_TABS.includes(rawTab) ? rawTab : 'tasks';
    return { view: 'lead', id, tab };
  }
  if (parts[0] === 'invoices') return { view: 'invoices' };
  if (parts[0] === 'calendar') return { view: 'calendar' };
  return { view: 'dashboard' };
}
