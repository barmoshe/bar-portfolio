import type { Priority } from '../data/types';
import { PRIORITY_LABEL } from './labels';

const COLOR: Record<Priority, string> = {
  low: 'var(--ink-faint)',
  normal: 'var(--blue)',
  high: 'var(--yellow)',
  urgent: 'var(--red)',
};

export default function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span className="bo-priority" aria-label={`עדיפות: ${PRIORITY_LABEL[priority]}`}>
      <span className="bo-priority__dot" style={{ background: COLOR[priority] }} aria-hidden="true" />
      <span className="bo-priority__text">{PRIORITY_LABEL[priority]}</span>
    </span>
  );
}
