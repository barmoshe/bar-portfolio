import { useMemo, useState } from 'react';
import Modal from './Modal';
import SegmentedControl from './SegmentedControl';
import DatePresetField from './DatePresetField';
import { addInvoice, nextInvoiceNumber } from '../lib/backend';
import { pushToast } from '../lib/hooks';
import type { Currency, InvoiceStatus } from '../data/types';
import { formatMoney } from '../lib/format';

type DraftItem = { _id: string; label: string; qty: number; unitPrice: number };

function todayIso(): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

function isoPlusDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function toYmd(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type Props = {
  leadId: string;
  defaultCurrency?: Currency;
  onClose: () => void;
};

export default function NewInvoiceModal({ leadId, defaultCurrency = 'ILS', onClose }: Props) {
  const [number, setNumber] = useState<string>(() => nextInvoiceNumber());
  const [status, setStatus] = useState<InvoiceStatus>('draft');
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [issuedAt, setIssuedAt] = useState<string>(todayIso());
  const [dueAt, setDueAt] = useState<string>(isoPlusDays(todayIso(), 30));
  const [items, setItems] = useState<DraftItem[]>([
    { _id: 'tmp_1', label: 'תשלום', qty: 1, unitPrice: 0 },
  ]);
  const [overrideTotal, setOverrideTotal] = useState(false);
  const [manualAmount, setManualAmount] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const computedAmount = useMemo(
    () => items.reduce((sum, it) => sum + (it.qty || 0) * (it.unitPrice || 0), 0),
    [items],
  );

  const amount = overrideTotal ? Number(manualAmount) || 0 : computedAmount;

  const updateItem = (id: string, patch: Partial<DraftItem>) => {
    setItems((curr) => curr.map((it) => (it._id === id ? { ...it, ...patch } : it)));
  };

  const addRow = () => {
    setItems((curr) => [...curr, { _id: `tmp_${curr.length + 1}_${Date.now()}`, label: '', qty: 1, unitPrice: 0 }]);
  };

  const removeRow = (id: string) => {
    setItems((curr) => (curr.length > 1 ? curr.filter((it) => it._id !== id) : curr));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addInvoice(leadId, {
        number,
        amount,
        currency,
        status,
        issuedAt,
        dueAt,
        items: items.map((it) => ({ label: it.label.trim() || 'פריט', qty: it.qty, unitPrice: it.unitPrice })),
      });
      pushToast('success', `חשבונית ${number} נוספה`);
      onClose();
    } catch (err) {
      pushToast('error', (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="חשבונית חדשה" onClose={onClose} width={640}>
      <form className="bo-form" onSubmit={submit}>
        <div className="bo-form-grid">
          <label className="bo-field">
            <span>מספר חשבונית</span>
            <input type="text" required value={number} onChange={(e) => setNumber(e.target.value)} />
          </label>
          <SegmentedControl
            legend="מטבע"
            value={currency}
            onChange={(v) => setCurrency(v as Currency)}
            options={[
              { value: 'ILS', label: '₪' },
              { value: 'USD', label: '$' },
            ]}
          />
        </div>

        <SegmentedControl
          legend="סטטוס"
          value={status}
          onChange={(v) => setStatus(v as InvoiceStatus)}
          options={[
            { value: 'draft', label: 'טיוטה' },
            { value: 'sent', label: 'נשלחה' },
            { value: 'paid', label: 'שולמה' },
          ]}
        />

        <DatePresetField
          legend="הופקה ב־"
          value={issuedAt}
          onChange={(iso) => {
            setIssuedAt(iso);
            // keep the 30-day default offset whenever issuedAt moves
            if (toYmd(dueAt) <= toYmd(iso)) setDueAt(isoPlusDays(iso, 30));
          }}
        />
        <DatePresetField
          legend="לתשלום עד"
          value={dueAt}
          onChange={setDueAt}
          min={toYmd(issuedAt)}
        />

        <fieldset className="bo-fieldset">
          <legend>פריטי החשבונית</legend>
          <div className="bo-inv-items-edit">
            <div className="bo-inv-items-edit__head" aria-hidden="true">
              <span>תיאור</span>
              <span>כמות</span>
              <span>מחיר</span>
              <span />
            </div>
            {items.map((it) => (
              <div key={it._id} className="bo-inv-items-edit__row">
                <input
                  type="text"
                  placeholder="תיאור"
                  value={it.label}
                  onChange={(e) => updateItem(it._id, { label: e.target.value })}
                  aria-label="תיאור"
                />
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={it.qty}
                  onChange={(e) => updateItem(it._id, { qty: Number(e.target.value) })}
                  aria-label="כמות"
                />
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={it.unitPrice}
                  onChange={(e) => updateItem(it._id, { unitPrice: Number(e.target.value) })}
                  aria-label="מחיר ליחידה"
                />
                <button
                  type="button"
                  className="bo-icon-btn bo-icon-btn--small"
                  aria-label="הסירי שורה"
                  onClick={() => removeRow(it._id)}
                  disabled={items.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="bo-btn bo-btn--ghost bo-btn--small" onClick={addRow}>
              + שורה
            </button>
          </div>
        </fieldset>

        <div className="bo-form__total">
          <strong>סך הכל:</strong>
          <span>{formatMoney(amount, currency)}</span>
          <label className="bo-form__override">
            <input
              type="checkbox"
              checked={overrideTotal}
              onChange={(e) => {
                setOverrideTotal(e.target.checked);
                if (e.target.checked) setManualAmount(String(computedAmount));
              }}
            />
            <span>החליפי ידנית</span>
          </label>
          {overrideTotal && (
            <input
              type="number"
              min={0}
              step={50}
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              aria-label="סכום מותאם"
            />
          )}
        </div>

        <footer className="bo-form__footer">
          <button type="button" className="bo-btn bo-btn--ghost" onClick={onClose}>
            ביטול
          </button>
          <button type="submit" className="bo-btn" disabled={submitting || amount <= 0}>
            {submitting ? 'יוצרת…' : 'צרי חשבונית'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
