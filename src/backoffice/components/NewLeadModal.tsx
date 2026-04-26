import { useState } from 'react';
import Modal from './Modal';
import SegmentedControl from './SegmentedControl';
import DatePresetField from './DatePresetField';
import TagInput from './TagInput';
import { createLead } from '../lib/backend';
import { pushToast } from '../lib/hooks';
import type { Currency, LeadStatus, LeadType, Priority } from '../data/types';
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  STATUS_ORDER,
  TYPE_LABEL,
  TYPE_ORDER,
} from './labels';
import type { Route } from '../lib/route';

const PRIORITY_ORDER: Priority[] = ['low', 'normal', 'high', 'urgent'];

const COLOR_PALETTE = [
  'var(--green)',
  'var(--blue)',
  'var(--purple)',
  'var(--cyan)',
  'var(--yellow)',
  'var(--magenta)',
  'var(--ocean)',
  'var(--ink-soft)',
];

function todayInputValue(): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

function toYmd(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type Props = {
  onClose: () => void;
  navigate: (r: Route) => void;
  paletteOffset?: number;
};

export default function NewLeadModal({ onClose, navigate, paletteOffset = 0 }: Props) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [color, setColor] = useState<string>(COLOR_PALETTE[paletteOffset % COLOR_PALETTE.length]!);

  const [type, setType] = useState<LeadType>('website');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const [status, setStatus] = useState<LeadStatus>('new');
  const [priority, setPriority] = useState<Priority>('normal');

  const [createdAt, setCreatedAt] = useState<string>(todayInputValue());
  const [dueDate, setDueDate] = useState<string>('');

  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('ILS');
  const [hourlyRate, setHourlyRate] = useState<string>('');

  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const lead = await createLead({
        client: {
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          color,
        },
        type,
        title: title.trim(),
        summary: summary.trim(),
        status,
        priority,
        createdAt,
        ...(dueDate ? { dueDate } : {}),
        budget: { amount: Number(budgetAmount), currency },
        ...(hourlyRate ? { hourlyRate: Number(hourlyRate) } : {}),
        tags,
      });
      pushToast('success', `הליד "${lead.client.company}" נוצר`);
      onClose();
      navigate({ view: 'lead', id: lead.id, tab: 'tasks' });
    } catch (err) {
      pushToast('error', (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const todayYmd = toYmd(todayInputValue());

  return (
    <Modal title="ליד חדש" onClose={onClose} width={720}>
      <form className="bo-form" onSubmit={submit}>
        <fieldset className="bo-fieldset">
          <legend>לקוחה</legend>
          <div className="bo-form-grid">
            <label className="bo-field">
              <span>שם איש קשר</span>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="bo-field">
              <span>שם העסק</span>
              <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} />
            </label>
            <label className="bo-field">
              <span>אימייל</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="bo-field">
              <span>טלפון</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="050-000-0000" />
            </label>
            <label className="bo-field">
              <span>עיר / אזור</span>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <fieldset className="bo-field">
              <legend>צבע אווטאר</legend>
              <div className="bo-color-swatches">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="bo-swatch"
                    aria-pressed={color === c}
                    aria-label={`צבע ${c}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        </fieldset>

        <fieldset className="bo-fieldset">
          <legend>פרויקט</legend>
          <SegmentedControl
            legend="סוג"
            value={type}
            onChange={(v) => setType(v as LeadType)}
            options={TYPE_ORDER.map((t) => ({ value: t, label: TYPE_LABEL[t] }))}
          />
          <label className="bo-field">
            <span>כותרת</span>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="bo-field">
            <span>תיאור קצר</span>
            <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </label>
        </fieldset>

        <fieldset className="bo-fieldset">
          <legend>סטטוס ועדיפות</legend>
          <SegmentedControl
            legend="סטטוס"
            value={status}
            onChange={(v) => setStatus(v as LeadStatus)}
            options={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
          />
          <SegmentedControl
            legend="עדיפות"
            value={priority}
            onChange={(v) => setPriority(v as Priority)}
            options={PRIORITY_ORDER.map((p) => ({ value: p, label: PRIORITY_LABEL[p] }))}
          />
        </fieldset>

        <fieldset className="bo-fieldset">
          <legend>תקציב</legend>
          <div className="bo-form-grid">
            <label className="bo-field">
              <span>תקציב</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={50}
                required
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
              />
            </label>
            <SegmentedControl
              legend="מטבע"
              value={currency}
              onChange={(v) => setCurrency(v as Currency)}
              options={[
                { value: 'ILS', label: '₪ שקל' },
                { value: 'USD', label: '$ דולר' },
              ]}
            />
            <label className="bo-field">
              <span>תעריף לשעה (אופציונלי)</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={10}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="bo-fieldset">
          <legend>תאריכים</legend>
          <DatePresetField
            legend="תאריך פתיחת הליד"
            value={createdAt}
            onChange={setCreatedAt}
            max={todayYmd}
          />
          <DatePresetField
            legend="דדליין יעד"
            value={dueDate}
            onChange={setDueDate}
            min={toYmd(createdAt)}
            optional
          />
        </fieldset>

        <fieldset className="bo-fieldset">
          <legend>תגיות</legend>
          <TagInput legend="תגיות" value={tags} onChange={setTags} />
        </fieldset>

        <footer className="bo-form__footer">
          <button type="button" className="bo-btn bo-btn--ghost" onClick={onClose}>
            ביטול
          </button>
          <button type="submit" className="bo-btn" disabled={submitting}>
            {submitting ? 'יוצרת…' : 'צרי ליד'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
