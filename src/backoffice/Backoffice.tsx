import { useState } from 'react';
import './backoffice.css';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import ToastStack from './components/ToastStack';
import DashboardView from './views/DashboardView';
import LeadsView from './views/LeadsView';
import LeadDetailView from './views/LeadDetailView';
import InvoicesView from './views/InvoicesView';
import CalendarView from './views/CalendarView';
import { isInvoiceOverdue, useLeads, useRoute } from './lib/hooks';

export default function Backoffice() {
  const { route, navigate } = useRoute();
  const [query, setQuery] = useState('');
  const { data: leads } = useLeads();

  const overdueCount = (leads ?? []).reduce(
    (n, l) => n + l.invoices.filter((inv) => isInvoiceOverdue(inv)).length,
    0,
  );

  return (
    <div className="bo-root">
      <a href="#main" className="bo-skip">דלגי לתוכן</a>
      <Topbar query={query} onQueryChange={setQuery} />
      <Sidebar
        route={route}
        navigate={navigate}
        badges={{ leads: leads?.length, invoices: overdueCount }}
      />
      <main id="main" tabIndex={-1} className="bo-main">
        {route.view === 'dashboard' && <DashboardView navigate={navigate} />}
        {route.view === 'leads' && <LeadsView query={query} navigate={navigate} />}
        {route.view === 'lead' && (
          <LeadDetailView leadId={route.id} tab={route.tab} navigate={navigate} />
        )}
        {route.view === 'invoices' && <InvoicesView navigate={navigate} />}
        {route.view === 'calendar' && <CalendarView navigate={navigate} />}
      </main>
      <ToastStack />
    </div>
  );
}
