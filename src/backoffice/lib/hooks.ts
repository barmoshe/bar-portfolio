import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getLead,
  isInvoiceOverdue,
  listActivity,
  listLeads,
  subscribe,
} from './backend';
import { parse, serialize, type Route } from './route';
import type { ActivityEntry, Invoice, Lead } from '../data/types';

type AsyncResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

function useAsync<T>(loader: () => Promise<T>): AsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loaderRef
      .current()
      .then((v) => {
        if (!cancelled) {
          setData(v);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function useLeads(): AsyncResult<Lead[]> {
  const result = useAsync(() => listLeads());
  useEffect(() => subscribe(result.refetch), [result.refetch]);
  return result;
}

export function useLead(id: string): AsyncResult<Lead> {
  const result = useAsync(() => getLead(id));
  useEffect(() => subscribe(result.refetch), [result.refetch]);
  return result;
}

export function useActivity(): AsyncResult<ActivityEntry[]> {
  const result = useAsync(() => listActivity());
  useEffect(() => subscribe(result.refetch), [result.refetch]);
  return result;
}

export function useRoute(): { route: Route; navigate: (next: Route) => void } {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { view: 'dashboard' } : parse(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((next: Route) => {
    const target = serialize(next);
    if (window.location.hash !== target) {
      window.history.pushState(null, '', target);
    }
    setRoute(next);
    // Move focus to <main> so screen readers announce the new view.
    const main = document.getElementById('main');
    main?.focus({ preventScroll: false });
  }, []);

  return { route, navigate };
}

export type Toast = {
  id: string;
  kind: 'info' | 'success' | 'error';
  message: string;
};

let toastListeners: Array<(toast: Toast) => void> = [];
let toastCounter = 0;

export function pushToast(kind: Toast['kind'], message: string): void {
  const t: Toast = { id: `t_${++toastCounter}`, kind, message };
  toastListeners.forEach((fn) => fn(t));
}

export function useToasts(): { toasts: Toast[]; dismiss: (id: string) => void } {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((curr) => [...curr, t]);
      window.setTimeout(() => {
        setToasts((curr) => curr.filter((x) => x.id !== t.id));
      }, 4500);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);
  const dismiss = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);
  return { toasts, dismiss };
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, onClose: () => void): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const first = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0]!;
      const lastEl = focusables[focusables.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [containerRef, onClose]);
}

export { isInvoiceOverdue };

export function flattenInvoices(leads: Lead[]): Array<Invoice & { leadId: string; clientName: string; company: string }> {
  return leads.flatMap((lead) =>
    lead.invoices.map((inv) => ({
      ...inv,
      leadId: lead.id,
      clientName: lead.client.name,
      company: lead.client.company,
    })),
  );
}
