import type { InvoiceStatus, LeadStatus } from '../data/types';
import { INVOICE_STATUS_LABEL, STATUS_LABEL } from './labels';

type Props =
  | { kind: 'lead'; status: LeadStatus }
  | { kind: 'invoice'; status: InvoiceStatus };

export default function StatusBadge(props: Props) {
  const label = props.kind === 'lead' ? STATUS_LABEL[props.status] : INVOICE_STATUS_LABEL[props.status];
  const swatchVar = `--status-${props.status}`;
  return (
    <span className="bo-badge" data-status={props.status} aria-label={`סטטוס: ${label}`}>
      <span className="bo-badge__dot" aria-hidden="true" style={{ background: `var(${swatchVar})` }} />
      {label}
    </span>
  );
}
