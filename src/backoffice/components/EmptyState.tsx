import type { ReactNode } from 'react';

export default function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="bo-empty">
      <div className="bo-empty__title">{title}</div>
      {body && <p className="bo-empty__body">{body}</p>}
      {action}
    </div>
  );
}
