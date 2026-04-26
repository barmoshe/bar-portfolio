import type { ReactNode } from 'react';

type Props = {
  label: string;
  value: ReactNode;
  delta?: { text: string; tone: 'up' | 'down' | 'flat' };
  tone?: 'default' | 'warning' | 'success';
  hint?: string;
};

export default function KpiCard({ label, value, delta, tone = 'default', hint }: Props) {
  return (
    <div className="bo-kpi" data-tone={tone}>
      <div className="bo-kpi__label">{label}</div>
      <div className="bo-kpi__value">{value}</div>
      {delta && (
        <div className="bo-kpi__delta" data-tone={delta.tone}>
          {delta.text}
        </div>
      )}
      {hint && <div className="bo-kpi__hint">{hint}</div>}
    </div>
  );
}
